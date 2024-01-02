import React, { useState, useEffect } from 'react';
import './CharacterToWordMatchingGame.css';
const CharacterToWordMatchingGame = ({ sourceChars = [], targetWords = [], handleSuccess }) => {

  const [matchedPairs, setMatchedPairs] = useState([]);
  const [matchedWords, setMatchedWords] = useState([]);
  const [failStack, setFailStack] = useState([]);

  const handleDragStart = (e, char) => {
    e.dataTransfer.setData('text/plain', char);
  };

  const handleDrop = (e, targetWord) => {
    const draggedChar = e.dataTransfer.getData('text/plain');

    // Check if the dragged char is not already matched
    if (!matchedPairs.some(pair => pair.word === targetWord)) {
      // Check if the dropped char matches the target word
      if (targetWord.includes(draggedChar)) {
        setMatchedPairs((prevMatchedPairs) => [...prevMatchedPairs, { char: draggedChar, word: targetWord }]);
        setMatchedWords((prevMatchedWords) => [...prevMatchedWords, targetWord]);

        if (matchedWords.length >= (localStorage.getItem('contentPracticeLimit') || 5) - 1) {
          //alert('Success stack is full!');
          handleSuccess();
        }
      } else {
        setFailStack((prevFailStack) => [...prevFailStack, { char: draggedChar, word: targetWord }]);

        if (failStack.length >= (localStorage.getItem('contentPracticeLimit') || 5) - 1) {
          //alert('Fail stack is full!');
          handleSuccess();
        }
      }
    }
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  const renderSourceChars = () => {
    return sourceChars.map((char, index) => (
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

  const renderTargetWords = () => {
    return targetWords.map((word, index) => (
      <div
        key={index}
        className={`target-word ${matchedWords.includes(word.contentSourceData[0].text) ? 'matched-word' : ''}`}
        onDrop={(e) => handleDrop(e, word.contentSourceData[0].text)}
        onDragOver={allowDrop}
      >
        {word.contentSourceData[0].text}
      </div>
    ));
  };

  return (
    <div>
      <h1 className='game-header'>Character to Word Matching Game</h1>
      <div className="game-container">
        <div className="stacks-container">
          <div>pass:{matchedPairs.length}</div>
          <div>fail:{failStack.length}</div>
        </div>
        <div className="source-chars-container">{renderSourceChars()}</div>
        <div className="target-words-container">{renderTargetWords()}</div>
      </div>
      {/* <div className="matched-pairs-container">
        <h2>Matched Pairs:</h2>
        {matchedPairs.map((pair, index) => (
          <div key={index} className="matched-pair stack-item success">
            <span className="char">{pair.char}</span> - <span className="word">{pair.word}</span>
          </div>
        ))}
      </div>
      <div className="fail-stack-container">
        <h2>Fail Stack:</h2>
        {failStack.map((failedWord, index) => (
          <div key={index} className="stack-item fail">
            {failedWord}
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default CharacterToWordMatchingGame;