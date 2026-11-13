'use strict';

import { initCanvas } from './components/canvas.js';
import { SimonGame } from './components/simonGame.js';

// Execute code after DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize HTML5 dynamic canvas element
  initCanvas();

  // Instantiate and run the Simon Game engine
  const game = new SimonGame();
  game.init();
});