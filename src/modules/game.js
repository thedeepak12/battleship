import { Player } from '../factories/player';

export const Game = () => {
  let humanPlayer = null;
  let computerPlayer = null;
  let currentPlayer = null;
  let gameOver = false;
  let gameStarted = false;
  let shipLengths = [];
  let currentShipIndex = 0;

  const initialize = () => {
    humanPlayer = Player('human');
    computerPlayer = Player('computer');
    currentPlayer = humanPlayer;
    gameOver = false;
    gameStarted = false;
    shipLengths = [];
    currentShipIndex = 0;
    console.log('Game initialized: humanPlayer and computerPlayer created');
  };

  const reset = () => {
    initialize();
    console.log('Game reset: all state cleared');
  };

  const startGame = () => {
    if (!humanPlayer || !computerPlayer) {
      throw new Error('Game not initialized');
    }
    placeRandomComputerShips();
    gameOver = false;
    gameStarted = true;
    currentPlayer = humanPlayer;
    console.log('Game started: computer ships placed, human turn');
    return true;
  };

  const placeRandomShips = () => {
    if (!humanPlayer) {
      throw new Error('Game not initialized');
    }
    const lengths = [1, 1, 1, 1, 2, 2, 2, 3, 3, 4];
    humanPlayer.gameboard = Player('human').gameboard;
    lengths.forEach((length) => {
      let placed = false;
      while (!placed) {
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);
        const isHorizontal = Math.random() > 0.5;
        try {
          humanPlayer.gameboard.placeShip(length, x, y, isHorizontal);
          placed = true;
          console.log(
            `Human ship placed: length ${length}, x=${x}, y=${y}, horizontal=${isHorizontal}`
          );
        } catch {}
      }
    });
  };

  const placeRandomComputerShips = () => {
    if (!computerPlayer) {
      throw new Error('Game not initialized');
    }
    const lengths = [1, 1, 1, 1, 2, 2, 2, 3, 3, 4];
    computerPlayer.gameboard = Player('computer').gameboard;
    lengths.forEach((length) => {
      let placed = false;
      while (!placed) {
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);
        const isHorizontal = Math.random() > 0.5;
        try {
          computerPlayer.gameboard.placeShip(length, x, y, isHorizontal);
          placed = true;
          console.log(
            `Computer ship placed: length ${length}, x=${x}, y=${y}, horizontal=${isHorizontal}`
          );
        } catch {}
      }
    });
  };

  const startShipPlacement = (lengths) => {
    if (!humanPlayer) {
      throw new Error('Game not initialized');
    }
    shipLengths = lengths;
    currentShipIndex = 0;
    humanPlayer.gameboard = Player('human').gameboard;
    console.log(`Ship placement started: lengths ${lengths}`);
  };

  const placeShip = (x, y, isHorizontal) => {
    if (!humanPlayer) {
      throw new Error('Game not initialized');
    }
    if (currentShipIndex >= shipLengths.length) {
      console.log('All ships placed');
      return false;
    }
    try {
      humanPlayer.gameboard.placeShip(
        shipLengths[currentShipIndex],
        x,
        y,
        isHorizontal
      );
      currentShipIndex++;
      console.log(
        `Ship placed: length ${shipLengths[currentShipIndex - 1]}, x=${x}, y=${y}, horizontal=${isHorizontal}`
      );
      return currentShipIndex < shipLengths.length;
    } catch (error) {
      console.error(`Ship placement error: ${error.message}`);
      throw error;
    }
  };

  const getCurrentShipLength = () => {
    if (currentShipIndex >= shipLengths.length) {
      return null;
    }
    return shipLengths[currentShipIndex];
  };

  const getCurrentPlayer = () => currentPlayer;

  const getComputerPlayer = () => computerPlayer;

  const isGameStarted = () => gameStarted;

  const playTurn = (x, y) => {
    if (!humanPlayer || !computerPlayer) {
      throw new Error('Game not initialized');
    }
    if (!gameStarted) {
      throw new Error('Game has not started');
    }
    if (gameOver) {
      throw new Error('Game is over');
    }
    if (currentPlayer !== humanPlayer) {
      throw new Error('Not your turn');
    }

    if (
      !Number.isInteger(x) ||
      !Number.isInteger(y) ||
      x < 0 ||
      x >= 10 ||
      y < 0 ||
      y >= 10
    ) {
      throw new Error('Invalid coordinates');
    }

    let hit = false;
    try {
      console.log(`Human attack: x=${x}, y=${y}`);
      const enemyBoard = computerPlayer.gameboard;
      hit = humanPlayer.attack(enemyBoard, x, y);

      if (enemyBoard.allShipsSunk()) {
        gameOver = true;
        console.log('Game over: human wins');
        return { hit, winner: humanPlayer };
      }
    } catch (error) {
      console.error(`Human attack failed: ${error.message}`);
      throw error;
    }

    currentPlayer = computerPlayer;
    let computerHit = false;
    try {
      const computerMove = computerPlayer.randomAttack(humanPlayer.gameboard);
      computerHit = humanPlayer.gameboard.receiveAttack(
        computerMove[0],
        computerMove[1]
      );
      console.log(
        `Computer attack: x=${computerMove[0]}, y=${computerMove[1]}`
      );
    } catch (error) {
      console.error(`Computer attack failed: ${error.message}`);
    }

    if (humanPlayer.gameboard.allShipsSunk()) {
      gameOver = true;
      console.log('Game over: computer wins');
      return { hit, computerHit, winner: computerPlayer };
    }

    currentPlayer = humanPlayer;
    return { hit, computerHit };
  };

  const isGameOver = () => gameOver;

  return {
    initialize,
    reset,
    startGame,
    placeRandomShips,
    startShipPlacement,
    placeShip,
    getCurrentShipLength,
    getCurrentPlayer,
    getComputerPlayer,
    isGameStarted,
    playTurn,
    isGameOver,
  };
};
