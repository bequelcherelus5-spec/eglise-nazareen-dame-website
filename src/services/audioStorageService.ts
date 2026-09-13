/**
 * Service de gestion et d'optimisation du stockage audio pour les Podcasts
 * Église du Nazaréen de Damé
 *
 * Fonctionnalités clés :
 * 1. Validation de taille stricte (Limite max 15 Mo) avec messages d'erreur explicites.
 * 2. Compression/Rééchantillonnage audio côté client (Web Audio API) pour réduire l'empreinte mémoire.
 * 3. Gestionnaire IndexedDB haute capacité pour stocker les fichiers audio volumineux sans saturer le localStorage.
 * 4. Protection contre les erreurs QuotaExceededError du localStorage.
 */

import { ChurchPodcast } from '../types';

export const MAX_AUDIO_SIZE_MB = 15;
export const MAX_AUDIO_SIZE_BYTES = MAX_AUDIO_SIZE_MB * 1024 * 1024;
export const RECOMMENDED_SIZE_MB = 5;

const DB_NAME = 'dame_church_audio_db';
const DB_VERSION = 1;
const STORE_NAME = 'podcast_audio';

/**
 * Validation du fichier audio avant traitement
 */
export function validateAudioFile(file: File): {
  valid: boolean;
  error?: string;
  sizeMb: number;
  sizeFormatted: string;
} {
  const sizeMb = file.size / (1024 * 1024);
  const sizeFormatted = `${sizeMb.toFixed(1)} Mo`;

  // Vérification de l'extension / type MIME
  const acceptedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/aac', 'audio/m4a', 'audio/ogg'];
  const acceptedExts = ['.mp3', '.wav', '.m4a', '.aac', '.ogg'];
  const hasValidExt = acceptedExts.some(ext => file.name.toLowerCase().endsWith(ext));
  const hasValidMime = acceptedTypes.some(type => file.type.toLowerCase().includes(type) || file.type.startsWith('audio/'));

  if (!hasValidExt && !hasValidMime) {
    return {
      valid: false,
      error: `Format non supporté pour « ${file.name} ». Veuillez sélectionner un fichier audio valide (.mp3 ou .wav).`,
      sizeMb,
      sizeFormatted
    };
  }

  // Vérification du quota maximal
  if (file.size > MAX_AUDIO_SIZE_BYTES) {
    return {
      valid: false,
      error: `Fichier trop volumineux (« ${file.name} » fait ${sizeFormatted}). La limite maximale autorisée est de ${MAX_AUDIO_SIZE_MB} Mo pour préserver les performances de lecture et éviter tout dépassement de quota (QuotaExceededError). Veuillez compresser ce fichier MP3 ou réduire son débit (64 à 128 kbps) avant de le téléverser.`,
      sizeMb,
      sizeFormatted
    };
  }

  return {
    valid: true,
    sizeMb,
    sizeFormatted
  };
}

/**
 * Formatage secondes -> mm:ss
 */
export function formatAudioDuration(seconds: number): string {
  if (!seconds || isNaN(seconds) || seconds <= 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Compression/Rééchantillonnage audio via Web Audio API
 * Réduit le canal en mono et abaisse la fréquence d'échantillonnage (ex: 22050 Hz)
 * pour produire un fichier audio optimisé très léger.
 */
export async function compressAudioFile(
  file: File,
  onProgress?: (step: string) => void
): Promise<{
  audioUrl: string;
  duration: string;
  originalSizeMb: number;
  finalSizeMb: number;
  compressed: boolean;
}> {
  const originalSizeMb = file.size / (1024 * 1024);

  // Si c'est déjà un MP3 très léger (< 3 Mo), on le conserve tel quel pour éviter tout ré-encodage inutile
  if (originalSizeMb <= 3 && file.type.includes('mpeg')) {
    onProgress?.('Lecture du fichier audio...');
    const dataUrl = await fileToDataUrl(file);
    const duration = await probeAudioDuration(dataUrl);
    return {
      audioUrl: dataUrl,
      duration,
      originalSizeMb,
      finalSizeMb: originalSizeMb,
      compressed: false
    };
  }

  try {
    onProgress?.('Décodage et analyse du signal sonore...');
    const arrayBuffer = await file.arrayBuffer();

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
      throw new Error("Web Audio API non disponible dans ce navigateur.");
    }

    const audioCtx = new AudioContextClass();
    const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer.slice(0));

    const totalSeconds = decodedBuffer.duration;
    const formattedDuration = formatAudioDuration(totalSeconds);

    onProgress?.('Optimisation de la bande passante (mono 22 kHz)...');

    // Réduction en mono à 22050 Hz (qualité voix/prédication idéale et ultra-légère)
    const targetSampleRate = 22050;
    const offlineCtx = new OfflineAudioContext(
      1, // 1 canal mono (largement suffisant pour des prédications orales)
      Math.ceil(totalSeconds * targetSampleRate),
      targetSampleRate
    );

    const source = offlineCtx.createBufferSource();
    source.buffer = decodedBuffer;
    source.connect(offlineCtx.destination);
    source.start(0);

    const renderedBuffer = await offlineCtx.startRendering();
    onProgress?.('Encodage du format compact...');

    // Conversion en WAV PCM 16-bit léger
    const wavBlob = audioBufferToWavBlob(renderedBuffer);
    const finalSizeMb = wavBlob.size / (1024 * 1024);

    // Si le résultat compressé est plus petit ou raisonnable, on le garde
    if (finalSizeMb < originalSizeMb) {
      const compressedUrl = await blobToDataUrl(wavBlob);
      return {
        audioUrl: compressedUrl,
        duration: formattedDuration,
        originalSizeMb,
        finalSizeMb,
        compressed: true
      };
    } else {
      // Si la compression WAV dépasse l'original (ex: MP3 d'origine déjà très compacté), on utilise le fichier d'origine
      const originalUrl = await fileToDataUrl(file);
      return {
        audioUrl: originalUrl,
        duration: formattedDuration,
        originalSizeMb,
        finalSizeMb: originalSizeMb,
        compressed: false
      };
    }
  } catch (err) {
    console.warn('Compression Web Audio non applicable, repli sur le fichier original:', err);
    onProgress?.('Chargement direct du fichier original...');
    const originalUrl = await fileToDataUrl(file);
    const duration = await probeAudioDuration(originalUrl);
    return {
      audioUrl: originalUrl,
      duration,
      originalSizeMb,
      finalSizeMb: originalSizeMb,
      compressed: false
    };
  }
}

