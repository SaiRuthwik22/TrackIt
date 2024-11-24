// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth,GoogleAuthProvider } from 'firebase/auth';
import {doc,getFirestore,setDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAPJkClWWgZ4-AqblfxAeocZ16IJcJ63sY",
  authDomain: "finance-tracker-84a15.firebaseapp.com",
  projectId: "finance-tracker-84a15",
  storageBucket: "finance-tracker-84a15.firebasestorage.app",
  messagingSenderId: "625740891618",
  appId: "1:625740891618:web:9192a16fc141a7fb2925bb",
  measurementId: "G-5X8DTDMD3H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
export {db,auth,provider,doc,setDoc}