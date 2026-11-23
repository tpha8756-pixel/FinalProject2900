'use strict';
/**
 * Renders and animates a custom MSMC crest on the HTML5 <canvas> element.
 * Demonstrates translation, rotation, and dynamic scaling transformations.
 */
export function initCanvas() {
  const canvas = document.getElementById('msmc-canvas');

  // Decision Point: Stop safely if the canvas element does not exist in the HTML.
  if (!canvas) {
    console.error('Canvas element #msmc-canvas not found.');
    return;
  }

  const ctx = canvas.getContext('2d');
  let angle = 0;

  /**
   * Draws a single animation frame and schedules the next frame.
   */
  function drawFrame() {
    // Clear the previous frame across the entire canvas area.
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save default coordinate state before applying transformations.
    ctx.save();

    // Transformation 1 (Translation): Move origin to the center of the canvas.
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // Transformation 2 (Rotation): Rotate smoothly based on the current angle.
    ctx.rotate((angle * Math.PI) / 180);

    // Transformation 3 (Scaling): Pulse gently between 90% and 110% size.
    const scaleFactor = 1 + 0.1 * Math.sin((angle * Math.PI) / 90);
    ctx.scale(scaleFactor, scaleFactor);

    // Draw outer MSMC Gold diamond badge.
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-42, -42, 84, 84);

    // Draw inner MSMC Navy circle.
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, Math.PI * 2);
    ctx.fill();

    // Draw centered white MSMC label.
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('MSMC', 0, 0);

    // Restore original canvas state.
    ctx.restore();

    // Advance rotation angle and loop continuously.
    angle = (angle + 1.2) % 360;
    requestAnimationFrame(drawFrame);
  }

  drawFrame();
}