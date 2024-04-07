import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";

const config = {
  apiKey: "AIzaSyDrkCcTA-x2YRWDg9irkpp41YfJ7Nllo1U",
  authDomain: "wildhacks24-1108b.firebaseapp.com",
  databaseURL: "https://wildhacks24-1108b-default-rtdb.firebaseio.com",
  projectId: "wildhacks24-1108b",
  storageBucket: "wildhacks24-1108b.appspot.com",
  messagingSenderId: "282904899307",
  appId: "1:282904899307:web:b67dd6eb5ad1577abd98ae",
};
export const app = initializeApp(config);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
