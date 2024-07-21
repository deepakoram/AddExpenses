// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyDh7Ary1Ptz5dVvsTPFr8qAbjgcgy5agYM",
  authDomain: "expense-tracker-applicat-d942b.firebaseapp.com",
  projectId: "expense-tracker-applicat-d942b",
  storageBucket: "expense-tracker-applicat-d942b.appspot.com",
  messagingSenderId: "995633911259",
  appId: "1:995633911259:web:c8eb4adf60747907ccc3fe",
  measurementId: "G-SSVP406D9V"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(app);