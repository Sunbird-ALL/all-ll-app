import React, { useState } from 'react';
import './SpellAndCheck.css';

const SpellAndCheck = ({ targetWords = [], handleSuccess }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [matchedChars, setMatchedChars] = useState([]);
  const [failStack, setFailStack] = useState([]);

  const currentWord = targetWords[currentWordIndex];
  const wordChars = currentWord.contentSourceData[0].text.split('');

  const handleDragStart = (e, char) => {
    e.dataTransfer.setData('text/plain', char);
  };

  const handleDrop = (e, char) => {
    const draggedChar = e.dataTransfer.getData('text/plain');

    if (draggedChar === char) {
      setMatchedChars(prevMatchedChars => [...prevMatchedChars, char]);

      if (matchedChars.length === currentWord.contentSourceData[0].text.length - 1) {
        handleSuccess(function(){
          handleNextWord()
        });
      }
    } else {
      setFailStack(prevFailStack => [...prevFailStack, char]);
    }
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  const handleNextWord = () => {
    setCurrentWordIndex(prevIndex => prevIndex + 1);
    setMatchedChars([]);
    setFailStack([]);
  };

  const renderSourceChars = () => {
    return wordChars.map((char, index) => (
      <div
        key={index}
        className="source-char"
        draggable
        onDragStart={(e) => handleDragStart(e, char)}
      >
        {char}
      </div>
    ));
  };

  const renderTargetChars = () => {
    return wordChars.map((char, index) => (
      <div
        key={index}
        className={`target-char ${matchedChars.includes(char) ? 'matched-char' : ''}`}
        onDrop={(e) => handleDrop(e, char)}
        onDragOver={allowDrop}
      >
        {matchedChars.includes(char) ? <div className="filled-box" >{char}</div> : <div className="empty-box" />}
      </div>
    ));
  };

  return (
    <div>
      <h1 className='game-header'>Spell and Speak</h1>
      <div className="game-container">
        {/* <h1>{currentWord.contentSourceData[0].text}</h1> */}
        <div className="source-chars-container">{renderSourceChars()}</div>
        <div className="target-words-container">
          {/* <div className="target-word">{currentWord.contentSourceData[0].text}</div> */}
          <div className="target-chars-container">{renderTargetChars()}</div>
        </div>
      </div>
      {/* <button onClick={handleNextWord} disabled={currentWordIndex === targetWords.length - 1}>Next</button> */}
    </div>
  );
};

export default SpellAndCheck;
