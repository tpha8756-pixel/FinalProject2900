'use strict';

/**
 * Initializes and animates a dynamic visual on the canvas element.
 * Fulfills the requirement for scaling, rotating, and transforming canvas visuals.
 */
export function initCanvas() {
  // Retrieve the canvas element from DOM
  const canvas = document.getElementById('msmc-canvas');
  
  // Decision Point: Guard check to ensure canvas element exists before context creation
  if (!canvas) {
    console.error('Canvas element not found in DOM.');
    return;
  }

  const ctx = canvas.getContext('2d');
  let angle = 0;

  /**
   * Animation loop that rotates and scales a customized geometric badge.
   */
  function draw() {
    // Clear canvas frame before re-drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context state for transformations
    ctx.save();

    // Translate origin to canvas center
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // Apply rotation transformation
    ctx.rotate((angle * Math.PI) / 180);

    // Apply dynamic scaling transformation
    const scale = 1 + 0.1 * Math.sin((angle * Math.PI) / 90);
    ctx.scale(scale, scale);

    // Draw Outer Square / Diamond Badge
    ctx.fillStyle = '#fbbf24'; // MSMC Gold
    ctx.fillRect(-45, -45, 90, 90);

    // Draw Inner Core
    ctx.fillStyle = '#1e3a8a'; // MSMC Navy Blue
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, Math.PI * 2);
    ctx.fill();

    // Draw Center Text Symbol
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('MSMC', 0, 0);

    // Restore context state
    ctx.restore();

    // Increment rotation angle
    angle = (angle + 1.5) % 360;

    // Request next frame for continuous animation
    requestAnimationFrame(draw);
  }

  // Kick off render loop
  draw();
}