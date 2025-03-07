import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ✅ Your Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaUyHkxAdft1_-JBCCBbUBA7MyiJnbRXs",
  authDomain: "scanner-8780a.firebaseapp.com",
  projectId: "scanner-8780a",
  storageBucket: "scanner-8780a.appspot.com", // Fixed storage bucket URL
  messagingSenderId: "145175979100",
  appId: "1:145175979100:web:6a1a1a85a4bf4adb4fb299",
  measurementId: "G-R1CZKMFLLV", // Not needed for React Native
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
