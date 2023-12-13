// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAHS1MadtDnhNBPdJNMx_G_8RcYr8X61eU",
  authDomain: "organ-donation-a8a9b.firebaseapp.com",
  projectId: "organ-donation-a8a9b",
  storageBucket: "organ-donation-a8a9b.appspot.com",
  messagingSenderId: "1004184568036",
  appId: "1:1004184568036:web:8ea12277829c828865acf1",
  measurementId: "G-D8XR0P0N61",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);

export default app;
