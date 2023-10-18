import React, { useEffect, useState } from 'react';
import './Story.css';
import { Box, Button, Flex, Image, Text, VStack } from '@chakra-ui/react';
import VoiceCompair from '../../components/VoiceCompair/VoiceCompair';
// import Storyjson from '../Story/story1.json';
import play from '../../assests/Images/play-img.png';
import pause from '../../assests/Images/pause-img.png';
import Next from '../../assests/Images/next.png';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { compareArrays, replaceAll } from '../../utils/helper';
import Header from '../Header';
import PlaceHolder from '../../assests/Images/hackthon-images/images.jpeg'
// import Modal from '../../components/Modal/Modal';
import Animation from '../../components/Animation/Animation'
import { showLoading, stopLoading } from '../../utils/Helper/SpinnerHandle';
import { PutObjectCommand } from "@aws-sdk/client-s3";
import S3Client from '../../config/awsS3'
import { response } from '../../services/telementryService';
import JSConfetti from 'js-confetti'
// import MyStoryimg from '../../assests/Images/DefaultStoryImg.png'
const jsConfetti = new JSConfetti();

const Story = () => {
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
  const [isUserSpeak,setUserSpeak] = useState(false);
  const [storycase64Data, setStoryBase64Data] = useState('');

  const { slug } = useParams();
  const [currentLine, setCurrentLine] = useState(0);
  localStorage.setItem("sentenceCounter", currentLine)
  const navigate = useNavigate()
  localStorage.setItem('apphomelang'
  ,'ta')
  const[pageno,setPageNo] = useState(1);

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
        `https://telemetry-dev.theall.ai/content-service/v1/WordSentence/pagination?limit=10&type=Sentence&collectionId=${slug}`
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
            // console.log(data);
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

  React.useEffect(() => {
    learnAudio();
  }, [temp_audio]);

  const playAudio = () => {
    set_temp_audio(new Audio(posts?.data[currentLine].data[0].ta.audio));
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
    if (currentLine <= posts?.data?.length - 1) {
      setCurrentLine(currentLine + 1);
    }
  };

  const prevLine = count => {
    if (currentLine > 0) {
      setCurrentLine(currentLine - 1);
    }
  };

  function findRegex(str) {
    var rawString = str;
    var regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
    var cleanString = rawString.replace(regex, '');
    return cleanString;
  }



  async function  saveIndb(base64Data) {
    showLoading();
    // .replace(/[.',|!|?-']/g, '')
    let responseText = "";
    const utcDate = new Date().toISOString().split('T')[0];
    const responseStartTime = new Date().getTime();
    axios
      .post(`https://www.learnerai-dev.theall.ai/lais/scores/updateLearnerProfile/ta`, {
        audio:base64Data,
        user_id: localStorage.getItem('virtualID'),
        session_id: localStorage.getItem('virtualStorySessionID'),
        date: utcDate,
        original_text: findRegex(posts?.data[currentLine]?.data[0]?.ta?.text),
        language: 'ta',
      })
      .then( async res => {  
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

        let tempteacherText = posts?.data[currentLine]?.data[0]?.ta?.text.toLowerCase();
        tempteacherText = replaceAll(tempteacherText, '.', '');
        tempteacherText = replaceAll(tempteacherText, "'", '');
        tempteacherText = replaceAll(tempteacherText, ',', '');
        tempteacherText = replaceAll(tempteacherText, '!', '');
        tempteacherText = replaceAll(tempteacherText, '|', '');
        tempteacherText = replaceAll(tempteacherText, '?', '');
        const teacherTextArray = tempteacherText.split(' ');;

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

        let word_result = (result_per_words === 100) ? "correct" : "incorrect";  

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
              { "original_text": posts?.data[currentLine]?.data[0]?.ta?.text },
              { "response_text": responseText},
              { "response_correct_words_array": student_correct_words_result},
              { "response_incorrect_words_array": student_incorrect_words_result},
              { "response_word_array_result": word_result_array},
              { "response_word_result": word_result},
              { "accuracy_percentage": result_per_words},
              { "duration":  responseDuration}
           ]
      },
        'ET'
      )
        stopLoading();
        setUserSpeak(true)
        handleStarAnimation();
        
      })
      .catch(error => {
        console.error(error);
        stopLoading();
      });
  }

  const handleStarAnimation=()=>{
    jsConfetti.addConfetti({
      emojis: ['⭐', '✨', '🌟', '⭐', '✨', '🌟',],
    })
    jsConfetti.addConfetti({
      emojis: ['⭐', '✨', '🌟', '⭐', '✨', '🌟',],
    })
    jsConfetti.addConfetti({
      emojis: ['⭐', '✨', '🌟','⭐', '✨', '🌟',],
    })

  }

  useEffect(()=>{

    if(currentLine === posts?.data?.length){
      navigate('/Results')
      setPageNo(pageno+1)
    }
  },[currentLine])

  // console.log(posts?.data[currentLine]?.data[0]?.hi?.audio);
  return (
    <div style={{height:'97vh'}}>
      <Header />
      {/* <button onClick={GetRecommendedWordsAPI}>getStars</button> */}
      <div
        style={{ boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',height:'97vh' }}
        className="story-container"
      >
        <Flex gap={14}>
  
        </Flex>
        <div
          style={{
            boxShadow: '2px 2px 15px 5px grey',
            border: '2px solid white',
            borderRadius: '30px',
          }}
          className="story-item"
        >
          <div className="row">
            {/* <h1 style={{position:'relative', left:'-100px'}}>{posts?.data[0]?.title}</h1> */}
            {/* <Modal /> */}
            {/* <button onClick={()=> setUserSpeak(!isUserSpeak)}>see Score</button> */}
            {loading ? (
              <div>Loading...</div>
            ) : isUserSpeak ? (
              <>
            
              <Flex>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '40vh',
                      position:'relative',
                      left:'-40px'
                    }}
                  >
                    <Box  p="4">
                      {currentLine === 1? <h1 style={{fontSize: '55px', marginTop: '40px' }}>Very Good</h1>: currentLine===2? <h1 style={{fontSize: '55px', marginTop: '40px' }}>Nice Try</h1>: currentLine === 3?<h1 style={{fontSize: '55px', marginTop: '40px' }}>WoW</h1>:<h1 style={{fontSize: '55px', marginTop: '40px' }}>Well Done</h1>}           
                      <div style={{ margin:'20px', textAlign:"center"}}>
                      <img style={{height:'40px', cursor:'pointer',}} onClick={nextLine} src={Next} alt='next-button'/>
                      <p >Try Next</p>
                      </div>
                    </Box>
                  </div>
                </Flex>
        
         
              </>
            ) : (
              <>
                       {posts?.data?.map((post, ind) =>
                  currentLine === ind ? (
                <Flex key={ind}>
                      <Image
                        className="story-image"
                        // src={post?.image}
                        src={PlaceHolder
                          // 'data:image/jpeg;base64,' +
                          // post.image.replace('data:image/jpeg;base64,', '')
                        }
                        alt={post?.title}
                      />
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '40vh',
                        }}
                      >
                        <Box p="4">
                          <h1 style={{ fontSize: '55px', marginTop: '40px' }}>
                            {/* {post?.data[0]?.ta?.text} */}
                            {posts?.data[currentLine]?.data[0]?.ta?.text }
                          </h1>
                          {localStorage.setItem(
                            'contentText',
                            post?.data[0]?.ta?.text
                          )}
                        </Box>
                      </div>
                    </Flex>
                  ) : (
                    ''
                  )
                )}
              </>
            )}
          </div>
          {
            isUserSpeak? <></> : <div
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
                {isAudioPlay !== 'recording' && (
                  <>
                  </>
                  // <VStack alignItems="center" gap="5">
                  //   {flag ? (
                  //     <img
                  //       className="play_btn"
                  //       src={play}
                  //       style={{ height: '72px', width: '72px' }}
                  //       onClick={() => playAudio()}
                  //       alt="play_audio"
                  //     />
                  //   ) : (
                  //     <img
                  //       className="play_btn"
                  //       src={pause}
                  //       style={{ height: '72px', width: '72px' }}
                  //       onClick={() => pauseAudio()}
                  //       alt="pause_audio"
                  //     />
                  //   )}
                  //   <h4
                  //     className="text-play m-0 "
                  //     style={{ position: 'relative' }}
                  //   >
                  //     Listen
                  //   </h4>
                  // </VStack>
                )}
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
                    <h4
                      style={{ position: 'relative', top: '-12px' }}
                      className="text-speak m-0"
                    >
                      Stop
                    </h4>
                  ) : (
                    <h4
                      style={{ position: 'relative', top: '-12px' }}
                      className="text-speak m-0"
                    >
                      Speak
                    </h4>
                  )}
                </VStack>
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
