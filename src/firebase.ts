import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth"; // If you plan to use Firebase Authentication

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCySIdMuHHAcBGGxIheSi8_fFpJbQLodsI",
  authDomain: "warehouse-system-3b4ea.firebaseapp.com",
  projectId: "warehouse-system-3b4ea",
  storageBucket: "warehouse-system-3b4ea.appspot.com",
  messagingSenderId: "270752310295",
  appId: "1:270752310295:web:8fdad81ccb4f76c0c4e852",
  measurementId: "G-E3B8E4JN40"
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const auth = firebase.auth(); // If you plan to use Firebase Authentication
export default firebase;
