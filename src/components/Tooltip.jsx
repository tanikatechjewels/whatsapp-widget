import React, { useEffect, useState, useRef } from "react";

const Tooltip = ({ config, showTooltip, position = "right", buttonSize = "small" }) => {
  const tooltipRef = useRef(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  useEffect(() => {
    if (tooltipRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      if (position === "right" && tooltipRect.right > window.innerWidth) {
        setAdjustedPosition("left"); // If overflowing, switch to left
      } else if (position === "left" && tooltipRect.left < 0) {
        setAdjustedPosition("right"); // If overflowing on left, switch to right
      }
    }
  }, [showTooltip, position]);

  if (!showTooltip) return null;

  // Dynamic styling based on config
  const sizeAdjustment = buttonSize === "big" ? 20 : 10; // Adjust based on button size
  const tooltipStyle = {
    position: "absolute",
    backgroundColor: config?.bgColor || "#000",
    color: config?.textColor || "#fff",
    fontSize: config?.fontSize || "14px",
    fontFamily: config?.fontFamily || "Arial, sans-serif",
    padding: config?.padding || "8px 12px",
    borderRadius: config?.borderRadius || "5px",
    whiteSpace: "nowrap",
    zIndex: 1000,
    top: "50%",
    transform: "translateY(-50%)",
    maxWidth: config?.maxWidth || "200px",
    ...(adjustedPosition === "right"
      ? { left: `calc(100% + ${sizeAdjustment}px)`, right: "auto" }
      : { right: `calc(100% + ${sizeAdjustment}px)`, left: "auto" }),
    boxShadow: config?.boxShadow || "0px 4px 8px rgba(0, 0, 0, 0.2)",
  };

  // Dynamic Arrow Styling
  const arrowSize = config?.arrowSize || 6;
  const arrowStyle = {
    content: '""',
    position: "absolute",
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderWidth: `${arrowSize}px`,
    top: "50%",
    transform: "translateY(-50%)",
    marginTop: "-1px", // Removes the gap between arrow and tooltip box
    ...(adjustedPosition === "right"
      ? {
          left: `-${arrowSize * 2}px`,
          borderColor: `transparent ${config?.bgColor || "#000"} transparent transparent`,
        }
      : {
          right: `-${arrowSize * 2}px`,
          borderColor: `transparent transparent transparent ${config?.bgColor || "#000"}`,
        }),
  };

  return (
    <div ref={tooltipRef} style={tooltipStyle}>
      <div style={arrowStyle}></div>
      {config?.text || "Chat with us on WhatsApp!"}
    </div>
  );
};

export default Tooltip;
