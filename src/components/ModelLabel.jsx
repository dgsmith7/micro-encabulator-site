import React, { useEffect } from "react";

/**
 * Overlay label/modal for each stop, positioned responsively.
 * Handles special classes for start, panametric, and landscape modes.
 */
function ModelLabel({
  label,
  desc,
  isStart,
  isPanametric,
  modalRef,
  modalClass,
  deviceType,
  orientation,
  viewportSize,
  labelPos,
  fade = 1,
}) {
  // Resize listener is kept for possible future enhancements
  useEffect(() => {
    const handleResize = () => {
      // Placeholder for future responsive logic
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Debug logging for development
  useEffect(() => {
    console.log("ModelLabel rendering:", {
      deviceType,
      orientation,
      viewportSize,
      labelPos,
      isStart,
      modalClass,
    });
  }, [deviceType, orientation, viewportSize, labelPos, isStart, modalClass]);

  // Build className string for modal overlay
  let className = "model-label-overlay";
  if (isStart) className += " start-modal";
  if (isPanametric) className += " panametric-modal";
  if (modalClass) className += ` ${modalClass}`;

  // Add landscape class for mobile devices in landscape or short screens
  const isLandscape =
    orientation === "l" ||
    (viewportSize && viewportSize.width > viewportSize.height);
  if (
    (deviceType === "mobile" && isLandscape) ||
    (viewportSize && viewportSize.height < 500)
  ) {
    className += " landscape-mobile";
  }

  return (
    <div className={`${className} ${!fade ? "fade-out" : ""}`} ref={modalRef}>
      <div className="model-label-title">{label}</div>
      <div className="model-label-desc">{desc}</div>
    </div>
  );
}

export default ModelLabel;
