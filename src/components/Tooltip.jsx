import React, { useEffect, useState, useRef } from "react";

const Tooltip = ({ config = {}, showTooltip, position = "right" }) => {
  const tooltipRef = useRef(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  useEffect(() => {
    if (tooltipRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      if (position === "right" && tooltipRect.right > window.innerWidth) {
        setAdjustedPosition("left");
      } else if (position === "left" && tooltipRect.left < 0) {
        setAdjustedPosition("right");
      }
    }
  }, [showTooltip, position]);

  if (!showTooltip) return null;

  const {
    text = "Chat!",
    bgColor = "#000",
    textColor = "#fff",
    fontSize = "12px",
    fontFamily = "Arial",
    padding = "4px 8px",
    borderRadius = "3px",
    boxShadow = "0px 2px 4px rgba(0, 0, 0, 0.2)",
    arrowSize = 6, // Adjusted arrow size
  } = config;

  const tooltipStyle = {
    position: "absolute",
    backgroundColor: bgColor,
    color: textColor,
    fontSize,
    fontFamily,
    padding,
    borderRadius,
    whiteSpace: "nowrap",
    zIndex: 1000,
    top: "50%",
    transform: "translateY(-50%)",
    boxShadow,
    ...(adjustedPosition === "right"
      ? { left: "calc(100% + 4px)", right: "auto" } // Reduced gap
      : { right: "calc(100% + 4px)", left: "auto" }),
  };

  const arrowStyle = {
    content: '""',
    position: "absolute",
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderWidth: `${arrowSize}px`,
    top: "50%",
    transform: "translateY(-50%)",
    ...(adjustedPosition === "right"
      ? {
          left: `-${arrowSize * 2}px`,
          borderColor: `transparent ${bgColor} transparent transparent`,
        }
      : {
          right: `-${arrowSize * 2}px`,
          borderColor: `transparent transparent transparent ${bgColor}`,
        }),
  };

  return (
    <div ref={tooltipRef} style={tooltipStyle}>
      <div style={arrowStyle}></div>
      {text}
    </div>
  );
};

export default Tooltip;
