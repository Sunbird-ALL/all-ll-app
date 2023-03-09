import React, { useState, useEffect } from 'react';
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { getContentList } from '../../utils/Const/Const';
import VoiceCompair from '../../components/VoiceCompair/VoiceCompair';
import play from '../../assests/Images/play-img.png';
import pause from '../../assests/Images/pause-img.png';
import refresh from '../../assests/Images/refresh.png';

import mic from '../../assests/Images/mic_old.png';
import axios from 'axios';

import { scroll_to_top } from '../../utils/Helper/JSHelper';

/*chakra*/
import { Button } from '@chakra-ui/react';

import { getParameter } from '../../utils/helper';

function StartLearn() {
  const navigate = useNavigate();

  const [temp_audio, set_temp_audio] = useState(null);
  const [flag, setFlag] = useState(true);
  const location = useLocation();
  const playAudio = () => {
    set_temp_audio(new Audio(content[sel_lang].audio));
  };
  const pauseAudio = () => {
    if (temp_audio !== null) {
      temp_audio.pause();
      setFlag(!false);
    }
  };

  const learnAudio = () => {
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

  useEffect(() => {
    localStorage.setItem('apphomelang', 'en');
    learnAudio();
  }, [temp_audio]);

  const [sel_lang, set_sel_lang] = useState('en');
  const [sel_lang_text, set_sel_lang_text] = useState('English');
  const [sel_level, set_sel_level] = useState('Sentence');
  const [sel_cource, set_sel_cource] = useState('Listen & Speak');
  const [trysame, set_trysame] = useState(
    localStorage.getItem('trysame') ? localStorage.getItem('trysame') : 'no'
  );

  const [content, set_content] = useState(null);
  const [content_id, set_content_id] = useState(0);

  const [load_cnt, set_load_cnt] = useState(0);

  const getfromurl = () => {
    const filePath = getParameter('source', location.search);
    axios
      .get(filePath)
      .then(res => {
        localStorage.setItem('contents', JSON.stringify(res.data));

        if (load_cnt == 0) {
          const content_list = getContentList();

          let tempContent = [];
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
                getitem = randomIntFromInterval(
                  0,
                  Number(tempContent.length - 1)
                );
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
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    getfromurl();
  }, [load_cnt]);
  function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  const [recordedAudio, setRecordedAudio] = useState('');
  const [voiceText, setVoiceText] = useState('');
  useEffect(() => {
    if (voiceText == '-') {
      alert('AI4Bharat gives empty source');
      setVoiceText('');
      setFlag(true);
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
    document.getElementById('link_score_proto4').click();
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
                {/* <h1>Speak like me</h1> */}

                <br />
                {sel_cource === 'See & Speak' ? (
                  <>
                    <div className="content_text_div">
                      {content[sel_lang]?.text ? content[sel_lang]?.text : ''}
                    </div>
                  </>
                ) : (
                  <h2 className="">
                    {content[sel_lang]?.text ? content[sel_lang]?.text : ''}
                  </h2>
                )}

                <div style={{ display: 'inline-flex' }}>
                  {flag ? (
                    <>
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
                    </>
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
                <div onClick={() => navigate(0)}>
                  <img src={refresh} className="home_icon"></img>
                  <br />
                  Try new
                </div>
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
                  {/* <h1>No Content Found</h1> */}
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
