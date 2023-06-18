import React, { useState, useEffect } from "react";
import ReactAudioPlayer from "react-audio-player";
import Speech from "react-speech";
import { useSpeechSynthesis } from "react-speech-kit";
//import axios
import axios from "axios";

import { showLoading, stopLoading } from "../../utils/Helper/SpinnerHandle";

const TextToSpeech = () => {
  const [enterText, setEnterText] = useState(
    "I am Leena. It is my first day at school."
  );
  const [texttospeechaudio, settexttospeechaudio] = useState("");

  const { speak } = useSpeechSynthesis();
  const convertai4bharat = () => {
    showLoading();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var payload = JSON.stringify({
      input: [
        {
          source: enterText,
        },
      ],
      config: {
        gender: "female",
        language: {
          sourceLanguage: "en",
        },
      },
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: payload,
      redirect: "follow",
    };
    const apiURL = `https://tts-api.ai4bharat.org/`;
    fetch(apiURL, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        var apiResponse = JSON.parse(result);
        var audioContent = apiResponse["audio"][0]["audioContent"];
        var audio = "data:audio/wav;base64," + audioContent;
        settexttospeechaudio(audio);
        stopLoading();
      });
  };

  return (
    <>
      <center>
        <h6 className="deniedtext">Enter Text Here</h6>
        <div className="div_input_text">
          <input
            type="text"
            className="form_input_text"
            placeholder="Enter Text to Speech Here"
            value={enterText}
            onChange={(e) => {
              setEnterText(e.target.value);
            }}
          />
        </div>
        <hr />
        using react-speech-kit package
        <br />
        <button onClick={() => speak({ text: enterText })}>Play</button>
        <br />
        using react-speech package
        <br />
        <Speech
          textAsButton={true}
          displayText="Play"
          text={enterText}
          pitch="3"
          rate="1"
          volume="0.1"
          voice="Daniel"
        />
        <br />
        using AI4Bharat Text to Speech
        <br />
        <button onClick={() => convertai4bharat()}>Convert</button>
        <br />
        {texttospeechaudio ? (
          <ReactAudioPlayer src={texttospeechaudio} controls />
        ) : (
          ""
        )}
      </center>
    </>
  );
};

export default TextToSpeech;
