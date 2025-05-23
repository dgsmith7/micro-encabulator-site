import React from "react";

/**
 * SVGLines Component
 *
 * Renders dynamic connection lines between labels and model parts.
 * Critical for visual connection between information and 3D model.
 *
 * Features:
 * - Dynamic positioning based on model and label coordinates
 * - Smooth fade transitions during navigation
 * - Responsive to device orientation
 * - Handles both 3D-calculated and preset positions
 *
 * Props:
 * @param {Object} lineProps - Coordinates for line start/end points
 * @param {boolean} visible - Controls fade transition state
 * @param {boolean} isFixed - Determines positioning strategy
 *
 * CSS Dependencies:
 * - opacity transitions
 * - z-index layering
 * - pointer-events handling
 */

/**
 * Renders a connecting SVG line and endpoints between a label/modal and a model part.
 * Used for both desktop and mobile/tablet overlays.
 */
function SVGLines({ lineProps, visible = true, isFixed = false }) {
  if (!lineProps) return null;

  // SVG is positioned absolutely or fixed, overlays the viewport
  const baseStyle = {
    position: isFixed ? "fixed" : "absolute",
    left: 0,
    top: 0,
    pointerEvents: "none", // Allow clicks to pass through
    zIndex: 10001, // above images and overlays
    width: "100vw",
    height: "100vh",
  };

  return (
    <svg
      style={baseStyle}
      width="100vw"
      height="100vh"
      className={`overlay-lines ${!visible ? "fade-out" : ""}`}
    >
      <line
        x1={lineProps.startX}
        y1={lineProps.startY}
        x2={lineProps.endX}
        y2={lineProps.endY}
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle
        cx={lineProps.startX}
        cy={lineProps.startY}
        r="3"
        fill="#fff"
        stroke="#fff"
        strokeWidth="1.2"
      />
      <circle
        cx={lineProps.endX}
        cy={lineProps.endY}
        r="3"
        fill="#fff"
        stroke="#fff"
        strokeWidth="1.2"
      />
    </svg>
  );
}

export default SVGLines;
