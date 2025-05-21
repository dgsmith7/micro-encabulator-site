/**
 * Animation utility functions for model and camera transitions.
 */

/**
 * Cubic ease-in-out for smooth acceleration/deceleration.
 */
export function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Linear interpolation between two values.
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Projects a 3D point to 2D screen coordinates.
 */
export function project3DToScreen(vec3, camera, size) {
  if (!camera) return { x: 0, y: 0 };
  const projected = vec3.clone().project(camera);
  return {
    x: ((projected.x + 1) / 2) * size.width,
    y: ((-projected.y + 1) / 2) * size.height,
  };
}
