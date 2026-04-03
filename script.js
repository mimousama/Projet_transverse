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

// --- 3. Récupération des éléments HTML ---
// Signup form elements
const usernameSignupInput = document.getElementById('usernameSignupInput');
const passwordSignupInput = document.getElementById('passwordSignupInput');
const securityQuestionInput = document.getElementById('securityQuestionInput');
const securityAnswerInput = document.getElementById('securityAnswerInput');
const btnSignup = document.getElementById('btn-signup');

// Login form elements
const usernameLoginInput = document.getElementById('usernameLoginInput');
const passwordLoginInput = document.getElementById('passwordLoginInput');
const btnLogin = document.getElementById('btn-login');
const btnForgotPassword = document.getElementById('btn-forgot-password');


const messageBox = document.getElementById('message');

// --- FONCTION INSCRIPTION ---
btnSignup.addEventListener('click', async () => {
    const username = usernameSignupInput.value.trim(); // .trim() removes leading/trailing whitespace
    const password = passwordSignupInput.value;
    const securityQuestion = securityQuestionInput.value.trim();
    const securityAnswer = securityAnswerInput.value.trim();

    if (!username || !password || !securityQuestion || !securityAnswer) {
        messageBox.innerText = "Please fill in all signup fields.";
        messageBox.className = "message error"; // Add error class for styling
        return;
    }

    try {
        // 1. Check if username is already taken
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            messageBox.innerText = "Username already taken. Please choose another one.";
            messageBox.className = "message error";
            return;
        }

        // 2. Create a dummy email for Firebase Auth
        // Using a unique domain based on your project ID to avoid conflicts
        const dummyEmail = `${username}@${firebaseConfig.projectId}.com`; 

        // 3. Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, dummyEmail, password);
        const user = userCredential.user;

        // 4. Store user data in Cloud Firestore
        await setDoc(doc(db, "users", user.uid), {
            username: username,
            securityQuestion: securityQuestion,
            securityAnswer: securityAnswer, // IMPORTANT: For production, you should hash this answer for security!
            createdAt: new Date()
        });

        messageBox.innerText = `Account created for: ${username}. Redirecting...`;
        messageBox.className = "message success";
        
        // --- REDIRECTION UPON SUCCESSFUL SIGNUP ---
        window.location.href = 'home.html'; // Redirect to home.html

    } catch (error) {
        messageBox.innerText = `Error creating account: ${error.message}`;
        messageBox.className = "message error";
        console.error("Signup error:", error);
    }
});

// --- FONCTION CONNEXION ---
btnLogin.addEventListener('click', async () => {
    const username = usernameLoginInput.value.trim();
    const password = passwordLoginInput.value;

    if (!username || !password) {
        messageBox.innerText = "Please enter your username and password to log in.";
        messageBox.className = "message error";
        return;
    }

    try {
        // Convert username back to the dummy email
        const dummyEmail = `${username}@${firebaseConfig.projectId}.com`;

        const userCredential = await signInWithEmailAndPassword(auth, dummyEmail, password);
        // User is successfully logged in. userCredential.user contains the Firebase user object.
        
        messageBox.innerText = `Welcome, ${username}! You are logged in. Redirecting...`;
        messageBox.className = "message info";
        
        // --- REDIRECTION UPON SUCCESSFUL LOGIN ---
        window.location.href = 'home.html'; // Redirect to home.html

    } catch (error) {
        messageBox.innerText = `Login error: ${error.message}`;
        messageBox.className = "message error";
        console.error("Login error:", error);
    }
});

// --- FORGOT PASSWORD (Placeholder) ---
btnForgotPassword.addEventListener('click', () => {
    messageBox.innerText = "This feature is not yet implemented. You would need to enter your username to trigger the security question flow.";
    messageBox.className = "message info";
    // This is where you'd implement the logic for security question recovery
});
