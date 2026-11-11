import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
  type Auth,
} from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const environmentKeys = {
  apiKey: "EXPO_PUBLIC_FIREBASE_API_KEY",
  authDomain: "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN",
  projectId: "EXPO_PUBLIC_FIREBASE_PROJECT_ID",
  messagingSenderId: "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  appId: "EXPO_PUBLIC_FIREBASE_APP_ID",
} as const;

const missingKeys = (Object.keys(firebaseConfig) as Array<keyof typeof firebaseConfig>)
  .filter((key) => !firebaseConfig[key]?.trim())
  .map((key) => environmentKeys[key]);

export const firebaseConfigStatus = {
  configured: missingKeys.length === 0,
  missingKeys,
} as const;

export const firebaseApp: FirebaseApp | null = firebaseConfigStatus.configured
  ? getApps().length > 0
    ? getApp()
    : initializeApp({
        apiKey: firebaseConfig.apiKey!,
        authDomain: firebaseConfig.authDomain!,
        projectId: firebaseConfig.projectId!,
        messagingSenderId: firebaseConfig.messagingSenderId!,
        appId: firebaseConfig.appId!,
      })
  : null;

const createAuth = (app: FirebaseApp): Auth => {
  if (Platform.OS === "web") {
    return getAuth(app);
  }

  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    // Fast Refresh can evaluate this module after Auth has already been initialized.
    return getAuth(app);
  }
};

export const auth: Auth | null = firebaseApp ? createAuth(firebaseApp) : null;
export const db: Firestore | null = firebaseApp ? getFirestore(firebaseApp) : null;
