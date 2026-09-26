// Firebase Messaging Service Worker for background push notifications
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForInitialization",
  projectId: "clarifex-app",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  const notificationTitle = payload.notification?.title || "Clarifex Legal Alert";
  const notificationOptions = {
    body: payload.notification?.body || "Your contract analysis is ready for review.",
    icon: "/icon.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
