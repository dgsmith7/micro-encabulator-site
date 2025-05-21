import React from "react";

/**
 * Modal component for displaying project credits and attributions.
 * Appears as an overlay when showCredits is true.
 */
function CreditsModal({ showCredits, setShowCredits }) {
  if (!showCredits) return null;

  return (
    <div
      className="credits-modal-overlay"
      style={{ zIndex: 2000 }}
      onClick={() => setShowCredits(false)}
    >
      <div className="credits-modal" onClick={(e) => e.stopPropagation()}>
        <span className="credits-close" onClick={() => setShowCredits(false)}>
          close
        </span>
        <div className="credits-content">
          <div className="credits-blurb">
            Website by David G. Smith, (c) 2025, DGS Creative, LLC
          </div>
          <div className="credits-adapted">Adapted from these originals:</div>
          <div>
            <a
              href="https://www.youtube.com/watch?v=Ac7G7xOG2Ag"
              target="_blank"
              rel="noopener noreferrer"
            >
              Turbo encabulator
            </a>
          </div>
          <div>
            <a
              href="https://www.youtube.com/watch?v=RXJKdh1KZ0w"
              target="_blank"
              rel="noopener noreferrer"
            >
              Retro encabulator
            </a>
          </div>
          <div className="license-credit">
            3d model: This work is based on{" "}
            <a
              href="https://sketchfab.com/3d-models/scifi-generator-bf2e1a087adb4628a376ffbed17c41ff"
              target="_blank"
              rel="noopener noreferrer"
            >
              "SCIFI GENERATOR"
            </a>{" "}
            by{" "}
            <a
              href="https://sketchfab.com/LordCinn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cinnamine3D
            </a>{" "}
            licensed under{" "}
            <a
              href="http://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
            >
              CC-BY-4.0
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreditsModal;
