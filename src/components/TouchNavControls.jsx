import React from "react";
import "../App.css";

/**
 * TouchNavControls Component
 *
 * Provides touch-based navigation interface for mobile and tablet devices.
 * Designed to be minimal yet highly responsive to user interaction.
 *
 * Key Features:
 * - Custom styled navigation buttons
 * - Haptic feedback through visual transitions
 * - High-contrast design for accessibility
 * - Strategic positioning above other UI elements
 *
 * Props:
 * @param {Function} onNav - Callback for navigation events
 *                          Takes direction ("up"/"down") as parameter
 *
 * Interaction Flow:
 * 1. User taps button
 * 2. Visual feedback via CSS transition
 * 3. Navigation callback triggered
 * 4. Parent components handle transition effects
 *
 * CSS Dependencies:
 * - .touch-nav-controls: Container styling and positioning
 * - .touch-nav-btn: Button appearance and transitions
 * - SVG styling for arrow icons
 *
 * Z-Index Layering:
 * - Container: 10001 (highest level)
 * - Ensures controls are always accessible
 */

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
