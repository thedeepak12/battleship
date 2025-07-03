import { Player } from '../factories/player';

export const Game = () => {
  let humanPlayer = null;
  let computerPlayer = null;
  let currentPlayer = null;
  let gameOver = false;

  const initialize = () => {
    humanPlayer = Player('human');
    computerPlayer = Player('computer');
    currentPlayer = humanPlayer;

    humanPlayer.gameboard.placeShip(2, 0, 0, true);
    humanPlayer.gameboard.placeShip(3, 2, 2, false);
    computerPlayer.gameboard.placeShip(2, 1, 1, true);
    computerPlayer.gameboard.placeShip(3, 3, 3, false);
  };

  const getCurrentPlayer = () => currentPlayer;

  const playTurn = (x, y) => {
    if (gameOver || currentPlayer === computerPlayer) {
      throw new Error('Invalid turn');
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
    getCurrentPlayer,
    playTurn,
    isGameOver,
  };
};
