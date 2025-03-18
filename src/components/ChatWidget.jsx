import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles.css";

const ChatWidget = ({ apikey
  
}) => {
  const [config, setConfig] = useState(null);
  console.log(config)
  const [isOpen, setIsOpen] = useState(false);
  const [notification, setNotification] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messageContent, setMessageContent] = useState("");

  const whatsappButtonRef = useRef(null);
  const chatWrapperRef = useRef(null);
  useEffect(() => {
  const fetchStoreInfo = axios.get("https://api.jwero.com/settings/store_info", {
    headers: {
      "apikey": apikey, // Replace with actual API key

    },
  });

  const fetchConfigJson = axios.get("public/config.json"); // Correct path for public folder

  Promise.all([fetchStoreInfo, fetchConfigJson])
    .then(([storeRes, configRes]) => {
      setConfig({
        storeInfo: storeRes?.data?.data || {}, // Ensure it doesn't break if empty
        configJson: configRes?.data || {}, // Ensure it doesn't break if empty
        ...configRes?.data || {}
      });

    })
    .catch((err) => console.error("Error loading data:", err));

  // Setting up tooltips and notifications
  const tooltipTimeout = setTimeout(() => {
    setShowTooltip(true);
    setNotification(1);
  }, 2000);

  // Updating current time every minute
  const updateTime = () => {
    setCurrentTime(
      new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  updateTime(); // Set initial time
  const interval = setInterval(updateTime, 60000);

  return () => {
    clearInterval(interval); // Cleanup interval on unmount
    clearTimeout(tooltipTimeout); // Cleanup timeout on unmount
  };
}, []);

  
  

  // Auto-opening the chat after 3 seconds if config.autoOpenChat is true
  useEffect(() => {
    if (config && config.autoOpenChat) {
      const timer = setTimeout(() => {
        setIsOpen(true);  // Set state to open chat
      }, 3000); // Delay of 3 seconds

      return () => clearTimeout(timer); // Cleanup the timer on unmount or config change
    }
  }, [config]);

  const handleButtonClick = () => {
    setIsOpen((prev) => !prev);
    setShowTooltip(false);
    setNotification(0);
  };

  // Simulate bot typing
  useEffect(() => {
    if (isOpen && config) {
      setIsTyping(true);
      setTimeout(() => {
        setMessageContent(config.chatBox.messageContent);
        setIsTyping(false);
      }, 2000);
    }
  }, [isOpen, config]);

  const getTooltipPosition = () => {
    if (whatsappButtonRef.current) {
      const buttonRect = whatsappButtonRef.current.getBoundingClientRect();
      if (config.floatingButton.alignment === "right") {
        return {
          top: buttonRect.top + 5,
          left: buttonRect.left - 90,
        };
      } else {
        return {
          top: buttonRect.top + 5,
          left: buttonRect.left + 58,
        };
      }
    }
    return { top: 0, left: 0 };
  };

  const getChatBoxPosition = () => {
    if (whatsappButtonRef.current && chatWrapperRef.current) {
      if (config.floatingButton.alignment === "right") {
        return { right: "10px", left: "auto" };
      } else {
        return { left: "10px", right: "auto" };
      }
    }
    return { top: 0, left: 0 };
  };

  const renderButtonContent = () => {
    if (config.floatingButton.display === "both") {
      return (
        <>
          <img
            src={config.floatingButton.icon}
            alt="WhatsApp"
            className="wts-icon"
            style={{ width: "24px", marginRight: "10px" }} // Adjust icon size and spacing
          />
          <span>{config.whatsappButton.buttonText}</span>
        </>
      );
    } else {
      return (
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/479px-WhatsApp.svg.png"
          alt="WhatsApp"
          //className="wts-icon"
          style={{ width: "35px" }} // Adjust icon size for logo only
        />
      );
    }
  };

  if (!config) return null;

  return (
    <div className="chat-container">
      {/* Floating WhatsApp Button */}
      <div style={{ position: "relative" }}>
        <button
          ref={whatsappButtonRef}
          className={`main-button ${config.floatingButton.display === "logo" ? "logo-only" : "logo-with-text"} animate-bounce`} //aaaaaaaaa
          onClick={handleButtonClick}
          style={{
            backgroundColor: config.floatingButton.bgColor,
            fontFamily: config.floatingButton.fontFamily,
            position: "fixed",
            [config.floatingButton.alignment]: "10px", // Dynamic positioning based on config
            bottom: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0px", // Space between icon and text
            width: "auto", // Allow width to adjust based on content
            padding: config.floatingButton.display === "logo" ? "10px" : "15px 20px", // Different padding for logo-only and logo+text
            fontSize: config.floatingButton.display === "logo" ? "0" : "16px", // No font size for logo-only
            fontWeight: "bold",
            borderRadius: "100px",
            textDecoration: "none",
            background: "#25d366", // WhatsApp green
            color: "white",
            transition: "background 0.3s ease-in-out",
          }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {renderButtonContent()}
          {notification > 0 && (
            <div className="notification-bubble">{notification}</div>
          )}
        </button>

        {showTooltip && (
          <div
            className="tooltip"
            style={{
              position: "fixed",
              fontSize: "12px",
              top: `${getTooltipPosition().top}px`,
              left: `${getTooltipPosition().left}px`,
              backgroundColor: config.tooltip.bgColor,
              color: config.tooltip.textColor,
              fontFamily: config.tooltip.fontFamily,
              padding: "8px 15px",
              borderRadius: "8px",
              boxShadow: "-5px 4px 6px rgba(0, 0, 0, 0.2)",
              zIndex: 999,
              whiteSpace: "nowrap",
              transition: "opacity 0.3s ease-in-out",
            }}
          >
            <div
              className="tooltip-arrow"
              style={{
                position: "absolute",
                top: "10px", // Adjusted to make it closer to the tooltip
                left: config.floatingButton.alignment === "right" ? "auto" : "5px", // Positioning based on alignment
                right: config.floatingButton.alignment === "left" ? "auto" : "-4.8px", // Positioning based on alignment
                borderLeft: config.floatingButton.alignment === "right" ? "5px solid transparent" : "none",  // Arrow pointing left
                borderRight: config.floatingButton.alignment === "right" ? "5px solid transparent" : "none",  // Arrow pointing right
                borderTop: "5px solid " + config.tooltip.bgColor,  // Creating the arrow pointing up
                borderBottom: "5px", // Ensure bottom arrow doesn't appear
              }}
            ></div>
            {config.tooltip.text}
          </div>
        )}
      </div>
        
      <div
        ref={chatWrapperRef}
        className={`chat-wrapper ${isOpen ? "open" : "close"}`}
        style={{
          backgroundImage: config.chatBox.bgImage,
          backgroundSize: "cover",
          fontFamily: config.chatBox.fontFamily,
          position: "fixed",
          bottom: "80px", // Adjust based on button size
          ...getChatBoxPosition(), // Ensure chat box follows button position
        }}
      >
        <div
          className="header"
          style={{
            backgroundColor: config.chatHeader.bgColor,
            color: config.chatHeader.textColor,
            fontFamily: config.chatHeader.fontFamily,
          }}
        >
          <div className="content-wrapper">
            <div className="img-wrapper">
              <img src={config.storeInfo?.store_icon} alt="Support" />
            </div>
            <div>
              <h3>{config.storeInfo?.store_name}</h3>
              <p className="status-message">
                {config.chatHeader.statusMessage}
              </p>
            </div>
          </div>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            ✖
          </button>
        </div>

        {/* Chat Messages */}
        <div className="chat-messages">
          <div
            className="user-message"
            style={{ fontFamily: config.chatBox.fontFamily }}
          >
            <p>{config.chatBox.messageTitle} 👋</p>
            <span className="message-time">{currentTime}</span>
          </div>

          {isTyping ? (
            <div className="bot-message typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          ) : (
            <div
              className="bot-message"
              style={{ fontFamily: config.chatBox.fontFamily }}
            >
              <p>{messageContent}</p>
              <span className="message-time">{currentTime}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="footer-wts">
          <a
            href={`https://wa.me/${config.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="wts-button"
            style={{
              backgroundColor: config.whatsappButton.bgColor,
              color: config.whatsappButton.textColor,
              fontFamily: config.whatsappButton.fontFamily,
            }}
          >
            <img
              // src={config.floatingButton.icon}
              alt="WhatsApp"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/479px-WhatsApp.svg.png"
              
              className="wts-button-icon"
            />
            {config.whatsappButton.buttonText}
          </a>
          <span
            className="powered-text"
            style={{ fontFamily: config.poweredBy.fontFamily }}
          >
            {config.poweredBy.poweredText}&nbsp;
            <a
              href={config.poweredBy.jweroText}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: config.poweredBy.jweroColor,
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Jwero.ai
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;

