// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "naijaagroconnect",
  appId: "1:753258882677:web:fe64b6a6989286b6ae7a3c",
  storageBucket: "naijaagroconnect.firebasestorage.app",
  apiKey: "AIzaSyDDTaqmqI3sGDt4GzrMhY-egHse2BmGWbQ",
  authDomain: "naijaagroconnect.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "753258882677",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
