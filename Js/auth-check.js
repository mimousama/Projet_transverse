import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

// Ta config Firebase exacte
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Écouteur de l'état de connexion de Firebase
onAuthStateChanged(auth, (user) => {
    // 1. Gestion de la PASTILLE (présente sur les pages de contenu)
    const badge = document.getElementById('status-connexion');
    const texte = document.getElementById('status-texte');

    // 2. Gestion de la ZONE DE TEXTE + DÉCONNEXION (présente uniquement sur la page connexion.html)
    const zoneStatutPage = document.getElementById('statut-connexion-page');
    const texteStatutPage = document.getElementById('texte-statut-page');

    if (user) {
        console.log("Utilisateur connecté :", user.email);

        // Si la pastille existe sur la page actuelle (ex: chapitre 1)
        if (badge && texte) {
            badge.className = "status-badge connecte";
            texte.innerText = "Connecté";
            // RÈGLE : Même verte, cliquer dessus renvoie vers la page connexion
            badge.onclick = () => {
                window.location.href = 'connexion.html';
            };
        }

        // Si on est sur la page de connexion, on affiche le message de bienvenue et le bouton déconnexion
        if (zoneStatutPage && texteStatutPage) {
            zoneStatutPage.style.display = "block";
            texteStatutPage.innerText = "Bonjour ! Vous êtes bien connecté avec : " + user.email;
        }

    } else {
        console.log("Utilisateur déconnecté.");

        // Si la pastille existe sur la page actuelle
        if (badge && texte) {
            badge.className = "status-badge invite";
            texte.innerText = "Déconnecté";
            badge.onclick = () => {
                window.location.href = 'connexion.html';
            };
        }

        // Si on est sur la page de connexion et qu'on est déconnecté, on cache la zone
        if (zoneStatutPage) {
            zoneStatutPage.style.display = "none";
        }
    }
});

// Gestion du clic sur le bouton Déconnexion (spécifique à la page connexion.html)
document.addEventListener('DOMContentLoaded', () => {
    const btnLogoutPage = document.getElementById('btn-logout-page');
    
    if (btnLogoutPage) {
        btnLogoutPage.addEventListener('click', async () => {
            console.log("Clic Déconnexion sur la page Connexion...");
            try {
                await signOut(auth);
                console.log("Déconnexion réussie !");
                messageBox.innerText = "Vous avez été déconnecté.";
                messageBox.className = "message info";
            } catch (error) {
                console.error("Erreur lors de la déconnexion :", error);
            }
        });
    }
});