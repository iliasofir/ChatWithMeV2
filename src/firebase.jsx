// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEsk72Lr6MWIIlPDhA_EPLu1rio0uKbKU",
  authDomain: "chatwithme-adb2e.firebaseapp.com",
  projectId: "chatwithme-adb2e",
  storageBucket: "chatwithme-adb2e.firebasestorage.app",
  messagingSenderId: "94337435378",
  appId: "1:94337435378:web:020b741ba2d9f8a144f26b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); //database
const auth = getAuth(app); // auth
const storage = getStorage(app); // storage

export { db, auth, storage };