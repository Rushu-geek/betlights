import { initializeApp } from 'firebase/app';
import { getStorage } from "firebase/storage";

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
const storage = getStorage(app);

export default storage;