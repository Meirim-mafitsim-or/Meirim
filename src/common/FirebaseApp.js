// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from 'firebase/auth';

import "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCBC742Q2W8Z5AM_5GcMEuUZLjhUQxw4aU",
  authDomain: "meirim-b3c4f.firebaseapp.com",
  projectId: "meirim-b3c4f",
  storageBucket: "meirim-b3c4f.appspot.com",
  messagingSenderId: "725325643196",
  appId: "1:725325643196:web:7d38a099023dca9d35bfb9",
  measurementId: "G-YRT0FDPHJC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export default app;

