import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDUJY00zHYnR3caJgcespvq6jcI0QvEALY",
  authDomain: "flikup-ee7f4.firebaseapp.com",
  projectId: "flikup-ee7f4",
  storageBucket: "flikup-ee7f4.firebasestorage.app",
  messagingSenderId: "17253970169",
  appId: "1:17253970169:android:74e456ea52d7378bd27228",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
export default app;
