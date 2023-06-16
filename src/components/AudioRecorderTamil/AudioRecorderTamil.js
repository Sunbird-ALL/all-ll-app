import React from 'react';

// import * as Recorder from './recorder';
import Recorder from './Recorder';

// import mic from '../../assests/Images/mic.png';
import mic_on from '../../assests/Images/mic_on.png';
import mic from '../../assests/Images/mic.png';
import stop from '../../assests/Images/stop.png';
import { showLoading, stopLoading } from '../../utils/Helper/SpinnerHandle';
import { response,interact } from '../../services/telementryService';

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
}) {
  const [record, setRecord] = React.useState(false);
  const [url, setUrl] = React.useState();
  const [tamiltext, setTamiltext] = React.useState('');

  React.useEffect(() => {
    setUrl(value);
  }, [value]);

  const startRecording = () => {
    setRecord(true);
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
      getASROutput(base64Data, blob);
    };
  };

  const createDownloadLink = (blob, transcript) => {
    var newUrl = URL.createObjectURL(blob);
    setUrl(newUrl);
    setTamilRecordedAudio(newUrl);
    console.log(new Date().toISOString() + '.wav', transcript);
    if (onStop) onStop({ text: transcript, audio: newUrl });
  };

  const getASROutput = (asrInput, blob) => {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

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

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: payload,
      redirect: 'follow',
    };

    const ASR_REST_URL =
      'https://asr-api.ai4bharat.org/asr/v1/recognize/' + MODEL_LANGUAGE;
    fetch(ASR_REST_URL, requestOptions)
      .then(response => response.text())
      .then(result => {
        var apiResponse = JSON.parse(result);
        if (apiResponse['output'][0]['source'] == '') {
          alert("Sorry I couldn't hear a voice. Could you please speak again?");
        }
        setTamiltext(apiResponse['output'][0]['source']);
        createDownloadLink(blob, apiResponse['output'][0]['source']);
        stopLoading();
        response({ // Required
            "target": localStorage.getItem('contentText'), // Required. Target of the response
            "qid": "", // Required. Unique assessment/question id
            "type": "SPEAK", // Required. Type of response. CHOOSE, DRAG, SELECT, MATCH, INPUT, SPEAK, WRITE
            "values": [{ "original_text": localStorage.getItem('contentText') },{ "response_text": apiResponse['output'][0]['source'] }] // Required. Array of response tuples. For ex: if lhs option1 is matched with rhs optionN - [{"lhs":"option1"}, {"rhs":"optionN"}]
          })
      })
      .catch(error => {
        console.log('error', error);
        stopLoading();
      });
  };

  const IconMic = () => {
    if (record) {
      return (
        <>
          {flag ? (
            <img src={stop} className="micimg mic_record"></img>
          ) : (
            <img src={mic_on} className="micimg mic_stop_record"></img>
          )}
        </>
      );
    } else {
      return <img src={mic} className={'micimg mic_record'}></img>;
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
