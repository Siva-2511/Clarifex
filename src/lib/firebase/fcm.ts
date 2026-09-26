"use client";

import { getMessaging, getToken, onMessage, Messaging } from "firebase/messaging";
import { firebaseApp } from "./app";

let messaging: Messaging | null = null;

if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  try {
    messaging = getMessaging(firebaseApp);
  } catch (e) {
    console.warn("FCM messaging not supported in this browser:", e);
  }
}

export async function requestFcmToken(): Promise<string | null> {
  if (!messaging) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const currentToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      });
      return currentToken || null;
    }
  } catch (err) {
    console.warn("An error occurred while retrieving token:", err);
  }
  return null;
}

export function onFcmMessage(callback: (payload: any) => void) {
  if (!messaging) return () => {};
  return onMessage(messaging, (payload) => {
    callback(payload);
  });
}
