import React from 'react';

const StartScreen = ({ startGame, highScore }) => {
  return (
    <div style={styles.container}>
      <h1>Avoid and Shoot</h1>

      {/* Display the high score */}
      {/* <h2>High Score: {highScore}</h2> */}

      <h2>Controls:</h2>
      <p>WASD to move - E to shoot - SPACE to jump</p>

      {/* Start button */}
      <button style={styles.button} onClick={startGame}>
        Start Game
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
    padding: '20px',
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '18px',
    cursor: 'pointer',
  },
};

export default StartScreen;
