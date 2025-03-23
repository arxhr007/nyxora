import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyCJ2xe6hdBHxOCpb5_cgp6njwTv5hTY888",
  authDomain: "nyxora-7aa0d.firebaseapp.com",
  projectId: "nyxora-7aa0d",
  storageBucket: "nyxora-7aa0d.appspot.com", // Fixed storageBucket URL
  messagingSenderId: "250070108630",
  appId: "1:250070108630:web:b94a6e4af5fee82723fc77"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Initialize Firestore
