import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, getFirestore, Firestore, setLogLevel } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialisation unique et sécurisée de l'application Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const targetDatabaseId = 
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? firebaseConfig.firestoreDatabaseId
    : undefined;

// Initialisation de Firestore avec support forcé du Long-Polling (indispensable dans les environnements iFrame et proxies)
let dbInstance: Firestore;
try {
  // Silence les logs verbeux de transition hors-ligne/en-ligne
  setLogLevel('error');
  
  dbInstance = initializeFirestore(
    app,
    {
      experimentalForceLongPolling: true,
    },
    targetDatabaseId
  );
} catch {
  try {
    dbInstance = getFirestore(app, targetDatabaseId);
  } catch (err) {
    console.warn('[Firebase] Fallback sur l’instance par défaut de Firestore:', err);
    dbInstance = getFirestore(app);
  }
}

export const db = dbInstance;
export { app };
export default db;
