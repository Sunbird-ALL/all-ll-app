import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
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
import { compareArrays, getParameter, replaceAll } from '../../../utils/helper';
import AppFooter from '../../../components/AppFooter/AppFooter';
import SubmitIcon from '../../../assests/Images/submit.svg';
import axios from 'axios';
import Speak_button from '../../../assests/Images/mic.png';
import Speak_button_on from '../../../assests/Images/mic_play.svg';
import Speaking from '../../../assests/Images/SentencePage.jpg';
import nextButton from '../../../assests/Images/next.png';

function StartLearn() {
  const location = useLocation();
  const myCurrectLanguage = getParameter('language', location.search);
  const navigate = useNavigate();
  const [isAudioPlay, setIsAudioPlay] = useState(true);
  const [temp_audio, set_temp_audio] = useState(null);
  const [flag, setFlag] = useState(true);
  const playAudio = () => {
    interactCall('DT');
    set_temp_audio(new Audio(content[sel_lang].audio));
  };
  // console.log(isAudioPlay);

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
      interactCall('DT');
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
    handleChangeWord();
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
  // console.log(newTempContent);
  const [base64Data, setBase64Data] = useState('');
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
    setBase64Data(
      newTempContent[getitem].content[localStorage.getItem('apphomelang')].audio
    );
  };

  useEffect(() => {
    const showNavigationFooter = getParameter(
      'hideNavigation',
      location.search
    );
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
        console.log(tempContent);
        set_content_id(getitem);
        localStorage.setItem(
          'contentText',
          tempContent[getitem].content[localStorage.getItem('apphomelang')].text
        );
        setBase64Data(
          tempContent[getitem].content[localStorage.getItem('apphomelang')]
            .audio
        );
      }
      scroll_to_top('smooth');
      setNewTempContent(tempContent);
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

  const [lang_code, set_lang_code] = useState(
    localStorage.getItem('apphomelang')
      ? localStorage.getItem('apphomelang')
      : 'en'
  );

  const DEFAULT_ASR_LANGUAGE_CODE = 'ai4bharat/whisper-medium-en--gpu--t4';
  const HINDI_ASR_LANGUAGE_CODE = 'ai4bharat/conformer-hi-gpu--t4';
  const KANNADA_ASR_LANGUAGE_CODE =
    'ai4bharat/conformer-multilingual-dravidian-gpu--t4';
  const TAMIL_ASR_LANGUAGE_CODE =
    'ai4bharat/conformer-multilingual-dravidian-gpu--t4';

  //for tamil language
  const [tamilRecordedText, setTamilRecordedText] = useState('');

  const [ai4bharat, setAi4bharat] = useState('');

  const [recordedAudioBase64, setRecordedAudioBase64] = useState('');

  const [asr_language_code, set_asr_language_code] = useState(
    DEFAULT_ASR_LANGUAGE_CODE
  );

  useEffect(() => {
    switch (lang_code) {
      case 'kn':
        set_asr_language_code(KANNADA_ASR_LANGUAGE_CODE);
        break;
      case 'ta':
        set_asr_language_code(TAMIL_ASR_LANGUAGE_CODE);
        break;
      case 'hi':
        set_asr_language_code(HINDI_ASR_LANGUAGE_CODE);
        break;
      default:
        set_asr_language_code(DEFAULT_ASR_LANGUAGE_CODE);
        break;
    }
  }, []);

  useEffect(() => {
    if (recordedAudio !== '') {
      // showLoading();
      let uri = recordedAudio;
      var request = new XMLHttpRequest();
      request.open('GET', uri, true);
      request.responseType = 'blob';
      request.onload = function () {
        var reader = new FileReader();
        reader.readAsDataURL(request.response);
        reader.onload = function (e) {
          var base64Data = e.target.result.split(',')[1];

          setRecordedAudioBase64(base64Data);
        };
      };
      request.send();
    } else {
      // stopLoading();
      setRecordedAudioBase64('');
      setAi4bharat('');
    }
  }, [recordedAudio]);
  // localStorage.getItem('allAppContentSessionId')
  function saveIndb(output) {
    const utcDate = new Date().toISOString().split('T')[0];
    axios.post(`https://telemetry-dev.theall.ai/learner/scores`, {
      taskType: 'asr',
      output: output,
      config: null,
      user_id: 55473503971256,
      session_id: '55473503971256' + Date.now(),
      date: utcDate,
      original_text: localStorage.getItem('contentText'),
      response_text: '',
    });
  }

  // API
  const getASROutput = async (asrInput, blob) => {
    const asr_api_key = process.env.REACT_APP_ASR_API_KEY;
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', asr_api_key);

    var payload = JSON.stringify({
      config: {
        serviceId: 'ai4bharat/conformer-ta-gpu--t4',
        language: {
          sourceLanguage: 'ta',
        },
        transcriptionFormat: {
          value: 'transcript',
        },
        bestTokenCount: 2,
        audioFormat: 'wav',
        samplingRate: 16000,
      },
      audio: [
        {
          audioContent: asrInput,
        },
      ],
    });

    const abortController = new AbortController();

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: payload,
      redirect: 'follow',
      signal: abortController.signal,
    };

    const ASR_REST_URL =
      'https://api.dhruva.ai4bharat.org/services/inference/asr';
    const responseStartTime = new Date().getTime();

    fetch(ASR_REST_URL, requestOptions)
      .then(response => response.text())
      .then(async result => {
        clearTimeout(waitAlert);
        const responseEndTime = new Date().getTime();
        const responseDuration = Math.round(
          (responseEndTime - responseStartTime) / 1000
        );

        var apiResponse = JSON.parse(result);
        saveIndb(apiResponse.output);

        if (apiResponse['output'][0]['source'] == '') {
          alert("Sorry I couldn't hear a voice. Could you please speak again?");
        }

        setTamilRecordedText(apiResponse['output'][0]['source']);

        // Data Manipulation on result capturing for telemetry log
        let texttemp = apiResponse['output'][0]['source'].toLowerCase();
        const studentTextArray = texttemp.split(' ');

        let tempteacherText = localStorage.getItem('contentText').toLowerCase();
        tempteacherText = replaceAll(tempteacherText, '.', '');
        tempteacherText = replaceAll(tempteacherText, "'", '');
        tempteacherText = replaceAll(tempteacherText, ',', '');
        tempteacherText = replaceAll(tempteacherText, '!', '');
        tempteacherText = replaceAll(tempteacherText, '|', '');
        tempteacherText = replaceAll(tempteacherText, '?', '');
        const teacherTextArray = tempteacherText.split(' ');

        let student_correct_words_result = [];
        let student_incorrect_words_result = [];
        let originalwords = teacherTextArray.length;
        let studentswords = studentTextArray.length;
        let wrong_words = 0;
        let correct_words = 0;
        let result_per_words = 0;
        let result_per_words1 = 0;
        let occuracy_percentage = 0;

        let word_result_array = compareArrays(
          teacherTextArray,
          studentTextArray
        );

        for (let i = 0; i < studentTextArray.length; i++) {
          if (teacherTextArray.includes(studentTextArray[i])) {
            correct_words++;
            student_correct_words_result.push(studentTextArray[i]);
          } else {
            wrong_words++;
            student_incorrect_words_result.push(studentTextArray[i]);
          }
        }
        //calculation method
        if (originalwords >= studentswords) {
          result_per_words = Math.round(
            Number((correct_words / originalwords) * 100)
          );
        } else {
          result_per_words = Math.round(
            Number((correct_words / studentswords) * 100)
          );
        }
        let word_result = result_per_words == 100 ? 'correct' : 'incorrect';

        if (process.env.REACT_APP_CAPTURE_AUDIO === 'true') {
          let getContentId =
            parseInt(localStorage.getItem('content_random_id')) + 1;
          var audioFileName = `${process.env.REACT_APP_CHANNEL}/${
            localStorage.getItem('contentSessionId') === null
              ? localStorage.getItem('allAppContentSessionId')
              : localStorage.getItem('contentSessionId')
          }-${Date.now()}-${getContentId}.wav`;
        }
      })
      .catch(error => {
        clearTimeout(waitAlert);
        // stopLoading();
        if (error.name !== 'AbortError') {
          alert(
            'Unable to process your request at the moment.Please try again later.'
          );
          console.log('error', error);
        }
      });
    const waitAlert = setTimeout(() => {
      abortController.abort();
      alert(
        'Server response is slow at this time. Please explore other lessons'
      );
    }, 10000);
  };
  const [counter, setCounter] = useState(1);
  const handleSubmit = () => {
    playAudio();
    // setCounter(old => old + 1);
    // if (counter === 5) {
    //   setCounter(1);
    //   navigate('/exploreandlearn/score');
    // }
    // var base64 = base64Data.split(',')[1];
    // getASROutput(base64, localStorage.getItem('apphomelang'));
  };

  const showPracticeResult=(base64)=>{
    navigate('/exploreandlearn/score');
  }

  const [currentLine, setCurrentLine] = useState(0);

  const nextLine = count => {
    if (currentLine < newTempContent.length - 1) {
      setCurrentLine(currentLine + 1);
    }
  };
  const prevLine = count => {
    if (currentLine > 0) {
      setCurrentLine(currentLine - 1);
    }
  };
  function showStartLearn() {
    const myCurrectLanguage = getParameter('language', location.search);
    console.log(content);
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
                
                {localStorage.getItem('apphomelevel') === 'Paragraph' ? (
                  <img src={Speaking} />
                ) : (
                  ''
                )}

                {sel_cource === 'See & Speak' ? (
                  <>
                    <br />
                    <img className="image_class" src={content?.image} />
                    <div className="content_text_div">
                      {content[sel_lang]?.text ? content[sel_lang]?.text : ''}
                    </div>
                    {sel_lang !== myCurrectLanguage ? (
                      <div className="content_text_div">
                        {content[myCurrectLanguage]?.text
                          ? content[myCurrectLanguage]?.text
                          : ''}
                      </div>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <>
                    <br />
                    <div className="content_text_div_see">
                      {localStorage.getItem('apphomelevel') === 'Paragraph' ? (
                        <>
                          {/* {newTempContent.map(item => {
                            // console.log();
                            return <div>{item.content.ta.text}</div>;
                          })} */}
                          {newTempContent[currentLine].content.ta.text}
                        </>
                      ) : content[sel_lang]?.text ? (
                        content[sel_lang]?.text
                      ) : (
                        ''
                      )}
                    </div>
                    {sel_lang !== myCurrectLanguage ? (
                      <div
                        className="content_text_div_see_ta"
                        style={{ fontSize: '21px' }}
                      >
                        {content[myCurrectLanguage]?.text
                          ? content[myCurrectLanguage]?.text
                          : ''}
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
                            src={
                              localStorage.getItem('apphomelevel') !==
                              'Paragraph'
                                ? play
                                : Speak_button
                            }
                            style={{ height: '72px', width: '72px' }}
                            onClick={() => handleSubmit()}
                            alt="play_audio"
                          />
                        ) : (
                          <img
                            className="play_btn"
                            src={
                              localStorage.getItem('apphomelevel') !==
                              'Paragraph'
                                ? pause
                                : Speak_button_on
                            }
                            style={{ height: '72px', width: '72px' }}
                            onClick={() => pauseAudio()}
                            alt="pause_audio"
                          />
                        )}
                        <h4
                          className="text-play m-0 "
                          style={{ position: 'relative' }}
                        >
                          {localStorage.getItem('apphomelevel') !== 'Paragraph'
                            ? 'Listen'
                            : 'Speak'}
                        </h4>
                      </VStack>
                    )}
                    {localStorage.getItem('apphomelevel') !== 'Paragraph' ? (
                      <VStack>
                        <VoiceCompair
                          practice={true}
                          setVoiceText={setVoiceText}
                          showPracticeResult={showPracticeResult}
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
                    ) : (
                      ''
                    )}
                  </HStack>

                  {isAudioPlay !== 'recording' && (
                    <>
                      {localStorage.getItem('apphomelevel') !== 'Paragraph' ? (
                        <VStack>
                          <img
                            src={refresh}
                            className="home_icon"
                            style={{ height: '72px', width: '72px' }}
                            alt="try_new_btn"
                            onClick={newSentence}
                          />
                          <h4 className="text-speak m-0">
                            {localStorage.getItem('apphomelevel') ===
                            'Paragraph'
                              ? 'Next'
                              : 'Try New'}
                          </h4>
                        </VStack>
                      ) : (
                        ''
                      )}
                      {localStorage.getItem('apphomelevel') === 'Paragraph' &&
                      currentLine !== 5 ? (
                        <div style={{ display: 'flex', gap:'40px' }}  >
                          <VStack>
                            <img
                              src={nextButton}
                              className="home_icon"
                              style={{
                                height: '72px',
                                width: '72px',
                                transform: 'scaleX(-1)',
                              }}
                              onClick={() => prevLine()}
                              alt="try_new_btn"
                            />
                            <h4 className="text-speak m-0">Previous</h4>
                          </VStack>
                          <VStack>
                            <img
                              src={nextButton}
                              className="home_icon"
                              style={{ height: '72px', width: '72px' }}
                              alt="try_new_btn"
                              onClick={() => nextLine()}
                            />
                            <h4 className="text-speak m-0">Next</h4>
                          </VStack>
                        </div>
                      ) : (
                        ''
                      )}
                    </>
                  )}
                </VStack>

                {localStorage.getItem('apphomelevel') === 'Paragraph' &&
                currentLine === 5 ? (
                  <Link
                    to={'/exploreandlearn/score'}
                    style={{ textDecoration: 'none' }}
                  >
                    <VStack>
                      <img
                        src={SubmitIcon}
                        className="home_icon"
                        style={{ height: '72px', width: '72px' }}
                        alt="try_new_btn"
                      />
                      <h4 className="text-speak m-0">Submit</h4>
                    </VStack>
                  </Link>
                ) : (
                  ''
                )}
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
