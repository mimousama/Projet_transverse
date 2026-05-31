import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";


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
const db = getDatabase(app);

// Global variables
let currentUser = null;
let previousScore = null;
let quizId = "quiz_unknown";


const titleElement = document.querySelector('h1 strong') || document.querySelector('h1');
if (titleElement) {
    const match = titleElement.innerText.match(/\d+/);
    if (match) {
        quizId = "quiz" + match[0]; 
    }
}


onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        
        const scoreRef = ref(db, `users/${user.uid}/scores/${quizId}`);
        const snapshot = await get(scoreRef);
        
        if (snapshot.exists()) {
            previousScore = snapshot.val().score;
            

            const banner = document.createElement('div');
            banner.style = "background-color: #e3f2fd; color: #1565c0; padding: 15px; border-radius: 8px; margin-bottom: 25px; text-align: center; font-weight: bold; font-size: 1.1em; border: 1px solid #bbdefb;";
            banner.innerHTML = `👋 Welcome back! Your previous score for this test was <span>${previousScore}</span>.`;
            
            const quizContainer = document.getElementById('quiz-container');
            if(quizContainer) {
                quizContainer.insertBefore(banner, quizContainer.firstChild);
            }
        }
    }
});


const resultDiv = document.getElementById('result');

if (resultDiv) {
    const observer = new MutationObserver((mutations) => {
    
        if (resultDiv.innerText.includes("You scored")) {
            

            const matchScore = resultDiv.innerText.match(/scored (\d+)/);
            const matchTotal = resultDiv.innerText.match(/out of (\d+)/);
            
            if (matchScore && matchTotal) {
                const currentScore = parseInt(matchScore[1], 10);
                const totalQuestions = parseInt(matchTotal[1], 10);


                observer.disconnect();


                injectFirebaseUI(currentScore, totalQuestions);
            }
        }
    });

    observer.observe(resultDiv, { childList: true, characterData: true, subtree: true });
}


function injectFirebaseUI(score, totalQuestions) {
    let resultHTML = `<h3 style="margin-bottom: 10px;">You scored ${score} out of ${totalQuestions}!</h3>`;

    if (currentUser) {

        if (previousScore !== null) {
            if (score > previousScore) {
                resultHTML += `<p style="color: #2e7d32; font-weight: bold;">📈 Great job! You improved your score by ${score - previousScore} point(s)!</p>`;
            } else if (score < previousScore) {
                resultHTML += `<p style="color: #d32f2f; font-weight: bold;">📉 You scored ${previousScore - score} point(s) less than last time. Keep practicing!</p>`;
            } else {
                resultHTML += `<p style="color: #1976d2; font-weight: bold;">➡️ You matched your previous score!</p>`;
            }
        } else {
            resultHTML += `<p style="color: #1976d2;">This is your first time taking this test.</p>`;
        }


        resultHTML += `
            <button id="save-score-btn" style="background-color: #0288d1; color: white; padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; margin-top: 15px; width: 100%;">
                Save this result
            </button>
        `;
    } else {
        // If disconneted
        resultHTML += `<p style="color: #757575; font-style: italic; font-size: 0.9em;">(Log in to track your progress and save your scores!)</p>`;
    }


    resultDiv.innerHTML = resultHTML;
    resultDiv.style.marginTop = "20px";
    resultDiv.style.padding = "15px";
    resultDiv.style.backgroundColor = "#f5f5f5";
    resultDiv.style.borderRadius = "8px";
    resultDiv.style.textAlign = "center";


    const saveBtn = document.getElementById('save-score-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            saveBtn.innerText = "Saving...";
            saveBtn.disabled = true;
            saveBtn.style.opacity = "0.7";

            try {
                await set(ref(db, `users/${currentUser.uid}/scores/${quizId}`), {
                    score: score,
                    total: totalQuestions,
                    date: new Date().toLocaleString()
                });

                saveBtn.innerText = "Result successfully saved ! ✔️";
                saveBtn.style.backgroundColor = "#388e3c"; 
                saveBtn.style.opacity = "1";
                previousScore = score;

            } catch (error) {
                console.error("Error saving score:", error);
                saveBtn.innerText = "Error saving result";
                saveBtn.style.backgroundColor = "#d32f2f"; 
                saveBtn.style.opacity = "1";
                saveBtn.disabled = false;
            }
        });
    }
}