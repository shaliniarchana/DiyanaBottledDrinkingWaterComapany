// /firebase/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth  } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// ✅ Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAu6bzZW-A5D8a2spyAcnin_rtCwnRbKHg",
  authDomain: "diyanawater.firebaseapp.com",
  projectId: "diyanawater",
  storageBucket: "diyanawater.firebasestorage.app",
  messagingSenderId: "732301529187",
  appId: "1:732301529187:web:c9a958d2c35725525d2856",
  measurementId: "G-H488LZ5QH3"
};


// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);


