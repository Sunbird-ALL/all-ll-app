import React, { useEffect, useState } from 'react';
// import './Story.css';
import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  HStack,
  Image,
  Progress,
  Spinner,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import VoiceCompair from '../../../components/VoiceCompair/VoiceCompair';
// import Storyjson from '../Story/story1.json';
import play from '../../../assests/Images/play-img.png';
import pause from '../../../assests/Images/pause-img.png';
import Speaker from '../../../assests/Images/Speaker.png';
import MuteSpeaker from '../../../assests/Images/speakerMute.png';
import Next from '../../../assests/Images/next.png';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { compareArrays, getParameter, replaceAll } from '../../../utils/helper';
import Header from '../../Header';
import PlaceHolder from '../../../assests/Images/hackthon-images/collections.png';
import KnPlaceHolder from '../../../assests/Images/hackthon-images/fox.png';
// import Modal from '../../components/Modal/Modal';
import Animation from '../../../components/Animation/Animation';
import { showLoading, stopLoading } from '../../../utils/Helper/SpinnerHandle';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import S3Client from '../../../config/awsS3';
import { error, response } from '../../../services/telementryService';
import retry from '../../../assests/Images/retry.svg';
import JSConfetti from 'js-confetti';
import calcCER from 'character-error-rate';
// import TryNew from '../../../assests/Images/refresh.svg'
import lang_constants from '../../../lang/lang_constants.json';
import CharacterToWordMatchingGame from './CharacterToWordMatchingGame';
import completionCriteria from '../../../config/practiceConfig';
import AppTimer from '../../../components/AppTimer/AppTimer.jsx';
import { addPointerApi } from '../../../utils/api/PointerApi';
import SpellAndCheck from './SpellAndCheck.jsx';
import HangmanGame from './hangman-game/HangmanGame.jsx';
import animation from './animation.css';
import { splitGraphemes } from 'split-graphemes';
import { interactCall } from '../../../services/callTelemetryIntract.js';
import marioImg from '../../Story/Mario/images/mario.png';
import dinoImg from '../../Story/Mario/images//dragon.png';

const jsConfetti = new JSConfetti();

