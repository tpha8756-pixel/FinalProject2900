'use strict';

import { initCanvas } from './components/Canvas.js';
import { SimonGameItself } from './components/SimonGameItself.js';

// Execute code after DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize HTML5 dynamic canvas element
  initCanvas();

  // Instantiate and run the Simon Game engine
  const game = new SimonGameItself ();
  game.init();
});