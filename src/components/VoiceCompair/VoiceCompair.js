import React, { useState, useEffect } from 'react';
import AudioRecorderCompairUI from '../AudioRecorderCompairUI/AudioRecorderCompairUI';
import AudioRecorderTamil from '../AudioRecorderTamil/AudioRecorderTamil';
import { response, interact } from '../../services/telementryService';

import { showLoading, stopLoading } from '../../utils/Helper/SpinnerHandle';

const VoiceCompair = props => {
  const [lang_code, set_lang_code] = useState(
    localStorage.getItem('apphomelang')
      ? localStorage.getItem('apphomelang')
      : 'en'
  );

  const ASR_REST_URLS = {
    bn: 'https://asr-api.ai4bharat.org',
    en: 'https://asr-api.ai4bharat.org',
    gu: 'https://asr-api.ai4bharat.org',
    hi: 'https://asr-api.ai4bharat.org',
    kn: 'https://asr-api.ai4bharat.org',
    ml: 'https://asr-api.ai4bharat.org',
    mr: 'https://asr-api.ai4bharat.org',
    ne: 'https://asr-api.ai4bharat.org',
    or: 'https://asr-api.ai4bharat.org',
    pa: 'https://asr-api.ai4bharat.org',
    sa: 'https://asr-api.ai4bharat.org',
    si: 'https://asr-api.ai4bharat.org',
    ta: 'https://asr-api.ai4bharat.org',
    //ta: "https://ai4b-dev-asr.ulcacontrib.org",
    te: 'https://ai4b-dev-asr.ulcacontrib.org',
    ur: 'https://asr-api.ai4bharat.org',
  };
  const [recordedAudio, setRecordedAudio] = useState('');
  const [recordedAudioBase64, setRecordedAudioBase64] = useState('');

  //for tamil language
  const [tamilRecordedAudio, setTamilRecordedAudio] = useState('');
  const [tamilRecordedText, setTamilRecordedText] = useState('');

  useEffect(() => {
    props.setVoiceText(tamilRecordedText);
    props.setRecordedAudio(tamilRecordedAudio);
  }, [tamilRecordedText]);

  useEffect(() => {
    if (recordedAudio !== '') {
      showLoading();
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
      fetchASROutput(localStorage.getItem('apphomelang'), recordedAudioBase64);
    }
  }, [recordedAudioBase64]);
  useEffect(() => {
    props.setVoiceText(ai4bharat);
    props.setRecordedAudio(recordedAudio);
  }, [ai4bharat]);

  //call api
  const fetchASROutput = async (sourceLanguage, base64Data) => {
    let samplingrate = 30000;
    if (lang_code === 'ta') {
      samplingrate = 16000;
    }
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    var payload = JSON.stringify({
      config: {
        language: {
          sourceLanguage: sourceLanguage,
        },
        transcriptionFormat: {
          value: 'transcript',
        },
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
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: payload,
      redirect: 'follow',
    };
    const apiURL = `${ASR_REST_URLS[sourceLanguage]}/asr/v1/recognize/${sourceLanguage}`;
    const responseStartTime = new Date().getTime();
    await fetch(apiURL, requestOptions)
      .then(response => response.text())
      .then(result => {
        const responseEndTime = new Date().getTime();
        const responseDuration = Math.round(
          (responseEndTime - responseStartTime) / 1000
        );
        var apiResponse = JSON.parse(result);
        response({
          // Required
          target: localStorage.getItem('contentText'), // Required. Target of the response
          qid: '', // Required. Unique assessment/question id
          type: 'SPEAK', // Required. Type of response. CHOOSE, DRAG, SELECT, MATCH, INPUT, SPEAK, WRITE
          values: [
            { original_text: localStorage.getItem('contentText') },
            { response_text: apiResponse['output'][0]['source'] },
            { duration: responseDuration },
          ], // Required. Array of response tuples. For ex: if lhs option1 is matched with rhs optionN - [{"lhs":"option1"}, {"rhs":"optionN"}]
        });
        setAi4bharat(
          apiResponse['output'][0]['source'] != ''
            ? apiResponse['output'][0]['source']
            : '-'
        );
        stopLoading();
      });
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
                {lang_code == 'ta' ? (
                  <AudioRecorderTamil
                    setTamilRecordedAudio={setTamilRecordedAudio}
                    setTamilRecordedText={setTamilRecordedText}
                    flag={props.flag}
                    {...(props?._audio ? props?._audio : {})}
                  />
                ) : (
                  <AudioRecorderCompairUI
                    setRecordedAudio={setRecordedAudio}
                    flag={props.flag}
                  
                    {...(props?._audio ? props?._audio : {})}
                  />
                )}

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
