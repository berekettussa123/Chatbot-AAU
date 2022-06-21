import React, { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

export default function MapImage({
  messageContent,
  handleShow,
  currentImage,
  forImage,
  handleShowImage
}) {
  return (
    <div
      onClick={handleShow}
      className={forImage && 'imageCont imageContClicked'}
      id="cimage"
    >
      {/* <TransformWrapper defaultScalex={2} defaultPositionX={500} defaultPositionY={500}>
        <TransformComponent> */}
          <img
            style={{
              zIndex:'10000000000000',
              objectFit: 'contain',
            }}
            onClick={handleShowImage}
            src={messageContent}
            alt=""
            id="miage"
            className="mapImage"
          />
        {/* </TransformComponent>
      </TransformWrapper> */}
    </div>
  );
}
