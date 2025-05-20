import React from "react";

function ModelLabel({
  label,
  desc,
  isStart,
  isPanametric,
  modalRef,
  modalClass,
}) {
  let className = "model-label-overlay";
  if (isStart) className += " start-modal";
  if (isPanametric) className += " panametric-modal";
  if (modalClass) className += ` ${modalClass}`;
  return (
    <div className={className} ref={modalRef}>
      <div className="model-label-title">{label}</div>
      <div className="model-label-desc">{desc}</div>
    </div>
  );
}

export default ModelLabel;
