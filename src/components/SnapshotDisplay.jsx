import React from "react";
import SVGLines from "./SVGLines";

/**
 * Displays a static snapshot image for the current stop (mobile/tablet only),
 * with crossfade transitions and optional SVG line overlay.
 */
function SnapshotDisplay({ crossfade, lineProps, stop, snapshotImg }) {
  // If there's no image to display, show fallback message
  if (!snapshotImg) {
    return (
      <div style={{ color: "#fff", textAlign: "center", marginTop: "2em" }}>
        No image available for this device/stop.
      </div>
    );
  }

  const { phase, prev, next } = crossfade;

  return (
    <div className="snapshot-crossfade">
      {/* At idle: only show the current image */}
      {phase === "idle" && next && (
        <img
          src={next}
          alt={`Micro-encabulator view ${stop}`}
          className="snapshot-img current"
          style={{ zIndex: 4, pointerEvents: "none" }}
        />
      )}

      {/* Fade-out phase: show current image fading out */}
      {phase === "fade-out" && prev && (
        <img
          src={prev}
          alt={`Previous micro-encabulator view`}
          className="snapshot-img current fade-out"
          style={{ zIndex: 4, pointerEvents: "none" }}
        />
      )}

      {/* Fade-in phase: show next image fading in */}
      {phase === "fade-in" && next && (
        <img
          src={next}
          alt={`Micro-encabulator view ${stop}`}
          className="snapshot-img next fade-in"
          style={{ zIndex: 4, pointerEvents: "none" }}
        />
      )}

      {/* Initial load: fade in */}
      {phase === "fade-in" && !prev && next && (
        <img
          src={next}
          alt={`Micro-encabulator view ${stop}`}
          className="snapshot-img next fade-in"
          style={{ zIndex: 4, pointerEvents: "none" }}
        />
      )}

      {/* SVG lines overlay, always above images */}
      {lineProps && stop !== 0 && (
        <SVGLines
          lineProps={lineProps}
          visible={crossfade.phase !== "fade-out"}
          isFixed={false}
        />
      )}
    </div>
  );
}

export default SnapshotDisplay;
