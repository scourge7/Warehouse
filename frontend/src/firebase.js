// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // dari Firebase Console
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
