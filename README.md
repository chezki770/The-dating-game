# Dating Game Question App

A simple web application that presents dating-related questions to help people get to know each other better. The app includes a collection of thoughtful questions organized by different sets and allows users to provide answers with difficulty ratings.

## Features

- Randomized questions from a curated list
- Ability to rate the difficulty of answering each question
- Simple and intuitive user interface
- Local storage of questions and answers
- Different question sets covering various topics

## Project Structure

```
new_dating_game/
├── index.html         # Main HTML file
├── js/
│   └── main.js       # JavaScript functionality
├── questions.json    # Database of questions
└── README.md        # This file
```

## How to Use

1. Open `index.html` in your web browser
2. The app will load with a randomized set of questions
3. For each question:
   - Read the presented question
   - Type your answer in the answer field
   - Use the slider to rate the difficulty of the question (1-5)
   - Click "Add Question" to save your response and move to the next question

## Question Sets

The questions are organized into different sets:
- `set_1`: Basic lifestyle and preferences
- `set_2`: Personal experiences and aspirations
- `set_3`: Family and relationships

## Development

To add more questions, you can modify the `questions.json` file or add them directly to the `questions` array in `main.js`. Each question should follow this format:

```json
{
    "id": number,
    "question": "Your question text here",
    "set_id": "set_1"  // or set_2, set_3
}
```

## Contributing

Feel free to contribute by:
1. Adding more questions to the question bank
2. Improving the UI/UX
3. Adding new features like question categories or scoring systems

## License

This project is open source and available for personal use. For commercial use, please contact the author.