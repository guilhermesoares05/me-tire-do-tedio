
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA2kJYudpfwIoaL00SSaSpAj3Vwo2LpOeY",
  authDomain: "me-tire-do-tedio.firebaseapp.com",
  projectId: "me-tire-do-tedio",
  storageBucket: "me-tire-do-tedio.firebasestorage.app",
  messagingSenderId: "745880746758",
  appId: "1:745880746758:web:7e610b19e6601670e2bc87"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
