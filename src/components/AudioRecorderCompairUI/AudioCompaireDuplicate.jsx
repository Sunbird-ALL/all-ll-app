import React, { useState, useEffect } from 'react';
import AudioRecorderCompairUI from '../AudioRecorderCompairUI/AudioRecorderCompairUI'

function SpeechToText(props) {
    const {setRecordedAudio,setUserSpeak} = props;
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const recognition = new window.SpeechRecognition() || window.webkitSpeechrecognition; // Initialize speech recognition

    recognition.onstart = () => {
        setTranscript("")
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const last = event.results.length - 1;
      setTranscript(event.results[last][0].transcript);
      if(event.results[last][0].transcript !== ""){
          setUserSpeak(true);
      }
      else{
        setUserSpeak(false);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    if (isListening) {
      recognition.start();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening]);

  const toggleListening = () => {
    setIsListening(!isListening);
  };
console.log(transcript);
  return (
    <div>
      {/* <h1>Speech-to-Text</h1>
      <button onClick={toggleListening}>
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
      <p>Transcript: {transcript}</p> */}
      {/* {transcript !== ""? } */}
      <AudioRecorderCompairUI
        toggleListening={toggleListening}
        setRecordedAudio={setRecordedAudio}
        flag={props.flag}
        transcript={transcript}
        {...(props?._audio ? props?._audio : {})}
      />
    </div>
  );
}

export default SpeechToText;
