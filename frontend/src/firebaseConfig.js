// Import Firebase SDK dan Firestore
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Konfigurasi Firebase (ganti sesuai projectmu)
const firebaseConfig = {
    apiKey: "AIzaSyDK4IAQoQRtHbOqJgmAVOKWJN8eKdX8x5g",
  authDomain: "w-house.firebaseapp.com",
  projectId: "w-house",
  storageBucket: "w-house.firebasestorage.app",
  messagingSenderId: "963902610732",
  appId: "1:963902610732:web:29f27e73d6de836ff1a089",
  measurementId: "G-F72R5VXGWX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);

// Export db supaya bisa dipakai di komponen lain
export { db };
