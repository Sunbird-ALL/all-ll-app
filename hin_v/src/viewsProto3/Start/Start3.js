import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

import new1word from '../../assests/Images/Learn/new1word.png';
import new2sentence from '../../assests/Images/Learn/new2sentence.png';
import new3paragraph from '../../assests/Images/Learn/new3paragraph.png';
import learn_next from '../../assests/Images/learn_next.png';

import { scroll_to_top } from '../../utils/Helper/JSHelper';

/*chakra*/
import { getParameter } from '../../utils/helper';
import axios from 'axios';

function Start3() {
  const [url, setUrl] = useState('');
  const [tabShow, setTabShow] = useState('');
  const [tabShowSentece, setTabShowSentence] = useState('');
  const [tabShowPara, setTabShowPara] = useState('');

  const location = useLocation();
  const [sel_lang, set_sel_lang] = useState('hi');
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

  const [sel_lang_text, set_sel_lang_text] = useState(
    localStorage.getItem('apphomelang')
      ? localStorage.getItem('apphomelang') === 'hi'
        ? 'हिंदी'
        : 'English'
      : 'English'
  );
  useEffect(() => {
    const metadata = window.name ? JSON.parse(window.name) : {};
    const url = getParameter('source', location.search);
    localStorage.setItem('URL', window.location.href);
    setUrl(url ? url : '');
  }, []);
  useEffect(() => {
    localStorage.setItem('apphomelang', sel_lang);
  }, [sel_lang]);

  const getfromurl = () => {
    const filePath = getParameter('source', location.search);

    if (filePath) {
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
          console.log(tabShowP);

          setTabShow(tabShowWord);
          setTabShowSentence(tabShowS);
          setTabShowPara(tabShowP);

          localStorage.setItem('apphomelevel', tabShowWord);
        })
        .catch(err => console.log(err));
    } else {
      localStorage.removeItem('contents');
    }
  };

  useEffect(() => {
    getfromurl();
  }, [sel_level]);

  useEffect(() => {
    localStorage.setItem('apphomecource', sel_cource);
  }, [sel_cource]);

  const [load_cnt, set_load_cnt] = useState(0);
  useEffect(() => {
    if (load_cnt == 0) {
      set_load_cnt(load_cnt => Number(load_cnt + 1));
      scroll_to_top('smooth');
    }
  }, [load_cnt]);

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
                          Try in English
                        </div>
                      </div>
                      <div className="col s6">
                        <div
                          className={
                            sel_lang === 'hi'
                              ? 'lang_select_div_active'
                              : 'lang_select_div_inactive'
                          }
                          onClick={() => {
                            let temp_dt = 'hi';
                            localStorage.setItem('apphomelang', temp_dt);
                            set_sel_lang(temp_dt);
                            //window.location.reload();
                          }}
                        >
                          Try in हिंदी
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
                      to={`/proto3/startlearn`}
                      onClick={() => {
                        set_sel_level('Word');
                        localStorage.setItem('apphomelevel', 'Word');
                      }}
                    >
                      <div className="learn_level_div">
                        <div className="col s2">
                          <div className="learn_level_div_start">
                            <img src={new1word} className="learn_level_img" />
                          </div>
                        </div>
                        <div className="col s8">
                          <div className="learn_level_div_middle">
                            <font className="learn_title">
                              {sel_lang === 'en' ? 'Word' : 'शब्द'}
                            </font>
                            <br />
                            <font className="learn_sub_title">
                              Learn to say single word
                            </font>
                          </div>
                        </div>
                        <div className="col s2">
                          <img src={learn_next} className="learn_next_img" />
                        </div>
                      </div>
                    </Link>
                  )}

                  <br />
                  {tabShowSentece === 'Sentence' && (
                    <Link
                      to={'/proto3/startlearn'}
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
                            />
                          </div>
                        </div>
                        <div className="col s8">
                          <div className="learn_level_div_middle">
                            <font className="learn_title">
                              {sel_lang === 'en' ? 'Sentence' : 'वाक्य'}
                            </font>
                            <br />
                            <font className="learn_sub_title">
                              Learn to say single sentence
                            </font>
                          </div>
                        </div>
                        <div className="col s2">
                          <img src={learn_next} className="learn_next_img" />
                        </div>
                      </div>
                    </Link>
                  )}

                  <br />
                  {tabShowPara === 'Paragraph' && (
                    <Link
                      to={'/proto3/startlearn'}
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
                            />
                          </div>
                        </div>
                        <div className="col s8">
                          <div className="learn_level_div_middle">
                            <font className="learn_title">
                              {sel_lang === 'en' ? 'Paragraph' : 'अनुच्छेद'}
                            </font>
                            <br />
                            <font className="learn_sub_title">
                              Learn to say single paragraph
                            </font>
                          </div>
                        </div>
                        <div className="col s2">
                          <img src={learn_next} className="learn_next_img" />
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
      </>
    );
  }
  return <React.Fragment>{showStart()}</React.Fragment>;
}
export default Start3;
