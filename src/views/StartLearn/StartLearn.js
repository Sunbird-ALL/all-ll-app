import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";

import AppNavbar from "../../components/AppNavbar/AppNavbar";
import NewTopHomeNextBar from "../../components/NewTopHomeNextBar/NewTopHomeNextBar";
import NewBottomHomeNextBar from "../../components/NewBottomHomeNextBar/NewBottomHomeNextBar";
//import HomeNextBar from "../../components/HomeNextBar/HomeNextBar";
import content_list from "../../utils/Const/ContentJSON";
import VoiceCompair from "../../components/VoiceCompair/VoiceCompair";
import ReactAudioPlayer from "react-audio-player";
import play from "../../assests/Images/play.png";

import { scroll_to_top } from "../../utils/Helper/JSHelper";

function StartLearn() {
  const [temp_audio, set_temp_audio] = useState(null);
  const playAudio = () => {
    set_temp_audio(new Audio(content[sel_lang + "_audio"]));
  };
  useEffect(() => {
    if (temp_audio !== null) {
      temp_audio.play();
      //temp_audio.addEventListener("ended", () => alert("end"));
    }
    return () => {
      if (temp_audio !== null) {
        temp_audio.pause();
      }
    };
  }, [temp_audio]);

  const [sel_lang, set_sel_lang] = useState(
    localStorage.getItem("apphomelang")
      ? localStorage.getItem("apphomelang")
      : "en"
  );
  const [sel_lang_text, set_sel_lang_text] = useState(
    localStorage.getItem("apphomelang")
      ? localStorage.getItem("apphomelang") === "ta"
        ? "Tamil"
        : "English"
      : "English"
  );
  const [sel_level, set_sel_level] = useState(
    localStorage.getItem("apphomelevel") 
      ? localStorage.getItem("apphomelevel")
      : "Word"
  );
  const [sel_cource, set_sel_cource] = useState(
    localStorage.getItem("apphomecource")
      ? localStorage.getItem("apphomecource")
      : "Listen & Speak"
  );

  const [content, set_content] = useState({});
  const [content_id, set_content_id] = useState(0);

  const [load_cnt, set_load_cnt] = useState(0);

  useEffect(() => {
    if (load_cnt == 0) {
      let count_array = 0;
      for (let value of content_list) {
        if (value.title == sel_level) {
          set_content(value);
          set_content_id(count_array);
          break;
        }
        count_array++;
      }
      scroll_to_top("smooth");
      set_load_cnt((load_cnt) => Number(load_cnt + 1));
    }
  }, [load_cnt]);

  const [recordedAudio, setRecordedAudio] = useState("");
  const [voiceText, setVoiceText] = useState("");
  useEffect(() => {
    if (voiceText == "-") {
      alert("AI4Bharat gives empty source");
      setVoiceText("");
    }
    if ((voiceText !== "") & (voiceText !== "-")) {
      go_to_result(voiceText);
    }
  }, [voiceText]);
  function go_to_result(voiceText) {
    localStorage.setItem("contentText", content[sel_lang]);
    localStorage.setItem("recordedAudio", recordedAudio);
    localStorage.setItem("voiceText", voiceText);
    localStorage.setItem("contentid", content_id);
    localStorage.setItem("contenttype", content["title"]);
    localStorage.setItem("isfromresult", "learn");
    document.getElementById("link_score").click();
  }
  function showStartLearn() {
    return (
      <>
        <div className="">
          <div className="row">
            <div className="col s12 m2 l3"></div>
            <div className="col s12 m8 l6 main_layout">
              {/*<AppNavbar navtitle={sel_cource + " a " + sel_level} />*/}
              <br />
              <NewTopHomeNextBar nextlink={""} ishomeback={true} />
              {sel_cource === "See & Speak" ? (
                <>
                  {/*<div className="content_text_div">
                    {"Answer in one " + sel_level + ". What is this?"}
                  </div>*/}
                  <br />
                  <img className="image_class" src={content?.image} />
                  {sel_lang != "ta" ? (
                    <div className="content_text_div">{content["ta"]}</div>
                  ) : (
                    <></>
                  )}
                  <div className="content_text_div">{content[sel_lang]}</div>
                </>
              ) : (
                <>
                  <br />
                  {sel_lang != "ta" ? (
                    <div className="content_text_div_see">{content["ta"]}</div>
                  ) : (
                    <></>
                  )}
                  <div className="content_text_div_see">
                    {content[sel_lang]}
                  </div>
                </>
              )}
              <br />
              <img
                style={{
                  width: "45px",
                  height: "45px",
                  cursor: "pointer",
                }}
                src={play}
                onClick={() => playAudio()}
              />
              {/*<ReactAudioPlayer
                autoPlay={false}
                src={content[sel_lang + "_audio"]}
                controls
                style={{ width: "100%" }}
              />*/}
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <VoiceCompair
                setVoiceText={setVoiceText}
                setRecordedAudio={setRecordedAudio}
              />
              <br />
              <NewBottomHomeNextBar nextlink={""} ishomeback={true} />
            </div>
            <div className="cols s12 m2 l3"></div>
          </div>
        </div>
      </>
    );
  }
  return <React.Fragment>{showStartLearn()}</React.Fragment>;
}

export default StartLearn;
