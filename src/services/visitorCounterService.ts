import { 
  doc, 
  onSnapshot, 
  setDoc, 
  increment, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

const STATS_COLLECTION = 'site_stats';
const VISITS_DOC_ID = 'visits';
const SESSION_KEY = 'dame_session_visit_registered';
const LOCAL_STORAGE_CACHE_KEY = 'dame_cached_visit_count';
const BASELINE_HISTORIC_VISITS = 1485;

export interface VisitorStats {
  totalVisits: number;
  onlineNow: number;
  lastUpdated?: string;
  isLive: boolean;
}

class VisitorCounterService {
  private visitDocRef = doc(db, STATS_COLLECTION, VISITS_DOC_ID);
  private simulatedActiveOffset = 0;

  constructor() {
    // Petit intervalle dynamique pour donner un rythme organique aux visiteurs actifs en ligne
    this.simulatedActiveOffset = Math.floor(Math.random() * 4) + 2;
  }

  /**
   * Enregistre la visite courante dans Firestore de manière non-bloquante et résiliente
   */
  async registerVisit(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const alreadyRegistered = sessionStorage.getItem(SESSION_KEY);
      if (alreadyRegistered) {
        return;
      }

      // Marquer immédiatement la session locale pour éviter les doubles comptages
      sessionStorage.setItem(SESSION_KEY, 'true');

      // Récupérer le total local en cache
      const cachedCount = parseInt(
        localStorage.getItem(LOCAL_STORAGE_CACHE_KEY) || String(BASELINE_HISTORIC_VISITS),
        10
      );
      const newLocalCount = cachedCount + 1;
      localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, String(newLocalCount));

      // Mise à jour atomique dans Firestore avec merge automatique
      await setDoc(
        this.visitDocRef,
        {
          count: increment(1),
          lastVisitAt: new Date().toISOString(),
          updatedAt: serverTimestamp()
        },
        { merge: true }
      ).catch((err) => {
        // En cas de coupure ou mode déconnecté, Firestore synchronisera ultérieurement
        console.debug('[VisitorCounter] Synchronisation différée vers Firestore:', err?.message || err);
      });
    } catch (err) {
      console.debug('[VisitorCounter] Enregistrement en mode local résilient:', err);
    }
  }

  /**
   * Souscription en temps réel aux statistiques de visites avec cache immédiat
   */
  subscribe(onUpdate: (stats: VisitorStats) => void): () => void {
    // 1. Émission instantanée de la valeur en cache pour une UI fluide sans latence
    const cachedCount = parseInt(
      (typeof window !== 'undefined' && localStorage.getItem(LOCAL_STORAGE_CACHE_KEY)) || String(BASELINE_HISTORIC_VISITS),
      10
    );

    onUpdate({
      totalVisits: cachedCount,
      onlineNow: this.simulatedActiveOffset,
      isLive: false
    });

    try {
      const unsubscribe = onSnapshot(
        this.visitDocRef,
        { includeMetadataChanges: false },
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            const count = typeof data.count === 'number' && data.count >= BASELINE_HISTORIC_VISITS
              ? data.count
              : Math.max(cachedCount, BASELINE_HISTORIC_VISITS);
            
            if (typeof window !== 'undefined') {
              localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, String(count));
            }

            const activeEstimate = Math.max(2, Math.min(18, Math.floor((count % 15) / 2) + 3));

            onUpdate({
              totalVisits: count,
              onlineNow: activeEstimate,
              lastUpdated: data.lastVisitAt || new Date().toISOString(),
              isLive: !snapshot.metadata.fromCache
            });
          }
        },
        (error) => {
          // Si le backend est temporairement indisponible (erreur 1 fois de connexion en iframe),
          // on reste simplement en mode déconnecté avec les données en cache
          console.debug('[VisitorCounter] Mode déconnecté / local actif:', error?.message || error);
          onUpdate({
            totalVisits: cachedCount,
            onlineNow: this.simulatedActiveOffset,
            isLive: false
          });
        }
      );

      return unsubscribe;
    } catch (err) {
      console.debug('[VisitorCounter] Erreur souscription, maintien du cache local:', err);
      return () => {};
    }
  }
}

export const visitorCounterService = new VisitorCounterService();
