import { initializeApp } from 'firebase/app';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDnwj7enoqC8T8lNOSoFMVoBA5HLnvkPJo",
    authDomain: "vicky-4d5d8.firebaseapp.com",
    projectId: "vicky-4d5d8",
    storageBucket: "vicky-4d5d8.appspot.com",
    messagingSenderId: "395103575379",
    appId: "1:395103575379:web:36dcd99651b6292dd195a6"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export default storage;