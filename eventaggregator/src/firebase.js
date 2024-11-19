// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdcM1LM8-ZxALOmy_CtVjh_aSsSZ7yFNY",
  authDomain: "event-aggregator-d08a5.firebaseapp.com",
  databaseURL: "https://event-aggregator-d08a5-default-rtdb.firebaseio.com",
  projectId: "event-aggregator-d08a5",
  storageBucket: "event-aggregator-d08a5.firebasestorage.app",
  messagingSenderId: "529849907947",
  appId: "1:529849907947:web:567136f3bb7fe139321cae",
  measurementId: "G-MFXNZHCF01"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const firestore = getFirestore(app);
