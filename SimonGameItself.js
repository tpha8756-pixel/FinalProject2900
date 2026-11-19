'use strict';

import { FACULTY_DATA } from '../data/Faculty.js';
import { delay } from '../utils/helpers.js';

/**
 * Class representing the Simon Says game state and logic.
 */
export class SimonGame {
  constructor() {
    // Game State tracking
    this.sequence = [];
    this.userStep = 0;
    this.round = 0;
    this.highScore = 0;
    this.isAcceptingInput = false;

    // DOM Elements
    this.boardElement = document.getElementById('game-board');
    this.statusText = document.getElementById('status-text');
    this.roundDisplay = document.getElementById('current-round');
    this.highScoreDisplay = document.getElementById('high-score');
    this.startBtn = document.getElementById('start-btn');

    if (!this.startBtn) {
      console.error("Error: 'start-btn' element not found in HTML!");
    }
  }

  /**
   * Initializes the game component, populates pads, and attaches listeners.
   */
  init() {
    console.log("SimonGame init() called. Finding elements...")
    this.renderBoard();
    
    // Event Listener: User clicks start button
    this.startBtn.addEventListener('click', () => {
      // Decision Point: Prevent restarting if sequence is currently playing
      if (!this.isAcceptingInput && this.sequence.length > 0) {
        return;
      }
      this.startNewGame();
    });
  }

  /**
   * Dynamically renders the 4 faculty interactive pads using Loops and DOM Manipulation.
   */
  renderBoard() {
    this.boardElement.innerHTML = '';

    // Loop over FACULTY_DATA array to build elements
    FACULTY_DATA.forEach((faculty) => {
      const pad = document.createElement('div');
      pad.className = 'faculty-pad';
      pad.dataset.id = faculty.id;

      pad.innerHTML = `
        <img class="faculty-photo" src="${faculty.image}" alt="${faculty.name}" />
        <div class="faculty-name">${faculty.name}</div>
        <div class="faculty-title">${faculty.title}</div>
      `;

      // Event Listener: User clicks a pad
      pad.addEventListener('click', () => this.handlePadClick(faculty.id));

      this.boardElement.appendChild(pad);
    });
  }

  /**
   * Resets scores and begins a new game.
   */
  startNewGame() {
    this.sequence = [];
    this.round = 0;
    this.updateRoundDisplay();
    this.statusText.textContent = "Watch the sequence carefully...";
    this.nextRound();
  }

  /**
   * Advances the game to the next round, adding a random faculty choice.
   */
  async nextRound() {
    this.isAcceptingInput = false;
    this.userStep = 0;
    this.round += 1;
    this.updateRoundDisplay();

    // Select random index from 0 to 3
    const randomFacultyId = Math.floor(Math.random() * FACULTY_DATA.length);
    this.sequence.push(randomFacultyId);

    // Playback sequence to user using Promise-based delay
    await this.playSequence();

    // Enable player input after sequence finishes
    this.isAcceptingInput = true;
    this.statusText.textContent = "Your turn! Repeat the pattern.";
  }

  /**
   * Plays back current sequence using Promises and asynchronous loops.
   */
  async playSequence() {
    await delay(600); // Initial delay before sequence starts

    // Loop through the sequence array sequentially
    for (let i = 0; i < this.sequence.length; i++) {
      const facultyId = this.sequence[i];
      await this.activatePad(facultyId);
      await delay(300); // Pause between flashes
    }
  }

  /**
   * Visually activates a faculty pad and returns a Promise when finished.
   * @param {number} facultyId 
   */
  async activatePad(facultyId) {
    const pad = this.boardElement.querySelector(`[data-id="${facultyId}"]`);
    
    // Decision Point: Verify pad exists before toggling classes
    if (pad) {
      pad.classList.add('active');
      await delay(500); // Hold active glow state
      pad.classList.remove('active');
    }
  }

  /**
   * Handles player click events on faculty pads.
   * @param {number} facultyId 
   */
  async handlePadClick(facultyId) {
    // Decision Point: Ignore clicks if system is displaying sequence or game inactive
    if (!this.isAcceptingInput) {
      return;
    }

    // Momentarily flash clicked pad
    this.activatePad(facultyId);

    // Decision Point: Check if click matches sequence at current step
    if (facultyId === this.sequence[this.userStep]) {
      this.userStep += 1;

      // Decision Point: Check if player successfully completed entire round sequence
      if (this.userStep === this.sequence.length) {
        this.statusText.textContent = "Correct! Get ready for the next round...";
        this.isAcceptingInput = false;

        // Update high score if exceeded
        if (this.round > this.highScore) {
          this.highScore = this.round;
          this.highScoreDisplay.textContent = this.highScore;
        }

        // Delay briefly before launching next round
        setTimeout(() => this.nextRound(), 1200);
      }
    } else {
      // Decision Point: Wrong input entered — Trigger Game Over
      this.handleGameOver();
    }
  }

  /**
   * Triggers game over screen and state reset.
   */
  handleGameOver() {
    this.isAcceptingInput = false;
    this.statusText.textContent = `❌ Game Over! You reached Round ${this.round}. Click "Start Game" to try again.`;
    this.sequence = [];
  }

  /**
   * Updates round text in UI.
   */
  updateRoundDisplay() {
    this.roundDisplay.textContent = this.round;
  }
}