import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBf377KQiGmjKPk4na4ixjjI06Lv6YroLk",
    authDomain: "betlights-afcff.firebaseapp.com",
    databaseURL: "",
    projectId: "betlights-afcff",
    storageBucket: "betlights-afcff.appspot.com",
    messagingSenderId: "728353810638",
    appId: "1:728353810638:web:b3073dd8c7f3abe695089f"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const storage = getStorage(app);
export default getFirestore(app);