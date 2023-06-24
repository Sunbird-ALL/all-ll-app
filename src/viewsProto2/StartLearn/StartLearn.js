import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { VStack,HStack } from '@chakra-ui/react';
import AppNavbar from '../../components/AppNavbar/AppNavbar';
import NewTopHomeNextBar from '../../components2/NewTopHomeNextBar/NewTopHomeNextBar';
import NewBottomHomeNextBar from '../../components2/NewBottomHomeNextBar/NewBottomHomeNextBar';
//import HomeNextBar from "../../components2/HomeNextBar/HomeNextBar";
import content_list from '../../utils/Const/Const';
import VoiceCompair from '../../components/VoiceCompair/VoiceCompair';
import ReactAudioPlayer from 'react-audio-player';
import play from '../../assests/Images/play-img.png';
import pause from '../../assests/Images/pause-img.png';
import refresh from '../../assests/Images/refresh.png';
import { scroll_to_top } from '../../utils/Helper/JSHelper';

/*chakra*/
import AppFooter from '../../components2/AppFooter/AppFooter';
console.log("proto2/startlearn");
function StartLearn() {
  const navigate = useNavigate();

  const [isAudioPlay, setIsAudioPlay] = useState(true);

  const [temp_audio, set_temp_audio] = useState(null);
  const [flag, setFlag] = useState(true);
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
    learnAudio();
  }, [temp_audio]);

  const [sel_lang, set_sel_lang] = useState(
    localStorage.getItem('apphomelang')
      ? localStorage.getItem('apphomelang')
      : 'en'
  );
  const [sel_lang_text, set_sel_lang_text] = useState(
    localStorage.getItem('apphomelang')
      ? localStorage.getItem('apphomelang') === 'ta'
        ? 'Tamil'
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

  const [content, set_content] = useState(null);
  const [content_id, set_content_id] = useState(0);

  const [load_cnt, set_load_cnt] = useState(0);

  useEffect(() => {
    if (load_cnt == 0) {
      let count_array = 0;
      /*for (let value of content_list) {
        if (value.title == sel_level) {
          set_content(value);
          set_content_id(count_array);
          break;
        }
        count_array++;
      }*/
      //extract title
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
      //console.log(JSON.stringify(tempContent[0].content));
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
    document.getElementById('link_score_proto2').click();
  }
  function showStartLearn() {
    return (
      <>
        {content != null && content[sel_lang] ? (
          <div className="">
            <div className="row">
              <div className="col s12 m2 l3"></div>
              <div className="col s12 m8 l6 main_layout">
                {/*<AppNavbar navtitle={sel_cource + " a " + sel_level} />*/}
                <br />
                <NewTopHomeNextBar nextlink={''} ishomeback={true} />
                {sel_cource === 'See & Speak' ? (
                  <>
                    {/*<div className="content_text_div">
                    {"Answer in one " + sel_level + ". What is this?"}
                  </div>*/}
                    <br />
                    <img className="image_class" src={content?.image} />
                    {sel_lang != 'ta' ? (
                      <div className="content_text_div">
                        {content['ta']?.text ? content['ta']?.text : ''}
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
                    {sel_lang != 'ta' ? (
                      <div className="content_text_div_see">
                        {content['ta']?.text ? content['ta']?.text : ''}
                      </div>
                    ) : (
                      <></>
                    )}
                    <div className="content_text_div_see">
                      {content[sel_lang]?.text ? content[sel_lang]?.text : ''}
                    </div>
                  </>
                )}

                {/* <div style={{ display: 'inline-flex' }}>
                  {flag ? (
                    <>
                     
                      <img
                        style={{
                          width: '72px',
                          height: '72px',
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
                        width: '72px',
                        height: '72px',
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
                    _audio={{ isAudioPlay: e => setIsAudioPlay(e) }}
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
                </div> */}
                 <VStack gap={'10'} alignItems="center">
              <HStack display={'flex'} gap={'40'} justifyContent={'justify-between'}>

              {isAudioPlay !== 'recording' && (
                <VStack alignItems="center" gap="5">
                  {flag ? (
                    <img
                    className="play_btn"
                      src={play}
                      style={{ height: '72px', width: '72px' }}
                      onClick={() => playAudio()}
                      />
                  ) : (
                    <img
                    className="play_btn"
                      src={pause}
                      style={{ height: '72px', width: '72px' }}
                      onClick={() => pauseAudio()}
                      />
                      )}
                  <h4 className="text-play m-0 " style={{position:'relative'}}>Listen</h4>
                </VStack>
              )}
              <VStack>
                <VoiceCompair
                  setVoiceText={setVoiceText}
                  setRecordedAudio={setRecordedAudio}
                  _audio={{ isAudioPlay: e => setIsAudioPlay(e) }}
                  flag={true}
                  
                  />
                  {isAudioPlay === 'recording'? <h4 className="text-speak m-0">Stop</h4>:<h4 className="text-speak m-0">Speak</h4>}
                
                  </VStack>
              </HStack>
              {isAudioPlay !== 'recording' && (
                <VStack>
                  <img
                    src={refresh}
                    className="home_icon"
                    style={{ height: '72px', width: '72px' }}
                    onClick={() => navigate(0)}
                  />
                  <h4 className="text-speak m-0">Try new</h4>
                </VStack>
              )}
            </VStack>
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
                  <h1>Loading</h1>
                </div>
              </div>
            </div>
          </>
        )}
        <AppFooter />
      </>
    );
  }
  return <React.Fragment>{showStartLearn()}</React.Fragment>;
}

export default StartLearn;
