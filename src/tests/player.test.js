import { Player } from '../factories/player';
import { Gameboard } from '../factories/gameboard';

test('creates human player with gameboard', () => {
  const player = Player('human');
  expect(player.type).toBe('human');
  expect(player.gameboard).toBeDefined();
  expect(player.gameboard.getGrid().length).toBe(10);
  expect(player.randomAttack).toBeUndefined();
});

test('creates computer player with gameboard and randomAttack', () => {
  const player = Player('computer');
  expect(player.type).toBe('computer');
  expect(player.gameboard).toBeDefined();
  expect(player.gameboard.getGrid().length).toBe(10);
  expect(typeof player.randomAttack).toBe('function');
});

test('throws error for invalid player type', () => {
  expect(() => Player('invalid')).toThrow(
    'Player type must be "human" or "computer"'
  );
});

test('human can attack enemy board', () => {
  const human = Player('human');
  const enemyBoard = Gameboard();
  enemyBoard.placeShip(2, 0, 0, true);
  const result = human.attack(enemyBoard, 0, 0);
  expect(result).toBe(true);
  expect(enemyBoard.getGrid()[0][0].getHits()).toBe(1);
});

test('human attack throws error for invalid coordinates', () => {
  const human = Player('human');
  const enemyBoard = Gameboard();
  expect(() => human.attack(enemyBoard, -1, 0)).toThrow(
    'Invalid attack coordinates'
  );
});

test('computer cannot use attack method', () => {
  const computer = Player('computer');
  const enemyBoard = Gameboard();
  expect(() => computer.attack(enemyBoard, 0, 0)).toThrow(
    'Computer use randomAttack instead'
  );
});

test('computer randomAttack returns valid coordinates', () => {
  const computer = Player('computer');
  const enemyBoard = Gameboard();
  const coords = computer.randomAttack(enemyBoard);
  expect(coords).toHaveLength(2);
  expect(Number.isInteger(coords[0])).toBe(true);
  expect(Number.isInteger(coords[1])).toBe(true);
  expect(coords[0]).toBeGreaterThanOrEqual(0);
  expect(coords[0]).toBeLessThan(10);
  expect(coords[1]).toBeGreaterThanOrEqual(0);
  expect(coords[1]).toBeLessThan(10);
});

test('computer randomAttack avoids previously attacked coordinates', () => {
  const computer = Player('computer');
  const enemyBoard = Gameboard();
  enemyBoard.placeShip(1, 0, 0, true);
  enemyBoard.receiveAttack(0, 0);
  enemyBoard.receiveAttack(5, 5);
  const coords = computer.randomAttack(enemyBoard);
  expect(coords).not.toEqual([0, 0]);
  expect(coords).not.toEqual([5, 5]);
});

test('computer randomAttack throws error when no valid moves', () => {
  const computer = Player('computer');
  const enemyBoard = Gameboard();
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      enemyBoard.receiveAttack(x, y);
    }
  }
  expect(() => computer.randomAttack(enemyBoard)).toThrow(
    'No valid moves available'
  );
});
