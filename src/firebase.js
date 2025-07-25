// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC4h9vP-lLkhXs-zr58MbS3EXxjtyUXOaM",
  authDomain: "ordenes-surgen.firebaseapp.com",
  projectId: "ordenes-surgen",
  storageBucket: "ordenes-surgen.appspot.com",
  messagingSenderId: "104328203190",
  appId: "1:104328203190:web:5be088dadfb9345fb64f17",
  measurementId: "G-2EW6XR9Z6R"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
