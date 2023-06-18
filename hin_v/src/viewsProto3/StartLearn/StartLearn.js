import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import AppNavbar from '../../components/AppNavbar/AppNavbar';
import NewTopHomeNextBar from '../../components2/NewTopHomeNextBar/NewTopHomeNextBar';
import NewBottomHomeNextBar from '../../components2/NewBottomHomeNextBar/NewBottomHomeNextBar';
//import HomeNextBar from "../../components2/HomeNextBar/HomeNextBar";
import { getContentList } from '../../utils/Const/Const';
import VoiceCompair from '../../components/VoiceCompair/VoiceCompair';
import ReactAudioPlayer from 'react-audio-player';
import play from '../../assests/Images/play-img.png';
import pause from '../../assests/Images/pause-img.png';
import refresh from '../../assests/Images/refresh.png';
import {startEvent,interactCall} from "../../services/callTelemetryIntract"
import axios from 'axios';

import { scroll_to_top } from '../../utils/Helper/JSHelper';

/*chakra*/
import AppFooter from '../../components2/AppFooter/AppFooter';
import { useWindowSize } from 'react-use-window-size';
import { getParameter } from '../../utils/helper';

function StartLearn() {
  const navigate = useNavigate();

  const [temp_audio, set_temp_audio] = useState(null);
  const [flag, setFlag] = useState(true);
  const location = useLocation();
  const playAudio = () => {
    interactCall()
    set_temp_audio(new Audio(content[sel_lang].audio));
  };

  const pauseAudio = () => {
    interactCall()
    if (temp_audio !== null) {
      temp_audio.pause();
      setFlag(!false);
    }
  };

  const learnAudio = () => {
    interactCall()
    if (temp_audio !== null) {
      temp_audio.play();
      setFlag(!flag);
      temp_audio.addEventListener('ended', () => setFlag(true));
    }
    return () => {
      if (temp_audio !== null) {
        temp_audio.pause();
      }
    };
  };

  const newSentence = () => {
    interactCall()
    navigate(0);
  };
  useEffect(() => {
    learnAudio();
  }, [temp_audio]);

  const [sel_lang, set_sel_lang] = useState(
    localStorage.getItem('apphomelang')
      ? localStorage.getItem('apphomelang')
      : 'en'
  );
  const [sel_lang_text, set_sel_lang_text] = useState(
    localStorage.getItem('apphomelang')
      ? localStorage.getItem('apphomelang') === 'hi'
        ? 'Hindi'
        : 'English'
      : 'English'
  );
  const [sel_level, set_sel_level] = useState(
    localStorage.getItem('apphomelevel')
      ? localStorage.getItem('apphomelevel')
      : 'Word'
  );
  const [sel_cource, set_sel_cource] = useState(
    localStorage.getItem('apphomecource')
      ? localStorage.getItem('apphomecource')
      : 'Listen & Speak'
  );
  const [trysame, set_trysame] = useState(
    localStorage.getItem('trysame') ? localStorage.getItem('trysame') : 'no'
  );
  let forbiddenChars = ['!', '?', '.'];

  const [content, set_content] = useState(null);
  const [content_id, set_content_id] = useState(0);

  const [load_cnt, set_load_cnt] = useState(0);
  // const [content_list, setContent_list] = useState(null);

  useEffect(() => {
    // getfromurl();
    if (load_cnt == 0) {
      let count_array = 0;
      const content_list = getContentList();

      let tempContent = [];
      const content_count = Object.keys(content_list).length;
      const content_keys = Object.keys(content_list);
      content_keys.forEach(key => {
        if (
          content_list[key].type == sel_level &&
          content_list[key]?.[sel_lang]
        ) {
          tempContent.push({
            content: content_list[key],
          });
        }
      });
      if (tempContent.length > 0) {
        let getitem = localStorage.getItem('content_random_id')
          ? localStorage.getItem('content_random_id')
          : 0;
        if (trysame != 'yes') {
          let old_getitem = getitem;
          while (old_getitem == getitem) {
            getitem = randomIntFromInterval(0, Number(tempContent.length - 1));
          }
        }
        localStorage.setItem('trysame', 'no');
        localStorage.setItem('content_random_id', getitem);
        set_content(tempContent[getitem].content);
        
        set_content_id(getitem);
      }
      scroll_to_top('smooth');
      set_load_cnt(load_cnt => Number(load_cnt + 1));
    }
  }, [load_cnt]);
  function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  const [recordedAudio, setRecordedAudio] = useState('');
  const [voiceText, setVoiceText] = useState('');
  useEffect(() => {
    if (voiceText == '-') {
      alert("Sorry I couldn't hear a voice. Could you please speak again?");
      setVoiceText('');
    }
    if ((voiceText !== '') & (voiceText !== '-')) {
      go_to_result(voiceText);
    }
  }, [voiceText]);
  function go_to_result(voiceText) {
    localStorage.setItem('contentText', content[sel_lang].text);    
    localStorage.setItem('recordedAudio', recordedAudio);
    localStorage.setItem('voiceText', voiceText);
    localStorage.setItem('contentid', content_id);
    localStorage.setItem('contenttype', content['title']);
    localStorage.setItem('isfromresult', 'learn');
    document.getElementById('link_score_proto3').click();
  }
  function showStartLearn() {
    return (
      <>
        {content != null && content[sel_lang] ? (
          <div className="">
            <div className="row">
              <div className="col s12 m2 l3"></div>
              <div className="col s12 m8 l6 main_layout">
                <br />
                <NewTopHomeNextBar
                  nextlink={''}
                  ishomeback={false}
                  isHideNavigation={true}
                />
                {sel_cource === 'See & Speak' ? (
                  <>
                    <br />
                    <img className="image_class" src={content?.image} />
                    {sel_lang != 'hi' ? (
                      <div className="content_text_div">
                        {content['hi']?.text ? content['hi']?.text : ''}
                      </div>
                    ) : (
                      <></>
                    )}
                    <div className="content_text_div">
                      {content[sel_lang]?.text ? content[sel_lang]?.text : ''}
                    </div>
                  </>
                ) : (
                  <>
                    <br />
                    {sel_lang != 'hi' ? (
                      <div className="content_text_div_see">
                        {content['hi']?.text ? content['hi']?.text : ''}
                      </div>
                    ) : (
                      <></>
                    )}
                    <div className="content_text_div_see">
                      {content[sel_lang]?.text ? content[sel_lang]?.text : ''}
                    </div>
                  </>
                )}
                <br />

                <div style={{ display: 'inline-flex' }}>
                  {flag ? (
                    <img
                      style={{
                        width: '80px',
                        height: '80px',
                        cursor: 'pointer',
                        marginRight: '80px',
                      }}
                      src={play}
                      onClick={() => playAudio()}
                    />
                  ) : (
                    <img
                      style={{
                        width: '80px',
                        height: '80px',
                        cursor: 'pointer',
                        marginRight: '80px',
                      }}
                      src={pause}
                      onClick={() => pauseAudio()}
                    />
                  )}

                  <VoiceCompair
                    setVoiceText={setVoiceText}
                    setRecordedAudio={setRecordedAudio}
                    flag={true}
                  />
                </div>

                <br />
                <div style={{ display: 'inline-flex' }}>
                  <h4 className="text-play"> Listen</h4>
                  <h4 className="text-speak">speak</h4>
                </div>
                <br />
                <div onClick={newSentence}>
                  <img src={refresh} className="home_icon"></img>
                  <br />
                  Try new
                </div>
                <NewBottomHomeNextBar nextlink={''} ishomeback={true} />
              </div>
              <div className="cols s12 m2 l3"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="">
              <div className="row">
                <div className="col s12 m2 l3"></div>
                <div className="col s12 m8 l6 main_layout">
                  <h1>Loading...</h1>
                </div>
              </div>
            </div>
          </>
        )}
        {/* <AppFooter hideNavigation={true} removeData={true} /> */}
      </>
    );
  }
  return <React.Fragment>{showStartLearn()}</React.Fragment>;
}

export default StartLearn;
