import React, { useState, useEffect } from 'react';
import {
  Button,
  VStack,
  Heading,
  Text,
  HStack,
  useToast,
  Flex,
  Box,
  Image,
} from '@chakra-ui/react';
import './HangmanGame.css';
import { splitGraphemes } from 'split-graphemes';
import play from '../../../../assests/Images/Speaker.png';
import pause from '../../../../assests/Images/speakerMute.png';
import hintSvg from '../../../../assests/Images/hint.svg';
import Next from '../../../../assests/Images/next.png';
import { interactCall } from '../../../../services/callTelemetryIntract';

const HangmanGame = ({
  sourceChars = [],
  targetWords = [],
  playAudio,
  pauseAudio,
  flag,
  isAudioPlay,
  currentWordIndex,
  setCurrentWordIndex,
  handleSuccess,
}) => {
  const toast = useToast();
  const words = [];
  const [word, setWord] = useState('');
  const [guessedWord, setGuessedWord] = useState([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState(0);
  const [maxIncorrectGuesses] = useState(10);
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [hintText, setHintText] = useState('');
  const [hintCharArray, setHintCharArray] = useState('');
  const [hint, setHint] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);

  const [showSplashScreen, setShowSplashScreen] = useState(
    localStorage.getItem('hasShownSplashScreen') === 'true' ? true : false
  );

  useEffect(() => {
    targetWords.map((word, index) => {
      return (
        <React.Fragment key={index}>
          {words.push(word?.contentSourceData[0]?.text)}
        </React.Fragment>
      );
    });
  }, [words]);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const randomWord = words[currentWordIndex];
    setWord(randomWord?.toLowerCase());
    // const guessWordSplit = randomWord?.split('');
    setGuessedWord(
      Array(
        splitGraphemes(randomWord)?.filter(
          item =>
            item !== '‌' &&
            item !== '' &&
            item !== ' ' &&
            item !== '-' &&
            item !== '.'
        )?.length
      ).fill('_')
    );

    setHint(randomWord?.length - 1);
    setIncorrectGuesses(0);
    setGameWon(false);
    setGameLost(false);
    setCurrentLine(0);
    setHintText('');
    setHintCharArray('');
  };

  const handleGuess = letter => {
    if (!gameWon && !gameLost) {
      if (word?.includes(letter)) {
        setGuessedWord(prevGuessedWord =>
          splitGraphemes(word)?.map((char, index) =>
            char === letter ? letter : prevGuessedWord[index]
          )
        );
      } else {
        setIncorrectGuesses(prevIncorrectGuesses => prevIncorrectGuesses + 1);
      }
    }
  };

  const handleNextWord = () => {
    setCurrentWordIndex(prevIndex => prevIndex + 1);
    // setCurrentLine(prevIndex => prevIndex + 1);
  };

  const provideHint = () => {
    const hints = splitGraphemes(word).filter(
      item => item !== '‌' && item !== '' && item !== ' ' && item !== '-'
    );

    if (currentLine < hints.length - 1) {
      setCurrentLine(prevVal => prevVal + 1);
      setHint(prevValue => prevValue - 1);
    } else {
      toast({
        position: 'top',
        title: `Oops! You've used all available hints`,
        duration: 2000,
        status: 'warning',
      });
      return;
    }
    setHintText(word);
    setHintCharArray(hints);
  };

  // Function to merge two arrays and shuffle the result

  useEffect(() => {
    if (guessedWord.join('') !== '' && guessedWord.join('') === word) {
      setGameWon(true);
    } else if (incorrectGuesses + 1 >= maxIncorrectGuesses) {
      setGameLost(true);
    }
  }, [guessedWord, word, incorrectGuesses, maxIncorrectGuesses]);

  const renderWord = () => (
    <HStack spacing="5">
      {guessedWord.map((letter, index) => (
        <Text
          key={index}
          fontSize={40}
          bg={gameWon && letter !== '_' ? 'green.100' : 'transparent'}
        >
          {letter}
        </Text>
      ))}
    </HStack>
  );

  const renderAlphabet = () => {
    const alphabetRowsEnglish = ['qweiop'];
    const alphabetRowsTamil = ['அஆஇஎஐ'];
    const alphabetRowsKannada = ['ಅಆಎಏಐ'];

    const lang = localStorage.getItem('apphomelang');
    const alphabetRows =
      lang === 'en'
        ? alphabetRowsEnglish
        : lang === 'ta'
        ? alphabetRowsTamil
        : alphabetRowsKannada;

    const middleIndex = Math.floor(splitGraphemes(alphabetRows[0]).length / 2);
    let alphabet = splitGraphemes(alphabetRows[0]);

    let filterWord = splitGraphemes(word).filter(
      item =>
        item !== '‌' &&
        item !== '' &&
        item !== ' ' &&
        item !== '-' &&
        item !== '.'
    );

    alphabet.splice(middleIndex, 0, ...filterWord);

    const uniqueAlphabet = Array.from(new Set(alphabet)).join('');

    return [uniqueAlphabet].map((row, rowIndex) => (
      <HStack key={rowIndex} spacing="1">
        {splitGraphemes(row).map((letter, colIndex) => (
          <Button
            key={letter}
            onClick={() => {
              handleGuess(letter);
              setHintText('');
              setHintCharArray('');
            }}
            bg={colIndex % 2 === 0 ? 'blue.100' : 'blue.300'}
            isDisabled={guessedWord.includes(letter) || gameWon || gameLost}
          >
            {letter}
          </Button>
        ))}
      </HStack>
    ));
  };

  const hangmanGraphics = [
    <line x1="2" y1="3" x2="0" y2="1000" stroke="black" strokeWidth="8" />, // Pole
    <line x1="0" y1="3" x2="10000" y2="80" stroke="black" strokeWidth="5" />,
    <line x1="90" y1="85" x2="90" y2="2" stroke="black" strokeWidth="3" />, // Pole
    <circle
      cx="90"
      cy="90"
      r="40"
      stroke="black"
      strokeWidth="3"
      fill="white"
    />, // Head
    <line x1="85" y1="127" x2="85" y2="190" stroke="black" strokeWidth="15" />, // Body
    <line x1="85" y1="160" x2="35" y2="110" stroke="black" strokeWidth="3" />, // Left Arm
    <line x1="85" y1="160" x2="150" y2="110" stroke="black" strokeWidth="3" />, // Right Arm
    <line x1="85" y1="185" x2="25" y2="280" stroke="black" strokeWidth="3" />, // Left Leg
    <line x1="85" y1="185" x2="150" y2="300" stroke="black" strokeWidth="3" />, // Right Leg
  ];

  const hangmanDisplay = hangmanGraphics?.slice(0, incorrectGuesses);

  return (
    <VStack spacing="1" align="center" w={'100%'}>
      {!showSplashScreen ? (
        <div className="splash-screen">
          <h1>Welcome to Hangman Game</h1>
          <Button
            onClick={() => {
              localStorage.setItem('hasShownSplashScreen', true);
              setShowSplashScreen(true);
            }}
          >
            Start Game
          </Button>
        </div>
      ) : (
        <>
          <Text fontSize={24} fontWeight={600}>
            Hangman Game
          </Text>
          {gameLost ? (
            <Text fontSize={'24px'} fontWeight={'600'} color="red.500">
              You lost! The word was: {word} <br />
            </Text>
          ) : null}
          {gameWon ? (
            <Text fontSize={'24px'} fontWeight={'600'} color="green.500">
              You won! The word is: {word} <br />
            </Text>
          ) : null}
          {!(gameLost || gameWon) && hintCharArray && (
            <Box
              bgColor={'orange'}
              p={2}
              borderRadius={5}
              shadow={'1px 1px 3px 2px orange '}
            >
              <Text fontSize={'20px'} fontWeight={'600'}>
                {hintCharArray && ` Hint is: ${hintCharArray}`}
              </Text>
            </Box>
          )}

          <Flex justifyContent={'center'} w={'100%'}>
            <Flex justifyContent={'start'} w={'80%'}>
              {incorrectGuesses != 0 && (
                <Box shadow={'1px 1px 3px 3px #f1f1f1'}>
                  <svg width="200" height="270">
                    {hangmanDisplay}
                  </svg>
                </Box>
              )}
            </Flex>
          </Flex>
          <VStack spacing="0" mb={5} mt={'-5px'}>
            {renderWord()}
          </VStack>
          <VStack spacing="2">{renderAlphabet()}</VStack>
          <HStack gap={5}>
            {isAudioPlay !== 'recording' && (
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
                            onClick={() => pauseAudio()}
                            src={play}
                            style={{ height: '72px', width: '72px' }}
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
                            onClick={() => playAudio()}
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
            )}
            {!(gameLost || gameWon) && (
              <Flex
                onClick={() => {
                  provideHint();
                  interactCall('provideHint', '', 'DT', 'hint');
                }}
                mt={3}
                flexDirection={'column'}
                alignItems={'center'}
                cursor={'pointer'}
              >
                <Image h={14} src={hintSvg} alt="hint" />
                <Text color={'orange'}>Hint</Text>
              </Flex>
            )}
            {(gameLost || gameWon) && (
              <Box
                mt={5}
                flexDirection={'column'}
                alignItems={'center'}
                cursor={'pointer'}
                textAlign={'center'}
              >
                <Image
                  h={12}
                  src={Next}
                  mb={1}
                  onClick={() => {
                    resetGame();
                    handleSuccess(handleNextWord);
                  }}
                  alt="next"
                />
                <Text>Next</Text>
              </Box>
            )}
          </HStack>
        </>
      )}
    </VStack>
  );
};

export default HangmanGame;
