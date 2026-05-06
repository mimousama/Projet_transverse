// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js"; // Make sure to import auth functions
import { getFirestore, collection, query, where, getDocs, setDoc, doc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js"; //
import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHf39NnMJDAZ-t8ZZx-Ae17Yy0pb4FiNI",
  authDomain: "elderisk.firebaseapp.com",
  databaseURL: "https://elderisk-default-rtdb.europe-west1.firebasedatabase.app",
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
const db = getDatabase(app); // Initialize Realtime Database
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
        passwordInput.value = ""; // Efface le champ mot de passe pour plus de sécurité
        console.error("Login error:", error);
    }
});



// On récupère les éléments
const testButton = document.getElementById('testbutton');
const testData = document.getElementById('testdata');

// On branche l'événement
testButton.addEventListener('click', () => {
    const valeur = testData.value;
    console.log("Tentative de sauvegarde pour :", valeur);
    
    // On appelle ta fonction de sauvegarde
    sauvegarderScore(valeur);
});

// Ta fonction sauvegarderScore (assure-toi qu'elle est bien définie dans script.js)
async function sauvegarderScore(score) {
    const user = auth.currentUser;

    if (user) {
        // On crée une référence vers l'endroit où on veut ranger le score
        // Ici : users / ID_DE_L_UTILISATEUR / scores
        const userScoresRef = ref(db, 'users/' + user.uid + '/scores');
        
        // "push" permet de rajouter un score à la liste sans effacer les anciens
        const newScoreRef = push(userScoresRef);

        try {
            await set(newScoreRef, {
                valeur: score,
                date: new Date().toLocaleString()
            });
            alert("Score de " + score + " enregistré dans la Realtime Database !");
        } catch (error) {
            console.error("Erreur :", error);
            alert("Erreur lors de la sauvegarde.");
        }
    } else {
        alert("Connecte-toi d'abord !");
    }
}


