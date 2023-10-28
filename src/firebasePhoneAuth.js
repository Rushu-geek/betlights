import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCk6fLYzlVxjiQWWv4Z-3Vao8L2mmtDgxU",
  authDomain: "thomas-cdee5.firebaseapp.com",
  projectId: "thomas-cdee5",
  storageBucket: "thomas-cdee5.appspot.com",
  messagingSenderId: "939459880201",
  appId: "1:939459880201:web:3373e6d5107c2b27b01fd8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
