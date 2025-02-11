import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles.css";

const ChatWidget = () => {
  const [config, setConfig] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [notification, setNotification] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [isTyping, setIsTyping] = useState(false); // Typing state for bot
  const [messageContent, setMessageContent] = useState(""); // Bot message content

  useEffect(() => {
    axios
      .get("/config.json")
      .then((res) => setConfig(res.data))
      .catch((err) => console.error("Error loading config:", err));

    setTimeout(() => {
      setShowTooltip(true);
    }, 3000);

    setTimeout(() => {
      setNotification(1);
    }, 3000);

    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
    setShowTooltip(false);
    setNotification(0);
  };

  // Simulate bot typing
  useEffect(() => {
    if (isOpen) {
      setIsTyping(true);
      setTimeout(() => {
        setMessageContent(config.chatBox.messageContent);
        setIsTyping(false); // Bot stops typing after a delay
      }, 2000); // Adjust the delay to simulate typing time
    }
  }, [isOpen]);

  if (!config) return null;

  return (
    <div className="chat-container">
      {/* Floating WhatsApp Button */}
      <div style={{ position: "relative" }}>
        <button
          className="main-button animate-bounce"
          onClick={handleButtonClick}
          style={{
            backgroundColor: config.floatingButton.bgColor,
            fontFamily: config.floatingButton.fontFamily,
          }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <img src={config.floatingButton.icon} alt="Chat" className="wts-icon" />

          {notification > 0 && (
            <div className="notification-bubble">
              {notification}
            </div>
          )}
        </button>

        {/* Tooltip */}
        {showTooltip && (
          <div
            className="tooltip"
            style={{
              backgroundColor: config.tooltip.bgColor,
              color: config.tooltip.textColor,
              fontFamily: config.tooltip.fontFamily,
            }}
          >
            {config.tooltip.text}
          </div>
        )}
      </div>

      {/* Chat Box */}
      <div
        className={`chat-wrapper ${isOpen ? "open" : "close"}`}
        style={{
          backgroundImage: `url(${config.chatBox.bgImage})`,
          backgroundSize: "cover",
          fontFamily: config.chatBox.fontFamily,
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
              <p className="status-message">{config.chatHeader.statusMessage}</p>
            </div>
          </div>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            ✖
          </button>
        </div>

        {/* Chat Messages */}
        <div className="chat-messages">
          <div className="user-message" style={{ fontFamily: config.chatBox.fontFamily }}>
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
            <div className="bot-message" style={{ fontFamily: config.chatBox.fontFamily }}>
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
            <img src={config.floatingButton.icon} alt="WhatsApp" className="wts-button-icon" />
            {config.whatsappButton.buttonText}
          </a>
          <span className="powered-text" style={{ fontFamily: config.poweredBy.fontFamily }}>
            {config.poweredBy.poweredText}&nbsp;
            <a
              href={config.poweredBy.jweroText}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: config.poweredBy.jweroColor, textDecoration: "none", fontWeight: "bold" }}
            >
              Jwero.ai🚀
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
