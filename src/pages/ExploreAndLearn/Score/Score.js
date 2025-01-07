import React, { useState, useEffect, createRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Thumbs_up from '../../../assests/Images/Thumbs_up.svg';
import Thumbs_Down from '../../../assests/Images/Thumbs_Down.svg';
import Thumbs_up_dis from '../../../assests/Images/thumb_up_disable.svg';
import Thumbs_down_dis from '../../../assests/Images/thumb_down_dis.svg';
import content_list from '../../../utils/Const/ContentJSON';
import home from '../../../assests/Images/home.png';
import menu from '../../../assests/Images/menu.png';
import 'react-h5-audio-player/lib/styles.css';
import refresh from '../../../assests/Images/refresh.png';
import Animation from '../../../components/Animation/Animation';
import { scroll_to_top } from '../../../utils/Helper/JSHelper';
import play from '../../../assests/Images/play-img.png';
import pause from '../../../assests/Images/pause-img.png';
import { replaceAll } from '../../../utils/helper';
import NewTopHomeNextBar from '../../../components/NewTopHomeNextBar/NewTopHomeNextBar';
import { feedback } from '../../../services/telementryService';
import { isProfanityWord } from '../../../utils/helper';

function Score() {
  const navigate = useNavigate();
  const [isStart, set_isStart] = useState(false);
  const [numberOfPieces, set_numberOfPieces] = useState(0);
  const [flag, setFlag] = useState(true);
  const [content, set_content] = useState({});
  const [content_id, set_content_id] = useState(
    localStorage.getItem('contentid') ? localStorage.getItem('contentid') : 0
  );
  const [contenttype, set_contenttype] = useState(
    localStorage.getItem('contenttype')
      ? localStorage.getItem('contenttype')
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
  const [resultnextlang, set_resultnextlang] = useState(
    localStorage.getItem('resultnextlang')
      ? localStorage.getItem('resultnextlang')
      : 'en'
  );

  const [apphomelevel, set_apphomelevel] = useState(
    localStorage.getItem('apphomelevel')
      ? localStorage.getItem('apphomelevel')
      : 'Word'
  );

  const [temp_audio, set_temp_audio] = useState(null);
  const playAudio = () => {
    set_temp_audio(new Audio(recordedAudio));
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
      //temp_audio.addEventListener("ended", () => alert("end"));
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
  const [load_cnt, set_load_cnt] = useState(0);

  const [sel_lang, set_sel_lang] = useState(
    localStorage.getItem('apphomelang')
      ? localStorage.getItem('apphomelang')
      : 'en'
  );

  useEffect(() => {
    if (load_cnt == 0) {
      set_content(content_list[content_id]);
      set_load_cnt(load_cnt => Number(load_cnt + 1));
      scroll_to_top('smooth');
    }
  }, [load_cnt]);

  useEffect(()=>{
    if(isProfanityWord()){
      alert('inappropriate word detected')
    }
  },[])

  const [recordedAudio, setRecordedAudio] = useState(
    localStorage.getItem('recordedAudio')
  );
  const [testResult, setTestResult] = useState('');
  const [teacherText, setTeacherText] = useState(
    localStorage.getItem('contentText')
  );
  const [voiceText, setVoiceText] = useState(localStorage.getItem('voiceText'));
  const [voiceTextTeacher, setVoiceTextTeacher] = useState('');
  const [voiceTextHighlight, setVoiceTextHighLight] = useState('');
  const [ocurracy_percentage, setOcurracy_percentage] = useState('');
  const [newtextresult, setnewtextresult] = useState('');
  const [fluencyresult, setfluencyresult] = useState('');
  const [percentages, setpercentages] = useState(0);
  const [isFeedbackDone, setIsFeedbackDone] = useState(false);

  useEffect(() => {
    if (voiceText && voiceText !== '') {
      checkVoice(voiceText);
    }
  }, [voiceText]);

  function handleScore() {
    let voiceTextNoSymbol = replaceAll(voiceText, '?', '');
    voiceTextNoSymbol = replaceAll(voiceTextNoSymbol, "'", '');
    voiceTextNoSymbol = replaceAll(voiceTextNoSymbol, '.', '');
    voiceTextNoSymbol = replaceAll(voiceTextNoSymbol, '’', '');
    voiceTextNoSymbol = replaceAll(voiceTextNoSymbol, '|', '');
    voiceTextNoSymbol = replaceAll(voiceTextNoSymbol, ',', '');
    voiceTextNoSymbol = replaceAll(voiceTextNoSymbol, '!', '');
    let tempVoiceText = voiceTextNoSymbol.toLowerCase().split(' ');

    let teacherTextNoSymbol = replaceAll(teacherText, '?', '');
    teacherTextNoSymbol = replaceAll(teacherTextNoSymbol, "'", '');
    teacherTextNoSymbol = replaceAll(teacherTextNoSymbol, '.', '');
    teacherTextNoSymbol = replaceAll(teacherTextNoSymbol, '’', '');
    teacherTextNoSymbol = replaceAll(teacherTextNoSymbol, '|', '');
    teacherTextNoSymbol = replaceAll(teacherTextNoSymbol, ',', '');
    teacherTextNoSymbol = replaceAll(teacherTextNoSymbol, '!', '');
    let tempVoiceTeacher = teacherTextNoSymbol.toLowerCase().split(' ');

    let rightWords = 0;
    let myLength = 0;
    if (tempVoiceTeacher.length > tempVoiceText.length) {
      myLength = tempVoiceTeacher.length;
    } else {
      myLength = tempVoiceText.length;
    }
    for (let i = 0; i < myLength; i++) {
      if (tempVoiceText[i] === tempVoiceTeacher[i]) {
        rightWords++;
      }
    }
    let myPercentages = Math.round((rightWords / myLength) * 100);
    return myPercentages;
  }

  function checkVoice(voiceText) {
    let tempvoiceText = voiceText?.toLowerCase();
    tempvoiceText = replaceAll(tempvoiceText, '.', '');
    tempvoiceText = replaceAll(tempvoiceText, "'", '');
    tempvoiceText = replaceAll(tempvoiceText, '’', '');
    tempvoiceText = replaceAll(tempvoiceText, ',', '');
    tempvoiceText = replaceAll(tempvoiceText, '!', '');
    tempvoiceText = replaceAll(tempvoiceText, '|', '');
    tempvoiceText = replaceAll(tempvoiceText, '?', '');

    let tempteacherText = teacherText?.toLowerCase();
    tempteacherText = replaceAll(tempteacherText, '.', '');
    tempteacherText = replaceAll(tempteacherText, "'", '');
    tempteacherText = replaceAll(tempteacherText, '’', '');
    tempteacherText = replaceAll(tempteacherText, ',', '');
    tempteacherText = replaceAll(tempteacherText, '!', '');
    tempteacherText = replaceAll(tempteacherText, '|', '');
    tempteacherText = replaceAll(tempteacherText, '?', '');
    setVoiceTextTeacher(tempteacherText);
    //alert(tempteacherText + "\n" + tempvoiceText);
    if (tempteacherText === tempvoiceText) {
      setTestResult(
        <font style={{ fontSize: '20px', color: 'green' }}>
          Teacher and Student audio match
        </font>
      );
      setnewtextresult(
        <font className="result_correct">Yay ! You got it right !</font>
      );
    } else {
      setTestResult(
        <font style={{ fontSize: '20px', color: 'red' }}>
          Teacher and Student audio does not match
        </font>
      );
      setnewtextresult(
        <font className="result_incorrect">Oops.. but you tried well!</font>
      );
    }
    //set text highlight
    let texttemp = tempvoiceText;
    const studentTextArray = texttemp.split(' ');
    const teacherTextArray = tempteacherText.split(' ');
    let student_text_result = [];
    let originalwords = teacherTextArray.length;
    let studentswords = studentTextArray.length;
    let wrong_words = 0;
    let correct_words = 0;
    let result_per_words = 0;

    for (let i = 0; i < studentTextArray?.length; i++) {
      if (teacherTextArray[i] === studentTextArray[i]) {
        correct_words++;
        student_text_result.push(
          <>
            {' '}
            <font className="correct_text_remove">{studentTextArray[i]}</font>
          </>
        );
      } else if (teacherTextArray.includes(studentTextArray[i])) {
        student_text_result.push(
          <>
            {' '}
            <font className="correct_seq_wrong">{studentTextArray[i]}</font>
          </>
        );
      } else {
        wrong_words++;
        student_text_result.push(
          <>
            {' '}
            <font className="inc_text">{studentTextArray[i]}</font>
          </>
        );
      }
    }
    setOcurracy_percentage(
      <>
        {' '}
        <font className="res_txt">{result_per_words}/100</font>
      </>
    );
    setVoiceTextHighLight(student_text_result);

    //calculation method
    if (originalwords >= studentswords) {
      result_per_words = Math.round(
        Number((correct_words / originalwords) * 100)
      );
      setpercentages(result_per_words);
    } else {
      result_per_words = Math.round(
        Number((correct_words / studentswords) * 100)
      );
      setpercentages(result_per_words);
    }
    set_numberOfPieces(result_per_words);
    set_isStart(true);

    //fluencytestresult
    if (result_per_words < 45) {
      setfluencyresult(
        <font className="result_incorrect">
          Needs to work on language skills
        </font>
      );
    } else if (result_per_words >= 45 && result_per_words <= 75) {
      setfluencyresult(
        <font className="result_incorrect">
          Good scope to improve language skills
        </font>
      );
    } else {
      setfluencyresult(
        <font className="result_incorrect">
          You have good level of language skills
        </font>
      );
    }

    setTestResult(
      <>
        <div className="res_txt">
          <>{handleScore()}/100</>
        </div>
        <br />
      </>
    );
  }

  const send = score => {
    const currentScore = (score / 100).toPrecision(2);
    if (window && window.parent) {
      window.parent.postMessage({
        score: currentScore,
        message: 'all-app-score',
      }, "*");
    }
  };

  useEffect(() => {
    if(handleScore() > 0){
      send(handleScore());
    }
  }, []);

  // function showScore() {
  // const [isAudioPlay , setIsAudioPlay] = React.useState(true);
  return (
    <Animation size={15} isStart={isStart} numberOfPieces={numberOfPieces}>
      <div className="">
        <div className="row">
          <div className="col s12 m2 l3"></div>
          <div className="col s12 m8 l6 main_layout">
            {/*<AppNavbar navtitle="Result" />*/}
            <br />
            <div style={{ display: 'flex' }}>
              <NewTopHomeNextBar
                nextlink={''}
                ishomeback={false}
                isHideNavigation={true}
              />
            </div>
            <div>
              <center>
                {testResult}
                {/* <br />
                  <br /> */}
                {newtextresult}
                <br />
                <br />
                {fluencyresult}
                <br />
                <br />
                <div className="content_text_div_see">
                  {handleScore() === 100 ? teacherText : voiceTextHighlight}
                </div>
                <br />
                {flag ? (
                  <div style={{ marginBottom: '-30px' }}>
                    <img
                      style={{
                        width: '72px',
                        height: '72px',
                        cursor: 'pointer',
                      }}
                      src={play}
                      onClick={() => playAudio()}
                    />
                    <p
                      style={{
                        position: 'relative',
                        marginTop: '-1px',
                        marginBottom: '-15px',
                        color: '#5286E4',
                        fontWeight: 600,
                      }}
                    >
                      Play
                    </p>
                  </div>
                ) : (
                  <>
                    <img
                      style={{
                        width: '72px',
                        height: '72px',
                        cursor: 'pointer',
                      }}
                      src={pause}
                      onClick={() => pauseAudio()}
                    />
                    <p
                      style={{
                        position: 'relative',
                        marginTop: '-1px',
                        marginBottom: '-15px',
                        color: '#5286E4',
                        fontWeight: 600,
                      }}
                    >
                      Pause
                    </p>
                  </>
                )}

                {/*<ReactAudioPlayer
                    autoPlay={false}
                    src={recordedAudio}
                    controls
                    style={{ width: "100%" }}
                  />*/}
                <br />
                <br />
                <br />
                {/*<font className="speech_title">Your Speech and Audio</font>
                  <div className="content_view">
                    <>
                      <font>
                        <br />
                        <b>{voiceTextHighlight}</b>
                        <br />
                        <br />
                        <ReactAudioPlayer
                          autoPlay={false}
                          src={recordedAudio}
                          controls
                          style={{ width: "100%" }}
                        />
                      </font>
                      <br />
                    </>
                  </div>
                  <font className="speech_title">
                    Original Speech and Audio
                  </font>
                  <div className="content_view">
                    <>
                      <font>
                        <br />
                        <b>{content[sel_lang]}</b>
                        <br />
                        <br />
                        <ReactAudioPlayer
                          autoPlay={false}
                          src={content[sel_lang + "_audio"]}
                          controls
                          style={{ width: "100%" }}
                        />
                      </font>
                      <br />
                    </>
                  </div>*/}
              </center>
            </div>
            {/*<HomeNextBar trylink={"startlearn"} ishomeback={true} />*/}

            <div className="app_footbar_remove">
              <div className="row" style={{ padding: '5px' }}>
                {resultnext === 'as' || apphomelevel === 'Paragraph' ? (
                  <>
                    <div onClick={() => navigate(-1)}>
                      <img src={refresh} className="home_icon"></img>
                      <p
                        style={{
                          position: 'relative',
                          marginTop: '-1px',
                          marginBottom: '-15px',
                          color: '#E7815E',
                          fontWeight: 600,
                        }}
                      >
                        Try New
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '54px',
                        marginTop: '-10px',
                      }}
                      className="col s12 center"
                    >
                      <div>
                        <div
                          onClick={() => {
                            localStorage.setItem('trysame', 'yes');
                            navigate(-1);
                          }}
                        >
                          <img src={refresh} className="home_icon"></img>
                          <br />
                          <p
                            style={{
                              position: 'relative',
                              marginTop: '-1px',
                              marginBottom: '-15px',
                              color: '#E7815E',
                              fontWeight: 600,
                            }}
                          >
                            Try Again
                          </p>
                        </div>
                        {/* {isAudioPlay === 'recording'? <h4 className="text-speak m-0">Stop</h4>:<h4 className="text-speak m-0">Speak</h4>} */}
                      </div>
                      <div onClick={() => navigate(-1)}>
                        <img src={refresh} className="home_icon"></img>
                        <p
                          style={{
                            position: 'relative',
                            marginTop: '-1px',
                            marginBottom: '-15px',
                            color: '#E7815E',
                            fontWeight: 600,
                          }}
                        >
                          Try New
                        </p>
                      </div>
                    </div>
                    <div className="col s4 center hide">
                      <Link to={isfromresult === 'learn' ? '/start' : '/'}>
                        <img
                          src={isfromresult === 'learn' ? menu : home}
                          className="home_icon"
                        ></img>
                      </Link>
                    </div>
                    {/* <div className="col s12" style={{ textAlign: 'right' }}>
                        <Link
                          to={
                            isfromresult === 'learn'
                              ? '/startlearn'
                              : '/' + resultnext
                          }
                          onClick={() => {
                            //localStorage.setItem("apphomelang", resultnextlang);
                            const next_apphomelevel =
                              apphomelevel === 'Word'
                                ? 'Sentence'
                                : apphomelevel === 'Sentence'
                                ? 'Paragraph'
                                : 'Word';
                            localStorage.setItem(
                              'apphomelevel',
                              next_apphomelevel
                            );
                          }}
                        >
                          <img src={next_nav} className={'next_nav'}></img>
                        </Link>
                      </div> */}
                  </>
                )}
              </div>
            </div>
            <div
              style={{
                marginTop: '30px',
                padding: '5px',
                cursor: 'pointer',
              }}
            >
              {isFeedbackDone === true ? (
                <>
                  {/* <img
                    style={{ marginRight: '40px' }}
                    src={Thumbs_up}
                    alt="thumbs-up-dis"
                  />
                  <img src={Thumbs_Down} alt="thumbs-down-dis" /> */}
                </>
              ) : (
                <>
                  <img
                    style={{ marginRight: '40px' }}
                    onClick={() => {
                      feedback(1, teacherText, 'ET');
                      setIsFeedbackDone(true);
                    }}
                    src={Thumbs_up}
                    alt="thumbs-up"
                  />
                  <img
                    onClick={() => {
                      feedback(-1, teacherText, 'ET');
                      setIsFeedbackDone(true);
                    }}
                    src={Thumbs_Down}
                    alt="thumbs-down"
                  />
                </>
              )}
            </div>
          </div>
          <div className="cols s12 m2 l3"></div>
        </div>
      </div>
    </Animation>
  );
}
// return <React.Fragment>{showScore()}</React.Fragment>;
// }

export default Score;
