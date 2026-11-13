'use strict';

/**
 * Returns a Promise that resolves after a specified duration in milliseconds.
 * Fulfills the project requirement for proper use of Promises.
 * 
 * @param {number} ms - Milliseconds to delay execution.
 * @returns {Promise<void>}
 */
export function delay(ms) {
  // Decision Point: Verify valid positive numerical input before creating Promise
  if (typeof ms !== 'number' || ms < 0) {
    ms = 500; // Fallback default duration
  }

  // Create and return a standard Promise wrapper around setTimeout
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}