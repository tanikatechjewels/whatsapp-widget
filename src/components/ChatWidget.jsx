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

    // Setting up tooltip and notification after 2 seconds
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
    return () => clearInterval(interval);
  }, []);

  // Auto-opening the chat after 3 seconds if config.autoOpenChat is true
  useEffect(() => {
    if (config && config.autoOpenChat) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [config]);

  const handleButtonClick = () => {
    setIsOpen((prev) => !prev);
    setShowTooltip(false);
    setNotification(0);
  };

  const getChatBoxPosition = () => {
    if (config?.floatingButton?.alignment === "right") {
      return { right: "10px", left: "auto" };
    } else {
      return { left: "10px", right: "auto" };
    }
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
            style={{ width: "34px", marginRight: "10px" }}
          />
          <span
            style={{
              color: config.floatingButton.textColor,
              whiteSpace: "nowrap",
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

  if (!config) return null;

  return (
    <div className="chat-container">
      {/* Fixed container for the button and tooltip */}
      <div
        style={{
          position: "fixed",
          [config.floatingButton.alignment]: "10px",
          bottom: "10px",
          zIndex: 9999,
        }}
      >
        <div style={{ position: "relative", display: "inline-block" }}>
          <button
            ref={whatsappButtonRef}
            className={`main-button ${
              config.floatingButton.display === "logo"
                ? "circle-button"
                : "full-button"
            } animate-bounce`}
            onClick={handleButtonClick}
            style={{
              backgroundColor: config.floatingButton.bgColor,
              fontFamily: config.floatingButton.fontFamily,
              // Now use relative positioning so the tooltip is positioned relative to this button
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width:
                config.floatingButton.display === "logo" ? "50px" : "auto",
              height:
                config.floatingButton.display === "logo" ? "50px" : "auto",
              padding:
                config.floatingButton.display === "logo"
                  ? "0px"
                  : "10px 15px",
              borderRadius:
                config.floatingButton.display === "logo" ? "50%" : "100px",
              fontSize: config.floatingButton.display === "logo" ? "0" : "16px",
              fontWeight: "bold",
              textDecoration: "none",
              color: config.floatingButton.textColor,
              transition: "background 0.3s ease-in-out",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
              border: "none",
              minWidth:
                config.floatingButton.display === "text" ? "auto" : "50px",
              maxWidth: "250px",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
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
            <Tooltip
              config={config.tooltip}
              showTooltip={showTooltip}
              position="right" // Tooltip appears to the right of the button
            />
          )}
        </div>
      </div>
      <div
        ref={chatWrapperRef}
        className={`chat-wrapper ${isOpen ? "open" : "close"}`}
        style={{
          backgroundImage: `url(${config.chatBox.bgImage})`,
          backgroundSize: "cover",
          fontFamily: config.chatBox.fontFamily,
          position: "fixed",
          bottom: "80px",
          ...getChatBoxPosition(),
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        {/* Chat Header */}
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
              <p className="status-message">{config.chatHeader.statusMessage}</p>
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