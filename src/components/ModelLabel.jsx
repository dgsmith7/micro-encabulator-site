import React from "react";

/**
 * ModelLabel Component
 *
 * Handles information overlay display and positioning.
 * Adapts to different device types and orientations.
 *
 * Features:
 * - Responsive positioning system
 * - Orientation-aware layout adjustments
 * - Smooth fade transitions
 * - Accessibility considerations
 *
 * Props:
 * @param {string} label - Title text
 * @param {string} desc - Description text
 * @param {boolean} isStart - Special handling for intro state
 * @param {boolean} isPanametric - Special handling for panametric view
 * @param {Object} modalRef - Reference for position calculations
 * @param {string} modalClass - Additional styling classes
 * @param {Object} deviceType - Current device information
 * @param {string} orientation - Current device orientation
 * @param {Object} viewportSize - Current viewport dimensions
 * @param {number} fade - Controls transition state
 *
 * CSS Dependencies:
 * - Position calculations
 * - Responsive text sizing
 * - Fade transitions
 * - z-index layering
 */

/**
 * Overlay label/modal for each stop, positioned responsively.
 * Handles special classes for start, panametric, and landscape modes.
 */
function ModelLabel({
  label,
  desc,
  isStart,
  isPanametric,
  modalRef,
  modalClass,
  deviceType,
  orientation,
  viewportSize,
  labelPos,
  fade = 1,
}) {
  // Removed debug logging for production

  // Build className string for modal overlay
  let className = "model-label-overlay";
  if (isStart) className += " start-modal";
  if (isPanametric) className += " panametric-modal";
  if (modalClass) className += ` ${modalClass}`;

  // Add landscape class for mobile devices in landscape or short screens
  const isLandscape =
    orientation === "l" ||
    (viewportSize && viewportSize.width > viewportSize.height);
  if (
    (deviceType === "mobile" && isLandscape) ||
    (viewportSize && viewportSize.height < 500)
  ) {
    className += " landscape-mobile";
  }

  return (
    <div className={`${className} ${!fade ? "fade-out" : ""}`} ref={modalRef}>
      <div className="model-label-title">{label}</div>
      <div className="model-label-desc">{desc}</div>
    </div>
  );
}

export default ModelLabel;
