import React, { useEffect, useState } from 'react';
import './Story.css';
import { Box, Button, Center, Flex, HStack, Image, Spinner, Text, VStack, useToast } from '@chakra-ui/react';
import VoiceCompair from '../../components/VoiceCompair/VoiceCompair';
// import Storyjson from '../Story/story1.json';
import play from '../../assests/Images/play-img.png';
import pause from '../../assests/Images/pause-img.png';
import Next from '../../assests/Images/next.png';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
import { response } from '../../services/telementryService';
import retry from '../../assests/Images/retry.svg'
import JSConfetti from 'js-confetti'
import calcCER from 'character-error-rate';

const jsConfetti = new JSConfetti();

const Showcase = () => {
  const [posts, setPosts] = useState([]);
  const [voiceText, setVoiceText] = useState('');
  // console.log(voiceText);
  localStorage.setItem('voiceText', voiceText.replace(/[.',|!|?']/g, ''));
  const [recordedAudio, setRecordedAudio] = useState(''); // blob
  localStorage.setItem('recordedAudio', recordedAudio);
  const [isAudioPlay, setIsAudioPlay] = useState(true);
  const [flag, setFlag] = useState(true);
  const [temp_audio, set_temp_audio] = useState(null); // base64url of teachertext
  const [loading, setLoading] = useState(true);
  const [isUserSpeak, setUserSpeak] = useState(false);
  const [storycase64Data, setStoryBase64Data] = useState('');

  const { slug } = useParams();
  const [currentLine, setCurrentLine] = useState(0);
  localStorage.setItem("sentenceCounter", currentLine)
  const navigate = useNavigate()
  const [pageno, setPageNo] = useState(1);
  const toast = useToast()

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
    try {
      axios
        .post(`https://www.learnerai.theall.ai/content-service/v1/content/getAssessment`, {
          "tags": ["ASER", localStorage.getItem('userCurrentLevel')],
          "language": localStorage.getItem('apphomelang')
        })
        .then(res => {
          console.log(res)
          setPosts(res.data.data[0].content);
          setLoading(false);
        });
    } catch (error) {
      setLoading(false)
      console.error(error.message);
    }
  };
console.log(currentLine)
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


  const nextLine = count => {
    setUserSpeak(!isUserSpeak)
    if (currentLine <= posts.length - 1) {
      setCurrentLine(currentLine + 1);
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
    // console.log(posts?.data[currentLine]?.data[0]?.[lang]?.text);
    axios
      .post(`https://www.learnerai.theall.ai/lais/scores/updateLearnerProfile/${lang}`, {
        audio: base64Data,
        user_id: localStorage.getItem('virtualID'),
        session_id: localStorage.getItem('virtualStorySessionID'),
        date: utcDate,
        original_text: findRegex(posts[currentLine]?.contentSourceData[0]?.text),
        language: lang,
      })
      .then(async res => {
        // console.log(res);
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
            Bucket: process.env.REACT_APP_AWS_s3_BUCKET_NAME,
            Key: audioFileName,
            Body: Uint8Array.from(window.atob(base64Data), (c) => c.charCodeAt(0)),
            ContentType: 'audio/wav'
          });
          try {
            const response = await S3Client.send(command);
            // console.log("Data Ala",response);
          } catch (err) {
            console.error(err);
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
      .catch(error => {
        toast({
          position: 'top',
          title: `Error! Please try again.`,
          status: 'error',
        })
        console.error(error);
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
      const response = await fetch(
        `https://www.learnerai.theall.ai/lais/scores/getMilestoneProgress/session/${localStorage.getItem('virtualStorySessionID')}`
      )
        .then(res => {
          return res.json();
        })
        .then(data => {
          setLoading(false);
          if (localStorage.getItem('userCurrentLevel') === data.currentLevel && localStorage.getItem('firstPracticeSessionCompleted') === 'true'){
            toast({
              position: 'top',
              title: `Level Reset!! You need to practice more to complete this level.`,
              status: 'error',
            })
            localStorage.removeItem('progressData');
            navigate('/practice')
          }else if(localStorage.getItem('userCurrentLevel') === data.currentLevel && localStorage.getItem('firstPracticeSessionCompleted') === 'false'){
            toast({
              position: 'top',
              title: `You need to practice more to complete this level.`,
              status: 'error',
            })
            navigate('/practice')
          }
          else{
            toast({
              position: 'top',
              title: `Congratulations! \n
              Your current level has been upgraded`,
              status: 'success'
            })
            localStorage.removeItem('progressData');
            localStorage.setItem('userPracticeState', 0)
            localStorage.setItem('firstPracticeSessionCompleted', false)
            navigate('/showcase')
          }
          localStorage.setItem('userCurrentLevel', data.currentLevel)
        });
    } catch (error) {
      setLoading(false);
      console.error(error.message);
    }
  };

  useEffect(() => {

    if (currentLine > 0 &&  currentLine === posts?.length ) {
        fetchCurrentLevel()
        setCurrentLine(0)
    }
  }, [currentLine])

  return (
    <>
      <Header active={3} />

      <Center pt={'10vh'} className='bg'>
        <div
          style={{
            boxShadow: '2px 2px 15px 5px grey',
            borderRadius: '30px',
            width: '75vw',
          }}
          className="story-item"
        >

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
                  <>
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
                            <h1 style={{ textAlign: "center" }} className='story-line'>
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
                  </>

                ) : (
                  ''
                )
              )}
            </>
          )}

        </div>
      </Center>

      {/* <Text>Session Id: {localStorage.getItem('virtualStorySessionID')}</Text> */}

    </>
  );
};

export default Showcase;
