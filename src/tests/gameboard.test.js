import { Gameboard } from '../factories/gameboard';

test('creates a 10x10 grid', () => {
  const gameboard = Gameboard();
  const grid = gameboard.getGrid();
  expect(grid.length).toBe(10);
  expect(grid.every((row) => row.length === 10)).toBe(true);
  expect(grid.every((row) => row.every((cell) => cell === null))).toBe(true);
});

test('places ship horizontally', () => {
  const gameboard = Gameboard();
  const ship = gameboard.placeShip(3, 0, 0, true);
  const grid = gameboard.getGrid();
  expect(grid[0][0]).toBe(ship);
  expect(grid[1][0]).toBe(ship);
  expect(grid[2][0]).toBe(ship);
  expect(grid[3][0]).toBe(null);
});

test('places ship vertically', () => {
  const gameboard = Gameboard();
  const ship = gameboard.placeShip(3, 0, 0, false);
  const grid = gameboard.getGrid();
  expect(grid[0][0]).toBe(ship);
  expect(grid[0][1]).toBe(ship);
  expect(grid[0][2]).toBe(ship);
  expect(grid[0][3]).toBe(null);
});

test('throws error for invalid ship placement', () => {
  const gameboard = Gameboard();
  expect(() => gameboard.placeShip(3, 9, 0, true)).toThrow(
    'Invalid ship placement'
  );
  expect(() => gameboard.placeShip(3, 0, 9, false)).toThrow(
    'Invalid ship placement'
  );
  gameboard.placeShip(3, 0, 0, true);
  expect(() => gameboard.placeShip(2, 1, 0, true)).toThrow(
    'Invalid ship placement'
  );
  expect(() => gameboard.placeShip(3, -1, 0, true)).toThrow(
    'Invalid ship placement'
  );
});

test('receiveAttack hits a ship', () => {
  const gameboard = Gameboard();
  const ship = gameboard.placeShip(3, 0, 0, true);
  const result = gameboard.receiveAttack(1, 0);
  expect(result).toBe(true);
  expect(ship.getHits()).toBe(1);
});

test('receiveAttack records a miss', () => {
  const gameboard = Gameboard();
  gameboard.placeShip(3, 0, 0, true);
  const result = gameboard.receiveAttack(5, 5);
  expect(result).toBe(false);
  expect(gameboard.getMissedAttacks()).toContainEqual([5, 5]);
});

test('throws error for invalid or repeated attack', () => {
  const gameboard = Gameboard();
  gameboard.receiveAttack(5, 5);
  expect(() => gameboard.receiveAttack(5, 5)).toThrow(
    'Invalid attack coordinates'
  );
  expect(() => gameboard.receiveAttack(-1, 0)).toThrow(
    'Invalid attack coordinates'
  );
  expect(() => gameboard.receiveAttack(10, 0)).toThrow(
    'Invalid attack coordinates'
  );
});

test('allShipsSunk returns false when ships are not sunk', () => {
  const gameboard = Gameboard();
  gameboard.placeShip(3, 0, 0, true);
  expect(gameboard.allShipsSunk()).toBe(false);
});

test('allShipsSunk returns true when all ships are sunk', () => {
  const gameboard = Gameboard();
  const ship = gameboard.placeShip(2, 0, 0, true);
  gameboard.receiveAttack(0, 0);
  gameboard.receiveAttack(1, 0);
  expect(ship.isSunk()).toBe(true);
  expect(gameboard.allShipsSunk()).toBe(true);
});
