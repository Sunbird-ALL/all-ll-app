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
import TryAgain from '../../../../assests/Images/retry.svg'
import { interactCall } from '../../../../services/callTelemetryIntract';

const HangmanGame = ({
  sourceChars = [],
  targetWords = [],
  playTeacherAudio,
  pauseAudio,
  flag,
  isAudioPlay,
  currentWordIndex,
  setCurrentWordIndex,
  handleSuccess,
  showSplashScreen,
  setShowSplashScreen,
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
  const [keyBoard, setKeyBoard] = useState([]);

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

  useEffect(() => {
    renderAlphabet();
  }, [word]);

  const resetGame = () => {
    const randomWord = words[currentWordIndex];
    setWord(randomWord?.toLowerCase());
    setGuessedWord(
      Array(
        splitGraphemes(randomWord)?.filter(
          item =>
            item.trim() !== '' &&
            item !== '‌' &&
            item !== '​' &&
            item !== '-' &&
            item !== '.' &&
            item !== '﻿'
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
        setIncorrectGuesses(prevValue => prevValue + 9 / filterWord.length);
      }
    }
  };

  const handleNextWord = () => {
    setCurrentWordIndex(prevIndex => prevIndex + 1);
  };

  const provideHint = () => {
    const hints = splitGraphemes(word).filter(
      item =>
        item.trim() !== '' &&
        item !== '‌' &&
        item !== '​' &&
        item !== '-' &&
        item !== '.' &&
        item !== '﻿'
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

  useEffect(() => {
    const filterWord = splitGraphemes(word).filter(
      item =>
        item.trim() !== '' &&
        item !== '‌' &&
        item !== '​' &&
        item !== '-' &&
        item !== '.' &&
        item !== '﻿'
    );
    if (
      guessedWord.join('') !== '' &&
      guessedWord.join('') === filterWord.join('')
    ) {
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

  function addCharsRandomPosition(arr, chars) {
    const combinedArray = [...arr, ...chars];

    for (let i = combinedArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combinedArray[i], combinedArray[j]] = [
        combinedArray[j],
        combinedArray[i],
      ];
    }
    const shuffledArr = combinedArray.slice(0, arr.length);
    const shuffledChars = combinedArray.slice(arr.length);

    return shuffledArr.concat(shuffledChars);
  }
  const renderAlphabet = () => {
    const alphabetRowsEnglish = [
      'q',
      'w',
      'e',
      'r',
      't',
      'y',
      'u',
      'i',
      'o',
      'p',
      'a',
      's',
      'd',
      'f',
      'g',
      'h',
      'j',
      'k',
      'l',
      'z',
      'x',
      'c',
      'v',
      'b',
      'n',
      'm',
    ];
    const alphabetRowsTamil = [
      'அ',
      'ஆ',
      'இ',
      'ஈ',
      'உ',
      'எ',
      'ஏ',
      'ஐ',
      'க',
      'ங',
      'ச',
      'ஞ',
      'ட',
      'ண',
      'த',
      'ந',
      'ப',
      'ம',
      'ய',
      'ர',
      'ல',
      'வ',
      'ழ',
      'ள',
      'ற',
      'ன',
    ];
    const alphabetRowsKannada = [
      'ಅ',
      'ಆ',
      'ಇ',
      'ಈ',
      'ಉ',
      'ಎ',
      'ಏ',
      'ಐ',
      'ಕ',
      'ಖ',
      'ಗ',
      'ಘ',
      'ಙ',
      'ಚ',
      'ಛ',
      'ಜ',
      'ಝ',
      'ಟ',
      'ಠ',
      'ಡ',
      'ಢ',
      'ಣ',
      'ತ',
      'ಥ',
      'ದ',
      'ಧ',
      'ನ',
      'ಪ',
      'ಫ',
      'ಬ',
      'ಭ',
      'ಮ',
    ];
    const lang = localStorage.getItem('apphomelang');
    const alphabetRows =
      lang === 'en'
        ? alphabetRowsEnglish
        : lang === 'ta'
        ? alphabetRowsTamil
        : alphabetRowsKannada;

    let alphabet = alphabetRows;

    const filterWord = splitGraphemes(word).filter(
      item =>
        item.trim() !== '' &&
        item !== '‌' &&
        item !== '​' &&
        item !== '-' &&
        item !== '.' &&
        item !== '﻿'
    );

    const keyboardChars = alphabet
      .filter((char, index) => index < splitGraphemes(word).length)
      .join('');

    let finalArray = addCharsRandomPosition(
      splitGraphemes(keyboardChars),
      filterWord
    );

    const uniqueAlphabet = Array.from(new Set(finalArray)).join('');

    setKeyBoard(uniqueAlphabet);
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
    <line x1="85" y1="127" x2="85" y2="190" stroke="black" strokeWidth="10" />, // Body
    <line x1="85" y1="160" x2="35" y2="110" stroke="black" strokeWidth="3" />, // Left Arm
    <line x1="85" y1="160" x2="150" y2="110" stroke="black" strokeWidth="3" />, // Right Arm
    <line x1="85" y1="185" x2="25" y2="280" stroke="black" strokeWidth="3" />, // Left Leg
    <line x1="85" y1="185" x2="150" y2="300" stroke="black" strokeWidth="3" />, // Right Leg
  ];

  const filterWord = splitGraphemes(word).filter(
    item =>
      item.trim() !== '' &&
      item !== '‌' &&
      item !== '​' &&
      item !== '-' &&
      item !== '.' &&
      item !== '﻿'
  );

  const hangmanDisplay = hangmanGraphics?.slice(0, incorrectGuesses);

  function showWinLoose(msg, answer, status) {
    toast({
      position: 'top',
      title: msg + ' ' + answer,
      duration: 2000,
      status: status,
    });
  }

  return (
    <VStack pos={'relative'} spacing="1" align="center" w={'100%'}>
      {!showSplashScreen ? (
        <div className="splash-screen">
          <Image
            h={40}
            mb={20}
            src={require('../../../../assests/Images/hangman.gif')}
          />

          <Button
            className="btn btn-info"
            onClick={() => {
              setShowSplashScreen(true);
            }}
            mt={-10}
          >
            Start Game {'>'}
          </Button>
        </div>
      ) : (
        <>
          <HStack pos={'relative'} justifyContent="end" w={'90%'}>
            <Box pos={'absolute'} top={'-7px'}>
              {!(gameLost || gameWon) && hintCharArray && (
                <Box
                  bgColor={'orange'}
                  p={1}
                  borderRadius={5}
                  shadow={'1px 1px 3px 2px orange '}
                >
                  <Text fontSize={'20px'} fontWeight={'600'}>
                    {hintCharArray && ` Hint is: ${hintCharArray}`}
                  </Text>
                </Box>
              )}
            </Box>
          </HStack>
          <Box pos={'absolute'} top={10}>
            {gameLost && (
              <Box pos={'absolute'} top={10}>
                {showWinLoose(' You lost! The word was:', word, 'warning')}
              </Box>
            )}
            {gameWon && (
              <Box pos={'absolute'} top={10}>
                {showWinLoose('You won! The word is:', word, 'success')}
              </Box>
            )}
          </Box>

          <Flex justifyContent={'space-around'} w={'90%'}>
            <Flex flex={1}>
              <Box>
                <svg width="200" height="270">
                  {hangmanDisplay}
                </svg>
              </Box>
            </Flex>

            <VStack flex={1} justifyContent={'end'}>
              <VStack spacing="0" mb={5}>
                {renderWord()}
              </VStack>
              <Flex flexWrap="wrap" justifyContent="center">
                {keyBoard?.length > 0 &&
                  splitGraphemes(keyBoard)?.map((row, rowIndex) => (
                    <HStack key={rowIndex} spacing={{ base: 4, md: 5 }} mb={2}>
                      {splitGraphemes(row).map((letter, colIndex) => (
                        <Button
                          key={`${rowIndex}-${colIndex}`}
                          m={1}
                          onClick={() => {
                            handleGuess(letter);
                            setHintText('');
                            setHintCharArray('');
                          }}
                          bg={
                            rowIndex % 2 === 0
                              ? colIndex === 0
                                ? 'yellow.400'
                                : colIndex % 2 === 0
                                ? 'yellow.300'
                                : 'yellow.400'
                              : colIndex % 2 === 0
                              ? 'yellow.300'
                              : 'yellow.400'
                          }
                          isDisabled={
                            guessedWord.includes(letter) || gameWon || gameLost
                          }
                          size={{ base: 'sm', md: 'md' }}
                          flex="1"
                          maxW="calc(25% - 4px)"
                        >
                          {letter}
                        </Button>
                      ))}
                    </HStack>
                  ))}
              </Flex>
            </VStack>
            <VStack flex={1}></VStack>
          </Flex>
          <HStack gap={5}>
            {!(gameLost || gameWon)? isAudioPlay !== 'recording' && (
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
                            onClick={() => playTeacherAudio()}
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
            ):<>
              <Box
                pos={'relative'}
                top={'6px'}
                flexDirection={'column'}
                alignItems={'center'}
                cursor={'pointer'}
                textAlign={'center'}
              >
                <Image
                  style={{
                    height: '72px',
                    width: '72px',
                    padding: '8px',
                  }}
                  src={TryAgain}
                  onClick={() => {
                    resetGame();
                  }}
                  alt="Try Again Img"
                />
                <Text>Try Again</Text>
              </Box>
            </>}
            {!(gameLost || gameWon) && (
              <Flex
                onClick={() => {
                  provideHint();
                  interactCall('HangmanHint', 'practice', 'DT', 'HINT');
                }}
                mt={3}
                flexDirection={'column'}
                alignItems={'center'}
                cursor={'pointer'}
              >
                <Image style={{ height: '72px', width: '72px' }} src={hintSvg} alt="hint" />
                <Text color={'orange'}>Hint</Text>
              </Flex>
            )}
            {(gameLost || gameWon) && (
              <Box
                pos={'relative'}
                top={'6px'}
                flexDirection={'column'}
                alignItems={'center'}
                cursor={'pointer'}
                textAlign={'center'}
              >
                <Image
                  style={{
                    height: '72px',
                    width: '72px',
                    padding: '8px',
                  }}
                  src={Next}
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
