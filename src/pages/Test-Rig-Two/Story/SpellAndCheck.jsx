import React, { useEffect, useState } from 'react';
import './SpellAndCheck.css';
import { splitGraphemes } from 'split-graphemes';
import Next from '../../../assests/Images/next.png';
import TryAgain from '../../../assests/Images/retry.svg';
import { Flex, HStack, Image, Img, Text, VStack } from '@chakra-ui/react';
import play from '../../../assests/Images/play-img.png';
import pause from '../../../assests/Images/pause-img.png';
import Speaker from '../../../assests/Images/Speaker.png';
import MuteSpeaker from '../../../assests/Images/speakerMute.png';

const SpellAndCheck = ({
  targetWords = [],
  handleSuccess,
  currentWordIndex,
  setCurrentWordIndex,
  nextLine,
  isNext,
  setIsNext,
  contentType,
  isUserSpeak,
  isAudioPlay,
  flag,
  playAudio,
  playTeacherAudio,
  pauseAudio,
  audioUrl,
}) => {
  const [matchedChars, setMatchedChars] = useState([]);
  const [failStack, setFailStack] = useState([]);
  const [isTryAgain, setIsTryAgain] = useState(false);

  const currentWord = targetWords[currentWordIndex];
  let wordChars = [];
  if (currentWord?.contentSourceData[0]?.text) {
    wordChars =
      contentType === 'word'
        ? splitGraphemes(currentWord?.contentSourceData[0]?.text).filter(
            item => item !== '‌' && item !== '' && item !== ' '
          )
        : currentWord?.contentSourceData[0]?.text
            .split(' ')
            .filter(item => item !== '‌' && item !== '' && item !== ' ');
  }
  const handleDragStart = (e, char) => {
    e.dataTransfer.setData('text/plain', char);
  };

  useEffect(() => {
    const filteredArr1Length = matchedChars.filter(element => element !== undefined).length;
    if (filteredArr1Length === wordChars.length) {
      // handleSuccess(handleNextWord);
      setIsNext(true);
      setIsTryAgain(true);
    }
  }, [matchedChars]);

  const handleDrop = (e, char) => {
    const draggedChar = e.dataTransfer.getData('text/plain');

    if (draggedChar === char) {
      setMatchedChars(prevMatchedChars => [...prevMatchedChars, char]);
    } else {
      setFailStack(prevFailStack => [...prevFailStack, char]);
    }
  };

  const allowDrop = e => {
    e.preventDefault();
  };

  const handleNextWord = () => {
    setCurrentWordIndex(prevIndex => prevIndex + 1);
    // nextLine();
    setMatchedChars([]);
    setFailStack([]);
  };

  const handleTryAgainWord = () => {
    setMatchedChars([]);
    setFailStack([]);
    setIsTryAgain(false);
    setIsNext(false);
  };

  const handleCharacterClick = index => {
    if (index === matchedChars.length) {
      const char = wordChars[index];
      const newMatchedChars = [...matchedChars];
      newMatchedChars[index] = char;
      setMatchedChars(newMatchedChars);
    }
  };

  const renderSourceChars = () => {
    return wordChars.map((char, index) => (
      <div
        key={index}
        className={`${
          matchedChars[index] ? 'source-char-disable' : 'source-char'
        }`}
        onClick={() =>
          matchedChars[index] ? null : handleCharacterClick(index)
        }
      >
        {char}
      </div>
    ));
  };

  const renderTargetChars = () => {
    return (
      wordChars &&
      wordChars.map((char, index) => (
        <div
          key={index}
          style={{ fontSize: '30px', textAlign: 'center' }}
          className={`target-char ${matchedChars[index] ? 'matched-char' : ''}`}
        >
          {matchedChars[index] ? (
            <div className="">{char}</div>
          ) : (
            <div className="empty-box" />
          )}
        </div>
      ))
    );
  };

  return (
    <div>
      <div>
        {isUserSpeak ? (
          isAudioPlay !== 'recording' && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <HStack
                style={{ display: 'flex' }}
                display={'flex'}
                alignItems="center"
                marginTop={'15px'}
              >
                <Flex gap={'2rem'} alignItems="center">
                  <div>
                    {flag ? (
                      <>
                        <img
                          className="play_btn"
                          src={play}
                          style={{ height: '72px', width: '72px' }}
                          onClick={() => playAudio()}
                          alt="play_audio"
                        />
                        <h4
                          className="text-play m-0 "
                          style={{
                            position: 'relative',
                            textAlign: 'center',
                          }}
                        >
                          Listen
                        </h4>
                      </>
                    ) : (
                      <>
                        <img
                          className="play_btn"
                          src={pause}
                          style={{ height: '72px', width: '72px' }}
                          onClick={() => pauseAudio()}
                          alt="pause_audio"
                        />
                        <h4
                          className="text-play m-0 "
                          style={{
                            position: 'relative',
                            textAlign: 'center',
                          }}
                        >
                          Pause
                        </h4>
                      </>
                    )}
                  </div>
                </Flex>
              </HStack>
            </div>
          )
        ) : (
          <div
            className="voice-recorder btn-absolute"
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <HStack gap={'2rem'}>
              {audioUrl !== ' '
                ? isAudioPlay !== 'recording' && (
                  <VStack>
                  <div>
                    {flag ? (
                      <>
                        <img
                          className="play_btn"
                          src={Speaker}
                          style={{
                            height: '72px',
                            width: '72px',
                          }}
                          onClick={() => playTeacherAudio()}
                          alt="play_audio"
                        />
                        <h4
                          className="text-play m-0 "
                          style={{
                            position: 'relative',
                            textAlign: 'center',
                          }}
                        >
                          Listen
                        </h4>
                      </>
                    ) : (
                      <>
                        <img
                          className="play_btn"
                          src={MuteSpeaker}
                          style={{
                            height: '72px',
                            width: '72px',
                          }}
                          onClick={() => pauseAudio()}
                          alt="pause_audio"
                        />
                        <h4
                          className="text-play m-0 "
                          style={{
                            position: 'relative',
                            textAlign: 'center',
                          }}
                        >
                          Mute
                        </h4>
                      </>
                    )}
                  </div>
                </VStack>
              )
                : ''}
            </HStack>
          </div>
        )}
      </div>
      {/* <h1 className='game-header'>Spell and Speak</h1> */}
      <div className="game-container">
        {/* <Text fontSize={45}>{currentWord.contentSourceData[0].text}</Text> */}
        <div className="target-words-container">
          {/* <div className="target-word">{currentWord.contentSourceData[0].text}</div> */}
          <div className="target-chars-container">{renderTargetChars()}</div>
        </div>
        <div className="source-chars-container">{renderSourceChars()}</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Flex
          visibility={isTryAgain ? 'visible' : 'hidden'}
          flexDirection={'column'}
          justifyContent={'center'}
          alignItems={'center'}
          textAlign={'center'}
          onClick={handleTryAgainWord}
        >
          <Image
            height={'52px'}
            width={'52px'}
            src={TryAgain}
            alt="Try Again"
            cursor={'pointer'}
          />
          <Text>Try Again</Text>
        </Flex>

        {isNext && (
          <Flex
            flexDirection={'column'}
            textAlign={'center'}
            alignItems={'center'}
            onClick={() =>
              isNext
                ? (handleSuccess(handleNextWord),
                  setIsNext(false),
                  setIsTryAgain(false))
                : null
            }
          >
            <Image
              height={'52px'}
              width={'52px'}
              src={Next}
              alt="Next"
              cursor={'pointer'}
            />
            <Text>Next</Text>
          </Flex>
        )}
      </div>
      {/* <button onClick={handleNextWord} disabled={currentWordIndex === targetWords.length - 1}>Next</button> */}
    </div>
  );
};

export default SpellAndCheck;