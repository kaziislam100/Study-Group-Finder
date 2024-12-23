import { auth } from './firebase-config.js';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { db } from './firebase-config.js';
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";


// Reference to the login button and logout button
const googleLoginBtn = document.getElementById('google-login-btn');
const logoutBtn = document.getElementById('logout-btn');

// Handle Google login
googleLoginBtn.addEventListener('click', async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check if user exists in Firestore
        const userDoc = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDoc);

        if (!docSnap.exists()) {
            // If the user does not exist, create a new user with the default role
            await setDoc(userDoc, {
                displayName: user.displayName,
                email: user.email,
                role: 'regular' // Set default role to regular
            });
            console.log('New user created with role: regular');
        } else {
            console.log('User already exists in Firestore:', docSnap.data());
        }

        showGroupCreationForm(user); // Show the group creation form if login is successful
    } catch (error) {
        console.error('Error during login:', error.message);
    }
});

// Handle logout
logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
        console.log('User logged out');
        showLoginForm(); // Show login form after successful logout
    } catch (error) {
        console.error('Error during logout:', error.message);
    }
});

// Listen for authentication state changes
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userDoc = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDoc);
        
        if (docSnap.exists()) {
            const userData = docSnap.data();
            console.log('User data:', userData);
            showGroupCreationForm(user, userData.role); // Show the group creation form if login is successful
        }
    } else {
        showLoginForm();
    }
});

// Function to show the group creation form
function showGroupCreationForm(user, role) {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('groupFormContainer').style.display = 'block';
    document.querySelector('.search-container').style.display = 'block';

    if (role === 'admin') {
        // Show group creation form only for admins
        document.getElementById('groupFormContainer').style.display = 'block';
        console.log('Admin logged in:', user.displayName, user.email);
    } else {
        // Hide group creation form for regular users
        document.getElementById('groupFormContainer').style.display = 'none';
        console.log('Regular user logged in:', user.displayName, user.email);
    }
}

// Function to show the login form
function showLoginForm() {
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('groupFormContainer').style.display = 'none';
    document.querySelector('.search-container').style.display = 'none';
}
