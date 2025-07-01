export const Ship = (length) => {
  if (!Number.isInteger(length) || length <= 0) {
    throw new Error('Ship length must be a positive integer');
  }

  let hits = 0;
  let sunk = false;

  const hit = () => {
    if (!sunk) {
      hits++;
      sunk = isSunk();
    }
  };

  const isSunk = () => hits >= length;

  return {
    length,
    getHits: () => hits,
    isSunk,
    hit,
  };
};
