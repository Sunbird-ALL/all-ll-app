import React, { useState } from 'react';
import './Mario.css';

const Mario = ({dragonPosition, marioPosition, gameOver}) => {

//   const handleDragonMove = () => {
//     if (!gameOver && dragonPosition > 0) {
//       const newDragonPosition = Math.max(dragonPosition - 10, 0);
//       setDragonPosition(newDragonPosition);
//       setMarioPosition(100 - newDragonPosition); // Adjust Mario's position accordingly
//       if (newDragonPosition === 0) {
//         alert('Dragon catches Mario! Game Over!');
//         setGameOver(true);
//       }
//       animateMario(); // Animate Mario's movement
//     }
//   };

  const progressStyle = {
    background: `linear-gradient(to right, #309b4e ${marioPosition}%, #ad1818 ${100 - dragonPosition}%)`
  };
  

  return (
    <div className="game-container">
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
