/**
 * Animation Utility Functions
 *
 * Core animation calculations and helpers for smooth transitions
 * across all interactive elements.
 *
 * Functions:
 *
 * easeInOutCubic:
 * - Provides smooth acceleration and deceleration
 * - Used for camera movements and UI transitions
 * - Creates natural-feeling motion
 *
 * lerp (Linear Interpolation):
 * - Calculates intermediate positions
 * - Used for camera position updates
 * - Ensures smooth movement between points
 *
 * project3DToScreen:
 * - Converts 3D coordinates to 2D screen space
 * - Critical for SVG line positioning
 * - Maintains connections during camera movement
 *
 * Usage:
 * These functions work together to create a cohesive
 * animation system across the entire application.
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