const Story = ({ forceRerender, setForceRerender }) => {
  const maxAllowedContent = localStorage.getItem('contentPracticeLimit') || 5;
  const [posts, setPosts] = useState([]);
  const toast = useToast();
  const [voiceText, setVoiceText] = useState('');
  const [showWellDone, setWellDone] = useState(false);
  const [isGame, setIsGame] = useState(true);
  const [sourceChars, setSourceChars] = useState([]);
  localStorage.setItem('voiceText', voiceText.replace(/[.',|!|?']/g, ''));
  const [recordedAudio, setRecordedAudio] = useState('');
  const [isAudioPlay, setIsAudioPlay] = useState(true);
  const [flag, setFlag] = useState(true);
  const [temp_audio, set_temp_audio] = useState(null); // base64url of teachertext
  const [loading, setLoading] = useState(true);
  const [isUserSpeak, setUserSpeak] = useState(false);
  const [storycase64Data, setStoryBase64Data] = useState('');

  const [template, SetTemplate] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isNext, setIsNext] = useState(false);
  const [showSplashScreen, setShowSplashScreen] = useState(false);

  // const [completionCriteriaIndex, setCompletionCriteriaIndex] = useState(() => {
  //   const storedData = JSON.parse(localStorage.getItem('progressData'));
  //   if (storedData && localStorage.getItem('virtualID')) {
  //     return storedData[localStorage.getItem('virtualID')]?.completionCriteriaIndex || 0;
  //   } else {
  //     return 0;
  //   }
  // });

  function highlightWords(sentence, matchedChar) {
    let isFirstImageDisplayed = false;
    const words = sentence.split(' ');
    matchedChar.sort(function(str1, str2) {
      return str2.length - str1.length;
      });
    let type = practiceCompletionCriteria[completionCriteriaIndex]?.criteria;
    if (type == 'char' || type == 'word') {
      const word = splitGraphemes(words[0].toLowerCase()).filter(item => item !== '‌' && item !== '' && item !== ' ');
      let highlightedString = [];
      for (let i = 0; i < word.length; i++) {
        let matchFound = false;
        for (let j = 0; j < matchedChar.length; j++) {
          let length=splitGraphemes(matchedChar[j]).filter(item => item !== '‌' && item !== '' && item !== ' ').length;
          const substr = word.slice(i, (i + length)).join('');
          if (substr.includes(matchedChar[j])) {
            highlightedString.push(
              <React.Fragment key={i}>
                <span
                  key={i}
                  style={{ backgroundColor: 'yellow', position: 'relative' }}
                >
                  {!isFirstImageDisplayed && (
                    <React.Fragment>
                      <Image
                        className="finger-pointer-word"
                        h={12}
                        src={require('../../../assests/Images/hand-pointer.png')}
                        alt={''}
                      />
                      {(isFirstImageDisplayed = true)}
                    </React.Fragment>
                  )}
                  {substr}
                </span>
              </React.Fragment>
            );
            i += length-1;
            matchFound = true;
            break;
          }
        }
        if (!matchFound) {
          highlightedString.push(word[i]);
        }
      }
      return highlightedString;
    } else {
      const highlightedSentence = words.map((word, index) => {
        const isMatched = matchedChar.some(char => word.toLowerCase().includes(char));
        if (isMatched) {
          return (
            <React.Fragment key={index}>
              <span
                key={index}
                style={{ backgroundColor: 'yellow', position: 'relative' }}
              >
                {!isFirstImageDisplayed && (
                  <>
                    <Image
                      className="finger-pointer"
                      h={12}
                      src={require('../../../assests/Images/hand-pointer.png')}
                      alt={''}
                    />
                    {(isFirstImageDisplayed = true)}
                  </>
                )}
                {word}
              </span>{' '}
            </React.Fragment>
          );
        } else {
          return <span key={index}>{word + ' '}</span>;
        }
      });
      return highlightedSentence;
    }
  }

  const [completionCriteriaIndex, setCompletionCriteriaIndex] = useState(
    parseInt(localStorage.getItem('userPracticeState') || 0)
  );

  const [currentLine, setCurrentLine] = useState(() => {
    const storedData = JSON.parse(localStorage.getItem('progressData'));
    if (storedData && localStorage.getItem('virtualID')) {
      return storedData[localStorage.getItem('virtualID')]?.currentLine || 0;
    } else {
      return 0;
    }
  });

  let practiceCompletionCriteria = [
    ...completionCriteria[localStorage.getItem('userCurrentLevel') || 'm1'],
  ];

  if (JSON.parse(localStorage.getItem('criteria'))) {
    practiceCompletionCriteria = [
      ...(JSON.parse(localStorage.getItem('criteria')) || []),
    ];
  }

  const { slug } = useParams();
  const max = practiceCompletionCriteria.length;
  const progressPercent =
    ((completionCriteriaIndex * maxAllowedContent + currentLine) /
      (max * maxAllowedContent)) *
    100;

  localStorage.setItem('sentenceCounter', currentLine);
  const navigate = useNavigate();
  const [pageno, setPageNo] = useState(1);

  const location = useLocation();
  const myCurrectLanguage =
    getParameter('language', location.search) || process.env.REACT_APP_LANGUAGE;
  const [sel_lang, set_sel_lang] = useState(myCurrectLanguage);

  const [progressData, setProgressData] = useState(() => {
    const storedData = localStorage.getItem('progressData');
    return storedData ? JSON.parse(storedData) : {};
  });

  React.useEffect(() => {
    localStorage.setItem('progressData', JSON.stringify(progressData));
  }, [progressData]);

  const updateProgress = (sessionId, newData) => {
    setProgressData(prevData => ({
      ...prevData,
      [sessionId]: { ...prevData[sessionId], ...newData },
    }));
    //setProgressPercent();
  };

  React.useEffect(() => {
    if (voiceText == '-') {
      alert("Sorry I couldn't hear a voice. Could you please speak again?");
      setVoiceText('');
    }
  }, [voiceText]);
  React.useEffect(() => {
    fetchApi();
  }, [forceRerender, completionCriteriaIndex]);

  const fetchApi = async () => {
    setLoading(true);
    if (practiceCompletionCriteria[completionCriteriaIndex]?.title === 'S1') {
      toast({
        position: 'top',
        title: `Well Done! \n
            You have completed the first practice session`,
        status: 'success',
      });
      addLessonApi('showcase', localStorage.getItem('userPracticeState'), 0);
      navigate('/showcase');
    } else if (
      practiceCompletionCriteria[completionCriteriaIndex]?.title === 'S2'
    ) {
      toast({
        position: 'top',
        title: `Well Done! \n
            You have completed the second practice session`,
        status: 'success',
      });
      setCompletionCriteriaIndex(0);
      addLessonApi('showcase', localStorage.getItem('userPracticeState'), 0);
      navigate('/showcase');
    }

    let type = practiceCompletionCriteria[completionCriteriaIndex]?.criteria;
    localStorage.setItem('apphomelevel', type);
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_LEARNER_AI_APP_HOST
        }/lais/scores/GetContent/${type}/${localStorage.getItem(
          'virtualID'
        )}?language=${localStorage.getItem('apphomelang')}&contentlimit=${
          localStorage.getItem('contentPracticeLimit') || 5
        }&gettargetlimit=${localStorage.getItem('contentTargetLimit') || 5}`
      )
        .then(res => {
          return res.json();
        })
        .then(data => {
          const newPosts = data?.content || [];
          setSourceChars(data?.getTargetChar);
          setPosts(newPosts);
          setCurrentLine(0);
          SetTemplate(
            practiceCompletionCriteria[completionCriteriaIndex]?.template ||
              'simple'
          );
          setLoading(false);
        });
      setLoading(false);
      setUserSpeak(false);
    } catch (err) {
      toast({
        position: 'top',
        title: `${
          err?.message === 'Failed to fetch'
            ? 'Please Check Your Internet Connection'
            : err?.message
        }`,
        status: 'error',
      });
      error(err, { err: err.name, errtype: 'CONTENT' }, 'ET');
    }
  };

  const handleAudioFile = async base64Data => {
    if (process.env.REACT_APP_CAPTURE_AUDIO === 'true') {
      var audioFileName = `${process.env.REACT_APP_CHANNEL}/${
        localStorage.getItem('contentSessionId') === null
          ? localStorage.getItem('allAppContentSessionId')
          : localStorage.getItem('contentSessionId')
      }-${Date.now()}-${currentLine}.wav`;
      const command = new PutObjectCommand({
        Bucket: process.env.REACT_APP_AWS_S3_BUCKET_NAME,
        Key: audioFileName,
        Body: Uint8Array.from(window.atob(base64Data), c => c.charCodeAt(0)),
        ContentType: 'audio/wav',
      });
      try {
        const response = await S3Client.send(command);
      } catch (err) {
        toast({
          position: 'top',
          title: `${err?.message}`,
          status: 'error',
        });
        error(err, { err: err.name, errtype: 'CONTENT' }, 'ET');
      }
    }

    response(
      {
        // Required
        target:
          process.env.REACT_APP_CAPTURE_AUDIO === 'true'
            ? `${audioFileName}`
            : '', // Required. Target of the response
        //"qid": "", // Required. Unique assessment/question id
        type: 'SPEAK', // Required. Type of response. CHOOSE, DRAG, SELECT, MATCH, INPUT, SPEAK, WRITE
        values: [
          { original_text: posts[currentLine]?.contentSourceData[0]?.text },
          { response_text: '' },
          { response_correct_words_array: [] },
          { response_incorrect_words_array: [] },
          { response_word_array_result: [] },
          { response_word_result: '' },
          { accuracy_percentage: 0 },
          {
            template:
              practiceCompletionCriteria[completionCriteriaIndex]?.template ||
              '',
          },
          { duration: 0 },
        ],
      },
      'ET'
    );
  };

  React.useEffect(() => {
    learnAudio();
  }, [temp_audio]);

  const playAudio = () => {
    interactCall('playAudio', 'practice', 'DT', 'PLAY');
    const myAudio = localStorage.getItem('recordedAudio');
    set_temp_audio(new Audio(myAudio));
  };

  const playTeacherAudio = () => {
    const contentId = posts?.[currentLine]?.contentId;
    var audio = new Audio(
      `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/Audio/${contentId}.wav`
    );

    audio.addEventListener('canplaythrough', () => {
      set_temp_audio(
        new Audio(
          `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/Audio/${contentId}.wav`
        )
      );
    });
    audio.addEventListener('error', err => {
      toast({
        position: 'top',
        title: 'Audio is not available',
        duration: 2000,
        status: 'error',
      });
      error(
        '',
        { err: 'Audio is not available', errtype: 'CONTENT' },
        'ET',
        contentId
      );
    });
  };

  const pauseAudio = () => {
    interactCall('pauseAudio', 'practice', 'DT', 'PAUSE');
    const contentId = posts?.[currentLine]?.contentId;
    var audio = new Audio(
      `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/Audio/${contentId}.wav`
    );

    audio.addEventListener('canplaythrough', () => {
      set_temp_audio(
        new Audio(
          `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/Audio/${contentId}.wav`
        )
      );
    });
    audio.addEventListener('error', () => {
      toast({
        position: 'top',
        title: 'Audio is not available',
        duration: 2000,
        status: 'error',
      });
    });
  };

  const handleSpellAndCheck = callback => {
    SetTemplate('simple');
    callback();
  };

  const learnAudio = () => {
    if (temp_audio !== null) {
      temp_audio.play();
      setFlag(!flag);
      temp_audio.addEventListener('ended', () => setFlag(true));
    }
  };

  const addLessonApi = (milestone, lesson, progressPercentage) => {
    const base64url = `${process.env.REACT_APP_LEARNER_AI_APP_HOST}/lp-tracker/api`;
    const pathnameWithoutSlash = location.pathname.slice(1);
    fetch(`${base64url}/lesson/addLesson`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: localStorage.getItem('virtualID'),
        sessionId: localStorage.getItem('virtualStorySessionID'),
        milestone: milestone,

        // milestone: 'practice',
        lesson: lesson,
        // lesson: localStorage.getItem('userPracticeState') || 0,
        progress: progressPercentage,
        milestoneLevel: localStorage.getItem('userCurrentLevel') || 'm0',
        language: localStorage.getItem('apphomelang') || 'ta',
      }),
    }).catch(err => {
      toast({
        position: 'top',
        title: `${
          err?.message === 'Failed to fetch'
            ? 'Please Check Your Internet Connection'
            : err?.message
        }`,
        status: 'error',
      });
      error(err, { err: err.name, errtype: 'CONTENT' }, 'ET');
    });
  };

  const nextLine = count => {
    handleAddPointer(1);
    addLessonApi(
      'practice',
      localStorage.getItem('userPracticeState') || 0,
      parseInt(progressPercent)
    );
    localStorage.setItem('lessonProgressPercent', parseInt(progressPercent));
    const sessionId = localStorage.getItem('virtualID');
    const newData = {
      progressPercent: progressPercent,
      currentLine: currentLine,
      completionCriteriaIndex: completionCriteriaIndex,
    };
    updateProgress(sessionId, newData);
    setUserSpeak(false);
    if (currentLine >= posts?.length - 1) {
      handleStarAnimation();
      setWellDone(true);
      setCurrentWordIndex(0);
    } else {
      setCurrentLine(currentLine + 1);
      SetTemplate(
        practiceCompletionCriteria[completionCriteriaIndex]?.template || ''
      );
    }
  };

  const handleAddPointer = async point => {
    const requestBody = {
      userId: localStorage.getItem('virtualID'),
      sessionId: localStorage.getItem('virtualStorySessionID'),
      points: point,
      milestoneLevel: localStorage.getItem('userCurrentLevel') || 'm0',
      language: localStorage.getItem('apphomelang') || 'ta',
    };

    try {
      const response = await addPointerApi(requestBody);
      localStorage.setItem(
        'totalSessionPoints',
        response.result.totalSessionPoints
      );
      localStorage.setItem('totalUserPoints', response.result.totalUserPoints);
      localStorage.setItem(
        'totalLanguagePoints',
        response.result.totalLanguagePoints
      );
    } catch (err) {
      toast({
        position: 'top',
        title: `${
          err?.message === 'Failed to fetch'
            ? 'Please Check Your Internet Connection'
            : err?.message
        }`,
        status: 'error',
      });
      error(err, { err: err.name, errtype: 'CONTENT' }, 'ET');
    }
  };

  function saveIndb(base64Data) {
    handleAudioFile(base64Data);
    setUserSpeak(true);
  }

  const handleStarAnimation = () => {
    jsConfetti.addConfetti({
      emojis: ['⭐', '✨', '🌟', '⭐', '✨', '🌟'],
    });
    jsConfetti.addConfetti({
      emojis: ['⭐', '✨', '🌟', '⭐', '✨', '🌟'],
    });
    jsConfetti.addConfetti({
      emojis: ['⭐', '✨', '🌟', '⭐', '✨', '🌟'],
    });
  };

  function getLanguageConstants(languageCode) {
    return lang_constants[languageCode] || lang_constants['en'];
  }

  const calculateFontSize = text => {
    const textLength = text ? text.length : 0;
    const initialFontSize = 38;
    const maxThresholdLength = 300;
    const fontSizeDecrement = 0.1;
    const minimumFontSize = 18;

    const adjustedFontSize = Math.max(
      initialFontSize -
        fontSizeDecrement * Math.max(textLength - maxThresholdLength, 0),
      minimumFontSize
    );

    return adjustedFontSize;
  };

  const onPracticeNext = () => {
    fetchApi();
    setCurrentLine(0);
    let index = completionCriteriaIndex + 1;
    setCompletionCriteriaIndex(index);
    localStorage.setItem('userPracticeState', index);
    addLessonApi('practice', index, parseInt(progressPercent));
    setWellDone(false);
  };

  return (
    <>
      <Header
        active={2}
        forceRerender={forceRerender}
        setForceRerender={setForceRerender}
      />
      <Container mt={20} w={'75vw'} className="story-container">
        <Center
          minH={'50vh'}
          style={{
            backgroundColor: `${
              practiceCompletionCriteria[completionCriteriaIndex]?.criteria ===
                'word' &&
              practiceCompletionCriteria[completionCriteriaIndex]?.template ===
                'simple' &&
              posts?.length > 0
                ? '#c9c4ff'
                : practiceCompletionCriteria[completionCriteriaIndex]
                    ?.criteria === 'sentence' &&
                  practiceCompletionCriteria[completionCriteriaIndex]
                    ?.template === 'simple' &&
                  posts?.length > 0
                ? '#d3ffbb'
                : practiceCompletionCriteria[completionCriteriaIndex]
                    ?.criteria === 'word' &&
                  practiceCompletionCriteria[completionCriteriaIndex]
                    ?.template === 'game' &&
                  posts?.length > 0
                ? '#FFDAB9'
                : 'white'
            }`,
            boxShadow: '2px 2px 15px 5px grey',
            borderRadius: '30px',
            width: 'inherit',
          }}
        >
          {loading ? (
            <Center h="50vh">
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
              />
            </Center>
          ) : posts?.length === 0 &&
            practiceCompletionCriteria[completionCriteriaIndex]?.template ==
              'simple' ? (
            <>
              <Center h="50vh">
                <VStack>
                  <div>
                    <h1 style={{ fontSize: '20px', color: 'red' }}>
                      Practice Data Not Found
                    </h1>
                  </div>
                  <div>
                    <section className="c-section">
                      <Link to={'/discoveryList'}>
                        <button className="btn btn-info">Discover {'>'}</button>
                      </Link>
                    </section>
                  </div>
                  {/* <button>No</button> */}
                </VStack>
              </Center>
            </>
          ) : showWellDone ? (
            <>
              <Center h="50vh">
                <Flex>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      width: '100%',
                      // left: '40px',
                    }}
                  >
                    {/* {jsConfetti.addConfetti({
          emojis: ['⭐', '✨', '🌟', '👏', '🎉', '🥳', '🎊', '🙌', '🎈', '🏆', '🎆', '🥇'],
        })} */}
                    <Box p="4">
                      <div style={{ textAlign: 'center' }}>
                        <br />
                        <Box p="4">
                          <VStack>
                            {completionCriteriaIndex ===
                              practiceCompletionCriteria.findIndex(
                                criteria => criteria.title === 'S1'
                              ) -
                                1 ||
                            completionCriteriaIndex ===
                              practiceCompletionCriteria.findIndex(
                                criteria => criteria.title === 'S2'
                              ) -
                                1 ? (
                              <>
                                <div className="game-poster-container">
                                  <div className="left-section">
                                    <Image
                                      h={300}
                                      src={marioImg}
                                      alt="Mario Image"
                                    />
                                  </div>
                                  <div className="center-section">
                                    {/* <h1 className="game-title">Welcome to the Game !</h1> */}
                                    <span className="star-font">⭐</span>
                                    <span className="badge-heading">🏆</span>
                                    <span className="star-font">⭐</span>

                                    <div className="game-message">
                                      <button
                                        className="btn btn-info start-button"
                                        onClick={onPracticeNext}
                                      >
                                        Start Game {'>'}
                                      </button>
                                      {/* <button onClick={onPracticeNext} className="start-button">Start Game</button> */}
                                    </div>
                                  </div>
                                  <div className="right-section">
                                    <Image
                                      h={300}
                                      src={dinoImg}
                                      alt="Dinosaur Image"
                                    />
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div style={{ textAlign: 'center' }}>
                                  <h1 style={{ fontSize: '60px' }}>
                                    Well Done{' '}
                                  </h1>
                                  <br />
                                </div>
                                <div>
                                  <img
                                    style={{
                                      height: '40px',
                                      cursor: 'pointer',
                                    }}
                                    onClick={() => {
                                      onPracticeNext();
                                      setShowSplashScreen(false);
                                    }}
                                    src={Next}
                                    alt="try_new"
                                  />
                                </div>
                                <div>
                                  <p>Practice More</p>
                                </div>
                              </>
                            )}
                          </VStack>
                        </Box>
                        {/* <button>No</button> */}
                      </div>
                    </Box>
                  </div>
                </Flex>
              </Center>
            </>
          ) : posts && template == 'simple' ? (
            <>
              <VStack>
                <Box>
                  {posts?.map((post, ind) =>
                    currentLine === ind ? (
                      <Center key={ind}>
                        <Flex
                          pos={'relative'}
                          w={'100%'}
                          className="story-box-container"
                          display={'flex'}
                          justifyContent={'center'}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Box p="4">
                              <h1
                                style={{
                                  textAlign: 'center',
                                  fontSize: `${calculateFontSize(
                                    post?.contentSourceData[0]?.text
                                  )}px`,
                                  whiteSpace: 'break-spaces',
                                  wordWrap: 'break-word',
                                }}
                                className="story-line relative-pos"
                              >
                                {highlightWords(
                                  post?.contentSourceData[0]?.text,
                                  post?.matchedChar
                                )}
                              </h1>

                              {localStorage.setItem(
                                'contentText',
                                post?.contentSourceData[0]?.text
                              )}
                            </Box>
                          </div>
                        </Flex>
                      </Center>
                    ) : (
                      ''
                    )
                  )}
                </Box>
                <Box>
                  {isUserSpeak ? (
                    isAudioPlay !== 'recording' && (
                      <div>
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
                            <div>
                              <img
                                className="play_btn"
                                style={{
                                  height: '72px',
                                  width: '72px',
                                  padding: '8px',
                                }}
                                onClick={nextLine}
                                src={Next}
                                alt="next-button"
                              />
                              <h4
                                className="text-play m-0"
                                style={{
                                  position: 'relative',
                                  textAlign: 'center',
                                }}
                              >
                                Try Next
                              </h4>
                            </div>
                          </Flex>
                        </HStack>
                      </div>
                    )
                  ) : (
                    <div className="voice-recorder">
                      <HStack gap={'2rem'}>
                        {posts?.[currentLine]?.contentSourceData[0]
                          ?.audioUrl !== ' '
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

                        <VStack
                          style={{ marginTop: '-13px', marginLeft: '0px' }}
                        >
                          <VoiceCompair
                            setVoiceText={setVoiceText}
                            setRecordedAudio={setRecordedAudio}
                            _audio={{ isAudioPlay: e => setIsAudioPlay(e) }}
                            flag={true}
                            setStoryBase64Data={setStoryBase64Data}
                            handleAudioFile={handleAudioFile}
                            saveIndb={saveIndb}
                          />
                          {isAudioPlay === 'recording' ? (
                            <h4
                              style={{ position: 'relative', top: '-10px' }}
                              className="text-speak m-0"
                            >
                              Stop
                            </h4>
                          ) : (
                            <h4
                              style={{ position: 'relative', top: '-10px' }}
                              className="text-speak m-0"
                            >
                              Speak
                            </h4>
                          )}
                        </VStack>
                      </HStack>
                    </div>
                  )}
                </Box>
              </VStack>
            </>
          ) : posts?.length >= 0 &&
            practiceCompletionCriteria[completionCriteriaIndex]?.template ==
              'spell-and-check' ? (
            <>
              <SpellAndCheck
                sourceChars={sourceChars}
                targetWords={posts}
                handleSuccess={callback => handleSpellAndCheck(callback)}
                currentWordIndex={currentWordIndex}
                nextLine={nextLine}
                setCurrentWordIndex={setCurrentWordIndex}
                isNext={isNext}
                setIsNext={setIsNext}
                contentType={
                  practiceCompletionCriteria[completionCriteriaIndex]
                    .criteria === 'char' ||
                  practiceCompletionCriteria[completionCriteriaIndex]
                    .criteria === 'paragraph'
                    ? 'word'
                    : practiceCompletionCriteria[completionCriteriaIndex]
                        .criteria
                }
                isUserSpeak={isUserSpeak}
                isAudioPlay={isAudioPlay}
                flag={flag}
                playAudio={playAudio}
                playTeacherAudio={playTeacherAudio}
                pauseAudio={pauseAudio}
                audioUrl={posts?.[currentLine]?.contentSourceData[0]?.audioUrl}
              />
            </>
          ) : posts?.length >= 0 &&
            practiceCompletionCriteria[completionCriteriaIndex]?.template ==
              'hangman-game' ? (
            <HangmanGame
              sourceChars={sourceChars}
              showSplashScreen={showSplashScreen}
              setShowSplashScreen={setShowSplashScreen}
              targetWords={posts}
              isAudioPlay={isAudioPlay}
              currentWordIndex={currentWordIndex}
              setCurrentWordIndex={setCurrentWordIndex}
              flag={flag}
              nextLine={nextLine}
              playAudio={playAudio}
              playTeacherAudio={playTeacherAudio}
              pauseAudio={pauseAudio}
              audioUrl={posts?.[currentLine]?.contentSourceData[0]?.audioUrl}
              handleSuccess={callback => handleSpellAndCheck(callback)}
            />
          ) : (
            ''
          )}
        </Center>
        <Box paddingTop={10}>
          <Stepper
            size="md"
            colorScheme="green"
            index={completionCriteriaIndex}
          >
            {practiceCompletionCriteria.map((step, index) => (
              <Step key={index}>
                <StepIndicator>
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepTitle>{step.title}</StepTitle>}
                    active={<StepTitle>{step.title}</StepTitle>}
                  />
                </StepIndicator>
              </Step>
            ))}
          </Stepper>
          <Box p={10}>
            <Center>Progress: {parseInt(progressPercent)}%</Center>
            <Progress colorScheme="green" size="sm" value={progressPercent} />
          </Box>
        </Box>
      </Container>

      {/* <Text>Session Id: {localStorage.getItem('virtualStorySessionID')}</Text> */}
    </>
  );
};

export default Story;
