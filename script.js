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
const analytics = getAnalytics(app); // Note: Analytics might require proper setup/consent for full functionality
const auth = getAuth(app); // Initialize Firebase Authentication
const db = getFirestore(app); // Initialize Cloud Firestore
console.log("All connected yiiihaaaafeur");

// --- 3. Récupération des éléments HTML (IDs corrigés) ---
// On utilise 'email' et 'password' car c'est ce qu'on a écrit dans le HTML
const emailInput = document.getElementById('email'); 
const passwordInput = document.getElementById('password');
const btnSignup = document.getElementById('btn-signup');
const btnLogin = document.getElementById('btn-login');
const messageBox = document.getElementById('message');

// On met en commentaire ou on supprime les autres car ils n'existent pas dans ton HTML
// const btnForgotPassword = ... (À supprimer pour l'instant)

// --- FONCTION INSCRIPTION ---
btnSignup.addEventListener('click', async () => {
    console.log("Le bouton S'inscrire a été cliqué !"); 
    
    // On récupère juste l'email et le mot de passe
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
        messageBox.innerText = "Merci de remplir l'email et le mot de passe.";
        return;
    }

    try {
        // On utilise directement les fonctions Firebase avec l'email
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        messageBox.innerText = "Compte créé avec succès !";
        console.log("Utilisateur créé :", userCredential.user);
        
    } catch (error) {
        messageBox.innerText = "Erreur : " + error.message;
    }
});

// --- FONCTION CONNEXION ---
// --- FONCTION CONNEXION ---
btnLogin.addEventListener('click', async () => {
    // On utilise les mêmes inputs que pour l'inscription : email et password
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
        messageBox.innerText = "Merci de saisir ton email et ton mot de passe.";
        messageBox.className = "message error";
        return;
    }

    try {
        // Connexion directe avec l'email réel
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        messageBox.innerText = `Ravi de te revoir ! Connexion réussie.`;
        messageBox.className = "message info";
        
        console.log("Connecté :", userCredential.user);

        // Redirection vers la page d'accueil
        // window.location.href = 'home.html'; 

    } catch (error) {
        messageBox.innerText = "Erreur de connexion : " + error.message;
        messageBox.className = "message error";
        console.error("Login error:", error);
    }
});

// Note : J'ai supprimé la partie btnForgotPassword car elle créait l'erreur rouge 
// que l'on voyait dans l'image_793aad.jpg.


