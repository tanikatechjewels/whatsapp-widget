import React from "react";

const Tooltip = ({ config, showTooltip, position }) => {
  if (!showTooltip) return null;

  const tooltipStyle = {
    position: "absolute",
    backgroundColor: config.bgColor || "#000",
    color: config.textColor || "#fff",
    padding: "5px 10px",
    borderRadius: "5px",
    fontSize: config.fontSize || "14px",
    whiteSpace: "nowrap",
    zIndex: 1000,
    transform: position === "left" ? "translateX(-100%)" : "translateX(100%)",
    top: "50%",
    [position]: "60px", // Adjust distance from button
  };

  const arrowStyle = {
    content: '""',
    position: "absolute",
    width: "0",
    height: "0",
    borderStyle: "solid",
    borderWidth: "5px",
    borderColor: position === "left"
      ? `transparent ${config.bgColor || "#000"} transparent transparent`
      : `transparent transparent transparent ${config.bgColor || "#000"}`,
    top: "50%",
    transform: "translateY(-50%)",
    [position === "left" ? "right" : "left"]: "-10px",
  };

  return (
    <div style={tooltipStyle}>
      <div style={arrowStyle}></div>
      {config.text || "Chat with us on WhatsApp!"}
    </div>
  );
};

export default Tooltip;
