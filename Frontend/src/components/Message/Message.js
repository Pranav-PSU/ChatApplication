import React from 'react';

import './Message.css';

const Message = ({ message: { text, user }, name }) => {
  let isSentByCurrentUser = false;

  const trimmedName = name.trim().toLowerCase();

  if (user === trimmedName) {
    isSentByCurrentUser = true;
  }

  return isSentByCurrentUser ? (
    <div className="message-container justify-end">
      <p className="sent-text pr-10">{trimmedName}</p>
      <div className="message-box background-blue" id="own-message">
        <p className="message-text color-white">{text}</p>
      </div>
    </div>
  ) : (
    <div className="message-container justify-start">
      <div className="message-box background-light" id="others-message">
        <p className="message-text color-dark">{text}</p>
      </div>
      <p className="sent-text pl-10 ">{user}</p>
    </div>
  );
};

export default Message;
