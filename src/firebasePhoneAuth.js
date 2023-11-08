import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAmrf0rzQy0J2cGPRaLurWBRl_iLvYVeBE",
  authDomain: "svexch.firebaseapp.com",
  projectId: "svexch",
  storageBucket: "svexch.appspot.com",
  messagingSenderId: "3534716036",
  appId: "1:3534716036:web:fbeeb56952f71b554f96d1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
