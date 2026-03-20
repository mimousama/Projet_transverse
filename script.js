// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-analytics.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
console.log("All connected yiiihaaaa");

// 3. Récupération des éléments HTML
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const btnSignup = document.getElementById('btn-signup');
const btnLogin = document.getElementById('btn-login');
const messageBox = document.getElementById('message');

// --- FONCTION INSCRIPTION ---
btnSignup.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            messageBox.style.color = "green";
            messageBox.innerText = "Compte créé pour : " + userCredential.user.email;
        })
        .catch((error) => {
            messageBox.innerText = "Erreur : " + error.message;
        });
});

// --- FONCTION CONNEXION ---
btnLogin.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            messageBox.style.color = "blue";
            messageBox.innerText = "Bienvenue, tu es connecté !";
        })
        .catch((error) => {
            messageBox.innerText = "Erreur : " + error.message;
        });
});