/**
 * Convertit un AudioBuffer en Blob WAV 16-bit Mono
 */
function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
  const numChannels = 1;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  const samples = buffer.getChannelData(0);
  const blockAlign = numChannels * (bitDepth / 8);
  const byteRate = sampleRate * blockAlign;
  const dataSize = samples.length * (bitDepth / 8);
  const bufferLength = 44 + dataSize;

  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');

  // fmt sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);

  // data sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // Écriture des échantillons 16-bit
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string): void {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function probeAudioDuration(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const audio = new Audio(dataUrl);
    audio.onloadedmetadata = () => {
      resolve(formatAudioDuration(audio.duration));
    };
    audio.onerror = () => {
      resolve('25:00');
    };
    // Timeout de sécurité si la métadonnée tarde
    setTimeout(() => resolve('25:00'), 1500);
  });
}

// ----------------------------------------------------------------------
// GESTIONNAIRE INDEXEDDB (Stockage sans contrainte de quota 5 Mo)
// ----------------------------------------------------------------------

function openAudioDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB non supporté'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Sauvegarde un fichier audio dans IndexedDB
 */
export async function saveAudioToIndexedDB(id: string, audioData: string): Promise<boolean> {
  try {
    const db = await openAudioDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put({ id, audioData, updatedAt: Date.now() });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Impossible de sauvegarder dans IndexedDB:', err);
    return false;
  }
}

/**
 * Récupère un fichier audio depuis IndexedDB
 */
export async function getAudioFromIndexedDB(id: string): Promise<string | null> {
  try {
    const db = await openAudioDb();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => {
        resolve(req.result?.audioData || null);
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Supprime un fichier audio d'IndexedDB
 */
export async function deleteAudioFromIndexedDB(id: string): Promise<boolean> {
  try {
    const db = await openAudioDb();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(id);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

// ----------------------------------------------------------------------
// LOCALSTORAGE SÉCURISÉ (Prévient QuotaExceededError)
// ----------------------------------------------------------------------

/**
 * Sauvegarde sécurisée dans le localStorage en prévenant QuotaExceededError
 */
export function safeLocalStorageSet(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err: any) {
    const isQuotaError = 
      err.name === 'QuotaExceededError' ||
      err.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      err.code === 22 ||
      err.code === 1014;

    if (isQuotaError) {
      console.warn(`[Stockage] QuotaExceededError détecté sur « ${key} ». Nettoyage des caches superflus.`);
      try {
        // Nettoyer les clés non critiques
        const nonCriticalKeys = [
          'dame_reading_prefs',
          'dame_contact_draft',
          'dame_epnd_draft',
          'dame_prayer_draft'
        ];
        nonCriticalKeys.forEach(k => localStorage.removeItem(k));

        // Réessayer
        localStorage.setItem(key, value);
        return true;
      } catch (retryErr) {
        console.error(`[Stockage] Échec définitif de l'enregistrement dans localStorage après nettoyage:`, retryErr);
        return false;
      }
    }

    console.error(`[Stockage] Erreur localStorage:`, err);
    return false;
  }
}

/**
 * Assainit un objet podcast avant mise en cache localStorage
 * Évite d'insérer des données Base64 volumineuses dans les 5 Mo du localStorage
 */
export function sanitizePodcastForStorage(podcast: ChurchPodcast): ChurchPodcast {
  // Si audioUrl est une chaîne base64 lourde (> 200 octets), on la remplace par un pointeur IndexedDB
  if (podcast.audioUrl && podcast.audioUrl.startsWith('data:audio') && podcast.audioUrl.length > 500) {
    // Sauvegarde en tâche de fond dans IndexedDB
    saveAudioToIndexedDB(podcast.id, podcast.audioUrl);
    return {
      ...podcast,
      audioUrl: `indexeddb:${podcast.id}`
    };
  }
  return podcast;
}
