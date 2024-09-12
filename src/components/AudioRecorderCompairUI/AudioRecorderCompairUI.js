import React, { useState, useEffect, useRef } from 'react';
import RecordRTC, { StereoAudioRecorder } from 'recordrtc';
import mic from '../../assests/Images/mic.png';
import mic_play from '../../assests/Images/mic_play.svg';

const AudioRecorderCompair = props => {
  const [status, setStatus] = useState('');
  const [audioSrc, setAudioSrc] = useState('');
  const recorderRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const handleStartRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(stream => {
        mediaStreamRef.current = stream;
        const options = {
          type: 'audio',
          mimeType: 'audio/wav',
          recorderType: StereoAudioRecorder,
          numberOfAudioChannels: 1,
          desiredSampRate: 16000,
        };
        const newRecorder = new RecordRTC(stream, options);
        recorderRef.current = newRecorder;
        newRecorder.startRecording();
        setStatus('recording');
        if (props?.isAudioPlay) props.isAudioPlay('recording');
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
      });
  };

  const handleStopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current.getBlob();
        if (audioSrc) {
          URL.revokeObjectURL(audioSrc); // Revoke the old blob URL
        }
        const audioUrl = URL.createObjectURL(blob);
        setAudioSrc(audioUrl);
        props.setRecordedAudio(audioUrl);
        setStatus('stopped');
        if (props?.isAudioPlay) props.isAudioPlay('stopped');
      });
    }
  };

  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop()); // Stop all media tracks
      }
    };
  }, [audioSrc]);

  return (
    <div>
      <center>
        {status === 'recording' ? (
          <img
            src={mic_play}
            style={{ height: '72px', width: '72px' }}
            className="micimg mic_stop_record"
            onClick={handleStopRecording}
          />
        ) : (
          <img
            src={mic}
            style={{ height: '72px', width: '72px' }}
            className="micimg mic_record"
            onClick={handleStartRecording}
          />
        )}
      </center>
    </div>
  );
};

export default AudioRecorderCompair;
