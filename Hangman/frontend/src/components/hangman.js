import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Highscore from './highscore';
import "../styles.css"

const Hangman = () => {
  const [word, setWord] = useState('');
  const [wordLength, setWordLength] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [incorrectLetters, setIncorrectLetters] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [showHighscore, setShowHighscore] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const maxWrongGuesses = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRandomWord = async () => {
      try {
        const response = await fetch('http://localhost:4000/random-word');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setWord(data.word);
        setWordLength(data.numLetters);
      } catch (error) {
        console.error("Error fetching the word:", error);
      }
    };

    fetchRandomWord();
  }, []);

  useEffect(() => {
    const gameOver = wrongGuesses >= maxWrongGuesses;
    const gameWon = word.split('').every(letter => guessedLetters.includes(letter));

    setIsGameOver(gameOver);
    setIsGameWon(gameWon);

    if (gameWon) {
      const addScore = async () => {
        try {
          const editedScore = {
            numLetters: wordLength,
            score: wrongGuesses,
            player: "filler"
          };
          
          await fetch('http://localhost:4000/highscores/add', {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(editedScore)
          });
        } catch (error) {
          console.error("Error fetching the word:", error);
        }
      };
      addScore();

      const timeoutId = setTimeout(() => {
        setShowHighscore(true);
      }, 2000);
      return () => clearTimeout(timeoutId);
    }

    if (gameOver) {
      const addScore = async () => {
        try {
          const editedScore = {
            numLetters: wordLength,
            score: wrongGuesses,
            player: "filler"
          };

          await fetch('http://localhost:4000/highscores/add', {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(editedScore)
          });
        } catch (error) {
          console.error("Error fetching the word:", error);
        }
      };
      addScore();
      setShowHighscore(false);
    }
  }, [word, guessedLetters, wrongGuesses]);

  const handleGuess = (letter) => {
    if (guessedLetters.includes(letter) || incorrectLetters.includes(letter)) return;

    if (word.includes(letter)) {
      setGuessedLetters([...guessedLetters, letter]);
    } else {
      setWrongGuesses(wrongGuesses + 1);
      setIncorrectLetters([...incorrectLetters, letter]);
    }
  };

  const handleReset = () => {
    setWord('');
    setGuessedLetters([]);
    setWrongGuesses(0);
    setIncorrectLetters([]);
    setCurrentGuess('');
    setIsGameOver(false);
    setIsGameWon(false);
    const fetchRandomWord = async () => {
      try {
        const response = await fetch('http://localhost:4000/random-word');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setWord(data.word);
        setWordLength(data.numLetters);
      } catch (error) {
        console.error("Error fetching the word:", error);
      }
    };
    fetchRandomWord();
  };

  const handleInputChange = (e) => {
    setCurrentGuess(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && currentGuess.length === 1) {
      handleGuess(currentGuess.toLowerCase());
      setCurrentGuess('');
    }
  };

  const renderWord = () => {
    return word.split('').map((letter, index) => (
      guessedLetters.includes(letter) ? letter : '_'
    )).join(' ');
  };

  if (showHighscore) {
    return <Highscore givenNumLetter={wordLength} onReset={handleReset} />;
  }

  const hangmanImage = `./images/hangman-${wrongGuesses}.svg`;

  return (
    <div className="Hangman">
      <h1>Hangman Game</h1>
      <img src={hangmanImage} alt="Hangman" />
      <p>Word: {renderWord()}</p>
      <p>Wrong guesses: {wrongGuesses}</p>
      <p>Incorrect letters: {incorrectLetters.join(', ')}</p>
      <input
        type="text"
        value={currentGuess}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        maxLength="1"
      />
      {isGameOver && <p>Game Over! The word was: {word}</p>}
      {isGameWon && <p>Congratulations! You've guessed the word!</p>}
      <button onClick={handleReset}>Reset Game</button>
      {isGameOver && <button onClick={() => setShowHighscore(true)}>Go to Highscore</button>}
    </div>
  );
};

export default Hangman;
