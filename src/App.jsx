import React, { useState } from 'react';
import StartScreen from './scenes/Start';
import Game from './scenes/Game';

const App = () => {
  const [isGameStarted, setIsGameStarted] = useState(false);

  const startGame = () => {
    setIsGameStarted(true);
  };

  const gameOver = () => {
    setIsGameStarted(false);  // Reset to start screen on game over
  };

  return (
    <>
      {isGameStarted ? (
        <Game onGameOver={gameOver} />  // Pass the gameOver function to the Game component
      ) : (
        <StartScreen startGame={startGame} />  // Show StartScreen if game hasn't started
      )}
    </>
  );
};

export default App;
