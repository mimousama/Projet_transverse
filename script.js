// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";

import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-analytics.js";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js"; // Make sure to import auth functions

import { getFirestore, collection, query, where, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js"; // Import Firestore functions


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyAHf39NnMJDAZ-t8ZZx-Ae17Yy0pb4FiNI",

  authDomain: "elderisk.firebaseapp.com",

  projectId: "elderisk",

  storageBucket: "elderisk.firebasestorage.app",

  messagingSenderId: "995844817153",

  appId: "1:995844817153:web:306c5cb36e6d2a08851b00",

  measurementId: "G-ETL1WVHZRZ"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

const auth = getAuth(app); // Initialize Firebase Authentication

const db = getFirestore(app); // Initialize Cloud Firestore

console.log("All connected yiiihaaaafeur");


// ... (rest of your code)










// ... (existing code)

// 3. Récupération des éléments HTML (add these new ones)
const emailInput = document.getElementById('email'); // This will be the dummy email now
const passwordInput = document.getElementById('password');
const usernameInput = document.getElementById('username'); // New input for username
const securityQuestionInput = document.getElementById('securityQuestion'); // New input
const securityAnswerInput = document.getElementById('securityAnswer'); // New input
const btnSignup = document.getElementById('btn-signup');
const btnLogin = document.getElementById('btn-login');
const messageBox = document.getElementById('message');

// --- FONCTION INSCRIPTION ---
btnSignup.addEventListener('click', async () => { // Make it async
    const username = usernameInput.value;
    const password = passwordInput.value;
    const securityQuestion = securityQuestionInput.value;
    const securityAnswer = securityAnswerInput.value;

    if (!username || !password || !securityQuestion || !securityAnswer) {
        messageBox.innerText = "Please fill in all fields.";
        messageBox.style.color = "red";
        return;
    }

    try {
        // 1. Check if username is already taken
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            messageBox.innerText = "Username already taken. Please choose another one.";
            messageBox.style.color = "red";
            return;
        }

        // 2. Create a dummy email for Firebase Auth
        const dummyEmail = `${username}@elderisk.com`; // Using your project ID as part of the domain

        // 3. Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, dummyEmail, password);
        const user = userCredential.user;

        // 4. Store user data in Cloud Firestore
        await setDoc(doc(db, "users", user.uid), {
            username: username,
            securityQuestion: securityQuestion,
            securityAnswer: securityAnswer, // **Consider hashing this for security!**
            // You can add other profile details here too
            createdAt: new Date()
        });

        messageBox.style.color = "green";
        messageBox.innerText = `Account created for: ${username}`;
        // Clear inputs or redirect user
    } catch (error) {
        messageBox.innerText = `Error: ${error.message}`;
        messageBox.style.color = "red";
    }
});


// --- FONCTION CONNEXION ---
btnLogin.addEventListener('click', async () => { // Make it async
    const username = usernameInput.value; // User will enter username here
    const password = passwordInput.value;

    if (!username || !password) {
        messageBox.innerText = "Please enter your username and password.";
        messageBox.style.color = "red";
        return;
    }

    try {
        // Convert username to dummy email
        const dummyEmail = `${username}@elderisk.com`;

        const userCredential = await signInWithEmailAndPassword(auth, dummyEmail, password);
        // Optionally, fetch user data from Firestore if you need other profile details
        // const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
        // const userData = userDoc.data();

        messageBox.style.color = "blue";
        messageBox.innerText = `Welcome, ${username}!`; // Display username
    } catch (error) {
        messageBox.innerText = `Error: ${error.message}`;
        messageBox.style.color = "red";
    }
});
