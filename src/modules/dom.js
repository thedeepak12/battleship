import { Game } from './game';

export const DOM = () => {
  const game = Game();
  let messageElement = null;
  let startButton = null;
  let placeShipButton = null;
  let randomPlacementButton = null;
  let orientationButton = null;
  let isPlacingShips = false;

  const initialize = () => {
    game.initialize();

    const container = document.createElement('div');
    container.classList.add('container');

    const title = document.createElement('h1');
    title.classList.add('title');
    title.textContent = 'BATTLESHIP';

    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('buttons');
    startButton = document.createElement('button');
    startButton.textContent = 'Start Game';
    startButton.classList.add('button');
    startButton.disabled = true;
    startButton.addEventListener('click', () => {
      isPlacingShips = false;
      game.startGame();
      renderBoards();
      messageElement.textContent = 'Attack the enemy board!';
      startButton.disabled = true;
      placeShipButton.disabled = true;
      randomPlacementButton.disabled = true;
      if (orientationButton) {
        orientationButton.remove();
        orientationButton = null;
      }
    });

    placeShipButton = document.createElement('button');
    placeShipButton.textContent = 'Place Ships';
    placeShipButton.classList.add('button');
    placeShipButton.addEventListener('click', () => setupShipPlacement());

    randomPlacementButton = document.createElement('button');
    randomPlacementButton.textContent = 'Random Placement';
    randomPlacementButton.classList.add('button');
    randomPlacementButton.addEventListener('click', () => {
      isPlacingShips = false;
      game.placeRandomShips();
      renderBoards();
      messageElement.textContent =
        'Ships placed randomly! Click Start Game to begin.';
      startButton.disabled = false;
      placeShipButton.disabled = true;
      randomPlacementButton.disabled = true;
      if (orientationButton) {
        orientationButton.remove();
        orientationButton = null;
      }
    });

    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset Game';
    resetButton.classList.add('button');
    resetButton.addEventListener('click', () => {
      game.reset();
      isPlacingShips = false;
      startButton.disabled = true;
      placeShipButton.disabled = false;
      randomPlacementButton.disabled = false;
      if (orientationButton) {
        orientationButton.remove();
        orientationButton = null;
      }
      renderBoards();
      messageElement.textContent =
        'Click Place Ships or Random Placement to position your ships!';
    });

    buttonsContainer.appendChild(placeShipButton);
    buttonsContainer.appendChild(randomPlacementButton);
    buttonsContainer.appendChild(startButton);
    buttonsContainer.appendChild(resetButton);

    const boardsContainer = document.createElement('div');
    boardsContainer.classList.add('boards');
    const playerBoard = createBoardElement('player-board', 'Your Board');
    const enemyBoard = createBoardElement('enemy-board', 'Enemy Board');
    boardsContainer.appendChild(playerBoard);
    boardsContainer.appendChild(enemyBoard);

    messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.textContent =
      'Click Place Ships or Random Placement to position your ships!';

    container.appendChild(title);
    container.appendChild(buttonsContainer);
    container.appendChild(boardsContainer);
    container.appendChild(messageElement);

    const appElement = document.getElementById('app');
    if (!appElement) {
      console.error('No #app element found in DOM');
      return;
    }
    appElement.appendChild(container);

    setupClickListeners(playerBoard, enemyBoard);
  };

  const createBoardElement = (id, titleText) => {
    const boardContainer = document.createElement('div');
    boardContainer.classList.add('board-container');
    boardContainer.id = id;

    const titleElement = document.createElement('h2');
    titleElement.textContent = titleText;

    const grid = document.createElement('div');
    grid.classList.add('grid');

    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.x = x;
        cell.dataset.y = y;
        grid.appendChild(cell);
      }
    }

    boardContainer.appendChild(titleElement);
    boardContainer.appendChild(grid);
    return boardContainer;
  };

  const renderBoards = () => {
    const playerBoard = game.getCurrentPlayer().gameboard;
    const enemyBoard = game.getComputerPlayer().gameboard;

    renderBoard(
      playerBoard,
      document.querySelector('#player-board .grid'),
      true
    );
    renderBoard(
      enemyBoard,
      document.querySelector('#enemy-board .grid'),
      false
    );
  };

  const renderBoard = (board, gridElement, showShips) => {
    if (!gridElement) return;
    const grid = board.getGrid();
    const missedAttacks = board.getMissedAttacks();

    Array.from(gridElement.children).forEach((cell) => {
      const x = parseInt(cell.dataset.x);
      const y = parseInt(cell.dataset.y);

      cell.className = 'cell';
      if (missedAttacks.some(([mx, my]) => mx === x && my === y)) {
        cell.classList.add('miss');
      } else if (grid[x][y] && grid[x][y].getHits() > 0) {
        cell.classList.add('hit');
      } else if (showShips && grid[x][y]) {
        cell.classList.add('ship');
      }
    });
  };

  const setupClickListeners = (playerBoardElement, enemyBoardElement) => {
    const playerCells = playerBoardElement.querySelectorAll('.cell');
    const enemyCells = enemyBoardElement.querySelectorAll('.cell');

    playerCells.forEach((cell) => {
      cell.addEventListener('click', () => {
        if (isPlacingShips) {
          handleShipPlacement(cell);
        }
      });
    });

    enemyCells.forEach((cell) => {
      cell.addEventListener('click', () => {
        if (!isPlacingShips) {
          handleAttack(cell);
        }
      });
    });
  };

  const handleAttack = (cell) => {
    if (game.isGameOver()) {
      return;
    }

    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);

    try {
      const result = game.playTurn(x, y);
      renderBoards();
      updateMessage(result);

      if (game.isGameOver()) {
        messageElement.textContent = `Game Over! ${result.winner.type === 'human' ? 'You win!' : 'Computer wins!'}`;
        startButton.disabled = true;
        placeShipButton.disabled = true;
        randomPlacementButton.disabled = true;
      }
    } catch (error) {
      messageElement.textContent = error.message;
    }
  };

  const updateMessage = ({ hit, computerHit }) => {
    const messages = [];
    if (hit) {
      messages.push('You hit a ship!');
    } else {
      messages.push('You missed!');
    }
    if (computerHit) {
      messages.push('Computer hit your ship!');
    } else {
      messages.push('Computer missed!');
    }
    messageElement.textContent = messages.join(' ');
  };

  const setupShipPlacement = () => {
    isPlacingShips = true;
    messageElement.textContent = `Click a cell on your board to place a ship (length ${game.getCurrentShipLength() || 2}). Use button to toggle orientation.`;
    startButton.disabled = true;
    placeShipButton.disabled = true;
    randomPlacementButton.disabled = true;

    orientationButton = document.createElement('button');
    orientationButton.textContent = 'Horizontal';
    orientationButton.classList.add('button');
    let isHorizontal = true;
    orientationButton.addEventListener('click', () => {
      isHorizontal = !isHorizontal;
      orientationButton.textContent = isHorizontal ? 'Horizontal' : 'Vertical';
      messageElement.textContent = `Click a cell on your board to place a ship (length ${game.getCurrentShipLength() || 2}). Orientation: ${orientationButton.textContent}.`;
    });
    document.querySelector('.buttons').appendChild(orientationButton);

    game.startShipPlacement([2, 3]);
  };

  const handleShipPlacement = (cell) => {
    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);
    const isHorizontal =
      orientationButton && orientationButton.textContent === 'Horizontal';

    try {
      const placed = game.placeShip(x, y, isHorizontal);
      renderBoards();
      if (placed) {
        messageElement.textContent = `Ship placed! Click a cell on your board to place a ship (length ${game.getCurrentShipLength() || 3}). Orientation: ${isHorizontal ? 'Horizontal' : 'Vertical'}.`;
      } else {
        messageElement.textContent =
          'All ships placed! Click Start Game to begin.';
        isPlacingShips = false;
        if (orientationButton) {
          orientationButton.remove();
          orientationButton = null;
        }
        startButton.disabled = false;
        placeShipButton.disabled = true;
        randomPlacementButton.disabled = true;
      }
    } catch (error) {
      messageElement.textContent = error.message;
    }
  };

  return {
    initialize,
    setupShipPlacement,
  };
};
