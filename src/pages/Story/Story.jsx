import React, { useState } from 'react';
import './Story.css';
import { Box, Button, Flex, Image, Text, VStack } from '@chakra-ui/react';
import VoiceCompair from '../../components/VoiceCompair/VoiceCompair';
// import Storyjson from '../Story/story1.json';
import play from '../../assests/Images/play-img.png';
import pause from '../../assests/Images/pause-img.png';
import Next from '../../assests/Images/next.png';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { compareArrays, replaceAll } from '../../utils/helper';
import Header from '../Header';

const Story = () => {
  const [posts, setPosts] = useState([]);
  const [voiceText, setVoiceText] = useState('');
  localStorage.setItem('voiceText', voiceText.replace(/[.',|!|?']/g, ''));
  const [recordedAudio, setRecordedAudio] = useState(''); // blob
  localStorage.setItem('recordedAudio', recordedAudio);
  const [isAudioPlay, setIsAudioPlay] = useState(true);
  const [flag, setFlag] = useState(true);
  const [temp_audio, set_temp_audio] = useState(null); // base64url of teachertext
  const [loading, setLoading] = useState(true);
  const [getGap, setGetGap] = useState(null);
  const [base64Data, setBase64Data] = useState('');
  const { slug } = useParams();

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
        `https://all-content-respository-backend.onrender.com/v1/WordSentence/pagination?type=Sentence&collectionId=${slug}`
      )
        .then(res => {
          return res.json();
        })
        .then(data => {
          setPosts(data);
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
    set_temp_audio(new Audio(posts?.data[currentLine].data[0].hi.audio));
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

  const [currentLine, setCurrentLine] = useState(0);

  const nextLine = count => {
    if (currentLine < posts?.data.length - 1) {
      setCurrentLine(currentLine + 1);
    }
  };
  const prevLine = count => {
    if (currentLine > 0) {
      setCurrentLine(currentLine - 1);
    }
  };

  function saveIndb(output) {
    const utcDate = new Date().toISOString().split('T')[0];
    axios.post(`https://telemetry-dev.theall.ai/learner/scores`, {
      taskType: 'asr',
      output: output,
      config: null,
      user_id: 8923471085,
      session_id: '8923471085' + Date.now(),
      date: utcDate,
      original_text: localStorage.getItem('contentText'),
      response_text: '',
    });
  }

  // API
  const getASROutput = async (asrInput, blob) => {
    console.log(asrInput,blob);
    const asr_api_key = process.env.REACT_APP_ASR_API_KEY;
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', asr_api_key);

    var payload = JSON.stringify({
      config: {
        serviceId: 'ai4bharat/conformer-hi-gpu--t4',
        language: {
          sourceLanguage: 'hi',
        },
        transcriptionFormat: {
          value: 'transcript',
        },
        bestTokenCount: 2,
        audioFormat: 'wav',
        samplingRate: 16000,
      },
      audio: [
        {
          audioContent: asrInput,
        },
      ],
    });

    const abortController = new AbortController();

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: payload,
      redirect: 'follow',
      signal: abortController.signal,
    };

    const ASR_REST_URL =
      'https://api.dhruva.ai4bharat.org/services/inference/asr';
    const responseStartTime = new Date().getTime();

    fetch(ASR_REST_URL, requestOptions)
      .then(response => response.text())
      .then(async result => {
        clearTimeout(waitAlert);
        const responseEndTime = new Date().getTime();
        const responseDuration = Math.round(
          (responseEndTime - responseStartTime) / 1000
        );

        var apiResponse = JSON.parse(result);
        saveIndb(apiResponse.output);

        if (apiResponse['output'][0]['source'] == '') {
          alert("Sorry I couldn't hear a voice. Could you please speak again?");
        }

        // setTamilRecordedText(apiResponse['output'][0]['source']);

        // Data Manipulation on result capturing for telemetry log
        let texttemp = apiResponse['output'][0]['source'].toLowerCase();
        const studentTextArray = texttemp.split(' ');

        let tempteacherText = localStorage.getItem('contentText').toLowerCase();
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

        let word_result_array = compareArrays(
          teacherTextArray,
          studentTextArray
        );

        for (let i = 0; i < studentTextArray.length; i++) {
          if (teacherTextArray.includes(studentTextArray[i])) {
            correct_words++;
            student_correct_words_result.push(studentTextArray[i]);
          } else {
            wrong_words++;
            student_incorrect_words_result.push(studentTextArray[i]);
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
        let word_result = result_per_words == 100 ? 'correct' : 'incorrect';

        if (process.env.REACT_APP_CAPTURE_AUDIO === 'true') {
          let getContentId =
            parseInt(localStorage.getItem('content_random_id')) + 1;
          var audioFileName = `${process.env.REACT_APP_CHANNEL}/${
            localStorage.getItem('contentSessionId') === null
              ? localStorage.getItem('allAppContentSessionId')
              : localStorage.getItem('contentSessionId')
          }-${Date.now()}-${getContentId}.wav`;
        }
      })
      .catch(error => {
        clearTimeout(waitAlert);
        // stopLoading();
        if (error.name !== 'AbortError') {
          alert(
            'Unable to process your request at the moment.Please try again later.'
          );
          console.log('error', error);
        }
      });
    const waitAlert = setTimeout(() => {
      abortController.abort();
      alert(
        'Server response is slow at this time. Please explore other lessons'
      );
    }, 10000);
  };
  const handleSubmit = () => {
    playAudio();
    // setCounter(old => old + 1);
    // if (counter === 5) {
    //   setCounter(1);
    //   navigate('/exploreandlearn/score');
    // }
    var base64 = base64Data.split(',')[1];
    getASROutput(base64, localStorage.getItem('apphomelang'));
  };
  

  
  // console.log(posts?.data[currentLine]?.data[0]?.hi?.audio);
  return (
    <><><Header /></><div className="story-container">

      <Flex gap={14}>
        <Image
          transform={'scaleX(-1)'}
          h={'32'} Result
          src={Next}
          onClick={prevLine}
          alt="next" />
        <Image h={'32'} src={Next} onClick={nextLine} alt="next" />
      </Flex>
      <div className="story-item">
        <div className="row">
          {/* <h1 style={{position:'relative', left:'-100px'}}>{posts?.data[0]?.title}</h1> */}
          {loading ? (
            <div>Loading...</div>
          ) : (
            posts?.data?.map((post, ind) => currentLine === ind ? (
              <Flex key={ind}>
                <Image
                  className="story-image"
                  src={post?.image}
                  alt={post?.title} />
                <Box key={ind}>
                  <Box p="4">
                    <h1>{post?.data[0]?.hi?.text}</h1>
                    {localStorage.setItem("contentText", post?.data[0]?.hi?.text)}
                    {localStorage.setItem("storyTitle", post?.title)}
                  </Box>
                </Box>
              </Flex>
            ) : (
              ''
            )
            )
          )}
        </div>
        {isAudioPlay !== 'recording' && (
          <VStack alignItems="center" gap="5">
            {flag ? (
              <img
                className="play_btn"
                src={play}
                style={{ height: '72px', width: '72px' }}
                onClick={() => playAudio()}
                alt="play_audio" />
            ) : (
              <img
                className="play_btn"
                src={pause}
                style={{ height: '72px', width: '72px' }}
                onClick={() => pauseAudio()}
                alt="pause_audio" />
            )}
            <h4 className="text-play m-0 " style={{ position: 'relative' }}>
              Listen
            </h4>
          </VStack>
        )}
        <VStack>

          <VoiceCompair
            setVoiceText={setVoiceText}
            setRecordedAudio={setRecordedAudio}
            _audio={{ isAudioPlay: e => setIsAudioPlay(e) }}
            flag={true}
            setCurrentLine={setCurrentLine} />
          {isAudioPlay === 'recording' ? (
            <h4 className="text-speak m-0">Stop</h4>
          ) : (
            <h4 className="text-speak m-0">Speak</h4>
          )}
        </VStack>
      </div>

    </div></>
  );
};

export default Story;
