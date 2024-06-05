import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  addDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCF0OddnnemkRaIWgMB7qiljOSK-nMAVYc",
  authDomain: "project-m-623e0.firebaseapp.com",
  projectId: "project-m-623e0",
  storageBucket: "project-m-623e0.appspot.com",
  messagingSenderId: "402462860686",
  appId: "1:402462860686:web:295b5a3b975f4a54a030df",
  measurementId: "G-7M5FEH7YCJ",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

const auth = getAuth(app);

export { auth, db };
