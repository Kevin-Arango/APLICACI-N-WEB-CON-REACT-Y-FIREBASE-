import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDOlBEqSgYmB3fPBtXOAOn-39pvk1qgccI",
  authDomain: "inventarioproductos-ef958.firebaseapp.com",
  projectId: "inventarioproductos-ef958",
  storageBucket: "inventarioproductos-ef958.appspot.com",
  messagingSenderId: "24309856202",
  appId: "1:24309856202:web:3665e2bd531cf4d28074d9",
  measurementId: "G-4J2B6ECKDQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { auth, firestore, storage };
