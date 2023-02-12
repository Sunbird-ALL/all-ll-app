import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";

import ReactAudioPlayer from "react-audio-player";

import VoiceDetect from "../../components/VoiceDetect/VoiceDetect";
import TextToSpeech from "../../components/TextToSpeech/TextToSpeech";
import VoiceCompair from "../../components/VoiceCompair/VoiceCompair";

//assests
import leena_audio from "../../assests/Audio/leena_audio.m4a";

function Audio() {
  const [recordedAudio, setRecordedAudio] = useState("");
  const [testResult, setTestResult] = useState("");
  const [teacherText, setTeacherText] = useState(
    "I am Leena. It is my first day at school."
  );
  const [voiceText, setVoiceText] = useState("");
  const [voiceTextTeacher, setVoiceTextTeacher] = useState("");
  const [voiceTextHighlight, setVoiceTextHighLight] = useState("");
  useEffect(() => {
    if (voiceText !== "") {
      checkVoice(voiceText);
    }
  }, [voiceText]);
  function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
  }
  const checkVoice = (voiceText) => {
    let tempvoiceText = voiceText.toLowerCase();
    let tempteacherText = teacherText.toLowerCase();
    tempvoiceText = replaceAll(tempvoiceText, "lena", "leena");
    tempteacherText = replaceAll(tempteacherText, ".", "");
    setVoiceTextTeacher(tempteacherText);
    //alert(tempteacherText + "\n" + tempvoiceText);
    if (tempteacherText === tempvoiceText) {
      setTestResult(
        <font style={{ fontSize: "20px", color: "green" }}>
          Teacher and Student audio partially match
        </font>
      );
    } else {
      setTestResult(
        <font style={{ fontSize: "20px", color: "red" }}>
          Teacher and Student audio does not match
        </font>
      );
    }
    //set text highlight
    let texttemp = voiceText.toLowerCase();
    const studentTextArray = texttemp.split(" ");
    const teacherTextArray = tempteacherText.split(" ");
    let student_text_result = [];
    for (let i = 0; i < studentTextArray.length; i++) {
      if (teacherTextArray.includes(studentTextArray[i])) {
        student_text_result.push(
          <>
            {" "}
            <font>{studentTextArray[i]} </font>
          </>
        );
      } else {
        student_text_result.push(
          <>
            {" "}
            <font className="inc_text">{studentTextArray[i]}</font>
          </>
        );
      }
    }
    setVoiceTextHighLight(student_text_result);
  };

  function showAudio() {
    return (
      <>
        <center>
          <Link to={"/"}>
            home
          </Link>
        </center>
        {/*<div className="container">
          <div className="row">
            <div className="col s12 m12 l2"></div>
            <div className="col s12 m12 l8 content_row">
              <center>
                <h5>Voice Compare</h5>
                <hr />
                <font style={{ fontSize: "25px", color: "blue" }}>
                  <b>{teacherText}</b>
                </font>
                <br />
                <font>
                  <b>Listen Text : </b>
                </font>
                <ReactAudioPlayer src={leena_audio} controls />
              </center>
              <hr />
              <center>
                <font
                  style={{
                    fontSize: "20px",
                    color: "green",
                  }}
                >
                  <b>Speak Text in Blue Color and Compare</b>
                </font>
              </center>
              <VoiceCompair
                setVoiceText={setVoiceText}
                setRecordedAudio={setRecordedAudio}
              />
              <hr />
              {voiceText !== "" ? (
                <>
                  <font
                    style={{
                      fontSize: "20px",
                    }}
                  >
                    <b>Result :</b>
                    <br />
                    {testResult}
                    <hr />
                    Student Speech and Audio :
                    <br />
                    <b>"{voiceTextHighlight}"</b>
                    <br />
                    <ReactAudioPlayer src={recordedAudio} controls />
                    <hr />
                    Teacher Speech and Audio :
                    <br />
                    <b>"{voiceTextTeacher}"</b>
                    <br />
                    <ReactAudioPlayer src={leena_audio} controls />
                  </font>
                  <br />
                </>
              ) : (
                ""
              )}
            </div>
            <div className="cols s12 m4 l4"></div>
          </div>
        </div>*/}
        <div className="container">
          <div className="row">
            <div className="col s12 m12 l2"></div>
            <div className="col s12 m12 l8 content_row">
              <center>
                <h5>Voice Record And Listen Recorded Voice</h5>
              </center>
              <VoiceDetect />{" "}
            </div>
            <div className="cols s12 m4 l4"></div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col s12 m12 l2"></div>
            <div className="col s12 m12 l8 content_row">
              <center>
                <h5>Text to Speech</h5>
              </center>
              <TextToSpeech />
            </div>
            <div className="cols s12 m4 l4"></div>
          </div>
        </div>
      </>
    );
  }
  return <React.Fragment>{showAudio()}</React.Fragment>;
}

export default Audio;
