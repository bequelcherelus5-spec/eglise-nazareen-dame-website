import { initializeApp, getApps, getApp, setLogLevel as setAppLogLevel } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, Firestore, setLogLevel } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Désactive les logs d'erreurs internes de reconnexion Firestore (@firebase/firestore)
// afin d'éviter les alertes intempestives lorsque le client bascule en cache local.
try {
  setLogLevel('silent');
  setAppLogLevel('silent');
} catch {
  // ignore
}

// Initialisation unique et sécurisée de l'application Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let dbInstance: Firestore;
try {
  dbInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
} catch {
  dbInstance = getFirestore(app);
}

export const db = dbInstance;
export const auth = getAuth(app);
export { app };
export default db;

