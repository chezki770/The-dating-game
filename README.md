# Dating Game Question App

An interactive web application that presents curated questions to help people get to know each other better. The app intelligently selects questions from three different difficulty sets, creating an engaging and dynamic conversation experience.

## Features

- Dynamic question selection based on three difficulty levels (Low, Medium, High)
- Smart distribution of questions from different sets:
  - Low difficulty: 6 easy, 3 medium, 1 hard questions
  - Medium difficulty: 3 easy, 4 medium, 3 hard questions
  - High difficulty: 2 easy, 4 medium, 4 hard questions
- Automatic progression to new question sets after every 10 questions
- No duplicate questions within a single round
- Progress tracking showing current question and round number
- Simple and intuitive user interface

## Project Structure

```
new_dating_game/
├── index.html         # Main HTML file
├── js/
│   └── main.js       # JavaScript functionality
├── questions.json     # Database of questions
└── README.md        # This file
```

## How to Run the Game

1. Start a local web server in the project directory. You can do this in several ways:

   Using Python (Python 3):
   ```bash
   python3 -m http.server 8000
   ```
   
   Using Python (Python 2):
   ```bash
   python2 -m SimpleHTTPServer 8000
   ```
   
   Using Node.js (with http-server installed):
   ```bash
   npx http-server
   ```

2. Open your web browser and navigate to:
   - If using Python: `http://localhost:8000`
   - If using Node.js: `http://localhost:8080`

## How to Play

1. When the game loads, you'll see a difficulty slider with three options: Low, Medium, High
2. Select your preferred difficulty level using the slider
3. Click "Start Game" to begin
4. For each question:
   - Read the presented question
   - Think about or discuss your answer
   - Click "Next Question" to move to the next question
5. After every 10 questions, a new set will automatically be generated
6. You can change the difficulty at any time using the slider

## Question Sets

The questions are organized into three difficulty levels:
- `set_1`: Easy questions (basic, ice-breaker type questions)
- `set_2`: Medium questions (more thoughtful, personal questions)
- `set_3`: Hard questions (deep, thought-provoking questions)

## Development

To add more questions, you can modify the `questions.json` file. Each question should follow this format:

```json
{
    "id": number,
    "question": "Your question text here",
    "set_id": "set_1"  // set_1 for easy, set_2 for medium, set_3 for hard
}
```

## Contributing

Feel free to contribute by:
1. Adding more questions to the question bank
2. Improving the UI/UX
3. Adding new features like:
   - Answer tracking
   - Score tracking
   - Multiple language support
   - Custom question sets

## License

This project is open source and available for personal use. For commercial use, please contact the author.