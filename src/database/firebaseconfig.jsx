import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Asegúrate de importar esto
import {getAuth} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDWf3YymwWxP2jmtPsQql7vD5Rh1OdLcoY",
  authDomain: "scholaria-d56f9.firebaseapp.com",
  projectId: "scholaria-d56f9",
  storageBucket: "scholaria-d56f9.firebasestorage.app",
  messagingSenderId: "670184845200",
  appId: "1:670184845200:web:2edb97d9ae975e55ea4d15",
  measurementId: "G-WVLLT3J20W"
};

const appfirebase = initializeApp(firebaseConfig);

const db = getFirestore(appfirebase);

const auth = getAuth(appfirebase);

export {appfirebase, db, auth};
