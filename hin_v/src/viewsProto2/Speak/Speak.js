import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";

import AppNavbar from "../../components/AppNavbar/AppNavbar";
import NewTopHomeNextBar from "../../components2/NewTopHomeNextBar/NewTopHomeNextBar";
import NewBottomHomeNextBar from "../../components2/NewBottomHomeNextBar/NewBottomHomeNextBar";
//import HomeNextBar from "../../components2/HomeNextBar/HomeNextBar";
import VoiceCompair from "../../components/VoiceCompair/VoiceCompair";
import Animation from "../../components/Animation/Animation";

import ReactAudioPlayer from "react-audio-player";
import AudioPlayer from "react-h5-audio-player";

import play from "../../assests/Images/play.png";

import Confetti from "react-confetti";
import content_list from "../../utils/Const/ContentJSON";
import speak_ta from "../../assests/Audio/speak_ta.mpga";
import home from "../../assests/Images/home.png";
import next from "../../assests/Images/next.png";
import refresh from "../../assests/Images/refresh.svg";

import { scroll_to_top } from "../../utils/Helper/JSHelper";

/*chakra*/
import AppFooter from '../../components2/AppFooter/AppFooter';

function Speak() {
  const [sel_lang, set_sel_lang] = useState(
    localStorage.getItem("apphomelang")
      ? localStorage.getItem("apphomelang")
      : "en"
  );
  const [temp_audio, set_temp_audio] = useState(null);
  const [temp_audio1, set_temp_audio1] = useState(null);
  const [temp_audio2, set_temp_audio2] = useState(null);

  const [isStart, set_isStart] = useState(false);
  const [content, set_content] = useState(content_list[0]);

  const playAudio = () => {
    set_temp_audio1(new Audio(content[sel_lang + "_audio"]));
  };
  const playHelpAudio = () => {
    set_temp_audio(new Audio(speak_ta));
  };
  const playRecordAudio = () => {
    set_temp_audio2(new Audio(recordedAudio));
  };
  useEffect(() => {}, []);
  const [load_cnt, set_load_cnt] = useState(0);

  const [resultnext, set_resultnext] = useState("start");
  const [resultnextlang, set_resultnextlang] = useState("hi");

  useEffect(() => {
    if (load_cnt == 0) {
      playHelpAudio();
      set_load_cnt((load_cnt) => Number(load_cnt + 1));
      localStorage.setItem("resultnext", resultnext);
      localStorage.setItem("resultnextlang", sel_lang);
      localStorage.setItem("apphomelevel", "Word");
    }
  }, [load_cnt]);

  const [voiceText, setVoiceText] = useState("");
  useEffect(() => {
    if (voiceText == "-") {
      alert("AI4Bharat gives empty source");
      setVoiceText("");
      set_isStart(false);
    } else if (voiceText != "") {
      set_isStart(true);
    }
    if ((voiceText !== "") & (voiceText !== "-")) {
      go_to_result(voiceText);
    }
    scroll_to_top("smooth");
  }, [voiceText]);
  const [content_id, set_content_id] = useState(0);
  function go_to_result(voiceText) {
    localStorage.setItem("contentText", content[sel_lang]);
    localStorage.setItem("recordedAudio", recordedAudio);
    localStorage.setItem("voiceText", voiceText);
    localStorage.setItem("contentid", content_id);
    localStorage.setItem("contenttype", content["title"]);
    localStorage.setItem("isfromresult", "speak3");
    document.getElementById("link_score_proto2").click();
  }
  const [recordedAudio, setRecordedAudio] = useState("");
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
  useEffect(() => {
    if (temp_audio1 !== null) {
      temp_audio1.play();
      //temp_audio1.addEventListener("ended", () => alert("end"));
    }
    return () => {
      if (temp_audio1 !== null) {
        temp_audio1.pause();
      }
    };
  }, [temp_audio1]);
  useEffect(() => {
    if (temp_audio2 !== null) {
      temp_audio2.play();
      //temp_audio2.addEventListener("ended", () => alert("end"));
    }
    return () => {
      if (temp_audio2 !== null) {
        temp_audio2.pause();
      }
    };
  }, [temp_audio2]);
  function showSpeak() {
    return (
      <Animation size={15} isStart={isStart} numberOfPieces={100}>
        <div className="">
          <div className="row">
            <div className="col s12 m2 l3"></div>
            <div className="col s12 m8 l6 main_layout">
              {/*<AppNavbar navtitle={"Speak"} />*/}
              <br />
              <NewTopHomeNextBar
                nextlink={resultnext}
                resultnextlang={resultnextlang}
              />
              <img className="image_class" src={content?.image} />
              <div className="content_text_div">{content[sel_lang]}</div>
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
              {voiceText != "" ? (
                <>
                  <br />
                  {/*<div className="content_text_div">Result</div>*/}
                  {/*<font className="app_title">Yay ! You spoke very well !</font>
                  <br />
                  <img
                    style={{
                      width: "40px",
                      height: "40px",
                      cursor: "pointer",
                    }}
                    src={play}
                    onClick={() => playRecordAudio()}
                  />*/}
                  <br />
                  {/*<ReactAudioPlayer
                    autoPlay={false}
                    src={recordedAudio}
                    controls
                    style={{ width: "100%" }}
                  />*/}
                  <br />
                  {/*<div className="content_text_div_see">{voiceText}</div>*/}
                  <br />
                  {/*<div className="app_footbar">
                    <div className="row" style={{ padding: "5px" }}>
                      <div className="col s4 center">
                        <div onClick={() => setVoiceText("")}>
                          <img src={refresh} className="home_icon"></img>
                        </div>
                      </div>
                      <div className="col s4 center">
                        <Link to={"/proto2/"}>
                          <img src={home} className="home_icon"></img>
                        </Link>
                      </div>
                      <div className="col s4 center">
                        <Link
                          to={"/proto2/" + resultnext}
                          onClick={() =>
                            localStorage.setItem("apphomelang", resultnextlang)
                          }
                        >
                          <img src={next} className="home_icon"></img>
                        </Link>
                      </div>
                    </div>
                  </div>*/}
                </>
              ) : (
                <>
                  <NewBottomHomeNextBar
                    nextlink={resultnext}
                    resultnextlang={resultnextlang}
                  />
                </>
              )}
            </div>
            <div className="cols s12 m2 l3"></div>
          </div>
        </div>
        <AppFooter />
      </Animation>
    );
  }
  return <React.Fragment>{showSpeak()}</React.Fragment>;
}

export default Speak;
