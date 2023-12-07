import React, { useEffect, useState } from 'react';
import './Story.css';
import { Box, Button, Flex, Image, Text, VStack } from '@chakra-ui/react';
import VoiceCompair from '../../../components/VoiceCompair/VoiceCompair';
// import Storyjson from '../Story/story1.json';
import play from '../../../assests/Images/play-img.png';
import pause from '../../../assests/Images/pause-img.png';
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
import lang_constants from '../../../lang/lang_constants.json';

const jsConfetti = new JSConfetti();

const Story = () => {
  const [posts, setPosts] = useState([]);
  const [voiceText, setVoiceText] = useState('');
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

  React.useEffect(() => {
    if (voiceText == '-') {
      alert("Sorry I couldn't hear a voice. Could you please speak again?");
      setVoiceText('');
    }
    // if ((voiceText !== '') & (voiceText !== '-')) {
    //   go_to_result(voiceText);
    // }
  }, [voiceText]);
  React.useEffect(() => {
    fetchApi();
  }, []);

  const fetchApi = async () => {
    try {
      const response = await fetch(
        `https://telemetry-dev.theall.ai/content-service/v1/WordSentence/getRandomContent?language=${localStorage.getItem('apphomelang')}&type=Sentence&limit=5`
        
      )
        .then(res => {
          return res.json();
        })
        .then(data => {
          // if(!!localStorage.getItem('contents')){
          //   setPosts(JSON.parse(localStorage.getItem('contents')));
          // }
          // else{
          setPosts(data);
          // }
          // console.log("localStorage.getItem('contents'):-" ,JSON.parse(localStorage.getItem('contents')));
          // console.log("api:-" ,data);
          setLoading(false);
        });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setPosts(data);
      setLoading(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  // console.log(posts);
  React.useEffect(() => {
    learnAudio();
  }, [temp_audio]);

  const playAudio = () => {
    const myAudio = localStorage.getItem('recordedAudio');
    set_temp_audio(new Audio(myAudio));
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
    setUserSpeak(!isUserSpeak);
    if (currentLine <= posts?.data?.length - 1) {
      setCurrentLine(currentLine + 1);
    }
  };

  const prevLine = count => {
    setUserSpeak(!isUserSpeak);
    // if (currentLine > 0) {
    //   setCurrentLine(currentLine - 1);
    // }
  };

  function findRegex(str) {
    var rawString = str;
    var regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
    var cleanString = rawString.replace(regex, '');
    return cleanString;
  }

  async function saveIndb() {
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

  //   const [isUserSpeak]
  const location = useLocation();
  const myCurrectLanguage = getParameter('language', location.search) || process.env.REACT_APP_LANGUAGE;;
  const [sel_lang, set_sel_lang] = useState(myCurrectLanguage);

  useEffect(() => {
    if (currentLine === posts?.data?.length) {
      navigate('/Results');
      setPageNo(pageno + 1);
    }
  }, [currentLine]);

  function getLanguageConstants(languageCode) {
    return lang_constants[languageCode] || lang_constants['en'];
  }

  // console.log(posts?.data[currentLine]?.data[0]?.hi?.audio);
  return (
    <div style={{ height: '97vh' }}>
      <Header active={3} />
      {/* <button onClick={GetRecommendedWordsAPI}>getStars</button> */}
      {/* <div style={{width:'100%', marginTop:'80px'}}>
          <Tabs/>
            </div> */}
      <div
        style={{ boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', height: '97vh' }}
        className="story-container"
      >
        <Flex gap={14}>
          <div className="col s12">
            <center>
              <div className="row">
                <div className="lang_select_div ">
                  <div className="col s4">
                    <div
                      className={
                        sel_lang === 'en'
                          ? 'lang_select_div_active'
                          : 'lang_select_div_inactive'
                      }
                      onClick={() => {
                        let temp_dt = 'en';
                        localStorage.setItem('apphomelang', temp_dt);
                        set_sel_lang(temp_dt);
                        setCurrentLine(0)
                        setUserSpeak(false)
                        fetchApi();
                        //window.location.reload();
                      }}
                    >
                      {getLanguageConstants('en').HOME_TRY_IN}
                    </div>
                  </div>
                  <div className="col s4">
                    <div
                      className={
                        sel_lang === 'kn'
                          ? 'lang_select_div_active'
                          : 'lang_select_div_inactive'
                      }
                      onClick={() => {
                        let temp_dt = 'kn';
                        localStorage.setItem('apphomelang', temp_dt);
                        set_sel_lang(temp_dt);
                        setCurrentLine(0)
                        setUserSpeak(false)
                        fetchApi();
                        //window.location.reload();
                      }}
                    >
                      {getLanguageConstants('kn').HOME_TRY_IN}
                    </div>
                  </div>
                  <div className="col s4">
                    
                  <div
                      className={
                          sel_lang === 'ta'
                          ? 'lang_select_div_active'
                          : 'lang_select_div_inactive'
                        }
                        onClick={() => {
                            let temp_dt = 'ta';
                            localStorage.setItem('apphomelang', temp_dt);
                            set_sel_lang(temp_dt);
                            setCurrentLine(0)
                            setUserSpeak(false)
                            fetchApi();
                            //window.location.reload();
                        }}
                        >
                      {getLanguageConstants('ta').HOME_TRY_IN}
                    </div>
                        </div>
                </div>
              </div>
            </center>
          </div>
        </Flex>
        <div
          style={{
            boxShadow: '2px 2px 15px 5px grey',
            // border: '2px solid white',
            borderRadius: '30px',
          }}
          className="story-item"
        >
          <div className="row">
            {/* <h1 style={{position:'relative', left:'-100px'}}>{posts?.data[0]?.title}</h1> */}
            {/* <Modal /> */}
            {/* <button onClick={()=> setUserSpeak(!isUserSpeak)}>see Score</button> */}
            {
              <>
                {posts?.data?.map((post, ind) =>
                  currentLine === ind ? (
                    <Flex
                      pos={'relative'}
                      w={'108%'}
                      className="story-box-container"
                      key={ind}
                    >
                      {/* {console.log(post.data[0])} */}
                      {console.log(currentLine)}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '40vh',
                        }}
                      >
                        <Box p="4">
                          <h1 className="story-line">
                            {
                              post?.data[0]?.[
                                localStorage.getItem('apphomelang')
                              ]?.text
                            }
                          </h1>
                          {localStorage.setItem(
                            'contentText',
                            post?.data[0]?.[localStorage.getItem('apphomelang')]
                              ?.text
                          )}
                        </Box>
                      </div>
                    </Flex>
                  ) : (
                    ''
                  )
                )}
              </>
            }
          </div>
          {
            <div
              style={{
                display: 'flex',
                gap: '20px',
                position: 'relative',
                bottom: '-220px',
                left: '-40%',
              }}
            >
              {currentLine === posts?.data?.length ? (
                ''
              ) : (
                <>
                  {isUserSpeak ? (
                    isAudioPlay !== 'recording' && (
                      <div>
                        <VStack
                          alignItems="center"
                          gap="5"
                          style={{ display: 'flex' }}
                        >
                          <div>
                            {flag ? (
                              <img
                                className="play_btn"
                                src={play}
                                style={{ height: '72px', width: '72px' }}
                                onClick={() => playAudio()}
                                alt="play_audio"
                              />
                            ) : (
                              <img
                                className="play_btn"
                                src={pause}
                                style={{ height: '72px', width: '72px' }}
                                onClick={() => pauseAudio()}
                                alt="pause_audio"
                              />
                            )}
                            <h4
                              className="text-play m-0 "
                              style={{ position: 'relative' }}
                            >
                              Listen
                            </h4>
                          </div>
                          <div style={{ display: 'fl', textAlign: 'center' }}>
                            <img
                              style={{ height: '40px', cursor: 'pointer' }}
                              onClick={nextLine}
                              src={Next}
                              alt="next-button"
                            />
                            <p style={{ fontSize: '18px' }}>Try Next</p>
                          </div>
                        </VStack>
                      </div>
                    )
                  ) : (
                    <div className="voice-recorder">
                      <VStack style={{ marginTop: '-20px' }}>
                        <VoiceCompair
                          setVoiceText={setVoiceText}
                          setRecordedAudio={setRecordedAudio}
                          _audio={{ isAudioPlay: e => setIsAudioPlay(e) }}
                          flag={true}
                          setCurrentLine={setCurrentLine}
                          setStoryBase64Data={setStoryBase64Data}
                          saveIndb={saveIndb}
                          setUserSpeak={setUserSpeak}
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
                    </div>
                  )}
                </>
              )}
            </div>
          }
        </div>
        {currentLine === posts?.data?.length ? (
          <div className="button-container">
            <Link to={'/Results'}>
              <button className="custom-button">View Result</button>
            </Link>
            <Link to={'/storyList'}>
              <button className="custom-button">Back To StoryList</button>
            </Link>
          </div>
        ) : (
          ''
        )}
      </div>
      <Text>Session Id: {localStorage.getItem('virtualStorySessionID')}</Text>
    </div>
  );
};

export default Story;
