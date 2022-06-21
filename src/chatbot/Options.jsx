import React from 'react';

export default function Options({
  messageContent,
  username,
  changeStyle,
  handleResolve,
  handleUnresolve,
  style,
  setShowOption,
}) {
  return (
    <div className="main-cont">
      <div id={username !== messageContent?.author && style}>
        <div className="answered">
          <p> ጥያቄዎ ተመልሷል?</p>
        </div>
        <div className="twobuttons">
          <div
            className="agreebutton"
            onClick={() => {
              //   changeStyle();
              handleResolve();
              setShowOption(false);
            }}
          >
            አዎ
          </div>
          <div className="line"></div>
          <div
            className="agreebutton"
            onClick={() => {
              //   changeStyle();
              setShowOption(false);
              handleUnresolve();
            }}
          >
            አይ
          </div>
        </div>
      </div>
    </div>
  );
}