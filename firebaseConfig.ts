import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD4Ynt_cVFnLsoMAzEY4tRYT9-TqV1toJM",
  authDomain: "appdevminiproject.firebaseapp.com",
  projectId: "appdevminiproject",
  storageBucket: "appdevminiproject.firebasestorage.app",
  messagingSenderId: "747787828656",
  appId: "1:747787828656:web:552ce1ce3a85251f152a75",
  measurementId: "G-W8LCDCZN3L"
};

const app = initializeApp(firebaseConfig);

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (e) {
  auth = getAuth(app);
}

const db = getFirestore(app);

export { auth, db };

