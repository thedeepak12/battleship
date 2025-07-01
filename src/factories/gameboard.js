import { Ship } from './ship';

export const Gameboard = () => {
  const size = 10;
  const grid = Array(size)
    .fill()
    .map(() => Array(size).fill(null));
  const ships = [];
  const missedAttacks = [];

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
      (isHorizontal && x + length >= size) ||
      (!isHorizontal && y + length >= size)
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
      y >= size ||
      missedAttacks.some(([mx, my]) => mx === x && my === y)
    ) {
      throw new Error('Invalid attack coordinates');
    }

    const ship = grid[x][y];
    if (ship) {
      ship.hit();
      return true;
    }

    missedAttacks.push([x, y]);
    return false;
  };

  const allShipsSunk = () =>
    ships.length > 0 && ships.every(({ ship }) => ship.isSunk());

  return {
    placeShip,
    receiveAttack,
    getMissedAttacks: () => missedAttacks,
    allShipsSunk,
    getGrid: () => grid.map((row) => [...row]),
  };
};
