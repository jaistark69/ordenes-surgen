// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC4h9vP-lLkhXs-zr58MbS3EXxjtyUXOaM",
  authDomain: "ordenes-surgen.firebaseapp.com",
  projectId: "ordenes-surgen",
  storageBucket: "ordenes-surgen.firebasestorage.app",
  messagingSenderId: "104328203190",
  appId: "1:104328203190:web:5be088dadfb9345fb64f17",
  measurementId: "G-2EW6XR9Z6R"
};
// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 🔥 Aquí está la clave: exporta `auth` y `db`
export const auth = getAuth(app);
export const db = getFirestore(app);
