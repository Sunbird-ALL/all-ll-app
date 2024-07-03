import React, { useState, useEffect } from 'react';
import AudioAnalyser from 'react-audio-analyser';
import mic from '../../assests/Images/mic.png';
import mic_play from '../../assests/Images/mic_play.svg';
import useAudioDetection from './useAudioDetection';

const AudioRecorderCompair = (props) => {
  const { startDetection, stopDetection, isSilent, isRunning, audioDetected } = useAudioDetection();
  const [status, setStatus] = useState('');
  const [audioType, setAudioType] = useState('audio/wav');
  const [audioSrc, setAudioSrc] = useState('');

  useEffect(() => {
    setAudioType('audio/wav');
  }, []);


  const controlAudio = async (status) => {
    if (status === "recording") {
      props.setIsAudioPlay('recording')
      await startDetection();
    } else {
      stopDetection();
      props.setIsAudioPlay('inactive')
    }
    setStatus(status);
  };

  useEffect(()=>{
    if(audioDetected){
      if(props.setIsEmptyAudio){
        props.setIsEmptyAudio(true);
      }
    }
    else{
      if(props.setIsEmptyAudio){
        props.setIsEmptyAudio(false);
      }
    }
  },[audioDetected])

  const handleMic = () => {
    document.getElementById('startaudio_compair').click();
  };

  const lang_code = localStorage.getItem('apphomelang');

  const audioProps = {
    audioType,
    status,
    audioSrc,
    timeslice: 1000,
    startCallback: () => {
      setAudioSrc('');
      props.setRecordedAudio('');
    },
    pauseCallback: () => {},
    stopCallback: (e) => {
      const temp_audioSrc = window.URL.createObjectURL(e);
      setAudioSrc(temp_audioSrc);
      props.setRecordedAudio(temp_audioSrc);
    },
    onRecordCallback: () => {},
    errorCallback: (err) => {},
    width: 300,
    height: 150,
    backgroundColor: "#ffefd1",
    strokeColor: 'red'
  };

  const audioProps_tamil = {
    ...audioProps,
    startCallback: () => {
      setAudioSrc('');
      props.setRecordedAudio('');
      console.log('succ start');
    },
    pauseCallback: () => {
      console.log('succ pause');
    },
    stopCallback: (e) => {
      const temp_audioSrc = window.URL.createObjectURL(e);
      setAudioSrc(temp_audioSrc);
      props.setRecordedAudio(temp_audioSrc);
      console.log('succ stop');
    },
    onRecordCallback: () => {
      console.log('recording');
    },
    errorCallback: (err) => {
      console.log('error', err);
    }
  };
  return (
    <div>
      <center>
        <div style={{ position: 'relative' }}>
          <div className={status === 'recording' ? 'dis-visible' : 'dis-none'}>
            <AudioAnalyser {...audioProps}></AudioAnalyser>
          </div>
        </div>
        {(() => {
          if (status === 'recording') {
            return (
              <>
                {props.flag ? (
                  <>
                    <img
                      src={mic_play}
                      style={{ height: '72px', width: '72px' }}
                      className="micimg mic_stop_record"
                      onClick={() => {
                        document.getElementById('stopaudio_compair').click();
                      }}
                    />
                  </>
                ) : (
                  <>
                    <img
                      src={mic}
                      style={{ height: '72px', width: '72px' }}
                      className="micimg mic_stop_record"
                      onClick={() => document.getElementById('stopaudio_compair').click()}
                    />
                  </>
                )}
              </>
            );
          } else {
            return (
              <>
                <img
                  src={mic}
                  style={{ height: '72px', width: '72px' }}
                  className={'micimg mic_record'}
                  onClick={handleMic}
                ></img>
              </>
            );
          }
        })()}
        <AudioAnalyser
          {...(lang_code === 'ta' ? audioProps_tamil : audioProps)}
          className="hide"
        >
          <div className="btn-box hide">
            <br />
            <button
              className="btn"
              id="startaudio_compair"
              onClick={() => controlAudio('recording')}
            >
              Start
            </button>
            <button
              className="btn"
              id="stopaudio_compair"
              onClick={() => controlAudio('inactive')}
            >
              Stop
            </button>
          </div>
        </AudioAnalyser>
      </center>
    </div>
  );
};

export default AudioRecorderCompair;
