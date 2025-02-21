import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Tooltip from "./Tooltip";
import "../styles.css";

const ChatWidget = () => {
  const [config, setConfig] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [notification, setNotification] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messageContent, setMessageContent] = useState("");

  const whatsappButtonRef = useRef(null);
  const chatWrapperRef = useRef(null);

  useEffect(() => {
    // Fetching configuration data
    axios
      .get("/config.json")
      .then((res) => setConfig(res.data))
      .catch((err) => console.error("Error loading config:", err));

    // Setting up tooltips and notification
    setTimeout(() => setShowTooltip(true), 2000);
    setTimeout(() => setNotification(1), 2000);

    // Updating current time every minute
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval); // Cleanup interval on unmount
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
  const getTooltipPosition = () => {
    if (!config) return {};
    return config.floatingButton.alignment === "right"
      ? { right: "60px", left: "auto" }
      : { left: "60px", right: "auto" };
  };

  const getTooltipArrow = () => {
    return config?.floatingButton.alignment === "right"
      ? "tooltip-arrow-right"
      : "tooltip-arrow-left";
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

  const getChatBoxPosition = () => {
    if (config?.floatingButton?.alignment === "right") {
      return { right: "10px", left: "auto" };
    } else {
      return { left: "10px", right: "auto" };
    }
    return { top: 0, left: 0 };
  };
  
    
const renderButtonContent = () => {
  if (!config) return null;
  if (config.floatingButton.display === "both") {
    return (
      <>
        <img
          src={config.floatingButton.icon}
          alt="WhatsApp"
          className="wts-icon"
          style={{ width: "34px", marginRight: "10px" }} // Adjust icon size and spacing
        />
        <span
          style={{
            color: config.floatingButton.textColor,
            whiteSpace: "nowrap", // Prevents text wrapping
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          {config.floatingButton.buttonText}
        </span>
      </>
    );
  } else if (config.floatingButton.display === "text") {
    return (
      <span
        style={{    
          color: config.floatingButton.textColor,
          whiteSpace: "nowrap",
          fontSize: config.floatingButton.fontSize,
          fontWeight: "bold",
        }}
      >
        {config.floatingButton.buttonText}
      </span>
    );
  } else {
    return (
      <img
        src={config.floatingButton.icon}
        alt="WhatsApp"
        className="wts-icon"
        style={{ width: "30px" }}
      />
    );
  }
};

  
  if (!config) return null;
  
  return (
    <div className="chat-container">
    {/* Tooltip Component */}
    <Tooltip
      config={config.tooltip}
      showTooltip={showTooltip}
      position={config.floatingButton.alignment}
    />
      {/* Floating WhatsApp Button */}
      <div style={{ position: "relative" }}>
   <button
          ref={whatsappButtonRef}
          className={`main-button ${
            config.floatingButton.display === "logo" ? "circle-button" : "full-button"
          } animate-bounce`}
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
            width: config.floatingButton.display === "logo" ? "50px" : "auto", // Fixed size for logo, auto for text
            height: config.floatingButton.display === "logo" ? "50px" : "auto", // Fixed size for logo, auto for text
            padding: config.floatingButton.display === "logo" ? "0px" : "10px 15px", // Different padding for logo-only and logo+text
            borderRadius: config.floatingButton.display === "logo" ? "50%" : "100px", // Circle for logo, rounded for text
            fontSize: config.floatingButton.display === "logo" ? "0" : "16px", // Hide text for logo-only
            fontWeight: "bold",
            textDecoration: "none",
            buttonText:config.floatingButton.buttonText,
            color: config.floatingButton.textColor,
            transition: "background 0.3s ease-in-out",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // Adding shadow for better visibility
            cursor: "pointer",
            border: "none",
            minWidth: config.floatingButton.display === "text" ? "auto" : "50px",
            maxWidth:"250px",
            textOverflow: "ellipsis",
            whiteSpace:"nowrap",
            zIndex:9999,
            
          }}
          
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {renderButtonContent()}
          {notification > 0 && (
            <div className="notification-bubble">{notification}</div>
          )}
        </button>
  </div>
      <div
        ref={chatWrapperRef}
        className={`chat-wrapper ${isOpen ? "open" : "close"}`}
        style={{
          backgroundImage: `url(${config.chatBox.bgImage})`,
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
              <img src={config.chatHeader.image} alt="Support" />
            </div>
            <div>
              <h3>{config.chatHeader.title}</h3>
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
              src={config.floatingButton.icon}
              alt="WhatsApp"
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
  



