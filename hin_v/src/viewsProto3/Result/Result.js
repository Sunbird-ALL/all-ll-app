import React, { useState, useEffect, createRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ReactAudioPlayer from "react-audio-player";
import AudioPlayer from "react-h5-audio-player";

import content_list from "../../utils/Const/Const";
import home_old from "../../assests/Images/home_old.png";
import "react-h5-audio-player/lib/styles.css";
import VoiceCompair from "../../components/VoiceCompair/VoiceCompair";
import refresh from "../../assests/Images/refresh.svg";

/*chakra*/
import AppFooter from '../../components2/AppFooter/AppFooter';

function Result() {
  const app_history = useNavigate();
  // Get ID from URL
  const params = useParams();
  const audio_player = createRef();
  const [recordedAudio, setRecordedAudio] = useState(
    localStorage.getItem("recordedAudio")
  );
  const [testResult, setTestResult] = useState("");
  const [teacherText, setTeacherText] = useState(
    localStorage.getItem("contentText")
  );
  const [texttospeechaudio, settexttospeechaudio] = useState(
    localStorage.getItem("voiceTextBlob")
  );
  const [indexid, setIndexID] = useState(localStorage.getItem("id"));
  const [voiceText, setVoiceText] = useState(localStorage.getItem("voiceText"));
  const [voiceTextTeacher, setVoiceTextTeacher] = useState("");
  const [voiceTextHighlight, setVoiceTextHighLight] = useState("");
  const [ocurracy_percentage, setOcurracy_percentage] = useState("");

  useEffect(() => {
    if (voiceText !== "") {
      checkVoice(voiceText);
    }
  }, [voiceText]);
  function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
  }
  function checkVoice(voiceText) {
    let tempvoiceText = voiceText.toLowerCase();
    let tempteacherText = teacherText.toLowerCase();
    tempteacherText = replaceAll(tempteacherText, ".", "");
    tempteacherText = replaceAll(tempteacherText, "'", "");
    tempteacherText = replaceAll(tempteacherText, ",", "");
    tempteacherText = replaceAll(tempteacherText, "!", "");
    setVoiceTextTeacher(tempteacherText);
    //alert(tempteacherText + "\n" + tempvoiceText);
    if (tempteacherText === tempvoiceText) {
      setTestResult(
        <font style={{ fontSize: "20px", color: "green" }}>
          Teacher and Student audio match
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
    let originalwords = teacherTextArray.length;
    let studentswords = studentTextArray.length;
    let wrong_words = 0;
    let correct_words = 0;
    let result_per_words = 0;
    for (let i = 0; i < studentTextArray.length; i++) {
      if (teacherTextArray.includes(studentTextArray[i])) {
        correct_words++;
        student_text_result.push(
          <>
            {" "}
            <font className="correct_text_remove">{studentTextArray[i]}</font>
          </>
        );
      } else {
        wrong_words++;
        student_text_result.push(
          <>
            {" "}
            <font className="inc_text">{studentTextArray[i]}</font>
          </>
        );
      }
    }
    setOcurracy_percentage(
      <>
        {" "}
        <font className="res_txt">{result_per_words}/100</font>
      </>
    );
    setVoiceTextHighLight(student_text_result);
    //calculation method
    if (originalwords >= studentswords) {
      result_per_words = Math.round(
        Number((correct_words / originalwords) * 100)
      );
    } else {
      result_per_words = Math.round(
        Number((correct_words / studentswords) * 100)
      );
    }
    setTestResult(
      <>
        <h5 className="home_sub_title">Word Result :</h5>
        <div className="res_txt">
          {originalwords < studentswords ? (
            <font style={{ color: "red" }}>You have recorded extra word</font>
          ) : (
            <>{result_per_words}/100</>
          )}
        </div>
        <br />
        <font className="ori_res_txt">Original Words : {originalwords} | </font>
        <font className="stu_res_txt">Your Words : {studentswords} | </font>
        <font className="cor_res_txt">Correct Words : {correct_words} | </font>
        <font className="icor_res_txt">Incorrect Words : {wrong_words}</font>
        <hr />
        <h5 className="home_sub_title">Sentence Result :</h5>
        <div className="res_txt">
          {tempteacherText === tempvoiceText ? (
            <>
              <font style={{ color: "green" }}>
                You recorded text match with content text
              </font>
            </>
          ) : (
            <>
              <font style={{ color: "red" }}>
                You recorded text does not match with content text
              </font>
            </>
          )}
        </div>
        <br />
      </>
    );
  }
  function showResult() {
    return (
      <>
        <div className="container">
          <br />
          <div className="row">
            <div className="col s12 m12 l2"></div>
            <div className="col s12 m12 l8 content_list">
              <Link to={"/proto2/contentlist"}>
                <img src={home_old} className="home_icon"></img>
              </Link>
              <div onClick={() => app_history(-1)}>
                <img src={refresh} className="refresh_icon"></img>
              </div>
              <div style={{ marginTop: "-65px" }}>
                <center>
                  <h5 className="home_title">Result</h5>
                  <hr />
                  {testResult}
                  <hr />
                  <font class="speech_title">Your Speech and Audio</font>
                  <div className="content_view">
                    <>
                      <font>
                        <br />
                        <b>{voiceTextHighlight}</b>
                        <br />
                        <br />
                        <ReactAudioPlayer
                          autoPlay={false}
                          src={recordedAudio}
                          controls
                          style={{ width: "100%" }}
                        />
                      </font>
                      <br />
                    </>
                  </div>
                  <font class="speech_title">Original Speech and Audio</font>
                  <div className="content_view">
                    <>
                      <font>
                        <br />
                        <b>{teacherText}</b>
                        <br />
                        <br />
                        <ReactAudioPlayer
                          autoPlay={false}
                          src={texttospeechaudio}
                          controls
                          style={{ width: "100%" }}
                        />
                      </font>
                      <br />
                    </>
                  </div>
                </center>
              </div>
            </div>
            <div className="cols s12 m4 l4"></div>
          </div>
        </div>
        <AppFooter />
      </>
    );
  }
  return <React.Fragment>{showResult()}</React.Fragment>;
}

export default Result;
