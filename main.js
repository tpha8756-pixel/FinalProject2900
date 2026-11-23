'use strict';

import { initCanvas } from './canvas.js';
import { SimonGame } from './simonGame.js';

/**
 * Entry point: waits for the HTML DOM to finish loading, then starts
 * the HTML5 Canvas animation and initializes the SimonGame controller.
 */
document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  const game = new SimonGame();
  game.init();
});