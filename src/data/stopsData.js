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
    line2DMobilePortrait: { startX: 200, startY: 600, endX: 210, endY: 400 },
    line2DMobileLandscape: { startX: 550, startY: 230, endX: 390, endY: 200 },
    line2DTabletPortrait: { startX: 230, startY: 820, endX: 420, endY: 530 },
    line2DTabletLandscape: { startX: 260, startY: 580, endX: 520, endY: 400 },
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
    line2DMobilePortrait: { startX: 200, startY: 600, endX: 180, endY: 400 },
    line2DMobileLandscape: { startX: 260, startY: 230, endX: 370, endY: 200 },
    line2DTabletPortrait: { startX: 230, startY: 820, endX: 360, endY: 480 },
    line2DTabletLandscape: { startX: 260, startY: 580, endX: 490, endY: 390 },
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
    line2DMobilePortrait: { startX: 200, startY: 520, endX: 280, endY: 410 },
    line2DMobileLandscape: { startX: 380, startY: 230, endX: 500, endY: 210 },
    line2DTabletPortrait: { startX: 400, startY: 790, endX: 500, endY: 500 },
    line2DTabletLandscape: { startX: 540, startY: 550, endX: 660, endY: 400 },
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
    lineAnchor: "left",
    line2D: { startX: 300, startY: 400, endX: 350, endY: 500 },
    line2DMobilePortrait: { startX: 200, startY: 570, endX: 210, endY: 420 },
    line2DMobileLandscape: { startX: 570, startY: 220, endX: 400, endY: 200 },
    line2DTabletPortrait: { startX: 550, startY: 790, endX: 390, endY: 500 },
    line2DTabletLandscape: { startX: 800, startY: 540, endX: 560, endY: 410 },
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
    lineAnchor: "left",
    line2D: { startX: 400, startY: 300, endX: 500, endY: 350 },
    line2DMobilePortrait: { startX: 200, startY: 600, endX: 210, endY: 410 },
    line2DMobileLandscape: { startX: 570, startY: 230, endX: 420, endY: 210 },
    line2DTabletPortrait: { startX: 550, startY: 820, endX: 400, endY: 520 },
    line2DTabletLandscape: { startX: 800, startY: 580, endX: 540, endY: 400 },
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
    lineAnchor: "right",
    line2D: { startX: 120, startY: 500, endX: 200, endY: 600 },
    line2DMobilePortrait: { startX: 200, startY: 600, endX: 220, endY: 430 },
    line2DMobileLandscape: { startX: 240, startY: 240, endX: 420, endY: 230 },
    line2DTabletPortrait: { startX: 220, startY: 820, endX: 440, endY: 520 },
    line2DTabletLandscape: { startX: 240, startY: 580, endX: 580, endY: 430 },
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
    lineAnchor: "top",
    line2D: { startX: 80, startY: 80, endX: 40, endY: 40 },
    line2DMobilePortrait: { startX: 200, startY: 600, endX: 150, endY: 460 },
    line2DMobileLandscape: { startX: 460, startY: 240, endX: 340, endY: 260 },
    line2DTabletPortrait: { startX: 550, startY: 820, endX: 320, endY: 570 },
    line2DTabletLandscape: { startX: 760, startY: 580, endX: 440, endY: 460 },
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
