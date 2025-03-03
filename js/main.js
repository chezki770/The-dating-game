const slider = document.getElementById("slider");
const sliderValue = document.getElementById("sliderValue");
const labels = ["Low", "Medium", "High"];
const startGame = document.getElementById("startGame");
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const currentQuestionElement = document.getElementById("currentQuestion");
const difficultySlider = document.getElementById("slider");

let allQuestions = [];
let currentQuestions = [];
let currentQuestionIndex = 0;

// Load questions from JSON file
async function loadAllQuestions() {
    try {
        const response = await fetch('questions.json');
        allQuestions = await response.json();
        console.log('Questions loaded:', allQuestions.length);
    } catch (error) {
        console.error('Error loading questions:', error);
        allQuestions = [];
    }
}

// Filter questions by difficulty level
function filterQuestionsByDifficulty(difficulty) {
    const setId = `set_${difficulty}`;
    return allQuestions.filter(q => q.set_id === setId);
}

slider.addEventListener("input", function() {
    sliderValue.textContent = labels[this.value - 1];
    if (gameScreen.style.display === 'flex') {
        loadQuestions();
        displayCurrentQuestion();
    }
});

// Start game when button is clicked
startGame.addEventListener('click', async function() {
    startScreen.style.display = 'none';
    gameScreen.style.display = 'flex';
    await loadAllQuestions();
    loadQuestions();
    displayCurrentQuestion();
});

function loadQuestions() {
    const difficulty = difficultySlider.value;
    currentQuestions = filterQuestionsByDifficulty(difficulty);
    shuffleArray(currentQuestions);
    currentQuestionIndex = 0;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function displayCurrentQuestion() {
    if (currentQuestions.length === 0) {
        currentQuestionElement.textContent = 'No questions available for this difficulty level!';
        return;
    }
    currentQuestionElement.textContent = currentQuestions[currentQuestionIndex].question;
}

function nextQuestion() {
    if (currentQuestions.length === 0) return;
    currentQuestionIndex = (currentQuestionIndex + 1) % currentQuestions.length;
    displayCurrentQuestion();
}