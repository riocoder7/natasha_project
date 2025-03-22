import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDp4l1ya5SnwywXjl7JpLvk5ljiI2OonNI",
    authDomain: "natasha-17954.firebaseapp.com",
    projectId: "natasha-17954",
    storageBucket: "natasha-17954.firebasestorage.app",
    messagingSenderId: "1023072095413",
    appId: "1:1023072095413:web:9c6a33d7e604132d2482fc",
    measurementId: "G-L026P6TKY6"
  };

  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

  // Export Firestore functions
export { db, collection, addDoc, getDocs };