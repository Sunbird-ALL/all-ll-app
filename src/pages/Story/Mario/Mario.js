import React, { useState } from 'react';
import './Mario.css';

const Mario = ({dragonPosition, marioPosition, gameOver}) => {

  const progressStyle = {
    background: `linear-gradient(to right, #309b4e ${marioPosition}%, #ad1818 ${100 - dragonPosition}%)`
  };
  

  return (
    <div className="mario-game-container">
      <div className="progress-bar" style={progressStyle}>
        <div className="start-icon">📍</div>
        <div className="dragon-progress" style={{ left: `${dragonPosition}%` }}></div>
        <div className="mario-progress" style={{ left: `${marioPosition}%` }}></div>
        <div className="end-icon">🚩</div>
      </div>
    </div>
  );
};

export default Mario;
