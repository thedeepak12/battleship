import { Player } from '../factories/player';

export const Game = () => {
  let humanPlayer = null;
  let computerPlayer = null;
  let currentPlayer = null;
  let gameOver = false;
  let shipLengths = [];
  let currentShipIndex = 0;

  const initialize = () => {
    humanPlayer = Player('human');
    computerPlayer = Player('computer');
    currentPlayer = humanPlayer;
    gameOver = false;
    shipLengths = [];
    currentShipIndex = 0;
  };

  const reset = () => {
    initialize();
  };

  const startGame = () => {
    if (!humanPlayer || !computerPlayer) {
      throw new Error('Game not initialized');
    }
    placeRandomComputerShips();
    gameOver = false;
    currentPlayer = humanPlayer;
  };

  const placeRandomShips = () => {
    if (!humanPlayer) {
      throw new Error('Game not initialized');
    }
    const lengths = [2, 3];
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
        } catch {}
      }
    });
  };

  const placeRandomComputerShips = () => {
    if (!computerPlayer) {
      throw new Error('Game not initialized');
    }
    const lengths = [2, 3];
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
  };

  const placeShip = (x, y, isHorizontal) => {
    if (!humanPlayer) {
      throw new Error('Game not initialized');
    }
    if (currentShipIndex >= shipLengths.length) {
      return false;
    }
    humanPlayer.gameboard.placeShip(
      shipLengths[currentShipIndex],
      x,
      y,
      isHorizontal
    );
    currentShipIndex++;
    return currentShipIndex < shipLengths.length;
  };

  const getCurrentShipLength = () => {
    if (currentShipIndex >= shipLengths.length) {
      return null;
    }
    return shipLengths[currentShipIndex];
  };

  const getCurrentPlayer = () => currentPlayer;

  const getComputerPlayer = () => computerPlayer;

  const playTurn = (x, y) => {
    if (!humanPlayer || !computerPlayer) {
      throw new Error('Game not initialized');
    }
    if (gameOver || currentPlayer === computerPlayer) {
      throw new Error('Invalid turn!');
    }

    const enemyBoard = computerPlayer.gameboard;
    const hit = humanPlayer.attack(enemyBoard, x, y);

    if (enemyBoard.allShipsSunk()) {
      gameOver = true;
      return { hit, winner: humanPlayer };
    }

    currentPlayer = computerPlayer;
    const computerMove = computerPlayer.randomAttack(humanPlayer.gameboard);
    const computerHit = humanPlayer.gameboard.receiveAttack(
      computerMove.x,
      computerMove.y
    );

    if (humanPlayer.gameboard.allShipsSunk()) {
      gameOver = true;
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
    playTurn,
    isGameOver,
  };
};
