import React, { useEffect, useState } from 'react';
// import './Story.css';
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  HStack,
  Image,
  Text,
  VStack,
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
import { response } from '../../../services/telementryService';
import retry from '../../../assests/Images/retry.svg';
import JSConfetti from 'js-confetti';
import calcCER from 'character-error-rate';
import Tabs from '../Tabs/Tabs';
// import TryNew from '../../../assests/Images/refresh.svg'
import lang_constants from '../../../lang/lang_constants.json';

const jsConfetti = new JSConfetti();


const Story = () => {
  const maxAllowedContent = 4;
  const [posts, setPosts] = useState([]);
  const [voiceText, setVoiceText] = useState('');
  const [showWellDone, setWellDone] = useState(false);
  // console.log(voiceText);
  localStorage.setItem('voiceText', voiceText.replace(/[.',|!|?']/g, ''));
  const [recordedAudio, setRecordedAudio] = useState(''); // blob
  //   localStorage.setItem('recordedAudio', recordedAudio);
  const [isAudioPlay, setIsAudioPlay] = useState(true);
  const [flag, setFlag] = useState(true);
  const [temp_audio, set_temp_audio] = useState(null); // base64url of teachertext
  const [loading, setLoading] = useState(true);
  const [isUserSpeak, setUserSpeak] = useState(false);

  const [storycase64Data, setStoryBase64Data] = useState('');

  const { slug } = useParams();
  const [currentLine, setCurrentLine] = useState(0);
  localStorage.setItem('sentenceCounter', currentLine);
  const navigate = useNavigate();
  const [pageno, setPageNo] = useState(1);

  const location = useLocation();
  const myCurrectLanguage =
    getParameter('language', location.search) || process.env.REACT_APP_LANGUAGE;
  const [sel_lang, set_sel_lang] = useState(myCurrectLanguage);


  React.useEffect(() => {
    if (voiceText == '-') {
      alert("Sorry I couldn't hear a voice. Could you please speak again?");
      setVoiceText('');
    }
  }, [voiceText]);
  React.useEffect(() => {
    fetchApi();
  }, []);

  const fetchApi = async () => {
    setLoading(true);
    let type =
      localStorage.getItem('apphomelevel') === 'Word' ? 'Sentence' : 'Word';
    localStorage.setItem('apphomelevel', type);
    try {
      const response = await fetch(
        `https://telemetry-dev.theall.ai/content-service/v1/WordSentence/getRandomContent?language=${localStorage.getItem(
          'apphomelang'
        )}&type=${type}&limit= ${currentLine === 2 ? 2 : 3}`
      )
        .then(res => {
          return res.json();
        })
        .then(data => {
          const oldPosts = posts || [];
          const newPosts = data?.data;

          if (currentLine && currentLine < maxAllowedContent - 1 && newPosts?.length) {
            setPosts([...oldPosts, ...newPosts]);
          } else {
            setPosts(newPosts);
            setCurrentLine(0);
          }
          setLoading(false);
        });
      setLoading(false);
      setUserSpeak(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  //console.log(posts);
  React.useEffect(() => {
    learnAudio();
  }, [temp_audio]);

  const playAudio = () => {
    const myAudio = localStorage.getItem('recordedAudio');
    set_temp_audio(new Audio(myAudio));
  };

  const playTeacherAudio = () => {
    set_temp_audio(
      new Audio(
        posts?.[currentLine].data[0]?.[
          localStorage.getItem('apphomelang')
        ].audio
      )
    );
  };

  const pauseAudio = () => {
    if (temp_audio !== null) {
      temp_audio.pause();
      setFlag(!false);
    }
  };

  const learnAudio = () => {
    if (temp_audio !== null) {
      temp_audio.play();
      setFlag(!flag);
      temp_audio.addEventListener('ended', () => setFlag(true));
    }
  };

  const nextLine = count => {
    setUserSpeak(false);
    if (currentLine >= maxAllowedContent) {
      handleStarAnimation();
      setWellDone(true);
    } else if (currentLine >= posts?.length - 1) {
      fetchApi();
      setCurrentLine(currentLine + 1);
    }else{
      setCurrentLine(currentLine + 1);
    }
  };

  function saveIndb() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
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

  return (
    <div>
      <VStack>
        <Header active={3} />
        <Container style={{ height: '97vh'}} className="story-container">
          <Center
          >
            <div className="col s4 m4">
              <div className="row">
                <div className="lang_select_div ">
                  <div className="col s12 m4">
                    <div
                      className={
                        localStorage.getItem('apphomelang') === 'en'
                          ? 'lang_select_div_active'
                          : 'lang_select_div_inactive'
                      }
                      onClick={() => {
                        let temp_dt = 'en';
                        localStorage.setItem('apphomelang', temp_dt);
                        set_sel_lang(temp_dt);
                        fetchApi();
                        setWellDone(false);
                        //window.location.reload();
                      }}
                    >
                      {getLanguageConstants('en').LANGUAGE}
                    </div>
                  </div>
                  <div className="col s12 m4">
                    <div
                      className={
                        localStorage.getItem('apphomelang') === 'kn'
                          ? 'lang_select_div_active'
                          : 'lang_select_div_inactive'
                      }
                      onClick={() => {
                        let temp_dt = 'kn';
                        localStorage.setItem('apphomelang', temp_dt);
                        set_sel_lang(temp_dt);
                        fetchApi();
                        setWellDone(false);
                        //window.location.reload();
                      }}
                    >
                      {getLanguageConstants('kn').LANGUAGE}
                    </div>
                  </div>
                  <div className="col s12 m4">
                    <div
                      className={
                        localStorage.getItem('apphomelang') === 'ta'
                          ? 'lang_select_div_active'
                          : 'lang_select_div_inactive'
                      }
                      onClick={() => {
                        let temp_dt = 'ta';
                        localStorage.setItem('apphomelang', temp_dt);
                        set_sel_lang(temp_dt);
                        fetchApi();
                        setWellDone(false);
                        //window.location.reload();
                      }}
                    >
                      {getLanguageConstants('ta').LANGUAGE}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Center>
          <Center
            style={{
              backgroundColor: `${localStorage.getItem('apphomelevel') === 'Word' &&
                posts?.length > 0
                ? '#c9c4ff'
                : posts?.length > 0
                  ? '#d3ffbb'
                  : 'white'
                }`,
              boxShadow: '2px 2px 15px 5px grey',
              borderRadius: '30px',
              width: 'inherit',
              height: '50vh'
            }}
          >
            {loading ? (
              <Center h='50vh'>Loading...</Center>
            ) : posts?.length === 0 ? (
              <>
                <Center h='50vh'>
                  <VStack>
                    <div>
                      <h1 style={{ fontSize: '20px', color: 'red' }}>
                      {localStorage.getItem('apphomelevel') } Data Not Found
                      </h1>
                    </div>
                    <div>
                      <img
                        style={{ height: '40px', cursor: 'pointer' }}
                        onClick={() => {
                          fetchApi();
                        }}
                        src={Next}
                        alt="try_new"
                      />
                    </div>
                    <div>
                      <p>Try New</p>
                    </div>
                    {/* <button>No</button> */}
                  </VStack>
                </Center>
              </>
            ) : showWellDone ? (
              <>
                <Center h='50vh'>
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
                      <Box p="4">
                        <div style={{ textAlign: 'center' }}>
                          <br />
                          <Box p="4">
                            <div style={{ textAlign: 'center' }}>
                              <h1 style={{ fontSize: '60px' }}>Well Done </h1>
                              <br />
                              <img
                                style={{ height: '40px', cursor: 'pointer' }}
                                onClick={() => {
                                  fetchApi();
                                  setCurrentLine(0);
                                  setWellDone(false);
                                }}
                                src={Next}
                                alt="try_new"
                              />

                              <p>Practice More</p>
                              {/* <button>No</button> */}
                            </div>
                          </Box>
                          {/* <button>No</button> */}
                        </div>
                      </Box>
                    </div>
                  </Flex>
                </Center>
              </>
            ) : posts ? (
              <>
                <VStack>
                  <Box>
                    {posts?.map((post, ind) =>
                      currentLine === ind ? (
                        <Center h='30vh'>
                          <Flex
                            pos={'relative'}
                            w={'100%'}
                            className="story-box-container"
                            key={ind}
                            display={'flex'}
                            justifyContent={'center'}

                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '40vh',
                              }}
                            >
                              <Box p="4">
                                <h1 style={{ textAlign: "center" }}  className="story-line">
                                  {
                                    post?.data[0]?.[
                                      localStorage.getItem('apphomelang')
                                    ]?.text
                                  }
                                </h1>
                                {localStorage.setItem(
                                  'contentText',
                                  post?.data[0]?.[
                                    localStorage.getItem('apphomelang')
                                  ]?.text
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
                                  style={{ height: '72px', width: '72px', 
                                  padding: '8px'}}
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
                          {posts?.[currentLine]?.data[0]?.[
                            localStorage.getItem('apphomelang')
                          ]?.audio !== ' '
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
            ) : ""}
          </Center>
        </Container>
      </VStack>
      <Text>Session Id: {localStorage.getItem('virtualStorySessionID')}</Text>
    </div>
  );
};

export default Story;
