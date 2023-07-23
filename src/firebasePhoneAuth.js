import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBc0M0xkbYdP3Vrt_rkPW7kDfh5eAR_bcY",
  authDomain: "phoneauth-7a05a.firebaseapp.com",
  projectId: "phoneauth-7a05a",
  storageBucket: "phoneauth-7a05a.appspot.com",
  messagingSenderId: "924888448316",
  appId: "1:924888448316:web:729eefd69c85a20ba07239"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
