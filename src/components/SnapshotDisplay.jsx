import React from "react";
import SVGLines from "./SVGLines";

/**
 * Component to handle the display of static images on mobile/tablet devices
 * with smooth crossfade transitions.
 */
function SnapshotDisplay({ crossfade, lineProps, stop, snapshotImg }) {
  // If there's no image to display
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

      {/* Fade-out phase: only show the current image, fading out */}
      {phase === "fade-out" && prev && (
        <img
          src={prev}
          alt={`Previous micro-encabulator view`}
          className="snapshot-img current fade-out"
          style={{ zIndex: 4, pointerEvents: "none" }}
        />
      )}

      {/* Fade-in phase: only show the next image, fading in */}
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
          visible={true}
          opacity={1}
          isFixed={false}
        />
      )}
    </div>
  );
}

export default SnapshotDisplay;
