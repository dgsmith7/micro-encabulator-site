import React, { useEffect } from "react";

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
}) {
  // We're not using isLandscape directly anymore since we get orientation info from props
  // but we keep the resize listener to potentially handle other dimension changes
  useEffect(() => {
    const handleResize = () => {
      // Just update if viewport size changes significantly
      // This could be enhanced later if needed
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // For debugging
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

  // Manage label classes for responsive display
  let className = "model-label-overlay";
  if (isStart) className += " start-modal";
  if (isPanametric) className += " panametric-modal";
  if (modalClass) className += ` ${modalClass}`;

  // Add landscape class for devices in landscape mode
  const isLandscape =
    orientation === "l" ||
    (viewportSize && viewportSize.width > viewportSize.height);

  // Apply landscape styles for mobile devices in landscape or any device with low height
  if (
    (deviceType === "mobile" && isLandscape) ||
    (viewportSize && viewportSize.height < 500)
  ) {
    className += " landscape-mobile";
  }

  return (
    <div className={className} ref={modalRef}>
      <div className="model-label-title">{label}</div>
      <div className="model-label-desc">{desc}</div>
    </div>
  );
}

export default ModelLabel;
