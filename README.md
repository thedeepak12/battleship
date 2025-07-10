# Battleship
Battleship is a turn-based strategy game. Each player places 10 ships of varying lengths on their board, then takes turns firing at the enemy's grid. The goal is to sink all of your opponent’s ships before they sink yours.

## Features

- **Manual and Random Ship Placement**  
  Place your fleet of 10 ships manually or with one click using random placement.
  - Ships: `4×1`, `3×2`, `2×3`, `1×4`
  - Orientation toggle: **Horizontal** / **Vertical**
  - Ship cells appear in **brown (#836b32)**

- **Turn-Based Combat**  
  Click cells on the **Enemy Board** to attack.
  - Hits: **Red (#ff0000)**
  - Misses: **White (#ffffff)**
  - Attacked cells: **Gray (#808080)**
  - Hover highlight: **Light blue (#4a8b9c)**

- **Computer Opponent AI**  
  The computer randomly places ships and attacks each turn.

- **Game State Management**  
  Tracks:
  - Ship placement
  - Turn order
  - Win/loss detection
  - Game reset

- **Modular Codebase**  
  Built using **factory functions** and **ES6 modules** for clean, maintainable code.

## How to Play

### 1. Place Your Ships

- You have **10 ships**:
  - `4` ships of length `1`
  - `3` ships of length `2`
  - `2` ships of length `3`
  - `1` ship of length `4`
- Use **manual placement** by clicking cells on **Your Board**
- Toggle ship orientation with the **Horizontal/Vertical** button
- Alternatively, click **Random Placement** to auto-place all ships
- Once all ships are placed, the **Start Game** button becomes active

### 2. Attack the Enemy

- After starting the game, click on cells in the **Enemy Board** to attack
- Visual feedback:
  - Hit → **Red**
  - Miss → **White**
  - Tried cell → **Gray**
- The computer will take a turn after you
- Messages will update to show what happened (e.g., `"You hit a ship!"`, `"Computer missed!"`)

### 3. Win the Game

- Sink all 10 enemy ships to win
- Ships are sunk when all their cells are hit

## Tech Stack

- **HTML** – Structuring the game interface
- **CSS** – Styling grid, ships, and responsive design
- **JavaScript (ES6)** – Game logic, UI updates, modular architecture
- **Webpack** – Bundling assets and modules
- **ESLint + Prettier** – Linting and code formatting

## What I Learned

- **Factory Functions & Modular JS**  
  Created reusable code using `player`, `gameboard`, and `ship` factories

- **DOM Manipulation & Events**  
  Dynamically updated UI and handled user interactions without libraries

- **Game State & Logic**  
  Managed game turns, ship health, and end-game conditions