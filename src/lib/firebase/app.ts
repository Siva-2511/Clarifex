import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDummyKeyForInitialization",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "clarifex-app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1234567890:web:abcdef",
  databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "clarifex-app"}-default-rtdb.firebaseio.com`,
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const rtdb = getDatabase(firebaseApp);
