import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";

const config = {
  // apiKey: "AIzaSyDrkCcTA-x2YRWDg9irkpp41YfJ7Nllo1U",
  // authDomain: "wildhacks24-1108b.firebaseapp.com",
  // databaseURL: "https://wildhacks24-1108b-default-rtdb.firebaseio.com",
  // projectId: "wildhacks24-1108b",
  // storageBucket: "wildhacks24-1108b.appspot.com",
  // messagingSenderId: "282904899307",
  // appId: "1:282904899307:web:b67dd6eb5ad1577abd98ae",

  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  // databaseURL: import.meta.env.
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};
export const app = initializeApp(config);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
