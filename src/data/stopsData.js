/**
 * This file defines all stop points for the Micro-encabulator tour.
 * Each stop includes camera, label, and line data for the UI.
 */

const INITIAL_DESCRIPTION =
  "An nano-instrument currently used in the operation of microscopic milford trenions. It not only provides inverse reactive current, for use in unilateral phase detractors, but is also capable of automatically synchronizing cardinal grammeters. Power is produced by the modial interaction of magneto-reluctance and capacitive diractance.";

export const INITIAL_STOP = {
  name: "Micro-encabulator",
  desc: INITIAL_DESCRIPTION,
  rotation: [0, -0.7, 0.3], // rotate 90 degrees from previous (side view)
  cameraTarget: [0, 0, 0],
  cameraPos: [-12, 0, 0], // move camera to the other side for a long-side view
  labelPos: { x: 0, y: 0, z: 0 },
  lineTo: { x: 0, y: 0, z: 0 },
  lineAnchor: "right",
};

export const STOPS = [
  {
    ...INITIAL_STOP,
    lineAnchor: "left",
    line2D: { startX: 120, startY: 400, endX: 220, endY: 300 },
  },
  {
    name: "Panametric Fan",
    desc: "Regulates the modial interaction of magneto-reluctance and capacitive diractance, ensuring phase stability.",
    rotation: [Math.PI / 6, Math.PI / 3, Math.PI],
    cameraTarget: [0, -2, 0],
    cameraPos: [8, -8, 8],
    labelPos: { x: 10, y: 2, z: 0 }, // fix: move labelPos to right and up for visibility
    lineTo: { x: 2, y: 2, z: 0 },
    lineAnchor: "top",
    line2D: { startX: 200, startY: 180, endX: 300, endY: 100 },
  },
  {
    name: "Spurving Bearings",
    desc: "Provide seamless support for the ambifacient lunar waneshaft, preventing side fumbling.",
    rotation: [0.5, Math.PI, 0.2],
    cameraTarget: [0, -2, 0],
    cameraPos: [-10, 4, 10],
    labelPos: { x: -10, y: 2, z: 0 }, // fix: move labelPos closer to model
    lineTo: { x: 40, y: 20, z: -50 },
    modalClass: "spurving-modal",
    lineAnchor: "top",
    line2D: { startX: 100, startY: 220, endX: 60, endY: 100 },
  },
  {
    name: "Ambifacient Lunar Waneshaft",
    desc: "Transmits inverse reactive current to the 'up' end of the cardinal grammeters with minimal loss.",
    rotation: [0.2, -Math.PI / 3, 0.1],
    cameraTarget: [0, 0, 0],
    cameraPos: [12, 6, 6],
    labelPos: { x: -2, y: 6, z: 0 }, // fix: move labelPos up for visibility
    lineTo: { x: 80, y: 20, z: 130 },
    lineAnchor: "top",
    line2D: { startX: 180, startY: 120, endX: 250, endY: 60 },
  },
  {
    name: "Hydrocoptic Marzlevanes",
    desc: "Six marzlevanes fitted to optimize sinusoidal repleneration and reduce vibrational artifacts when employed in conjunction with a drawn reciprocation dingle arm.",
    rotation: [0.7, -0.9, 0.5],
    cameraTarget: [0, -3, 0],
    cameraPos: [0, -10, -12],
    labelPos: { x: 8, y: 8, z: -6 }, // fix: move labelPos to right and up
    lineTo: { x: 0, y: -2, z: -2 },
    modalClass: "marzlevanes-modal",
    lineAnchor: "bottom",
    line2D: { startX: 300, startY: 400, endX: 350, endY: 500 },
  },
  {
    name: "Lotus-o-Delta Main Winding",
    desc: "Panendermic semi-boloid slots house the main winding, enhancing differential girdle spring efficiency.",
    rotation: [0.2, Math.PI / 2, -0.2],
    cameraTarget: [0, 2, 0],
    cameraPos: [-8, 8, 8],
    labelPos: { x: 10, y: 0, z: 0 }, // fix: move labelPos to right
    lineTo: { x: 2, y: 0, z: 0 },
    modalClass: "lotus-modal",
    lineAnchor: "bottom",
    line2D: { startX: 400, startY: 300, endX: 500, endY: 350 },
  },
  {
    name: "Non-reversible Tremie Pipe",
    desc: "Connects every seventh conductor to the differential girdle spring, ensuring unidirectional flow.",
    rotation: [0.3, 0.2, 0],
    cameraTarget: [0, 0, 0],
    cameraPos: [7, 6, 14],
    labelPos: { x: -10, y: -2, z: 4 }, // fix: move labelPos left and down
    lineTo: { x: 1, y: -1, z: 1 },
    modalClass: "tremie-modal",
    lineAnchor: "bottom",
    line2D: { startX: 120, startY: 500, endX: 200, endY: 600 },
  },
  {
    name: "Cardinal Grammeters",
    desc: "Synchronizes the entire system, automatically adjusting for flourescent skor motion.",
    rotation: [0.1, 0.2, Math.PI / 2],
    cameraTarget: [0, 4, 0],
    cameraPos: [0, 14, 8],
    labelPos: { x: -10, y: 10, z: 0 }, // fix: move labelPos left and up
    lineTo: { x: -50, y: -51, z: -80 },
    modalClass: "grammeters-modal",
    lineAnchor: "bottom",
    line2D: { startX: 80, startY: 80, endX: 40, endY: 40 },
  },
];

