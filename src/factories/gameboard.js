import { Ship } from './ship';

export const Gameboard = () => {
  const size = 10;
  const grid = Array(size)
    .fill()
    .map(() => Array(size).fill(null));
  const ships = [];
  const missedAttacks = [];
  const hitCells = new Set();

  const placeShip = (length, x, y, isHorizontal) => {
    if (!isValidPlacement(length, x, y, isHorizontal)) {
      throw new Error('Invalid ship placement');
    }

    const ship = Ship(length);
    ships.push({ ship, x, y, isHorizontal });

    for (let i = 0; i < length; i++) {
      const posX = isHorizontal ? x + i : x;
      const posY = isHorizontal ? y : y + i;
      grid[posX][posY] = ship;
    }

    console.log(
      `Ship placed on gameboard: length=${length}, x=${x}, y=${y}, horizontal=${isHorizontal}`
    );
    return ship;
  };

  const isValidPlacement = (length, x, y, isHorizontal) => {
    if (
      !Number.isInteger(x) ||
      !Number.isInteger(y) ||
      x < 0 ||
      y < 0 ||
      x >= size ||
      y >= size ||
      (isHorizontal && x + length > size) ||
      (!isHorizontal && y + length > size)
    ) {
      return false;
    }

    for (let i = 0; i < length; i++) {
      const posX = isHorizontal ? x + i : x;
      const posY = isHorizontal ? y : y + i;
      if (grid[posX][posY] != null) {
        return false;
      }
    }

    return true;
  };

  const receiveAttack = (x, y) => {
    if (
      !Number.isInteger(x) ||
      !Number.isInteger(y) ||
      x < 0 ||
      y < 0 ||
      x >= size ||
      y >= size
    ) {
      throw new Error('Invalid coordinates');
    }

    const key = `${x},${y}`;
    if (
      missedAttacks.some(([mx, my]) => mx === x && my === y) ||
      hitCells.has(key)
    ) {
      throw new Error('Cell already attacked');
    }

    const ship = grid[x][y];
    if (ship) {
      ship.hit();
      hitCells.add(key);
      console.log(`Attack hit: x=${x}, y=${y}, ship hits=${ship.getHits()}`);
      return true;
    }

    missedAttacks.push([x, y]);
    console.log(`Attack missed: x=${x}, y=${y}`);
    return false;
  };

  const allShipsSunk = () =>
    ships.length > 0 && ships.every(({ ship }) => ship.isSunk());

  const reset = () => {
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        grid[x][y] = null;
      }
    }
    ships.length = 0;
    missedAttacks.length = 0;
    hitCells.clear();
    console.log(
      'Gameboard reset: grid, ships, missedAttacks, hitCells cleared'
    );
  };

  const getHitCells = () => Array.from(hitCells);

  return {
    placeShip,
    receiveAttack,
    getMissedAttacks: () => missedAttacks,
    allShipsSunk,
    getGrid: () => grid.map((row) => [...row]),
    reset,
    getHitCells,
  };
};
