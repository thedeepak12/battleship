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
      if (game.startGame()) {
        renderBoards();
        messageElement.textContent = 'Attack the enemy board!';
        startButton.disabled = true;
        placeShipButton.disabled = true;
        randomPlacementButton.disabled = true;
        if (orientationButton) {
          orientationButton.remove();
          orientationButton = null;
        }
        console.log('Start Game clicked: attack phase begins');
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
      console.log('Random Placement clicked: human ships placed');
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
      console.log('Reset Game clicked');
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
    console.log('Boards rendered');
  };

  const renderBoard = (board, gridElement, showShips) => {
    if (!gridElement) return;
    const grid = board.getGrid();
    const missedAttacks = board.getMissedAttacks();
    const hitCells = board.getHitCells ? board.getHitCells() : [];

    Array.from(gridElement.children).forEach((cell) => {
      const x = parseInt(cell.dataset.x);
      const y = parseInt(cell.dataset.y);

      cell.className = 'cell';
      const isMiss = missedAttacks.some(([mx, my]) => mx === x && my === y);
      const isHit = grid[x][y] && hitCells.includes(`${x},${y}`);

      if (isMiss) {
        cell.classList.add('miss', 'attacked');
        console.log(
          `Rendering miss at x=${x}, y=${y} on ${showShips ? 'player' : 'enemy'} board`
        );
      } else if (isHit) {
        cell.classList.add('hit', 'attacked');
        console.log(
          `Rendering hit at x=${x}, y=${y} on ${showShips ? 'player' : 'enemy'} board`
        );
      } else if (showShips && grid[x][y] && !isHit) {
        cell.classList.add('ship');
        console.log(`Rendering ship at x=${x}, y=${y} on player board`);
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
      cell.addEventListener('mouseover', () => {
        if (isPlacingShips) {
          highlightShipPlacement(cell);
        }
      });
      cell.addEventListener('mouseout', () => {
        if (isPlacingShips) {
          clearHighlight(playerBoardElement.querySelector('.grid'));
        }
      });
    });

    enemyCells.forEach((cell) => {
      cell.addEventListener('click', () => {
        if (!isPlacingShips && game.isGameStarted() && !game.isGameOver()) {
          handleAttack(cell);
        } else if (isPlacingShips) {
          messageElement.textContent =
            'Finish placing ships and click Start Game to attack!';
        } else if (!game.isGameStarted()) {
          messageElement.textContent = 'Click Start Game to begin attacking!';
        }
      });
    });
  };

  const highlightShipPlacement = (cell) => {
    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);
    const isHorizontal =
      orientationButton && orientationButton.textContent === 'Horizontal';
    const length = game.getCurrentShipLength() || 2;
    const gridElement = document.querySelector('#player-board .grid');

    clearHighlight(gridElement);

    for (let i = 0; i < length; i++) {
      const posX = isHorizontal ? x + i : x;
      const posY = isHorizontal ? y : y + i;
      if (posX < 10 && posY < 10) {
        const targetCell = gridElement.querySelector(
          `[data-x="${posX}"][data-y="${posY}"]`
        );
        if (targetCell) {
          targetCell.classList.add('hover');
        }
      }
    }
  };

  const clearHighlight = (gridElement) => {
    gridElement.querySelectorAll('.cell').forEach((cell) => {
      cell.classList.remove('hover');
    });
  };

  const handleAttack = (cell) => {
    if (game.isGameOver()) {
      messageElement.textContent = 'Game is over! Reset to play again.';
      return;
    }
    if (!game.isGameStarted()) {
      messageElement.textContent = 'Click Start Game to begin attacking!';
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
      console.error(`Attack failed: ${error.message}`);
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
    console.log('Ship placement setup: orientation button added');
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
      console.error(`Ship placement error: ${error.message}`);
    }
  };

  return {
    initialize,
    setupShipPlacement,
  };
};
