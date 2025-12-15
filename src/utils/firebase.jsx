import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyASZn0Gl55GbGtD_tZL6wv6M7--cXK_j1Q",
  authDomain: "codeastra-8bee9.firebaseapp.com",
  projectId: "codeastra-8bee9",
  storageBucket: "codeastra-8bee9.firebasestorage.app",
  messagingSenderId: "956650169084",
  appId: "1:956650169084:web:9ceece19e3ca8dd4f26d79",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
