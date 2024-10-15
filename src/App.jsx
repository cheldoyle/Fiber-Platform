import React, { useState } from 'react';
import StartScreen from './scenes/Start';
import Game from './scenes/Game';

const App = () => {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const handleScoreUpdate = (score) => {
    if (score > highScore) {
      setHighScore(score);
    }
  };

  const startGame = () => {
    setIsGameStarted(true);
  };

  const gameOver = () => {
    setIsGameStarted(false);
  };

  return (
    <>
      {isGameStarted ? (
        <Game onGameOver={gameOver} onScoreUpdate={handleScoreUpdate} />
      ) : (
        <StartScreen startGame={startGame} highScore={highScore} />
      )}
    </>
  );
};

export default App;
