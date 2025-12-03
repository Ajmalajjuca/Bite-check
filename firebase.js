import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

// Your firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA2w4ytVxv1JuBAmCqBhxEq5Y1FxWrsoII",
  authDomain: "bitecheck-b2862.firebaseapp.com",
  projectId: "bitecheck-b2862",
  storageBucket: "bitecheck-b2862.firebasestorage.app",
  messagingSenderId: "529430956648",
  appId: "1:529430956648:web:5ec3422713b16bd2be09dd",
};

// 🟢 Initialize app only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 🟢 Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// 🟢 Initialize Firestore with proper settings for React Native
let db;
try {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  });
} catch (error) {
  // If already initialized, just get the instance
  db = getFirestore(app);
}

export { app, auth, db };
