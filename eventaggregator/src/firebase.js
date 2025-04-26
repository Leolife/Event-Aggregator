
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore";
import { getAuth, deleteUser, sendEmailVerification } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDqgtkpby4KM9jJN6dESZ2hLUuYnAFq63o",
  authDomain: "event-aggregator-b95e6.firebaseapp.com",
  databaseURL: "https://event-aggregator-b95e6-default-rtdb.firebaseio.com",
  projectId: "event-aggregator-b95e6",
  storageBucket: "event-aggregator-b95e6.firebasestorage.app",
  messagingSenderId: "570659202335",
  appId: "1:570659202335:web:cfd9e1f2d96075c6993c2a",
  measurementId: "G-M10TZN2EVK"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);  // currently using for login authentication
export const firestore = getFirestore(app);


// function to delete a user's account
export const deleteUserAccount = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    try {
      await deleteUser(user);
      return { success: true };
    } catch (error) {
      console.error("Error deleting user:", error);
      return { success: false, error };
    }
  } else {
    return { success: false, error: "No user is currently signed in." };
  }
};
