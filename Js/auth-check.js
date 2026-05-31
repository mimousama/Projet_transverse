import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";


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


function injecterPastille() {

    if (document.getElementById('status-connexion')) return;

    const pastilleCode = `
        <style>
            #status-connexion {
                position: fixed;
                top: 15px;
                right: 15px;
                z-index: 10000; /* Assure que c'est toujours au-dessus du reste */
                display: flex;
                align-items: center;
                gap: 8px;
                font-family: Arial, sans-serif;
                font-size: 14px;
                background: #ffffff;
                padding: 6px 12px;
                border-radius: 20px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                cursor: pointer;
                transition: all 0.3s ease;
            }
            #status-connexion:hover {
                transform: scale(1.05);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }
            .pastille {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                display: inline-block;
            }
            /* Couleurs gérées automatiquement */
            #status-connexion.invite { color: #d32f2f; border: 1px solid #ffcdd2; }
            #status-connexion.invite .pastille { background-color: #d32f2f; }
            #status-connexion.connecte { color: #2e7d32; border: 1px solid #c8e6c9; }
            #status-connexion.connecte .pastille { background-color: #2e7d32; }
        </style>
        
        <div id="status-connexion" class="invite">
            <span class="pastille"></span>
            <span id="status-texte">Loading...</span>
        </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', pastilleCode);
}


injecterPastille();


onAuthStateChanged(auth, (user) => {
    const badge = document.getElementById('status-connexion');
    const texte = document.getElementById('status-texte');
    const zoneStatutPage = document.getElementById('statut-connexion-page');
    const texteStatutPage = document.getElementById('texte-statut-page');

    if (user) {
        // IF CONNECTED
        if (badge && texte) {
            badge.className = "connecte";
            texte.innerText = "Connected";
            badge.onclick = () => window.location.href = '/connexion.html';
        }


        if (zoneStatutPage && texteStatutPage) {
            zoneStatutPage.style.display = "block";
            texteStatutPage.innerText = "You are logged in with: " + user.email;
        }

    } else {
        // IF INVITED
        if (badge && texte) {
            badge.className = "invite";
            texte.innerText = "Disconnected";
            badge.onclick = () => window.location.href = '/connexion.html';
        }


        if (zoneStatutPage) {
            zoneStatutPage.style.display = "none";
        }
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const btnLogoutPage = document.getElementById('btn-logout-page');
    
    if (btnLogoutPage) {
        btnLogoutPage.addEventListener('click', async () => {
            try {
                await signOut(auth);
                const message1 = document.getElementById('message1'); // Ton ID de message sur la page connexion
                if(message1) {
                    message1.innerText = "You have been successfully logged out.";
                    message1.className = "message info";
                }
            } catch (error) {
                console.error("Erreur lors de la déconnexion :", error);
            }
        });
    }
});