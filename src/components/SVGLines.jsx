import React from "react";

/**
 * Renders a connecting SVG line and endpoints between a label/modal and a model part.
 * Used for both desktop and mobile/tablet overlays.
 */
function SVGLines({ lineProps, visible = true, opacity = 1, isFixed = false }) {
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

  // Add opacity and transition if needed
  const style = {
    ...baseStyle,
    opacity: visible ? opacity : 0,
    transition: "opacity 1.5s cubic-bezier(.4,0,.2,1)",
  };

  return (
    <svg style={style} width="100vw" height="100vh">
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
