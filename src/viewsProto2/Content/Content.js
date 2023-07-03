import React, { useState, useEffect, createRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ReactAudioPlayer from "react-audio-player";
import AudioPlayer from "react-h5-audio-player";

import content_list from "../../utils/Const/Const";
import home_old from "../../assests/Images/home_old.png";
import "react-h5-audio-player/lib/styles.css";
import VoiceCompair from "../../components/VoiceCompair/VoiceCompair";

import { showLoading, stopLoading } from "../../utils/Helper/SpinnerHandle";

/*chakra*/
import AppFooter from '../../components2/AppFooter/AppFooter';

function Content() {
  const app_history = useNavigate();
  // Get ID from URL
  const params = useParams();
  const audio_player = createRef();
  const [sel_lang, set_sel_lang] = useState(
    localStorage.getItem("apphomelang")
      ? localStorage.getItem("apphomelang")
      : "en"
  );
  const [iscontentpresent, setiscontentpresent] = useState(null);
  const [content, setcontent] = useState({});
  const [isedit, setisedit] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState("");
  const [voiceText, setVoiceText] = useState("");
  const [texttospeechaudio, settexttospeechaudio] = useState("");
  const [textAreaheight, settextAreaheight] = useState("0px");
  const [contentText, setContentText] = useState("");
  const convertai4bharat = () => {
    settexttospeechaudio("");
    showLoading();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var payload = JSON.stringify({
      input: [
        {
          source: contentText,
        },
      ],
      config: {
        gender: "female",
        language: {
          sourceLanguage: "hi",
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
  const [load_count, setload_count] = useState(0);
  useEffect(() => {
    if (load_count === 0) {
      //convertai4bharat();
      //setload_count((load_count) => Number(load_count + 1));
      setcontent(content_list[params.id]);
      if (content_list[params.id]?.[`${sel_lang}`]) {
        setiscontentpresent(true);
        setContentText(content_list[params.id]?.[`${sel_lang}`].text);
        settexttospeechaudio(content_list[params.id]?.[`${sel_lang}`].audio);
      } else {
        setiscontentpresent(false);
        setContentText("");
        settexttospeechaudio("");
      }
    }
    setInterval(function () {
      auto_grow();
    }, 500);
  }, [load_count]);
  useEffect(() => {
    if (voiceText !== "") {
      go_to_result(voiceText);
    }
  }, [voiceText]);
  useEffect(() => {
    if (isedit) {
      if (document.getElementById("postContent") != null) {
        const element = document.getElementById("postContent");
        element.focus();
      }
    }
  }, [isedit]);
  function go_to_result(voiceText) {
    localStorage.setItem("contentText", contentText);
    localStorage.setItem("recordedAudio", recordedAudio);
    localStorage.setItem("voiceText", voiceText);
    localStorage.setItem("id", params.id);
    localStorage.setItem("voiceTextBlob", texttospeechaudio);
    document.getElementById("link_result_proto2").click();
  }
  function auto_grow() {
    if (document.getElementById("postContent") != null) {
      const element = document.getElementById("postContent");
      settextAreaheight(element.scrollHeight + "px");
    }
  }
  function showContent() {
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
              <div style={{ marginTop: "-65px" }}>
                {iscontentpresent != null ? (
                  iscontentpresent ? (
                    <center>
                      <h5 className="home_title">
                        {content_list[params.id]?.title}
                      </h5>
                      <hr />
                      <div className="content_view">
                        {isedit ? (
                          <>
                            <br />
                            <textarea
                              name="postContent"
                              onChange={(e) => {
                                settexttospeechaudio("");
                                setContentText(e.target.value);
                              }}
                              onInput={(e) => auto_grow(e)}
                              className="textarea_content"
                              id="postContent"
                              style={{ height: textAreaheight }}
                              value={contentText}
                            />
                            <br />
                            <br />
                            <div
                              className="button_div"
                              onClick={() => setisedit(false)}
                            >
                              Save
                            </div>
                          </>
                        ) : (
                          <>
                            {/*<div
                              className="button_div_edit"
                              onClick={() => setisedit(true)}
                            >
                              Enter Your Text
                            </div>
                            <br />*/}
                            {contentText}
                          </>
                        )}
                        {/*!isedit ? (
                          texttospeechaudio != "" ? (
                            <>
                              <br />
                              <br />
                              <AudioPlayer
                                autoPlay={false}
                                src={texttospeechaudio}
                                ref={audio_player}
                                style={{ width: "100%" }}
                              />
                            </>
                          ) : (
                            <>
                              <br />
                              <br />
                              <div
                                className="button_div"
                                onClick={() => convertai4bharat()}
                              >
                                Convert to Hear
                              </div>
                            </>
                          )
                        ) : (
                          ""
                        )*/}
                        <br />
                        <br />
                        <AudioPlayer
                          autoPlay={false}
                          src={texttospeechaudio}
                          ref={audio_player}
                          style={{ width: "100%" }}
                        />
                      </div>
                      {!isedit ? (
                        texttospeechaudio != "" ? (
                          <>
                            <hr />
                            <VoiceCompair
                              setVoiceText={setVoiceText}
                              setRecordedAudio={setRecordedAudio}
                            />
                          </>
                        ) : (
                          ""
                        )
                      ) : (
                        ""
                      )}
                    </center>
                  ) : (
                    <center>
                      <h5 className="home_title">No content found</h5>
                    </center>
                  )
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="cols s12 m4 l4"></div>
          </div>
        </div>
        <AppFooter />
      </>
    );
  }
  return <React.Fragment>{showContent()}</React.Fragment>;
}

export default Content;
