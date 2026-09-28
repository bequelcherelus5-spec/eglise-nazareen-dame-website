/**
 * Utilitaire d'optimisation, de compression et de fallback pour les images
 * Église du Nazaréen de Damé
 */

export const PRESET_CHURCH_IMAGES = [
  { label: 'Bâtiment & Façade de l\'École', url: '/images/ecole_facade.jpg' },
  { label: 'Cour & Environs de l\'Église', url: '/images/cour_paysage.jpg' },
  { label: 'Culte d\'Adoration & Action de Grâce', url: '/images/culte_action_de_grace.jpg' },
  { label: 'Conseil Paroissial & Comité', url: '/images/comite.jpg' },
  { label: 'Sceau Officiel de l\'Église', url: '/images/logo.png' },
];

export const DEFAULT_CHURCH_IMAGE = '/images/ecole_facade.jpg';

/**
 * Compresse une image (Fichier ou chaîne Base64) via HTML Canvas côté client
 * Réduit la résolution (max 800px) et compresse en JPEG 65-70% pour éviter tout dépassement de quota (QuotaExceededError)
 */
export async function compressImage(
  source: File | string,
  maxWidth: number = 800,
  maxHeight: number = 600,
  quality: number = 0.65
): Promise<string> {
  // Si c'est une URL statique locale ou web (pas du base64 lourd), la renvoyer directement
  if (typeof source === 'string') {
    if (source.startsWith('/') || source.startsWith('http://') || source.startsWith('https://')) {
      return source;
    }
    // Si c'est un base64 très court (< 10 Ko), renvoyer tel quel
    if (source.startsWith('data:image') && source.length < 15000) {
      return source;
    }
  }

  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        try {
          let { width, height } = img;

          // Calculer les nouvelles dimensions proportionnelles
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.max(1, Math.round(width * ratio));
            height = Math.max(1, Math.round(height * ratio));
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            // Fallback si canvas non disponible
            resolve(typeof source === 'string' && source.length < 100000 ? source : DEFAULT_CHURCH_IMAGE);
            return;
          }

          // Fond blanc pour éviter le noir si PNG transparent converti en JPEG
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          // Exporter en JPEG optimisé
          let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

          // Si le résultat dépasse encore 80 Ko, recompresser plus agressivement
          if (compressedDataUrl.length > 80000) {
            compressedDataUrl = canvas.toDataURL('image/jpeg', 0.5);
          }

          resolve(compressedDataUrl);
        } catch (canvasErr) {
          console.warn('[ImageOptimizer] Échec de la compression Canvas:', canvasErr);
          resolve(typeof source === 'string' && source.length < 100000 ? source : DEFAULT_CHURCH_IMAGE);
        }
      };

      img.onerror = () => {
        console.warn('[ImageOptimizer] Impossible de charger la source de l\'image, fallback sur image par défaut');
        resolve(DEFAULT_CHURCH_IMAGE);
      };

      if (typeof source === 'string') {
        img.src = source;
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target?.result as string;
        };
        reader.onerror = () => {
          resolve(DEFAULT_CHURCH_IMAGE);
        };
        reader.readAsDataURL(source);
      }
    } catch (err) {
      console.warn('[ImageOptimizer] Erreur globale compression:', err);
      resolve(DEFAULT_CHURCH_IMAGE);
    }
  });
}

/**
 * Assainit une chaîne d'image pour le stockage persistant
 * Si l'image est trop volumineuse pour le localStorage, elle est allégée ou remplacée
 */
export function sanitizeImageForStorage(image?: string): string {
  if (!image) return '';
  if (image.startsWith('/') || image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }
  if (image.startsWith('data:image') && image.length > 100000) {
    return DEFAULT_CHURCH_IMAGE;
  }
  return image;
}
