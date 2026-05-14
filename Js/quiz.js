const startBtn = document.getElementById('start-btn');
const quizContainer = document.getElementById('quiz-container');
const submitBtn = document.getElementById('submit-btn');
const resultDiv = document.getElementById('result');


// Function to calculate score
function Submit_Quiz(){
    const form = document.getElementById('quiz-form');
    if (!form) return;

    const data = new FormData(form);
    let score = 0;

    for (let value of data.values()) {
        if (value === 'correct') {
            score++;
        }
    }
    if (resultDiv) {
        resultDiv.innerText = `You scored ${score} out of 5!`;
    }
}



if (submitBtn) {
    submitBtn.addEventListener('click', Submit_Quiz);
}