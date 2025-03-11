const slider = document.getElementById("slider");
const sliderValue = document.getElementById("sliderValue");
const labels = ["Low", "Medium", "High"];
const startGame = document.getElementById("startGame");
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const currentQuestionElement = document.getElementById("currentQuestion");
const questionCounter = document.getElementById("questionCounter");

// Question sets based on difficulty
let allQuestions = [];
let currentQuestions = [];
let usedQuestions = [];
let currentQuestionIndex = 0;
let questionCount = 0;
let roundNumber = 1;
let isAuthenticated = false;
let currentGameQuestions = []; // Store questions for current game session

// Check if user is authenticated
async function checkAuthStatus() {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.AUTH.STATUS}`, {
            credentials: 'include'
        });
        const data = await response.json();
        isAuthenticated = data.isAuthenticated;
        return isAuthenticated;
    } catch (error) {
        console.error('Error checking auth status:', error);
        return false;
    }
}

// Load questions from JSON file
async function loadTenQuestions() {
    try {
        const response = await fetch('/questions.json');
        allQuestions = await response.json();
        console.log('Questions loaded:', allQuestions.length);

        // Organize questions by set for easier access
        window.questionSets = {
            set_1: allQuestions.filter(q => q.set_id === "set_1"),
            set_2: allQuestions.filter(q => q.set_id === "set_2"),
            set_3: allQuestions.filter(q => q.set_id === "set_3")
        };

        console.log(`Set 1 (Easy): ${questionSets.set_1.length} questions`);
        console.log(`Set 2 (Medium): ${questionSets.set_2.length} questions`);
        console.log(`Set 3 (Hard): ${questionSets.set_3.length} questions`);
    } catch (error) {
        console.error('Error loading questions:', error);
        allQuestions = [];
    }
}

// Selects a random subset of questions from a given set, ensuring no duplicates with used questions
function selectRandomQuestions(set, count, usedIds) {
    const availableQuestions = set.filter(q => !usedIds.includes(q.id));

    if (availableQuestions.length < count) {
        console.warn(`Not enough unique questions in set. Requested ${count}, but only ${availableQuestions.length} available.`);
        return shuffleArray([...availableQuestions]);
    }

    const shuffled = shuffleArray([...availableQuestions]);
    return shuffled.slice(0, count);
}

// Prepare questions based on difficulty level
function selectQuestionsByDifficulty(difficulty, usedIds = []) {
    let questions = [];
    const sets = window.questionSets;

    if (!sets) {
        console.error('Question sets not initialized');
        return [];
    }

    switch (difficulty.toLowerCase()) {
        case 'low':
            // 6 from set_1, 3 from set_2, 1 from set_3
            questions = [
                ...selectRandomQuestions(sets.set_1, 6, usedIds),
                ...selectRandomQuestions(sets.set_2, 3, usedIds),
                ...selectRandomQuestions(sets.set_3, 1, usedIds)
            ];
            break;
        case 'medium':
            // 3 from set_1, 4 from set_2, 3 from set_3
            questions = [
                ...selectRandomQuestions(sets.set_1, 3, usedIds),
                ...selectRandomQuestions(sets.set_2, 4, usedIds),
                ...selectRandomQuestions(sets.set_3, 3, usedIds)
            ];
            break;
        case 'high':
            // 2 from set_1, 4 from set_2, 4 from set_3
            questions = [
                ...selectRandomQuestions(sets.set_1, 2, usedIds),
                ...selectRandomQuestions(sets.set_2, 4, usedIds),
                ...selectRandomQuestions(sets.set_3, 4, usedIds)
            ];
            break;
        default:
            console.error('Invalid difficulty level:', difficulty);
            return [];
    }

    return shuffleArray(questions); // Shuffle again to mix questions from different sets
}

// Event listener for the difficulty slider
slider.addEventListener("input", function () {
    sliderValue.textContent = labels[this.value - 1];

    // If game is already running, reload questions with new difficulty
    if (gameScreen.style.display === 'flex') {
        loadNewRound();
    }
});

// Start game when button is clicked
startGame.addEventListener('click', async function () {
    startScreen.style.display = 'none';
    gameScreen.style.display = 'flex';
    await loadTenQuestions();
    // Check authentication status
    isAuthenticated = await checkAuthStatus();
    loadNewRound();
});

// Load a new round of 10 questions
function loadNewRound() {
    const difficulty = labels[slider.value - 1];
    usedQuestions = []; // Reset used questions for new round
    currentQuestions = selectQuestionsByDifficulty(difficulty);
    currentQuestionIndex = 0;
    questionCount = 0;
    roundNumber = 1;
    currentGameQuestions = []; // Reset current game questions for new game
    updateQuestionCounter();
    displayCurrentQuestion();
}

// Shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
    const newArray = [...array]; // Create a copy to avoid modifying the original
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Display the current question
function displayCurrentQuestion() {
    if (currentQuestions.length === 0) {
        currentQuestionElement.textContent = 'No questions available for this difficulty level!';
        return;
    }

    const question = currentQuestions[currentQuestionIndex];
    currentQuestionElement.textContent = question.question;

    // Log the question ID and set
    console.log('Current Question ID:', question.id);
    console.log('Question Set:', question.set_id);

    // Add current question ID to used questions
    if (!usedQuestions.includes(question.id)) {
        usedQuestions.push(question.id);
    }
    
    // Add to current game questions if not already there
    if (!currentGameQuestions.includes(question.id)) {
        currentGameQuestions.push(question.id);
    }
}

// Update the question counter display
function updateQuestionCounter() {
    if (questionCounter) {
        questionCounter.textContent = `Question ${questionCount + 1}/10 - Round ${roundNumber}`;
    }
}

// Move to the next question
function nextQuestion() {
    if (currentQuestions.length === 0) return;

    questionCount++;

    // Add current question to game history if not already added
    const currentQuestion = currentQuestions[currentQuestionIndex];
    if (currentQuestion && !currentGameQuestions.includes(currentQuestion.id)) {
        currentGameQuestions.push(currentQuestion.id);
    }

    // If we've shown 10 questions, get a new set
    if (questionCount >= 10) {
        // Save current round to database if user is authenticated
        saveGameHistory();
        
        roundNumber++;
        questionCount = 0;
        const difficulty = labels[slider.value - 1];
        currentQuestions = selectQuestionsByDifficulty(difficulty, usedQuestions);
        currentQuestionIndex = 0;
        currentGameQuestions = []; // Reset current game questions for new round
    } else {
        currentQuestionIndex = (currentQuestionIndex + 1) % 10; // Keep within the 10 questions
    }

    updateQuestionCounter();
    displayCurrentQuestion();
}

// Save game history to database if user is authenticated
async function saveGameHistory() {
    if (!isAuthenticated) return;
    
    try {
        const difficulty = labels[slider.value - 1];
        
        const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.USER.GAME_HISTORY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                difficultyLevel: difficulty,
                questionsAsked: currentGameQuestions,
                round: roundNumber
            })
        });
        
        if (response.ok) {
            console.log('Game history saved successfully');
        } else {
            console.error('Failed to save game history');
        }
    } catch (error) {
        console.error('Error saving game history:', error);
    }
}
