import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import NewTopHomeNextBar from '../../components2/NewTopHomeNextBar/NewTopHomeNextBar';
import NewBottomHomeNextBar from '../../components2/NewBottomHomeNextBar/NewBottomHomeNextBar';
//import HomeNextBar from "../../components2/HomeNextBar/HomeNextBar";
import { getContentList } from '../../utils/Const/Const';
import VoiceCompair from '../../components/VoiceCompair/VoiceCompair';
import play from '../../assests/Images/play-img.png';
import pause from '../../assests/Images/pause-img.png';
import refresh from '../../assests/Images/refresh.png';
import { interactCall } from '../../services/callTelemetryIntract';
import { Box, HStack, VStack } from '@chakra-ui/react';
import { scroll_to_top } from '../../utils/Helper/JSHelper';
function StartLearn() {
  const navigate = useNavigate();
  const [isAudioPlay, setIsAudioPlay] = useState(true);
  const [temp_audio, set_temp_audio] = useState(null);
  const [flag, setFlag] = useState(true);
  const playAudio = () => {
    interactCall();
    set_temp_audio(new Audio(content[sel_lang].audio));
  };
  // console.log(isAudioPlay);

  const pauseAudio = () => {
    interactCall();
    if (temp_audio !== null) {
      temp_audio.pause();
      setFlag(!false);
    }
  };

  const learnAudio = () => {
    if (temp_audio !== null) {
      temp_audio.play();
      interactCall();
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
    interactCall();

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

  const [load_cnt, set_load_cnt] = useState(0);
  const [content_list, setContent_list] = useState(null);

  useEffect(() => {
    if (load_cnt == 0) {

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
        let getitem = parseInt(localStorage.getItem('content_random_id')) === -1 ? localStorage.getItem('content_random_id') : 0;
        randomIntFromInterval(Number(tempContent.length - 1)).then(async (returnElementIndex) => {
          getitem = returnElementIndex;
          console.log(getitem);
          await checkitem();
        })

        async function checkitem() {
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

        localStorage.setItem('content_random_id', getitem);
        set_content(tempContent[getitem].content);
        set_content_id(getitem);

        localStorage.setItem(
          'contentText',
          tempContent[getitem].content[localStorage.getItem('apphomelang')].text
        );

        }
      }

      scroll_to_top('smooth');
      set_load_cnt(load_cnt => Number(load_cnt + 1));
      console.log(load_cnt);
    }
  }, [load_cnt]);

  async function randomIntFromInterval(max) {

    if (parseInt(localStorage.getItem('content_random_id')) === max) {
      let pageno = parseInt(localStorage.getItem('pageno')) + 1;
      const response = await fetch(`https://all-content-respository-backend.onrender.com/v1/WordSentence/pagination?type=${sel_level}&page=${pageno}&limit=${process.env.REACT_APP_CONTENT_SIZE}`, {
        method: "get",
        headers: {
          'ngrok-skip-browser-warning': 6124
        }
      }).then((res) => res.json())
      .then(async (res) => {
        const dataFromAPI = res;
        let contentdata = []
        dataFromAPI.data.forEach((element, index) => {
            let contentObj = {};
            contentObj.title = element.title
            contentObj.type = element.type
            contentObj.ta = element.data[0].ta
            contentObj.en = element.data[0].en
            contentObj.image = element.image
            contentdata[index] = contentObj;
        });

        if (contentdata.length == 0) {
          const response = await fetch(`https://all-content-respository-backend.onrender.com/v1/WordSentence/pagination?type=${sel_level}&page=1&limit=${process.env.REACT_APP_CONTENT_SIZE}`, {
            method: "get",
            headers: {
              'ngrok-skip-browser-warning': 6124
            }
          }).then((res) => res.json())
          .then((res) => {
            const dataFromAPI = res;
            let contentdata = []
          dataFromAPI.data.forEach((element, index) => {
              let contentObj = {};
              contentObj.title = element.title
              contentObj.type = element.type
              contentObj.ta = element.data[0].ta
              contentObj.en = element.data[0].en
              contentObj.image = element.image
              contentdata[index] = contentObj;
          });
          localStorage.setItem('contents', JSON.stringify(contentdata));
          localStorage.setItem('content_random_id', 0);
          localStorage.setItem('pageno', 1);
        })
        }else{
          localStorage.setItem('contents', JSON.stringify(contentdata));
          localStorage.setItem('content_random_id', 0);
          localStorage.setItem('pageno', pageno);
        }
        return 0;
      })
      return 0;
      } else {
              return parseInt(localStorage.getItem('content_random_id')) + 1;
      }
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
                    {sel_lang !== 'ta' ? (
                      <div className="content_text_div">
                        {content['ta']?.text ? content['ta']?.text : ''}
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
                    {sel_lang !== 'ta' ? (
                      <div className="content_text_div_see_ta"  style={{fontSize:'21px'}}>
                        {content['ta']?.text ? content['ta']?.text : ''}
                      </div>
                    ) : (
                      <></>
                    )}
                  </>
                )}
                <br />

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
                      alt='play_audio'
                      />
                  ) : (
                    <img
                    className="play_btn"
                      src={pause}
                      style={{ height: '72px', width: '72px' }}
                      onClick={() => pauseAudio()}
                      alt='pause_audio'
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

                    alt='try_new_btn'

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
                                    <NewTopHomeNextBar
                  nextlink={''}
                  ishomeback={true}
                  isHideNavigation={true}
                    />
                      <>
                        <h1>Loading....</h1>
                      </>
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
