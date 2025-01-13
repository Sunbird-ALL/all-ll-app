import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import new1word from '../../../assests/Images/Learn/new1word.png';
import new2sentence from '../../../assests/Images/Learn/new2sentence.png';
import new3paragraph from '../../../assests/Images/Learn/new3paragraph.png';
import learn_next from '../../../assests/Images/learn_next.png';

import { scroll_to_top } from '../../../utils/Helper/JSHelper';
import lang_constants from '../../../lang/lang_constants.json';
/*chakra*/
import { getParameter } from '../../../utils/helper';
import AppFooter from '../../../components/AppFooter/AppFooter';
import axios from 'axios';

function Start3() {
  const [url, setUrl] = useState('');
  const [tabShow, setTabShow] = useState('');
  const [tabShowSentece, setTabShowSentence] = useState('');
  const [tabShowPara, setTabShowPara] = useState('');

  const location = useLocation();
  const myCurrectLanguage =
    getParameter('language', location.search) || process.env.REACT_APP_LANGUAGE;
  const [sel_lang, set_sel_lang] = useState(myCurrectLanguage);
  const [sel_level, set_sel_level] = useState(
    // localStorage.getItem('apphomelevel')
    //   ? localStorage.getItem('apphomelevel')
    //   : 'Word'
    'Word'
  );
  const [sel_cource, set_sel_cource] = useState(
    localStorage.getItem('apphomecource')
      ? localStorage.getItem('apphomecource')
      : 'Listen & Speak'
  );
  const [hide_navFooter, set_hide_navFooter] = useState('false');

  useEffect(() => {
    const metadata = window.name ? JSON.parse(window.name) : {};
    const url = getParameter('source', location.search);
    localStorage.setItem('URL', window.location.href);
    setUrl(url ? url : '');
  }, []);
  useEffect(() => {
    if (localStorage.getItem('apphomelang') === null) {
      localStorage.setItem('apphomelang', sel_lang);
    } else {
      set_sel_lang(localStorage.getItem('apphomelang'));
    }
  }, [sel_lang]);

  const getfromurl = () => {
    const filePath = getParameter('source', location.search);

    if (filePath && filePath != 'null') {
      axios
        .get(filePath)
        .then(res => {
          localStorage.setItem('contents', JSON.stringify(res.data));

          let data = JSON.parse(JSON.stringify(res.data));
          let val =
            data &&
            Object.values(data).map(item => {
              return item.type;
            });
          let tabShowWord = val && val.find(val => val === 'Word');
          let tabShowS = val && val.find(val => val === 'Sentence');
          let tabShowP = val && val.find(val => val === 'Paragraph');
          // console.log(tabShowP);

          setTabShow(tabShowWord);
          setTabShowSentence(tabShowS);
          setTabShowPara(tabShowP);

          localStorage.setItem('apphomelevel', tabShowWord);
        })
        .catch(err => console.log(err));
    } else {
      localStorage.removeItem('contents');
      axios
        .get(
          window.location.origin + '/db/' + myCurrectLanguage + '/proto3.json'
        )
        .then(res => {
          localStorage.setItem('contents', JSON.stringify(res.data));

          let data = JSON.parse(JSON.stringify(res.data));
          let val =
            data &&
            Object.values(data).map(item => {
              return item.type;
            });
          let tabShowWord = val && val.find(val => val === 'Word');
          let tabShowS = val && val.find(val => val === 'Sentence');
          let tabShowP = val && val.find(val => val === 'Paragraph');
          // console.log(tabShowP);

          setTabShow(tabShowWord);
          setTabShowSentence(tabShowS);
          setTabShowPara(tabShowP);

          localStorage.setItem('apphomelevel', tabShowWord);
        })
        .catch(err => console.log(err));
    }
  };

  useEffect(() => {
    if (localStorage.getItem('contents') === null) getfromurl();
    else {
      let data = JSON.parse(localStorage.getItem('contents'));
      let val =
        data &&
        Object.values(data).map(item => {
          return item.type;
        });
      let tabShowWord = val && val.find(val => val === 'Word');
      let tabShowS = val && val.find(val => val === 'Sentence');
      let tabShowP = val && val.find(val => val === 'Paragraph');
      setTabShow(tabShowWord);
      setTabShowSentence(tabShowS);
      setTabShowPara(tabShowP);

      localStorage.setItem('apphomelevel', tabShowWord);
    }
  }, [sel_level]);

  useEffect(() => {
    localStorage.setItem('apphomecource', sel_cource);
  }, [sel_cource]);

  const [load_cnt, set_load_cnt] = useState(0);
  useEffect(() => {
    const showNavigationFooter = getParameter(
      'hideNavigation',
      location.search
    );
    set_hide_navFooter(showNavigationFooter);

    if (load_cnt == 0) {
      set_load_cnt(load_cnt => Number(load_cnt + 1));
      scroll_to_top('smooth');
    }
  }, [load_cnt]);

  // This is for language selection

  function getLanguageConstants(languageCode) {
    return lang_constants[languageCode] || lang_constants['en'];
  }

  function showStart() {
    return (
      <>
        <div className="">
          <div className="row">
            <div className="col s12 m2 l3"></div>
            <div className="col s12 m8 l6 main_layout">
              <br />

              <div className="row">
                <div className="col s12">
                  <center>
                    <div className="lang_select_div">
                      <div className="col s6">
                        <div
                          className={
                            sel_lang === 'en'
                              ? 'lang_select_div_active'
                              : 'lang_select_div_inactive'
                          }
                          onClick={() => {
                            let temp_dt = 'en';
                            localStorage.setItem('apphomelang', temp_dt);
                            set_sel_lang(temp_dt);
                            //window.location.reload();
                          }}
                        >
                          {getLanguageConstants('en').HOME_TRY_IN}
                        </div>
                      </div>
                      <div className="col s6">
                        <div
                          className={
                            sel_lang === myCurrectLanguage
                              ? 'lang_select_div_active'
                              : 'lang_select_div_inactive'
                          }
                          onClick={() => {
                            let temp_dt = myCurrectLanguage;
                            localStorage.setItem('apphomelang', temp_dt);
                            set_sel_lang(temp_dt);
                            //window.location.reload();
                          }}
                        >
                          {getLanguageConstants(myCurrectLanguage).HOME_TRY_IN}
                        </div>
                      </div>
                    </div>
                  </center>
                </div>

                <div className="col s12">
                  <br />
                  <br />
                  {tabShow === 'Word' && (
                    <Link
                      to={`/exploreandlearn/startlearn`}
                      onClick={() => {
                        set_sel_level('Word');
                        localStorage.setItem('apphomelevel', 'Word');
                      }}
                    >
                      <div className="learn_level_div">
                        <div className="col s2">
                          <div className="learn_level_div_start">
                            <img
                              src={new1word}
                              className="learn_level_img"
                              alt="Word"
                            />
                          </div>
                        </div>
                        <div className="col s8">
                          <div className="learn_level_div_middle">
                            <font className="learn_title">
                              {sel_lang === 'en'
                                ? getLanguageConstants('en').COMMON_WORD
                                : getLanguageConstants(myCurrectLanguage)
                                    .COMMON_WORD}
                            </font>
                            <br />
                            <font className="learn_sub_title">
                              Learn to say single word
                            </font>
                          </div>
                        </div>
                        <div className="col s2">
                          <img
                            src={learn_next}
                            className="learn_next_img"
                            alt="Start Learning"
                          />
                        </div>
                      </div>
                    </Link>
                  )}

                  <br />
                  {tabShowSentece === 'Sentence' && (
                    <Link
                      to={'/exploreandlearn/startlearn'}
                      onClick={() => {
                        set_sel_level('Word');
                        localStorage.setItem('apphomelevel', 'Sentence');
                      }}
                    >
                      <div className="learn_level_div">
                        <div className="col s2">
                          <div className="learn_level_div_start">
                            <img
                              src={new2sentence}
                              className="learn_level_img"
                              alt="Sentence"
                            />
                          </div>
                        </div>
                        <div className="col s8">
                          <div className="learn_level_div_middle">
                            <font className="learn_title">
                              {sel_lang === 'en'
                                ? getLanguageConstants('en').COMMON_SENTENCE
                                : getLanguageConstants(myCurrectLanguage)
                                    .COMMON_SENTENCE}
                            </font>
                            <br />
                            <font className="learn_sub_title">
                              Learn to say single sentence
                            </font>
                          </div>
                        </div>
                        <div className="col s2">
                          <img
                            src={learn_next}
                            className="learn_next_img"
                            alt="Start Learning"
                          />
                        </div>
                      </div>
                    </Link>
                  )}

                  <br />
                  {tabShowPara === 'Paragraph' && (
                    <Link
                      to={'/exploreandlearn/startlearn'}
                      onClick={() => {
                        set_sel_level('Word');
                        localStorage.setItem('apphomelevel', 'Paragraph');
                      }}
                    >
                      <div className="learn_level_div">
                        <div className="col s2">
                          <div className="learn_level_div_start">
                            <img
                              src={new3paragraph}
                              className="learn_level_img"
                              alt="Paragraph"
                            />
                          </div>
                        </div>
                        <div className="col s8">
                          <div className="learn_level_div_middle">
                            <font className="learn_title">
                              {sel_lang === 'en'
                                ? getLanguageConstants('en').COMMON_PARAGRAPH
                                : getLanguageConstants(myCurrectLanguage)
                                    .COMMON_PARAGRAPH}
                            </font>
                            <br />
                            <font className="learn_sub_title">
                              Learn to say single paragraph
                            </font>
                          </div>
                        </div>
                        <div className="col s2">
                          <img
                            src={learn_next}
                            className="learn_next_img"
                            alt="Start Learning"
                          />
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
              <br />
              <div></div>
            </div>
            <div className="cols s12 m2 l3"></div>
          </div>
        </div>
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
  return <React.Fragment>{showStart()}</React.Fragment>;
}
export default Start3;
