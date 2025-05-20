import React from "react";
import "../App.css";

export default function TouchNavControls({ onNav }) {
  return (
    <div className="touch-nav-controls">
      <button
        className="touch-nav-btn up"
        aria-label="Previous"
        onClick={() => onNav("up")}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="14"
            cy="14"
            r="13"
            stroke="#e0e0e0"
            strokeWidth="2"
            fill="none"
          />
          <polyline
            points="9,16 14,11 19,16"
            stroke="#e0e0e0"
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
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="14"
            cy="14"
            r="13"
            stroke="#e0e0e0"
            strokeWidth="2"
            fill="none"
          />
          <polyline
            points="9,12 14,17 19,12"
            stroke="#e0e0e0"
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
