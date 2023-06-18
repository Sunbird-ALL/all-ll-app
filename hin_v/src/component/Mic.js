import React from 'react';
import { VStack } from '@chakra-ui/react';
import { FaTimes } from 'react-icons/fa';
import { blobToBase64 } from '../utils/helper';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';

function Mic({ name, onStop, value }) {
  const [url, setUrl] = React.useState();
  React.useEffect(() => {
    setUrl(value);
  }, [value]);
  const recorderControls = useAudioRecorder();
  const addAudioElement = blob => {
    blobToBase64(blob, e => {
      if (onStop) onStop(e);
      setUrl(`${e}`);
    });
  };

  return (
    <VStack spacing={4} overflow="hidden">
      {!url ? (
        <React.StrictMode>
          <AudioRecorder
            recorderControls={recorderControls}
            onRecordingComplete={addAudioElement}
          />
        </React.StrictMode>
      ) : (
        <VStack>
          <FaTimes
            onClick={e => setUrl()}
            style={{
              position: 'absolute',
              zIndex: 1,
              right: 0,
              padding: '3px',
              background: '#e53e3e',
              color: '#fff',
              borderRadius: '100%',
            }}
          />
          <audio controls="controls" src={url} type="audio/webm" />
        </VStack>
      )}
    </VStack>
  );
}

export default React.memo(Mic);
