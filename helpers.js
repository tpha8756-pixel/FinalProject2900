'use strict';

/**
 * Creates a Promise that pauses execution for a given number of milliseconds.
 * Used with async/await to control the timing of Simon sequence animations.
 *
 * @param {number} ms - Time to wait in milliseconds.
 * @returns {Promise<void>}
 */
export function delay(ms) {
  // Decision Point: Validate that ms is a positive number; fallback to 500ms if invalid.
  if (typeof ms !== 'number' || ms < 0) {
    ms = 500;
  }

  // Return a Promise that resolves once setTimeout completes.
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Plays a short synthesized musical tone using the browser's Web Audio API,
 * giving each faculty pad distinct audio feedback like classic Simon.
 *
 * @param {number} frequency - Sound frequency in Hertz.
 */
export function playTone(frequency) {
  // Decision Point: Check if Web Audio API is supported in the current browser.
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) {
    return;
  }

  const audioCtx = new AudioCtx();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

  gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.35);
}