import { useRef, useState, useEffect } from "react";

const useAudioDetection = () => {
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const scriptProcessorRef = useRef(null);
  const [isSilent, setIsSilent] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [audioDetected, setAudioDetected] = useState(false);

  const startDetection = async () => {
    try {
      // Initialize audio context and analyser
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;

      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);

      // Create script processor
      scriptProcessorRef.current = audioContextRef.current.createScriptProcessor(1024, 1, 1);

      // Connect nodes
      microphoneRef.current.connect(analyserRef.current);
      analyserRef.current.connect(scriptProcessorRef.current);
      scriptProcessorRef.current.connect(audioContextRef.current.destination);

      // Process audio data
      scriptProcessorRef.current.onaudioprocess = (event) => {
        const inputData = event.inputBuffer.getChannelData(0);
        const inputDataLength = inputData.length;
        let total = 0;

        for (let i = 0; i < inputDataLength; i++) {
          total += Math.abs(inputData[i]);
        }

        const average = total / inputDataLength;
        const currentIsSilent = average < 0.04; // Threshold for silence

        if (!currentIsSilent) {
          setAudioDetected(true);
        }

        setIsSilent(currentIsSilent);
      };

      setIsRunning(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopDetection = () => {
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect();
    }
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    microphoneRef.current = null;
    scriptProcessorRef.current = null;

    setIsRunning(false);
    setIsSilent(true);
  };

  useEffect(() => {
    return () => {
      // Clean up when component unmounts
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return { startDetection, stopDetection, isSilent, isRunning, audioDetected };
};

export default useAudioDetection;
