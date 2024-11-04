//firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";


// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC03czYmN3ZS8CHjn0x9JpOhHCID3HQwXw",
    authDomain: "study-group-finder-26e67.firebaseapp.com",
    projectId: "study-group-finder-26e67",
    storageBucket: "study-group-finder-26e67.firebasestorage.app",
    messagingSenderId: "60724631858",
    appId: "1:60724631858:web:0c178a4b2885e0d77c5f2b",
    measurementId: "G-5NV9B0ZB5X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);
