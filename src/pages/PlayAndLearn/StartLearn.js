import React, { useState, useEffect } from 'react';
import {
  useLocation,
  useNavigate
} from 'react-router-dom';
import { Box, HStack, VStack } from '@chakra-ui/react';
import { getContentList } from '../../utils/Const/Const';
import VoiceCompair from '../../components/VoiceCompair/VoiceCompair';
import play from '../../assests/Images/play-img.png';
import pause from '../../assests/Images/pause-img.png';
import refresh from '../../assests/Images/refresh.png';
import AppFooter from '../../components/AppFooter/AppFooter';

import { interactCall } from '../../services/callTelemetryIntract';
import axios from 'axios';

import { scroll_to_top } from '../../utils/Helper/JSHelper';

/*chakra*/

import {  getParameter } from '../../utils/helper';

function StartLearn() {
  const navigate = useNavigate();
  const [isAudioPlay, setIsAudioPlay] = useState(true);
  const [temp_audio, set_temp_audio] = useState(null);
  const [flag, setFlag] = useState(true);
  const location = useLocation();

  const playAudio = () => {
    interactCall('DT');
    set_temp_audio(new Audio(content[sel_lang].audio));
  };

  const pauseAudio = () => {
    interactCall('DT');
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

  const newSentence = () => {
    interactCall('DT');
    handleChangeWord()
  };

  useEffect(() => {
    localStorage.setItem('apphomelang', 'en');
    learnAudio();
  }, [temp_audio]);

  const [sel_lang, set_sel_lang] = useState('en');
  const [sel_level, set_sel_level] = useState('Sentence');
  const [sel_cource, set_sel_cource] = useState('Listen & Speak');

  const [trysame, set_trysame] = useState(
    localStorage.getItem('trysame') ? localStorage.getItem('trysame') : 'no'
  );

  const [content, set_content] = useState(null);
  const [content_id, set_content_id] = useState(0);

  const [load_cnt, set_load_cnt] = useState(0);
  const [hide_navFooter, set_hide_navFooter] = useState('false');

  const getfromurl = () => {
    const filePath = getParameter('source', location.search);

    if (filePath && filePath != 'null') {
    axios
      .get(filePath)
      .then(res => {
        localStorage.setItem('contents', JSON.stringify(res.data));

        if (load_cnt === 0) {
          const content_list = getContentList();

          let tempContent = [];
          const content_keys = Object.keys(content_list);

          content_keys.forEach(key => {
            if (
              content_list[key].type === sel_level &&
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
            localStorage.setItem('contentText', tempContent[getitem].content[localStorage.getItem('apphomelang')].text);
          }
          scroll_to_top('smooth');
            setNewTempContent(tempContent)
          set_load_cnt(load_cnt => Number(load_cnt + 1));
        }
      })
      .catch(err => console.log(err));
    } else {
      axios
      .get(window.location.origin + '/db/playAndLearn/proto4.json')
      .then(res => {
        localStorage.setItem('contents', JSON.stringify(res.data));

        if (load_cnt === 0) {
          const content_list = getContentList();

          let tempContent = [];
          const content_keys = Object.keys(content_list);

          content_keys.forEach(key => {
            if (
              content_list[key].type === sel_level &&
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
            localStorage.setItem('contentText', tempContent[getitem].content[localStorage.getItem('apphomelang')].text);
          }
          scroll_to_top('smooth');
          setNewTempContent(tempContent)
          set_load_cnt(load_cnt => Number(load_cnt + 1));
        }
      })
      .catch(err => console.log(err));
    }

  };
  const [newTempContent, setNewTempContent] = useState([]); 

  const handleChangeWord = () => {
    // Implement logic to select a new content
    let getitem = content_id;
      let old_getitem = getitem;
      while (old_getitem === getitem) {
        getitem = randomIntFromInterval(0, Number(newTempContent.length - 1));
      }
    localStorage.setItem('trysame', 'no');
    localStorage.setItem('content_random_id', getitem);
    set_content(newTempContent[getitem].content);
    set_content_id(getitem);
    localStorage.setItem(
        'contentText',
        newTempContent[getitem].content[localStorage.getItem('apphomelang')].text
      );
  };


  useEffect(() => {
    const showNavigationFooter = getParameter('hideNavigation', location.search);
    set_hide_navFooter(showNavigationFooter);
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
      alert("Sorry I couldn't hear a voice. Could you please speak again?");
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

            <VStack gap={'10'} alignItems="center">
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
                    onClick={newSentence}
                    alt=''


                  />
                  <h4 className="text-speak m-0">Try new</h4>
                </VStack>
              )}
            </VStack>
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
        {hide_navFooter === 'false' ? (
          <AppFooter hideNavigation={getParameter('hideNavigation', location.search)} selectedLanguage={getParameter('language', location.search)} source={getParameter('source', location.search)}/>
        ) : (
          <></>
        )}
      </>
    );
  }
  return <React.Fragment>{showStartLearn()}</React.Fragment>;
}

export default StartLearn;
