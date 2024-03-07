import React, { useState, useEffect } from 'react';
import AudioRecorderCompairUI from '../AudioRecorderCompairUI/AudioRecorderCompairUI';
import AudioRecorderTamil from '../AudioRecorderTamil/AudioRecorderTamil';
import { response, interact } from '../../services/telementryService';

import { showLoading, stopLoading } from '../../utils/Helper/SpinnerHandle';
import { replaceAll, compareArrays } from '../../utils/helper';

import { PutObjectCommand } from "@aws-sdk/client-s3";
import S3Client from '../../config/awsS3';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';

const VoiceCompair = props => {

  const [isAudioPreprocessing,setIsAudioPreprocessing] = useState(
  localStorage.getItem('isAudioPreprocessing') === 'true' ? true : false
);

  const [lang_code, set_lang_code] = useState(
    localStorage.getItem('apphomelang')
      ? localStorage.getItem('apphomelang')
      : 'en'
  );

  const toast = useToast();

  const ASR_REST_URLS = {
    bn: 'https://api.dhruva.ai4bharat.org',
    en: 'https://api.dhruva.ai4bharat.org',
    gu: 'https://api.dhruva.ai4bharat.org',
    hi: 'https://api.dhruva.ai4bharat.org',
    kn: 'https://api.dhruva.ai4bharat.org',
    ml: 'https://api.dhruva.ai4bharat.org',
    mr: 'https://api.dhruva.ai4bharat.org',
    ne: 'https://api.dhruva.ai4bharat.org',
    or: 'https://api.dhruva.ai4bharat.org',
    pa: 'https://api.dhruva.ai4bharat.org',
    sa: 'https://api.dhruva.ai4bharat.org',
    si: 'https://api.dhruva.ai4bharat.org',
    ta: 'https://api.dhruva.ai4bharat.org',
    kn: 'https://api.dhruva.ai4bharat.org',
    //ta: "https://ai4b-dev-asr.ulcacontrib.org",
    te: 'https://ai4b-dev-asr.ulcacontrib.org',
    ur: 'https://api.dhruva.ai4bharat.org',
  };

  const DEFAULT_ASR_LANGUAGE_CODE = 'ai4bharat/whisper-medium-en--gpu--t4';
  const HINDI_ASR_LANGUAGE_CODE = 'ai4bharat/conformer-hi-gpu--t4';
  const KANNADA_ASR_LANGUAGE_CODE = 'ai4bharat/conformer-multilingual-dravidian-gpu--t4';
  const TAMIL_ASR_LANGUAGE_CODE = 'ai4bharat/conformer-multilingual-dravidian-gpu--t4';
  const [recordedAudio, setRecordedAudio] = useState('');
  const [recordedAudioBase64, setRecordedAudioBase64] = useState('');

  //for tamil language
  const [tamilRecordedAudio, setTamilRecordedAudio] = useState('');
  const [tamilRecordedText, setTamilRecordedText] = useState('');

  const [asr_language_code, set_asr_language_code] = useState(DEFAULT_ASR_LANGUAGE_CODE);

  useEffect(() => {
	switch (lang_code) {
	case 'kn':
		set_asr_language_code(KANNADA_ASR_LANGUAGE_CODE);
		break;
  case 'ta':
    set_asr_language_code(TAMIL_ASR_LANGUAGE_CODE);
  break;
  case 'hi':
    set_asr_language_code(HINDI_ASR_LANGUAGE_CODE);
    break;
	default:
		set_asr_language_code(HINDI_ASR_LANGUAGE_CODE);
		break;
	}
  }, []);
  useEffect(() => {
    props.setVoiceText(tamilRecordedText);
    props.setRecordedAudio(tamilRecordedAudio);
  }, [tamilRecordedText]);

  useEffect(() => {
    
    if (recordedAudio !== '') {
      // showLoading();
      let uri = recordedAudio;
      var request = new XMLHttpRequest();
      request.open('GET', uri, true);
      request.responseType = 'blob';
      request.onload = function () {
        var reader = new FileReader();
        reader.readAsDataURL(request.response);
        reader.onload = function (e) {
          var base64Data = e.target.result.split(',')[1];
         
          setRecordedAudioBase64(base64Data);
        };
      };
      request.send();
    } else {
      stopLoading();
      setRecordedAudioBase64('');
      setAi4bharat('');
    }
  }, [recordedAudio]);

  //sent to AI bharat
  const [ai4bharat, setAi4bharat] = useState('');
  useEffect(() => {
    if (recordedAudioBase64 !== '') {
      if(props.hasOwnProperty("setStoryBase64Data")){
        props?.setStoryBase64Data(recordedAudioBase64)
      }
      // fetchASROutput(localStorage.getItem('apphomelang'), recordedAudioBase64);
      // fetchLearnerAI(recordedAudioBase64)
    }
  }, [recordedAudioBase64]);
  useEffect(() => {
    props.setVoiceText(ai4bharat);
    props.setRecordedAudio(recordedAudio);
  }, [ai4bharat]);

  // const [data, setData] = useState([]);
  // console.log(data);

  // const fetchLearnerAI = async (base64Data) => {

    
  //   try {
  //     const response = await axios.get();
  //     setData(response.data);
  //     stopLoading();
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };



  //call api
  const fetchASROutput = async (sourceLanguage, base64Data) => {
    let samplingrate = 30000;
    if (lang_code === 'ta') {
      samplingrate = 16000;
    }

    const asr_api_key = process.env.REACT_APP_ASR_API_KEY;
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', asr_api_key);
    var payload = JSON.stringify({
      config: {
        language: {
          sourceLanguage: sourceLanguage,
        },
        transcriptionFormat: {
          value: 'transcript',
        },
        bestTokenCount: 2,
        audioFormat: 'wav',
        samplingRate: samplingrate,
        postProcessors: null,
      },
      audio: [
        {
          audioContent: base64Data,
        },
      ],
    });
    if(props.hasOwnProperty("setStoryBase64Data")){
      props?.setStoryBase64Data(base64Data)
    }
    
    const abortController = new AbortController();
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: payload,
      redirect: 'follow',
      signal: abortController.signal
    };

    const apiURL = `${ASR_REST_URLS[sourceLanguage]}/services/inference/asr?serviceId=${asr_language_code}`;
    const responseStartTime = new Date().getTime();
    fetch(apiURL, requestOptions)
      .then(response => response.text())
      .then(async result => {
        // clearTimeout(waitAlert);
        const responseEndTime = new Date().getTime();
        const responseDuration = Math.round(
          (responseEndTime - responseStartTime) / 1000
        );
        var apiResponse = JSON.parse(result);
        if (localStorage.getItem("voiceText") !== 0) {
          let sentenceCounter = parseInt(localStorage.getItem("sentenceCounter"), 10) || 0;
        
          sentenceCounter++;
          localStorage.setItem("sentenceCounter", sentenceCounter);
        }
        
   
        if(props.hasOwnProperty("saveIndb")){
          props.saveIndb(apiResponse)
        }
        
        // props.setBase64Data(base64Data)
        // if(props.hasOwnProperty("setCurrentLine")){
        //   props?.setCurrentLine((oldData)=> oldData+1)
        // }

        if(props.hasOwnProperty("setUserSpeak")){
          props?.setUserSpeak(true);
        }
        

        // Data Manipulation on result capturing for telemetry log
        let texttemp = apiResponse['output'][0]['source'].toLowerCase();
        texttemp = replaceAll(texttemp, '.', '');
        texttemp = replaceAll(texttemp, "'", '');
        texttemp = replaceAll(texttemp, ',', '');
        texttemp = replaceAll(texttemp, '!', '');
        texttemp = replaceAll(texttemp, '|', '');
        texttemp = replaceAll(texttemp, '?', '');
        const studentTextArray = texttemp.split(' ');

        let tempteacherText = localStorage.getItem('contentText').toLowerCase();
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
          let getContentId = parseInt(localStorage.getItem('content_random_id')) + 1;
          var audioFileName = `${process.env.REACT_APP_CHANNEL}/${localStorage.getItem('contentSessionId')===null? localStorage.getItem('allAppContentSessionId'):localStorage.getItem('contentSessionId')}-${Date.now()}-${getContentId}.wav`;

          const command = new PutObjectCommand({
            Bucket: process.env.REACT_APP_AWS_S3_BUCKET_NAME,
            Key: audioFileName,
            Body: Uint8Array.from(window.atob(base64Data), (c) => c.charCodeAt(0)),
            ContentType: 'audio/wav'
          });


          try {
            const response = await S3Client.send(command);
            // console.log(response);
          } catch (err) {
            console.error(err);
          }
        }

        response({ // Required
            "target": process.env.REACT_APP_CAPTURE_AUDIO === 'true' ? `${audioFileName}` : '', // Required. Target of the response
            //"qid": "", // Required. Unique assessment/question id
            "type": "SPEAK", // Required. Type of response. CHOOSE, DRAG, SELECT, MATCH, INPUT, SPEAK, WRITE
            "values": [
                { "original_text": localStorage.getItem('contentText') },
                { "response_text": texttemp},
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

        setAi4bharat(
          apiResponse['output'][0]['source'] != ''
            ? apiResponse['output'][0]['source']
            : '-'
        );
        stopLoading();
      }).catch(error => {
        // clearTimeout(waitAlert);
        stopLoading();
        // if (error.name !== 'AbortError') {
          // alert('Unable to procedsadasdas later.');
          console.log('error', error);
        // }
      });
    //   const waitAlert = setTimeout(() => {
    //   abortController.abort();
    //   alert('Server response is slow at this time. Please explore other lessons');
    // }, 10000);
  };

  //get permission
  //temp variable
  const [loadCnt, setLoadCnt] = useState(0);
  const [audioPermission, setAudioPermission] = useState(null);
  //onmount
  useEffect(() => {
    if (loadCnt == 0) {
      getpermision();
      setLoadCnt(loadCnt => Number(loadCnt + 1));
    }
  }, [loadCnt]);
  const getpermision = () => {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;
    navigator.getUserMedia(
      { audio: true },
      () => {
        console.log('Permission Granted');
        setAudioPermission(true);
      },
      () => {
        console.log('Permission Denied');
        setAudioPermission(false);
        //alert("Microphone Permission Denied");
      }
    );
  };

  
  return (
    <center>
      {(() => {
        if (audioPermission != null) {
          if (audioPermission) {
            return (
              <div>
                {/* {lang_code === 'kn' || lang_code ===  'ta'  ? (
                  <AudioRecorderTamil
                    setTamilRecordedAudio={setTamilRecordedAudio}
                    setTamilRecordedText={setTamilRecordedText}
                    flag={props.flag}
                    saveIndb={props.saveIndb}
                    setUserSpeak = {props.setUserSpeak}
                    setCurrentLine = {props.setCurrentLine}
                    {...(props?._audio ? props?._audio : {})}
                  />
                ) : ( */}
                  <AudioRecorderCompairUI
                    isAudioPreprocessing={isAudioPreprocessing}
                    toast={toast}
                    setRecordedAudio={setRecordedAudio}
                    flag={props.flag}
                    setUserSpeak = {props.setUserSpeak}
                    setCurrentLine = {props.setCurrentLine}
                    saveIndb={props.saveIndb}
                    {...(props?._audio ? props?._audio : {})}
                  />
                {/* )} */}

                {/*recordedAudio !== "" ? (
                    <>
                      <br />
                      Wav File URL : {recordedAudio}
                      <br />
                      API Response : {ai4bharat}
                      <br />
                      Base 64 : {recordedAudioBase64}
                    </>
                  ) : (
                    ""
                  )*/}
                {/*recordedAudio != "" ? blobToBase64(recordedAudio) : ""*/}
              </div>
            );
          } else {
            return <h5 className="deniedtext">Microphone Permission Denied</h5>;
          }
        }
      })()}
    </center>
  );
};

export default VoiceCompair;