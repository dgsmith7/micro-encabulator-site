import React from "react";
import "../App.css";

// Touch navigation controls for mobile/tablet: up/down buttons trigger navigation
export default function TouchNavControls({ onNav }) {
  return (
    <div className="touch-nav-controls">
      <button
        className="touch-nav-btn up"
        aria-label="Previous"
        onClick={() => onNav("up")}
      >
        {/* Up arrow icon */}
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polyline
            points="9,16 14,11 19,16"
            stroke="rgba(255, 255, 255, 0.9)"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        className="touch-nav-btn down"
        aria-label="Next"
        onClick={() => onNav("down")}
      >
        {/* Down arrow icon */}
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polyline
            points="9,12 14,17 19,12"
            stroke="rgba(255, 255, 255, 0.9)"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
