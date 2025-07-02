import { Gameboard } from './gameboard';

export const Player = (type = 'human') => {
  if (!['human', 'computer'].includes(type)) {
    throw new Error('Player type must be "human" or "computer"');
  }

  const gameboard = Gameboard();

  const attack = (enemyBoard, x, y) => {
    if (type === 'computer') {
      throw new Error('Computer use randomAttack instead');
    }
    return enemyBoard.receiveAttack(x, y);
  };

  const randomAttack = (enemyBoard) => {
    if (type !== 'computer') {
      throw new Error('Only computer can use randomAttack');
    }

    const availableMoves = [];
    const gridSize = 10;
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        if (
          !enemyBoard
            .getMissedAttacks()
            .some(([mx, my]) => mx === x && my === y) &&
          !enemyBoard.getGrid()[x][y]?.isSunk()
        ) {
          availableMoves.push([x, y]);
        }
      }
    }

    if (availableMoves.length === 0) {
      throw new Error('No valid moves available');
    }

    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    const [x, y] = availableMoves[randomIndex];
    return [x, y];
  };

  return {
    type,
    gameboard,
    attack,
    randomAttack: type === 'computer' ? randomAttack : undefined,
  };
};
