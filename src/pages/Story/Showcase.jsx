import React, { useEffect, useState } from 'react';
import './Story.css';
import { Box, Button, Center, Flex, HStack, Image, Progress, Spinner, Step, StepIcon, StepIndicator, StepStatus, StepTitle, Stepper, Text, VStack, useToast } from '@chakra-ui/react';
import VoiceCompair from '../../components/VoiceCompair/VoiceCompair';
// import Storyjson from '../Story/story1.json';
import play from '../../assests/Images/play-img.png';
import pause from '../../assests/Images/pause-img.png';
import Next from '../../assests/Images/next.png';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { compareArrays, replaceAll } from '../../utils/helper';
import Header from '../Header';
import PlaceHolder from '../../assests/Images/hackthon-images/collections.png'
import KnPlaceHolder from '../../assests/Images/hackthon-images/fox.png'
// import Modal from '../../components/Modal/Modal';
import Animation from '../../components/Animation/Animation'
import { showLoading, stopLoading } from '../../utils/Helper/SpinnerHandle';
import { PutObjectCommand } from "@aws-sdk/client-s3";
import S3Client from '../../config/awsS3'
import { error,response } from '../../services/telementryService';
import retry from '../../assests/Images/retry.svg'
import JSConfetti from 'js-confetti'
import calcCER from 'character-error-rate';
import { addPointerApi } from '../../utils/api/PointerApi';
import { uniqueId } from '../../services/utilService';
import completionCriteria from '../../config/practiceConfig';

const jsConfetti = new JSConfetti();

