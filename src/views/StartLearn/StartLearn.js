import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NewTopHomeNextBar from '../../components/NewTopHomeNextBar/NewTopHomeNextBar';
import NewBottomHomeNextBar from '../../components/NewBottomHomeNextBar/NewBottomHomeNextBar';
//import HomeNextBar from "../../components/HomeNextBar/HomeNextBar";
import content_list from '../../utils/Const/ContentJSON';
import VoiceCompair from '../../components/VoiceCompair/VoiceCompair';
// import play from '../../assests/Images/play.png';
import play from '../../assests/Images/play-img.png';
import pause from '../../assests/Images/pause-img.png';
import refresh from '../../assests/Images/refresh.png';
import { scroll_to_top } from '../../utils/Helper/JSHelper';
import { Box, HStack, VStack } from '@chakra-ui/react';
import wordLists from '../../Badwords/badWords.json';
import { replaceAll, compareArrays } from '../../utils/helper';

function StartLearn() {
  const myCurrectLanguage = process.env.REACT_APP_LANGUAGE;
  const navigate = useNavigate();
  const [temp_audio, set_temp_audio] = useState(null);
  const [flag, setFlag] = useState(true);
  const [isAudioPlay, setIsAudioPlay] = useState(true);
  const playAudio = () => {
    set_temp_audio(new Audio(content[sel_lang + '_audio']));
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

  const [content, set_content] = useState({});
  const [content_id, set_content_id] = useState(0);
  const [load_cnt, set_load_cnt] = useState(0);

  useEffect(() => {
    if (load_cnt == 0) {
      let count_array = 0;
      for (let value of content_list) {
        if (value.title === sel_level) {
          set_content(value);
          set_content_id(count_array);
          break;
        }
        count_array++;
      }
      scroll_to_top('smooth');
      set_load_cnt(load_cnt => Number(load_cnt + 1));
    }
    localStorage.setItem('contentText', content[sel_lang]);
  }, [load_cnt]);

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

  const checkBadWord = userInput => {
    const lang_code = localStorage.getItem('apphomelang');
    const words = wordLists[lang_code];

    if (!words || !Array.isArray(words)) {
      return false;
    }

    const cleanedInput = userInput.trim().toLowerCase();
    return words.includes(cleanedInput);
  };

  const filterBadWords = input => {
    let texttemp = input;
    texttemp = replaceAll(texttemp, '.', '');
    texttemp = replaceAll(texttemp, "'", '');
    texttemp = replaceAll(texttemp, ',', '');
    texttemp = replaceAll(texttemp, '!', '');
    texttemp = replaceAll(texttemp, '|', '');
    texttemp = replaceAll(texttemp, '?', '');
    const wordsToFilter = texttemp.toLowerCase().split(/\s+/); // Split the input into an array of words
    const filteredWords = wordsToFilter.map(word => {
      if (checkBadWord(word)) {
        return '****'; // Replace bad words with ****
      }
      return word;
    });

    return filteredWords.join(' '); // Join the array back into a string
  };

  function go_to_result(voiceText) {
    localStorage.setItem('contentText', content[sel_lang]);
    localStorage.setItem('recordedAudio', recordedAudio);

    localStorage.setItem('voiceText', filterBadWords(voiceText));
    // localStorage.setItem('voiceText', voiceText);
    localStorage.setItem('contentid', content_id);
    localStorage.setItem('contenttype', content['title']);
    localStorage.setItem('isfromresult', 'learn');
    document.getElementById('link_score').click();
  }
  function showStartLearn() {
    const myCurrectLanguage = process.env.REACT_APP_LANGUAGE;
    return (
      <VStack>
        <Box className="main_layout" gap="20">
          <br />
          <NewTopHomeNextBar nextlink={''} ishomeback={true} />
          {sel_cource === 'See & Speak' ? (
            <VStack>
              <img className="image_class" src={content?.image} />
              {sel_lang !== myCurrectLanguage && (
                <div className="content_text_div">
                  {content[myCurrectLanguage]}
                </div>
              )}
              <div className="content_text_div">{content[sel_lang]}</div>
            </VStack>
          ) : (
            <VStack>
              {sel_lang !== myCurrectLanguage && (
                <div className="content_text_div_see">
                  {content[myCurrectLanguage]}
                </div>
              )}
              <div className="content_text_div_see">{content[sel_lang]}</div>
            </VStack>
          )}

          <Box
            // position="fixed"
            // bottom="20px"
            // left="50%"
            // transform="translate(-50%, 0%)"

            display={'flex'}
            justifyContent={'center'}
            mt={'20'}
          >
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
                      />
                    ) : (
                      <img
                        className="play_btn"
                        src={pause}
                        style={{ height: '72px', width: '72px' }}
                        onClick={() => pauseAudio()}
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
                    alt="refresh"
                    className="home_icon"
                    style={{ height: '72px', width: '72px' }}
                    onClick={() => navigate(0)}
                  />
                  <h4 className="text-speak m-0">Try new</h4>
                </VStack>
              )}
            </VStack>
            {/* <NewBottomHomeNextBar nextlink={''} ishomeback={true} /> */}
          </Box>
        </Box>
      </VStack>
    );
  }
  return <React.Fragment>{showStartLearn()}</React.Fragment>;
}

export default StartLearn;
