'use strict';

import { FACULTY_DATA } from './facultyData.js';
import { delay, playTone } from './helpers.js';

/**
 * Controls the Simon Says game state, sequence generation, board rendering,
 * and player input validation.
 */
export class SimonGame {
  constructor() {
    // Game state properties
    this.sequence = [];
    this.playerStep = 0;
    this.round = 0;
    this.highScore = 0;
    this.isAcceptingInput = false;
    this.isPlayingSequence = false;

    // Cache references to DOM elements
    this.boardElement = document.getElementById('game-board');
    this.statusText = document.getElementById('status-text');
    this.roundDisplay = document.getElementById('current-round');
    this.highScoreDisplay = document.getElementById('high-score');
    this.startBtn = document.getElementById('start-btn');
  }


  /**
   * Sets up the game board and attaches the Start Game button listener.
   */
  init() {
    console.log('init running, startBtn:', this.startBtn);
    this.renderBoard();

    if (!this.startBtn) {
      console.error('Could not find #start-btn in the DOM.');
      return;
    }

    // Decision Point: Attach click listener only if Start button exists in DOM.
    if (this.startBtn) {
      this.startBtn.addEventListener('click', () => {
        console.log('Start button clicked! isPlayingSequence:', this.isPlayingSequence);
        // Decision Point: Ignore clicks while a sequence is actively playing back.
        if (this.isPlayingSequence) {
          return;
        }
        this.startNewGame();
      });
    }
  }

  /**
   * Loops through FACULTY_DATA to create and render the 4 interactive pads.
   */
  renderBoard() {
    this.boardElement.innerHTML = '';

    // Loop over each faculty object to construct its HTML card.
    FACULTY_DATA.forEach((faculty) => {
      const pad = document.createElement('div');
      pad.className = 'faculty-pad';
      pad.dataset.id = faculty.id;

      pad.innerHTML = `
        <div class="faculty-badge" style="background-color: ${faculty.color};">
          ${faculty.initials}
        </div>
        <div class="faculty-name">${faculty.name}</div>
        <div class="faculty-title">${faculty.title}</div>
      `;

      // Attach click event listener for player turns.
      pad.addEventListener('click', () => this.handlePadClick(faculty.id));
      this.boardElement.appendChild(pad);
    });
  }

  /**
   * Resets all round counters and launches Round 1.
   */
  startNewGame() {
    this.sequence = [];
    this.round = 0;
    this.updateScoreDisplay();
    this.startBtn.textContent = 'Restart Game';
    this.nextRound();
  }

  /**
   * Adds one random faculty member to the sequence and plays the full pattern.
   */
  async nextRound() {
    this.isAcceptingInput = false;
    this.isPlayingSequence = true;
    this.playerStep = 0;
    this.round += 1;
    this.updateScoreDisplay();

    this.statusText.textContent = `Round ${this.round}: Watch the sequence...`;

    // Pick a random index between 0 and 3 and append it to the sequence array.
    const randomIndex = Math.floor(Math.random() * FACULTY_DATA.length);
    this.sequence.push(randomIndex);

    // Play back the sequence step-by-step using Promises.
    await this.playSequence();

    this.clearActivePads();

    // Unlock user input once sequence playback finishes.
    this.isPlayingSequence = false;
    this.isAcceptingInput = true;
    this.statusText.textContent = 'Your turn! Repeat the pattern.';
  }

  /**
   * Iterates through the stored sequence and illuminates each faculty pad in order.
   */
  async playSequence() {
    await delay(500);

    // Standard for-loop to step sequentially through the sequence array.
    for (let i = 0; i < this.sequence.length; i++) {
      const facultyId = this.sequence[i];
      await this.flashPad(facultyId);
      await delay(250);
    }
  }

  /**
   * Lights up a single faculty pad, plays its tone, and turns off the highlight.
   *
   * @param {number} facultyId - ID of the faculty pad (0-3).
   */
  async flashPad(facultyId) {
    const pad = this.boardElement.querySelector(`[data-id="${facultyId}"]`);
    const faculty = FACULTY_DATA[facultyId];
    
    // Decision Point: Only animate and play sound if matching pad and data exist.
    if (pad && faculty) {
    pad.classList.add('active');
    playTone(faculty.frequency);
    await delay(450);
    pad.classList.remove('active');
  }
}

  /**
   * Validates the player's pad click against the expected step in the sequence.
   *
   * @param {number} facultyId - ID of the pad clicked by the player.
   */
  async handlePadClick(facultyId) {
    // Decision Point: Ignore clicks when it is not the player's turn.
    if (!this.isAcceptingInput) {
      return;
    }

    // Visual and audio feedback for the player's click.
    await this.flashPad(facultyId);

    // Decision Point: Check if the clicked pad matches the expected sequence step.
    if (facultyId === this.sequence[this.playerStep]) {
      this.playerStep += 1;

      // Decision Point: Check if the player completed all steps for this round.
      if (this.playerStep === this.sequence.length) {
        this.isAcceptingInput = false;
        this.statusText.textContent = 'Nice job! Get ready for the next round...';

        // Decision Point: Update high score if current round beats previous best.
        if (this.round > this.highScore) {
          this.highScore = this.round;
          this.updateScoreDisplay();
        }

        await delay(1000);
        this.nextRound();
      }
    } else {
      // Decision Point: Player clicked the wrong pad -> end game.
      this.handleGameOver();
    }
  }

  /**
   * Ends the current game session and displays the final round reached.
   */
  handleGameOver() {
    this.isAcceptingInput = false;
    this.sequence = [];
    this.statusText.textContent = `Game Over! You reached Round ${this.round}. Click "Restart Game" to try again.`;
  }

  clearActivePads() {
    if (!this.boardElement) return;
    const activePads = this.boardElement.querySelectorAll('.faculty-pad.active');
    activePads.forEach((pad) => {
      pad.classList.remove('active');
    });
  }
  /**
   * Updates the Round and High Score numbers rendered on the page.
   */
  updateScoreDisplay() {
    this.roundDisplay.textContent = this.round;
    this.highScoreDisplay.textContent = this.highScore;
  }
}