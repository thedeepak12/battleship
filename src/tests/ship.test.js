import { Ship } from '../factories/ship';

const ship = Ship(3);

test('creates ship correctly', () => {
  expect(ship.length).toBe(3);
  expect(ship.getHits()).toBe(0);
  expect(ship.isSunk()).toBe(false);
});

test('throws error for invalid length', () => {
  expect(() => Ship(0)).toThrow('Ship length must be a positive integer');
  expect(() => Ship(-1)).toThrow('Ship length must be a positive integer');
  expect(() => Ship(1.5)).toThrow('Ship length must be a positive integer');
});

test('hit increases hits count', () => {
  ship.hit();
  expect(ship.getHits()).toBe(1);
  expect(ship.isSunk()).toBe(false);
  ship.hit();
  expect(ship.getHits()).toBe(2);
  expect(ship.isSunk()).toBe(false);
});

test('isSunk returns true when hits equal length', () => {
  ship.hit();
  ship.hit();
  ship.hit();
  expect(ship.getHits()).toBe(3);
  expect(ship.isSunk()).toBe(true);
});

test('hit does not increase hits after ship is sunk', () => {
  ship.hit();
  ship.hit();
  ship.hit();
  expect(ship.isSunk()).toBe(true);
  ship.hit();
  expect(ship.getHits()).toBe(3);
});
