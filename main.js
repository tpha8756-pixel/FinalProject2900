'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const playBtn = document.getElementById('play-btn');

  if (!playBtn) {
    console.error('Play button (#play-btn) was not found.');
    return;
  }

  playBtn.addEventListener('click', () => {
    console.log('Play button clicked!');
    // Show game section / start game here
  });
});

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