const Showcase = ({forceRerender, setForceRerender}) => {
  const [posts, setPosts] = useState([]);
  const [voiceText, setVoiceText] = useState('');
  localStorage.setItem('voiceText', voiceText.replace(/[.',|!|?']/g, ''));
  const [recordedAudio, setRecordedAudio] = useState(''); // blob
  localStorage.setItem('recordedAudio', recordedAudio);
  const [isAudioPlay, setIsAudioPlay] = useState(true);
  const [flag, setFlag] = useState(true);
  const [temp_audio, set_temp_audio] = useState(null); // base64url of teachertext
  const [loading, setLoading] = useState(true);
  const [isUserSpeak, setUserSpeak] = useState(false);
  const [storycase64Data, setStoryBase64Data] = useState('');
  const [contentType, setContentType] = useState('word')
  const [completionCriteriaIndex, setCompletionCriteriaIndex] = useState(parseInt(localStorage.getItem('userPracticeState') || 0));
  const practiceCompletionCriteria = [
    ...(JSON.parse(localStorage.getItem('criteria')) || []),
    ...completionCriteria[localStorage.getItem('userCurrentLevel') || 'm1'],
  ];

  const { slug } = useParams();
  const [currentLine, setCurrentLine] = useState(0);
  localStorage.setItem("sentenceCounter", currentLine)
  const navigate = useNavigate()
  const [pageno, setPageNo] = useState(1);
  const toast = useToast()
  const maxAllowedContent = localStorage.getItem('contentPracticeLimit') || 5;
  const max = practiceCompletionCriteria.length;
  const progressPercent = ((completionCriteriaIndex * maxAllowedContent + currentLine) / (max * maxAllowedContent)) * 100;
  
  React.useEffect(() => {
    if (voiceText == '-') {
      alert("Sorry I couldn't hear a voice. Could you please speak again?");
      setVoiceText('');
    }
  }, [voiceText]);
  React.useEffect(() => {
    fetchApi();
  }, [forceRerender]);

  const fetchApi = async () => {
    localStorage.setItem(
      'sub_session_id',uniqueId()
     );
    setLoading(true);


    try {
      const response = await fetch(
        `${process.env.REACT_APP_LEARNER_AI_APP_HOST}/lais/scores/GetContent/${practiceCompletionCriteria[completionCriteriaIndex]?.criteria || 'word'}/${localStorage.getItem('virtualID')}?language=${localStorage.getItem(
          'apphomelang'
        )}&contentlimit=${localStorage.getItem('contentPracticeLimit') || 5}&gettargetlimit=${localStorage.getItem('contentTargetLimit') || 5}`
      )
        .then(res => {
          return res.json();
        })
        .then(data => {
          const newPosts = data?.content || [];
          setPosts(newPosts);
          setLoading(false);
          setContentType(practiceCompletionCriteria[completionCriteriaIndex]?.criteria || 'word')
        });
      setLoading(false);
      setUserSpeak(false);
    } catch (err) {
      toast({
        position: 'top',
        title: `${err?.message === "Failed to fetch" ? "Please Check Your Internet Connection" : err?.message}`,
        status: 'error',
      })
      error(err, { err: err.name, errtype: 'CONTENT' }, 'ET');
    }



    // try {
    //   axios
    //     .post(`${process.env.REACT_APP_LEARNER_AI_APP_HOST}/content-service/v1/content/getAssessment`, {
    //       "tags": ["ASER", localStorage.getItem('userCurrentLevel')],
    //       "language": localStorage.getItem('apphomelang')
    //     })
    //     .then(res => {
    //       setPosts(res?.data?.data[0]?.content);
    //       setLoading(false);
    //       setContentType(res?.data?.data[0]?.category)
    //     });
    // } catch (err) {
    //   setLoading(false)
    //   toast({
    //     position: 'top',
    //     title: `${err?.message}`,
    //     status: 'error',
    //   })
    //   error(err, { err: err.name, errtype: 'CONTENT' }, 'ET');
    // }
  };

  React.useEffect(() => {
    learnAudio();
  }, [temp_audio]);

  const playAudio = () => {
    set_temp_audio(new Audio(posts[currentLine].contentSourceData[0].audioUrl));
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

  
  const handleAddPointer = async (point) => {
    const requestBody = {
      userId: localStorage.getItem('virtualID'),
      sessionId: localStorage.getItem('virtualStorySessionID'),
      points: point,
    };

    try {
      const response = await addPointerApi(requestBody);
      localStorage.setItem('totalSessionPoints',response.result.totalSessionPoints)
      localStorage.setItem('totalUserPoints',response.result.totalUserPoints)
    } catch (err) {
      toast({
        position: 'top',
        title: `${err?.message === "Failed to fetch" ? "Please Check Your Internet Connection" : err?.message}`,
        status: 'error',
      })
      error(err, { err: err.name, errtype: 'CONTENT' }, 'ET');
    }
  };



  const nextLine = count => {
    const percentage = ((currentLine+1) / posts?.length) * 100;
    addLessonApi(`showcase`,localStorage.getItem('userPracticeState'), percentage)
    setUserSpeak(!isUserSpeak)
    handleAddPointer(1)
    if (currentLine <= posts.length - 1) {
      setCurrentLine(currentLine + 1);
    }else{
      fetchCurrentLevel()
      setCurrentLine(0)
    }
  };

  const prevLine = count => {
    setUserSpeak(!isUserSpeak)
  };

  function findRegex(str) {
    var rawString = str;
    var regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
    var cleanString = rawString.replace(regex, '');
    return cleanString;
  }



  async function saveIndb(base64Data) {
    let lang = localStorage.getItem('apphomelang');
    showLoading();
    // .replace(/[.',|!|?-']/g, '')
    let responseText = "";
    const utcDate = new Date().toISOString().split('T')[0];
    const responseStartTime = new Date().getTime();
    axios
      .post(`${process.env.REACT_APP_LEARNER_AI_APP_HOST}/lais/scores/updateLearnerProfile/${lang}`, {
        audio: base64Data,
        user_id: localStorage.getItem('virtualID'),
        session_id: localStorage.getItem('virtualStorySessionID'),
        date: utcDate,
        original_text: findRegex(posts[currentLine]?.contentSourceData[0]?.text),
        language: lang,
        sub_session_id: localStorage.getItem('sub_session_id'),
        contentId:posts[currentLine].collectionId,
        contentType : contentType
      })
      .then(async res => {
        responseText = res.data.responseText
        const responseEndTime = new Date().getTime();
        const responseDuration = Math.round(
          (responseEndTime - responseStartTime) / 1000
        );

        let texttemp = responseText.toLowerCase();
        texttemp = replaceAll(texttemp, '.', '');
        texttemp = replaceAll(texttemp, "'", '');
        texttemp = replaceAll(texttemp, ',', '');
        texttemp = replaceAll(texttemp, '!', '');
        texttemp = replaceAll(texttemp, '|', '');
        texttemp = replaceAll(texttemp, '?', '');
        const studentTextArray = texttemp.split(' ');

        let tempteacherText = posts[currentLine]?.contentSourceData[0]?.text.toLowerCase();
        tempteacherText = tempteacherText.replace(/\u00A0/g, ' ');
        tempteacherText = tempteacherText.trim();
        tempteacherText = replaceAll(tempteacherText, '.', '');
        tempteacherText = replaceAll(tempteacherText, "'", '');
        tempteacherText = replaceAll(tempteacherText, ',', '');
        tempteacherText = replaceAll(tempteacherText, '!', '');
        tempteacherText = replaceAll(tempteacherText, '|', '');
        tempteacherText = replaceAll(tempteacherText, '?', '');
        const teacherTextArray = tempteacherText.split(' ');

        let student_correct_words_result = [];
        let student_incorrect_words_result = [];
        let originalwords = teacherTextArray.length;
        let studentswords = studentTextArray.length;
        let wrong_words = 0;
        let correct_words = 0;
        let result_per_words = 0;
        let result_per_words1 = 0;
        let occuracy_percentage = 0;

        let word_result_array = compareArrays(teacherTextArray, studentTextArray);

        for (let i = 0; i < studentTextArray.length; i++) {
          if (teacherTextArray.includes(studentTextArray[i])) {
            correct_words++;
            student_correct_words_result.push(
              studentTextArray[i]
            );
          } else {
            wrong_words++;
            student_incorrect_words_result.push(
              studentTextArray[i]
            );
          }
        }
        //calculation method
        if (originalwords >= studentswords) {
          result_per_words = Math.round(
            Number((correct_words / originalwords) * 100)
          );
        } else {
          result_per_words = Math.round(
            Number((correct_words / studentswords) * 100)
          );
        }

        const errorRate = calcCER(responseText, tempteacherText);
        let finalScore = 100 - errorRate * 100;

        finalScore = finalScore < 0 ? 0 : finalScore;

        let word_result = (finalScore === 100) ? "correct" : "incorrect";

        if (process.env.REACT_APP_CAPTURE_AUDIO === 'true') {
          let getContentId = currentLine;
          var audioFileName = `${process.env.REACT_APP_CHANNEL}/${localStorage.getItem('virtualStorySessionID')}-${Date.now()}-${getContentId}.wav`;

          const command = new PutObjectCommand({
            Bucket: process.env.REACT_APP_AWS_S3_BUCKET_NAME,
            Key: audioFileName,
            Body: Uint8Array.from(window.atob(base64Data), (c) => c.charCodeAt(0)),
            ContentType: 'audio/wav'
          });
          try {
            const response = await S3Client.send(command);
          } catch (err) {
            toast({
              position: 'top',
              title: `${err?.message}`,
              status: 'error',
            })
            error(err, { err: err.name, errtype: 'CONTENT' }, 'ET');
          }
        }
        response({ // Required
          "target": process.env.REACT_APP_CAPTURE_AUDIO === 'true' ? `${audioFileName}` : '', // Required. Target of the response
          //"qid": "", // Required. Unique assessment/question id
          "type": "SPEAK", // Required. Type of response. CHOOSE, DRAG, SELECT, MATCH, INPUT, SPEAK, WRITE
          "values": [
            { "original_text": posts[currentLine]?.contentSourceData[0]?.text },
            { "response_text": responseText },
            { "response_correct_words_array": student_correct_words_result },
            { "response_incorrect_words_array": student_incorrect_words_result },
            { "response_word_array_result": word_result_array },
            { "response_word_result": word_result },
            { "accuracy_percentage": finalScore },
            { "duration": responseDuration }
          ]
        },
          'ET'
        )
        stopLoading();
        setUserSpeak(true)
        handleStarAnimation();
      })
      .catch(err => {
        toast({
          position: 'top',
          title: `${err?.message}`,
          status: 'error',
        })
        error(err, { err: err.name, errtype: 'CONTENT' }, 'ET');
        stopLoading();
      });
  }

  const handleStarAnimation = () => {
    jsConfetti.addConfetti({
      emojis: ['⭐', '✨', '🌟', '⭐', '✨', '🌟',],
    })
    jsConfetti.addConfetti({
      emojis: ['⭐', '✨', '🌟', '⭐', '✨', '🌟',],
    })
    jsConfetti.addConfetti({
      emojis: ['⭐', '✨', '🌟', '⭐', '✨', '🌟',],
    })
  }

  const fetchCurrentLevel = async () => {
    setLoading(true);
    try {
      axios
    .post(
      `${process.env.REACT_APP_LEARNER_AI_APP_HOST}/lais/scores/getSetResult`,
      {
        sub_session_id: localStorage.getItem('sub_session_id'),
        contentType : contentType,
        session_id: localStorage.getItem('virtualStorySessionID'),
        user_id: localStorage.getItem('virtualID'),
        language:localStorage.getItem('apphomelang')|| 'ta'
      }
    )
        .then(data => {
          setLoading(false);

          if ( data?.data?.data?.sessionResult === 'fail' && localStorage.getItem('firstPracticeSessionCompleted') === 'true'){
            toast({
              position: 'top',
              duration: '2000',
              title: `You need to practice more to complete this level.`,
              status: 'error',
            })
            localStorage.setItem('userPracticeState',parseInt(localStorage.getItem('userPracticeState'))+1)            
            addLessonApi('practice',localStorage.getItem('userPracticeState'), parseInt(progressPercent));
            navigate('/practice')
          }else if(data?.data?.data?.sessionResult === 'fail' && localStorage.getItem('firstPracticeSessionCompleted') === 'false'){
            toast({
              position: 'top',
              duration: '2000',
              title: `Level Reset!! You need to practice more to complete this level.`,
              status: 'error',
            })
          
            localStorage.setItem('userPracticeState', 0)
            localStorage.setItem('firstPracticeSessionCompleted', false)
            addLessonApi('practice',0, 0);
            navigate('/practice')
          }
          else{
            toast({
              position: 'top',
              duration: '2000',
              title: `Congratulations! \n
              Your current level has been upgraded`,
              status: 'success'
            })
            localStorage.removeItem('progressData');
            localStorage.setItem('userPracticeState', 0)
            localStorage.setItem('firstPracticeSessionCompleted', false)
            localStorage.setItem('userCurrentLevel', data?.data?.data?.currentLevel)
            fetchMileStone();
            addLessonApi('practice',0, 0);
            navigate('/practice')
          }
          fetchMileStone();
        });
    } catch (err) {
      setLoading(false);
      toast({
        position: 'top',
        title: `${err?.message}`,
        status: 'error',
      })
      error(err, { err: err.name, errtype: 'CONTENT' }, 'ET');
    }
  };

  const fetchMileStone = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_LEARNER_AI_APP_HOST}/lais/scores/getMilestone/user/${localStorage.getItem('virtualID')}`
      )
        .then(res => {
          return res.json();
        })
        .then(data => {
          setLoading(false);
          localStorage.setItem('userCurrentLevel', data?.data?.milestone_level)
        });
    } catch (err) {
      setLoading(false);
      toast({
        position: 'top',
        title: `${err?.message === "Failed to fetch" ? "Please Check Your Internet Connection" : err?.message}`,
        status: 'error',
      })
      error(err, { err: err.name, errtype: 'CONTENT' }, 'ET');
    }
  };

  const location = useLocation();

  const addLessonApi = (milestone,lesson, progressPercentage)=>{
    const base64url = `${process.env.REACT_APP_LEARNER_AI_APP_HOST}/lp-tracker/api`;
    const pathnameWithoutSlash = location.pathname.slice(1);
  fetch(`${base64url}/lesson/addLesson`,{
    method:'POST',
    headers:{
      "Content-Type":"application/json"
      },
      body:JSON.stringify({
        userId : localStorage.getItem('virtualID'),
        sessionId : localStorage.getItem('virtualStorySessionID'),
        milestone : milestone,
        lesson : lesson,
        progress: progressPercentage
        })
  })
 }

 const calculateFontSize = (text) => {
  const textLength = text ? text.length : 0;
  const initialFontSize = 38;
  const maxThresholdLength = 100;
  const fontSizeDecrement = 0.1;
  const minimumFontSize = 18;

  const adjustedFontSize = Math.max(
    initialFontSize - fontSizeDecrement * Math.max(textLength - maxThresholdLength, 0),
    minimumFontSize
  );

  return adjustedFontSize;
};


  useEffect(() => {

    if (currentLine > 0 &&  currentLine === posts?.length ) {
        fetchCurrentLevel()
        setCurrentLine(0)
    }
  }, [currentLine])

  return (
    <>
      <Header active={3} forceRerender={forceRerender} setForceRerender={setForceRerender} />

      <Center pt={'10vh'} className='bg'>
        <Flex flexDirection={'column'}>
        <div
          style={{
            boxShadow: '2px 2px 15px 5px grey',
            borderRadius: '30px',
            width: '75vw',
          }}
          className="story-item"
        >
          {!posts?.length>0 ? <>
            <div style={{ display: 'flex', margin: '20px', justifyContent:'center' }}>
                  <HStack>
                    <div style={{ margin: '20px', textAlign: "center" }}>
                      <p style={{ color:'red' }}>No Content Available</p>
                    </div>
                  </HStack>
                </div>
          </>:<></>}
          {loading ? (
            <Center minH='50vh'><Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
          /></Center>
          ) : isUserSpeak ? (
            <>
              <VStack>
                <div>
                  {currentLine === 1 ? <h1 style={{ fontSize: '60px', marginTop: '40px', textAlign: 'center' }}>Very Good</h1> : currentLine === 2 ? <h1 style={{ fontSize: '60px', marginTop: '40px', textAlign: 'center' }}>Nice Try</h1> : currentLine === 3 ? <h1 style={{ fontSize: '60px', marginTop: '40px', textAlign: 'center' }}>WoW</h1> : <h1 style={{ fontSize: '60px', marginTop: '60px', textAlign: 'center' }}>Well Done</h1>}
                </div>
                <div style={{ display: 'flex', margin: '20px', }}>
                  <HStack>
                    <div style={{ margin: '20px', textAlign: "center" }}>
                      <img style={{ height: '40px', cursor: 'pointer', }} onClick={nextLine} src={Next} alt='next-button' />
                      <p style={{ fontSize: '18px' }}>Try Next</p>
                    </div>
                    <div style={{ margin: '20px', textAlign: "center" }}>
                      <img style={{ height: '40px', cursor: 'pointer', }} onClick={prevLine} src={retry} alt="retry-again" />
                      <p style={{ fontSize: '18px' }}>Try Again</p>
                    </div>
                  </HStack>
                </div>
              </VStack>
            </>
          ) : (
            <>
              {posts?.map((post, ind) =>
                currentLine === ind ? (
                    <div className='story-box-container' key={ind}>
                      <Center w={'100%'}>
                        <img
                          className="story-image"
                          src={localStorage.getItem('apphomelang') === 'kn' ? KnPlaceHolder : PlaceHolder
                          }
                          alt={post?.name}
                        />
                      </Center>
                      <Center w={'100%'}>
                        <VStack>
                          <div>
                            <h1 
                              style={{
                                textAlign: 'center',
                                fontSize: `${calculateFontSize(posts[currentLine]?.contentSourceData[0]?.text)}px`,
                                whiteSpace: 'break-spaces',
                                wordWrap: 'break-word',
                              }}
                              className='story-line'>
                              {posts[currentLine]?.contentSourceData[0].text}
                            </h1>
                            {localStorage.setItem(
                              'contentText',
                              posts[currentLine]?.contentSourceData[0].text
                              )}
                          </div>
                          <div>
                            {
                              isUserSpeak ? <></> : <div>
                                {currentLine === posts?.length ? (
                                  ''
                                  ) : (
                                  <>
                                    <div className='voice-recorder'>
                                      <VStack>
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
                                          <h4 className="text-speak m-0">
                                            Stop
                                          </h4>
                                        ) : (
                                          <h4 className="text-speak m-0">
                                            Speak
                                          </h4>
                                        )}
                                      </VStack>
                                    </div>
                                  </>
                                )}
                              </div>
                            }
                          </div>
                        </VStack>
                      </Center>
                    </div>
                ) : (
                  ''
                )
              )}
            </>
          )}

        </div>
      <Flex justifyContent={'center'} paddingTop={10}>
          <Stepper size='md' colorScheme='yellow' index={completionCriteriaIndex}>
            {practiceCompletionCriteria.map((step, index) => (
                    <Box key={index}>
                    {step.title ==='S1' && <Step key={index}>
                      <StepIndicator>
                        <StepStatus
                          complete={<StepIcon />}
                          incomplete={<StepTitle>{step.title}</StepTitle>}
                          active={<StepTitle>{step.title}</StepTitle>}
                          />
                      </StepIndicator>
                    </Step>}
                    {step.title ==='S2' && <Step key={index}>
                      <StepIndicator>
                        <StepStatus
                          complete={<StepIcon />}
                          incomplete={<StepTitle>{step.title}</StepTitle>}
                          active={<StepTitle>{step.title}</StepTitle>}
                          />
                      </StepIndicator>
                    </Step>}
                          </Box>
            ))}
          </Stepper>
      </Flex>
    </Flex>
  </Center>
       

      {/* <Text>Session Id: {localStorage.getItem('virtualStorySessionID')}</Text> */}

    </>
  );
};

export default Showcase;
