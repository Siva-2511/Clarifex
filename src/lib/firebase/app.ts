import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDummyKeyForInitialization",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "clarifex-13c44",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1050590644742",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1050590644742:web:073bb71bc3ee2c108d5187",
  databaseURL:
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
    "https://clarifex-13c44-default-rtdb.asia-southeast1.firebasedatabase.app",
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const rtdb = getDatabase(firebaseApp);
