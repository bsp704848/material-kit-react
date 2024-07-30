import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // If you plan to use Firebase Authentication
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyCySIdMuHHAcBGGxIheSi8_fFpJbQLodsI",
  authDomain: "warehouse-system-3b4ea.firebaseapp.com",
  projectId: "warehouse-system-3b4ea",
  storageBucket: "warehouse-system-3b4ea.appspot.com",
  messagingSenderId: "270752310295",
  appId: "1:270752310295:web:8fdad81ccb4f76c0c4e852",
  measurementId: "G-E3B8E4JN40"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app); // If you plan to use Firebase Authentication
export const storage = getStorage(app);

export default app;
