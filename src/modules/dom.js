import { Game } from './game';

export const DOM = () => {
  const game = Game();
  let messageElement = null;

  const initialize = () => {
    const container = document.createElement('div');
    container.classList.add('container');

    const title = document.createElement('h1');
    title.classList.add('title');
    title.textContent = 'BATTLESHIP';

    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('buttons');
    const startButton = document.createElement('button');
    startButton.textContent = 'Start Game';
    startButton.classList.add('button');
    startButton.addEventListener('click', () => {
      game.initialize();
      renderBoards();
      messageElement.textContent = 'Attack the enemy board!';
      startButton.disabled = true;
    });
    buttonsContainer.appendChild(startButton);

    const boardsContainer = document.createElement('div');
    boardsContainer.classList.add('boards');
    const playerBoard = createBoardElement('player-board', 'Your Board');
    const enemyBoard = createBoardElement('enemy-board', 'Enemy Board');
    boardsContainer.appendChild(playerBoard);
    boardsContainer.appendChild(enemyBoard);

    messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.textContent = 'Click Start Game to begin!';

    container.appendChild(title);
    container.appendChild(buttonsContainer);
    container.appendChild(boardsContainer);
    container.appendChild(messageElement);
    document.body.appendChild(container);

    setupAttackListeners(enemyBoard);
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
    const enemyBoard =
      game.getCurrentPlayer().type === 'human'
        ? game.getCurrentPlayer().gameboard
        : game.getCurrentPlayer().gameboard;

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

  const setupAttackListeners = (enemyBoardElement) => {
    const cells = enemyBoardElement.querySelectorAll('.cell');
    cells.forEach((cell) => {
      cell.addEventListener('click', () => handleAttack(cell));
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

  const setupShipPlacement = () => {};

  return {
    initialize,
    setupShipPlacement,
  };
};
