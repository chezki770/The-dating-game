const slider = document.getElementById("slider");
const sliderValue = document.getElementById("sliderValue");
const labels = ["Low", "Medium", "High"];
const startGame = document.getElementById("startGame");
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const currentQuestionElement = document.getElementById("currentQuestion");

slider.addEventListener("input", function() {
    sliderValue.textContent = labels[this.value - 1];
});

let questions = [
    {
        "id": 1,
        "question": "How much importance do you place on work vs leisure?",
        "set_id": "set_1"
    },
    {
        "id": 2,
        "question": "Do you have specific dietary or nutritional attitudes? I.e., Vegan, Health foods etc?",
        "set_id": "set_1"
    },
    {
        "id": 3,
        "question": "What is your stance on recreational marijuana?",
        "set_id": "set_1"
    },
    {
        "id": 4,
        "question": "What is your attitude towards money?",
        "set_id": "set_1"
    }
];
let currentQuestionIndex = 0;

// Start game when button is clicked
startGame.addEventListener('click', function() {
    startScreen.style.display = 'none';
    gameScreen.style.display = 'flex';
    loadQuestions();
    displayCurrentQuestion();
});

function loadQuestions() {
    shuffleArray(questions);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function displayCurrentQuestion() {
    if (questions.length === 0) {
        currentQuestionElement.textContent = 'No more questions available!';
        return;
    }
    currentQuestionElement.textContent = questions[currentQuestionIndex].question;
}

function nextQuestion() {
    currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
    displayCurrentQuestion();
}