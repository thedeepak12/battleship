import { Gameboard } from './gameboard';

export const Player = (type = 'human') => {
  if (!['human', 'computer'].includes(type)) {
    throw new Error('Player type must be "human" or "computer"');
  }

  const gameboard = Gameboard();
  const attackedCells = new Set();

  const attack = (enemyBoard, x, y) => {
    if (type === 'computer') {
      throw new Error('Computer use randomAttack instead');
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
    const key = `${x},${y}`;
    if (attackedCells.has(key)) {
      throw new Error('Cell already attacked');
    }
    attackedCells.add(key);
    console.log(`Player ${type} attacks: x=${x}, y=${y}`);
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
        const key = `${x},${y}`;
        if (!attackedCells.has(key)) {
          availableMoves.push([x, y]);
        }
      }
    }

    if (availableMoves.length === 0) {
      throw new Error('No valid moves available');
    }

    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    const [x, y] = availableMoves[randomIndex];
    attackedCells.add(`${x},${y}`);
    console.log(`Computer random attack: x=${x}, y=${y}`);
    enemyBoard.receiveAttack(x, y);
    return [x, y];
  };

  const resetAttackedCells = () => {
    attackedCells.clear();
    console.log(`Attacked cells reset for ${type} player`);
  };

  return {
    type,
    gameboard,
    attack,
    randomAttack: type === 'computer' ? randomAttack : undefined,
    resetAttackedCells,
  };
};
