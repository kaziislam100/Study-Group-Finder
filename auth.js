import { auth } from './firebase-config.js';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Reference to the login button and logout button
const googleLoginBtn = document.getElementById('google-login-btn');
const logoutBtn = document.getElementById('logout-btn');

// Handle Google login
googleLoginBtn.addEventListener('click', async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log('User logged in:', user);
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
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, show the group creation form
        showGroupCreationForm(user);
    } else {
        // User is signed out, show login form
        showLoginForm();
    }
});

// Function to show the group creation form
function showGroupCreationForm(user) {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('groupFormContainer').style.display = 'block';
    document.querySelector('.search-container').style.display = 'block';

    // You can display user details if needed
    console.log('Logged in as:', user.displayName, user.email);
}

// Function to show the login form
function showLoginForm() {
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('groupFormContainer').style.display = 'none';
    document.querySelector('.search-container').style.display = 'none';
}
