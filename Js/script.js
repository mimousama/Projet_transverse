import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js"; 
import { getFirestore, collection, query, where, getDocs, setDoc, doc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js"; 
import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

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
const analytics = getAnalytics(app); 
const auth = getAuth(app); 
const db = getDatabase(app); 


console.log("All connected yiiihaaaafeur");

const emailLogin = document.getElementById('email-login');
const passwordLogin = document.getElementById('password-login');
const btnLogin = document.getElementById('btn-login');

const emailSignup = document.getElementById('email-signup');
const passwordSignup = document.getElementById('password-signup');
const secretQuestion = document.getElementById('secret-question');
const secretAnswer = document.getElementById('secret-answer');
const btnSignup = document.getElementById('btn-signup');

const btnForgot = document.getElementById('btn-forgot-password');
const messageBox1 = document.getElementById('message1');
const messageBox2 = document.getElementById('message2');

console.log("Tous les éléments HTML ont été récupérés par le script.");


btnLogin.addEventListener('click', async () => {
    console.log("--- DÉBUT DE LA TENTATIVE DE CONNEXION ---");
    console.log("Le bouton Connexion a été cliqué !");

    const email = emailLogin.value.trim();
    const password = passwordLogin.value;

    console.log("Email saisi pour connexion :", email);

    if (!email || !password) {
        console.log("Échec : Il manque l'email ou le mot de passe.");
        messageBox1.innerText = "Please enter your email and password.";
        messageBox1.className = "message error";
        return;
    }

    try {
        console.log("Envoi de la requête de connexion à Firebase...");
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        emailLogin.value = "";
        passwordLogin.value = "";
        
        messageBox1.innerText = "Login successful!";
        messageBox1.className = "message success";
        
        console.log("SUCCÈS - Connecté :", userCredential.user.email);

    } catch (error) {
        passwordLogin.value = "";
        messageBox1.innerText = "Error: Incorrect email or password.";
        messageBox1.className = "message error";
        
        console.error("ÉCHEC - Login error:", error.code, error.message);
    }
});


btnSignup.addEventListener('click', async () => {
    console.log("--- DÉBUT DE LA TENTATIVE D'INSCRIPTION ---");
    console.log("Le bouton S'inscrire a été cliqué !"); 
    
    const email = emailSignup.value.trim();
    const password = passwordSignup.value;
    const question = secretQuestion.value.trim();
    const answer = secretAnswer.value.trim();

    console.log("Données saisies - Email :", email, "/ Question :", question);

    if (!email || !password || !question || !answer) {
        console.log("Échec : Tous les champs d'inscription ne sont pas remplis.");
        messageBox2.innerText = "Please fill in all fields!";
        messageBox2.className = "message error";
        return;
    }

    try {
        console.log("Création du compte Firebase en cours...");
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        console.log("Compte créé avec succès ! UID :", user.uid);
        console.log("Sauvegarde de la question secrète dans la base de données...");

        // Sauvegarde de la question secrète
        await set(ref(db, 'users/' + user.uid + '/securite'), {
            question_secrete: question,
            reponse_secrete: answer.toLowerCase()
        });

        messageBox2.innerText = "Registration successful! Your account has been created.";
        messageBox2.className = "message success";
        
        console.log("SUCCÈS - Utilisateur créé et données enregistrées :", user.email);

    } catch (error) {
        messageBox2.innerText = "Registration error: " + error.message;
        messageBox2.className = "message error";
        
        console.error("ÉCHEC - Erreur d'inscription :", error.code, error.message);
    }
});


btnForgot.addEventListener('click', async () => {
    console.log("--- TENTATIVE DE RÉINITIALISATION DE MOT DE PASSE ---");
    console.log("Le bouton Mot de passe oublié a été cliqué !");
    
    const email = emailLogin.value.trim();
    console.log("Email ciblé pour la réinitialisation :", email);

    if (!email) {
        console.log("Échec : L'email n'a pas été renseigné dans la case de connexion.");
        messageBox1.innerText = "Please enter your email in the Login section, then click on Forgot password.";
        messageBox1.className = "message error";
        return;
    }

    try {
        console.log("Demande de l'email de réinitialisation à Firebase...");
        await sendPasswordResetEmail(auth, email);
        
        messageBox1.innerText = "A password reset email has been sent to " + email;
        messageBox1.className = "message info";
        
        console.log("SUCCÈS - Email de reset envoyé !");
    } catch (error) {
        messageBox1.innerText = "Error: " + error.message;
        messageBox1.className = "message error";
        
        console.error("ÉCHEC - Erreur d'envoi du mail de reset :", error.code, error.message);
    }
});

// ========================================================
const testButton = document.getElementById('testbutton');
const testData = document.getElementById('testdata');

if (testButton && testData) { 
    testButton.addEventListener('click', () => {
        const valeur = testData.value;
        console.log("Tentative de sauvegarde pour :", valeur);
        sauvegarderScore(valeur);
    });
}

async function sauvegarderScore(score) {
    console.log("Lancement de la fonction sauvegarderScore...");
    const user = auth.currentUser;

    if (user) {
        console.log("Utilisateur identifié :", user.uid, "- Préparation de l'enregistrement...");
        const userScoresRef = ref(db, 'users/' + user.uid + '/scores');
        const newScoreRef = push(userScoresRef);

        try {
            await set(newScoreRef, {
                valeur: score,
                date: new Date().toLocaleString()
            });
            console.log("SUCCÈS - Score enregistré en base de données !");
            alert("Score of " + score + " saved to the Realtime Database!");
        } catch (error) {
            console.error("ÉCHEC - Erreur lors de la sauvegarde :", error);
            alert("Error saving score.");
        }
    } else {
        console.log("ÉCHEC - Impossible de sauvegarder, aucun utilisateur n'est connecté.");
        alert("Please log in first!");
    }
}