const slider = document.getElementById("slider");
const sliderValue = document.getElementById("sliderValue");
const labels = ["Low", "Medium", "High"];

slider.addEventListener("input", function() {
    sliderValue.textContent = labels[this.value - 1];
});

const startGame = document.getElementById("startGame");

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

function loadQuestions() {
    shuffleArray(questions);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function addQuestion() {
    if (questions.length === 0) {
        console.error('No questions loaded');
        return;
    }

    const answer = document.getElementById("answer").value;
    const difficulty = slider.value;
    const questionList = document.getElementById("questionList");

    const currentQuestion = questions[currentQuestionIndex].question;
    const li = document.createElement("li");
    li.textContent = `Question: ${currentQuestion} | Answer: ${answer} | Difficulty: ${labels[difficulty - 1]}`;
    questionList.appendChild(li);

    currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
}

// Initialize questions when the page loads
document.addEventListener('DOMContentLoaded', loadQuestions);