import {
  Button,
  HStack,
  IconButton,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { ReactMic } from 'react-mic';

export default function Mic({ onStop }) {
  const [record, setRecord] = React.useState(false);

  const onData = recordedBlob => {
    // console.log('chunk of real-time data is: ', recordedBlob);
  };

  const onPlayStop = recordedBlob => {
    // console.log('recordedBlob is: ', recordedBlob);
    onStop(recordedBlob);
  };

  return (
    <VStack spacing={4} overflow="hidden">
      <ReactMic
        record={record}
        onStop={onPlayStop}
        onData={onData}
        strokeColor="#fff"
        backgroundColor="#FF4081"
        mimeType="audio/webm"
      />
      <HStack justifyContent="center">
        <IconButton
          size="md"
          fontSize="lg"
          variant="ghost"
          color="current"
          marginLeft="2"
          onClick={e => setRecord(!record)}
          icon={record ? <FaMicrophone /> : <FaMicrophoneSlash />}
        />
      </HStack>
    </VStack>
  );
}
