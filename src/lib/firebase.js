import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-69a9d.firebaseapp.com",
  projectId: "reactchat-69a9d",
  storageBucket: "reactchat-69a9d.firebasestorage.app",
  messagingSenderId: "1032999750716",
  appId: "1:1032999750716:web:37c5e20b25af2fdc2d8739",
  databaseURL:"https://reactchat-69a9d-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);