import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NewTopHomeNextBar from '../../../components/NewTopHomeNextBar/NewTopHomeNextBar';
import NewBottomHomeNextBar from '../../../components/NewBottomHomeNextBar/NewBottomHomeNextBar';
import { getContentList } from '../../../utils/Const/Const';
import VoiceCompair from '../../../components/VoiceCompair/VoiceCompair';
import play from '../../../assests/Images/play-img.png';
import pause from '../../../assests/Images/pause-img.png';
import refresh from '../../../assests/Images/refresh.png';
import { interactCall } from '../../../services/callTelemetryIntract';
import { HStack, VStack } from '@chakra-ui/react';
import { scroll_to_top } from '../../../utils/Helper/JSHelper';
import { getParameter } from '../../../utils/helper';
import AppFooter from '../../../components/AppFooter/AppFooter';

function StartLearn() {
  const location = useLocation();
  const myCurrectLanguage = getParameter('language', location.search);
  const navigate = useNavigate();
  const [isAudioPlay, setIsAudioPlay] = useState(true);
  const [temp_audio, set_temp_audio] = useState(null);
  const [flag, setFlag] = useState(true);
  const playAudio = () => {
    interactCall("playAudio", "startlearn","DT", "play");
      set_temp_audio(new Audio(content[sel_lang].audio));
  };

  const pauseAudio = () => {
    interactCall("pauseAudio", "startlearn","DT", "pause");
    if (temp_audio !== null) {
      temp_audio.pause();
      setFlag(!false);
    }
  };

  const learnAudio = () => {
    if (temp_audio !== null) {
      temp_audio.play();
      interactCall("learnAudio", "startlearn","DT", "learn");
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
    interactCall("newSentence", "startlearn","DT", "");
    handleChangeWord()
  };
  useEffect(() => {
    learnAudio();
  }, [temp_audio]);

  const [sel_lang, set_sel_lang] = useState(
    localStorage.getItem('apphomelang')
      ? localStorage.getItem('apphomelang')
      : 'en'
  );

  const [sel_level, set_sel_level] = useState(
    localStorage.getItem('apphomelevel')
      ? localStorage.getItem('apphomelevel')
      : 'Word'
  );

  const [apphomelevel, set_apphomelevel] = useState(
    localStorage.getItem('apphomelevel')
      ? localStorage.getItem('apphomelevel')
      : 'Word'
  );

  const [isfromresult, set_isfromresult] = useState(
    localStorage.getItem('isfromresult')
      ? localStorage.getItem('isfromresult')
      : 'learn'
  );

  const [resultnext, set_resultnext] = useState(
    localStorage.getItem('resultnext') ? localStorage.getItem('resultnext') : ''
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
  const [hide_navFooter, set_hide_navFooter] = useState('false');
  const [load_cnt, set_load_cnt] = useState(0);
  // const [content_list, setContent_list] = useState(null);
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
    const showNavigationFooter = getParameter('hideNavigation',location.search);
    set_hide_navFooter(showNavigationFooter);

    if (load_cnt == 0) {
      let count_array = 0;
      const content_list = getContentList();

      let tempContent = [];
      const content_count = Object.keys(content_list).length;
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
        if (trysame !== 'yes') {
          let old_getitem = getitem;
          while (old_getitem == getitem) {
            getitem = randomIntFromInterval(0, Number(tempContent.length - 1));
          }
        }
        localStorage.setItem('trysame', 'no');
        localStorage.setItem('content_random_id', getitem);
        set_content(tempContent[getitem].content);
        set_content_id(getitem);
        localStorage.setItem(
          'contentText',
          tempContent[getitem].content[localStorage.getItem('apphomelang')].text
        );
      }
      scroll_to_top('smooth');
      setNewTempContent(tempContent)
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
    const myCurrectLanguage = getParameter('language', location.search);
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
                  ishomeback={true}
                  isHideNavigation={true}
                />
                {sel_cource === 'See & Speak' ? (
                  <>
                    <br />
                    <img className="image_class" src={content?.image} />
                    <div className="content_text_div">
                      {content[sel_lang]?.text ? content[sel_lang]?.text : ''}
                    </div>
                    {sel_lang !== myCurrectLanguage ? (
                      <div className="content_text_div">
                        {content[myCurrectLanguage]?.text ? content[myCurrectLanguage]?.text : ''}
                      </div>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <>
                    <br />
                    <div className="content_text_div_see">
                      {content[sel_lang]?.text ? content[sel_lang]?.text : ''}
                    </div>
                    {sel_lang !== myCurrectLanguage ? (
                      <div className="content_text_div_see_ta"  style={{fontSize:'21px'}}>
                        {content[myCurrectLanguage]?.text ? content[myCurrectLanguage]?.text : ''}
                      </div>
                    ) : (
                      <></>
                    )}
                  </>
                )}
                <br />

                <VStack gap={'10'} alignItems="center">
                  <HStack
                    display={'flex'}
                    gap={'40'}
                    justifyContent={'justify-between'}
                  >
                    {isAudioPlay !== 'recording' && (
                      <VStack alignItems="center" gap="5">
                        {flag ? (
                          <img
                            className="play_btn"
                            src={play}
                            style={{ height: '72px', width: '72px' }}
                            onClick={() => playAudio()}
                            alt="play_audio"
                          />
                        ) : (
                          <img
                            className="play_btn"
                            src={pause}
                            style={{ height: '72px', width: '72px' }}
                            onClick={() => pauseAudio()}
                            alt="pause_audio"
                          />
                        )}
                        <h4
                          className="text-play m-0 "
                          style={{ position: 'relative' }}
                        >
                          Listen
                        </h4>
                      </VStack>
                    )}
                    <VStack>
                      <VoiceCompair
                        setVoiceText={setVoiceText}
                        setRecordedAudio={setRecordedAudio}
                        _audio={{ isAudioPlay: e => setIsAudioPlay(e) }}
                        flag={true}
                      />
                      {isAudioPlay === 'recording' ? (
                        <h4 className="text-speak m-0">Stop</h4>
                      ) : (
                        <h4 className="text-speak m-0">Speak</h4>
                      )}
                    </VStack>
                  </HStack>
                  {isAudioPlay !== 'recording' && (
                    <VStack>
                      <img
                        src={refresh}
                        className="home_icon"
                        style={{ height: '72px', width: '72px' }}
                        alt="try_new_btn"
                        onClick={newSentence}
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
                  <h1>Loading...</h1>
                </div>
              </div>
            </div>
          </>
        )}
        {hide_navFooter === 'false' ? (
          <AppFooter
            hideNavigation={getParameter('hideNavigation', location.search)}
            selectedLanguage={getParameter('language', location.search)}
            source={getParameter('source', location.search)}
          />
        ) : (
          <></>
        )}
      </>
    );
  }
  return <React.Fragment>{showStartLearn()}</React.Fragment>;
}

export default StartLearn;
