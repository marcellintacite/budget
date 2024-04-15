// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBwWHsjNS9yHM199Fe3PwD05U7nmYMqXAY",
  authDomain: "web-app-b1ebc.firebaseapp.com",
  databaseURL: "https://web-app-b1ebc-default-rtdb.firebaseio.com",
  projectId: "web-app-b1ebc",
  storageBucket: "web-app-b1ebc.appspot.com",
  messagingSenderId: "982356225821",
  appId: "1:982356225821:web:de7d6cf5a11b321fe0fbf4",
  measurementId: "G-SEKJG0YF3Q",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);

// initialiser firestore avec persistance
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});
