import React from 'react';
import Recorder from './Recorder';
import mic_play from '../../assests/Images/mic_play.svg'
import mic from '../../assests/Images/mic.png';
import { showLoading, stopLoading } from '../../utils/Helper/SpinnerHandle';
import { response,interact } from '../../services/telementryService';
import { replaceAll, compareArrays } from '../../utils/helper';
import { PutObjectCommand } from "@aws-sdk/client-s3";
import S3Client from '../../config/awsS3';

//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;
var gumStream;
//stream from getUserMedia()
var rec;
//Recorder.js object
var input;
//MediaStreamAudioSourceNode we'll be recording
// shim for AudioContext when it's not avb.
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = null;
//new audio context to help us record

var constraints = {
  audio: true,
  video: false,
};

const MODEL_SAMPLING_RATE = 16000;
const MODEL_LANGUAGE = 'ta';

function Mic({
  name,
  onStop,
  value,
  flag,
  setTamilRecordedAudio,
  setTamilRecordedText,
  isAudioPlay,
  saveIndb,
  setUserSpeak,
  setCurrentLine
}) {
  const [record, setRecord] = React.useState(false);
  const [url, setUrl] = React.useState();
  const [tamiltext, setTamiltext] = React.useState('');

  React.useEffect(() => {
    setUrl(value);
  }, [value]);


  const startRecording = () => {
    setRecord(true);
    isAudioPlay('recording');
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (stream) {
        console.log(
          'getUserMedia() success, stream created, initializing Recorder.js ...'
        );
        /* assign to gumStream for later use */
        gumStream = stream;
        /* use the stream */
        audioContext = new AudioContext();
        input = audioContext.createMediaStreamSource(stream);
        /* Create the Recorder object and configure to record mono sound (1 channel) Recording 2 channels will double the file size */
        rec = new Recorder(input, {
          numChannels: 1,
        });
        //start the recording process
        rec.record();
        console.log('Recording started');
      })
      .catch(function (err) {
        //enable the record button if getUserMedia() fails
        console.log('error', err);
      });
  };

  const stopRecording = () => {

    showLoading();
    setRecord(false);
    isAudioPlay('inactive');
    rec.stop(); //stop microphone access
    gumStream.getAudioTracks()[0].stop();
    //create the wav blob and pass it on to createDownloadLink
    rec.exportWAV(handleRecording, 'audio/wav', MODEL_SAMPLING_RATE);
  
  };

  const pauseRecording = () => {
    console.log('pauseRecording rec.recording=', rec.recording);
    if (rec.recording) {
      rec.stop();
    } else {
      rec.record();
    }
  };

  const handleRecording = blob => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      var base64Data = reader.result.split(',')[1];
      // getASROutput(base64Data, blob);
      saveIndb(base64Data)
      setUserSpeak(true)
      // setCurrentLine((oldData)=> oldData+1)
      stopLoading();
    };
  };

  const createDownloadLink = (blob, transcript) => {
    var newUrl = URL.createObjectURL(blob);
    setUrl(newUrl);
    setTamilRecordedAudio(newUrl);
    console.log(new Date().toISOString() + '.wav', transcript);
    if (onStop) onStop({ text: transcript, audio: newUrl });
  };

  const getASROutput = async (asrInput, blob) => {
    const asr_api_key = process.env.REACT_APP_ASR_API_KEY;
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', asr_api_key);

    var payload = JSON.stringify({
      config: {
        language: {
          sourceLanguage: MODEL_LANGUAGE,
        },
        transcriptionFormat: {
          value: 'transcript',
        },
        audioFormat: 'wav',
        samplingRate: MODEL_SAMPLING_RATE,
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
      signal: abortController.signal
    };

    const ASR_REST_URL =
      'https://api.dhruva.ai4bharat.org/services/inference/asr?serviceId=ai4bharat/conformer-multilingual-dravidian-gpu--t4';
    const responseStartTime = new Date().getTime();

    fetch(ASR_REST_URL, requestOptions)
      .then(response => response.text())
      .then( async (result) => {
        clearTimeout(waitAlert);
        const responseEndTime = new Date().getTime();
        const responseDuration = Math.round(
          (responseEndTime - responseStartTime) / 1000
        );

        var apiResponse = JSON.parse(result);

        if (apiResponse['output'][0]['source'] == '') {
          alert("Sorry I couldn't hear a voice. Could you please speak again?");
        }
        setTamiltext(apiResponse['output'][0]['source']);
        createDownloadLink(blob, apiResponse['output'][0]['source']);
        stopLoading();
        setTamilRecordedText(apiResponse['output'][0]['source']);

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
        let word_result = (result_per_words == 100) ? "correct" : "incorrect";

        if (process.env.REACT_APP_CAPTURE_AUDIO === 'true') {
          let getContentId = parseInt(localStorage.getItem('content_random_id')) + 1;
          var audioFileName = `${process.env.REACT_APP_CHANNEL}/${localStorage.getItem('contentSessionId')===null? localStorage.getItem('allAppContentSessionId'):localStorage.getItem('contentSessionId')}-${Date.now()}-${getContentId}.wav`;

          const command = new PutObjectCommand({
            Bucket: process.env.REACT_APP_AWS_s3_BUCKET_NAME,
            Key: audioFileName,
            Body: Uint8Array.from(window.atob(asrInput), (c) => c.charCodeAt(0)),
            ContentType: 'audio/wav'
          });


          try {
            const response = await S3Client.send(command);
          } catch (err) {
            console.error(err);
          }

        }


        response(
          { // Required
            "target": process.env.REACT_APP_CAPTURE_AUDIO === 'true' ? `${audioFileName}` : '', // Required. Target of the response
            //"qid": "", // Required. Unique assessment/question id
            "type": "SPEAK", // Required. Type of response. CHOOSE, DRAG, SELECT, MATCH, INPUT, SPEAK, WRITE
            "values": [
                { "original_text": localStorage.getItem('contentText') },
                { "response_text": apiResponse['output'][0]['source']},
                { "response_correct_words_array": student_correct_words_result},
                { "response_incorrect_words_array": student_incorrect_words_result},
                { "response_word_array_result": word_result_array},
                { "response_word_result": word_result},
                { "accuracy_percentage": result_per_words},
                { "duration":  responseDuration}
             ]
          },
          'ET'
        )
      })
      .catch(error => {
        clearTimeout(waitAlert);
        stopLoading();
        if (error.name !== 'AbortError') {
          alert('Unable to process your request at the moment.Please try again later.');
          console.log('error', error);
        }
      });
    const waitAlert = setTimeout(() => {
      abortController.abort();
      alert('Server response is slow at this time. Please explore other lessons');
    }, 10000);
  };

    const IconMic = () => {
      if (record) {
        return <img alt='mic_play' src={mic_play} className="micimg mic_stop_record"></img>;
      } else {
        return <img alt='mic' src={mic} className={'micimg mic_record'}></img>;
      }
    };

  return (
    <div spacing={4} overflow="hidden">
      {/*!url ? (
        <div onClick={record ? stopRecording : startRecording}>
          <IconMic />
        </div>
      ) : (
        <div>
          {url}={tamiltext}
          <div onClick={(e) => setUrl()}>&#10060;</div>
          <audio controls="controls" src={url} type="audio/webm" />
        </div>
      )*/}
      <div onClick={record ? stopRecording : startRecording}>
        <IconMic />
      </div>
    </div>
  );
}

export default React.memo(Mic);