// Responsive label positions for each stop
export const getResponsiveLabelPos = (stop, size) => {
  const isLandscape = size.width > size.height;

  // Debug positioning info
  console.log("getResponsiveLabelPos:", {
    stopName: stop.name,
    width: size.width,
    height: size.height,
    isLandscape,
  });

  // Handle mobile landscape specifically - move labels to better positions
  if (size.width < 800 && isLandscape) {
    // This is for landscape orientation on mobile/small screens
    const mobileLandscapePositions = {
      // Start (index 0)
      0: { x: 0, y: -30, z: 0 }, // Move up even more in Y-axis for better visibility
      // Panametric Fan (index 1)
      1: { x: 10, y: -30, z: 0 }, // Move up even more in Y-axis
      // Spurving Bearings (index 2)
      2: { x: -10, y: -30, z: 0 }, // Move up even more in Y-axis
      // Ambifacient Lunar Waneshaft (index 3)
      3: { x: -2, y: -30, z: 0 }, // Move up even more in Y-axis
      // Hydrocoptic Marzlevanes (index 4)
      4: { x: 8, y: -30, z: -6 }, // Move up even more in Y-axis
      // Lotus-o-Delta Main Winding (index 5)
      5: { x: 10, y: -30, z: 0 }, // Move up even more in Y-axis
      // Non-reversible Tremie Pipe (index 6)
      6: { x: -10, y: -30, z: 4 }, // Move up even more in Y-axis
      // Cardinal Grammeters (index 7)
      7: { x: -10, y: -30, z: 0 }, // Move up even more in Y-axis
    };

    // Get the stop index if it exists in the custom positions
    const stopIndex = STOPS.findIndex(
      (s) => s.name === stop.name || JSON.stringify(s) === JSON.stringify(stop)
    );

    console.log("Mobile landscape position:", {
      stopIndex,
      foundPosition:
        stopIndex >= 0 ? mobileLandscapePositions[stopIndex] : null,
    });

    if (stopIndex >= 0 && mobileLandscapePositions[stopIndex]) {
      return mobileLandscapePositions[stopIndex];
    }
  }

  // Example breakpoints (customize as needed)
  if (size.width < 600) {
    // Mobile: move labels further out, higher/lower, or shrink
    return stop.labelPosMobile || stop.labelPos || { x: 0, y: 0, z: 0 };
  } else if (size.width < 1000) {
    // Tablet: slightly different
    return stop.labelPosTablet || stop.labelPos || { x: 0, y: 0, z: 0 };
  } else {
    // Desktop
    return stop.labelPos || { x: 0, y: 0, z: 0 };
  }
};

export default STOPS;
