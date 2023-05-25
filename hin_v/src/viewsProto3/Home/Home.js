import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import AppNavbar from '../../components/AppNavbar/AppNavbar';
import TamilGirl from '../../assests/Images/TamilGirl.png';
import welcome_en from '../../assests/Audio/welcome_en.m4a';
import welcome_ta from '../../assests/Audio/welcome_ta.mpga';
import welcome_hi from '../../assests/Audio/welcome_hi.m4a';

import play from '../../assests/Images/play.png';
import home_button from '../../assests/Images/home_button.png';

/*chakra*/
import AppFooter from '../../components2/AppFooter/AppFooter';

function Home() {
  const [temp_audio, set_temp_audio] = useState(null);
  const [isplaying, set_isplaying] = useState(false);
  const playAudio = (audio, lang) => {
    set_isplaying(false);
    set_temp_audio(new Audio(audio));
    localStorage.setItem('apphomelang', lang);
  };
  useEffect(() => {
    if (temp_audio !== null && !isplaying) {
      set_isplaying(true);
      temp_audio.play();
      temp_audio.addEventListener('ended', () => {
        set_isplaying(false);
        document.getElementById('link_speak_proto2').click();
      });
    }
    return () => {
      if (temp_audio !== null) {
        set_isplaying(false);
        temp_audio.pause();
      }
    };
  }, [temp_audio]);

  function showHome() {
    return (
      <>
        <div className="">
          <div className="row">
            <div className="col s12 m3 l4"></div>
            <div className="col s12 m6 l4 main_layout">
              {/*<AppNavbar navtitle="Assisted Language Learning" />*/}
              <br />
              <center>
                <div className="home_name_div">
                  <font className="welcome_home">👋 வணக்கம்‌</font>
                  <br />
                  <font className="name_title">கயல்விழி</font>
                </div>
              </center>
              <br />
              <br />
              <img className="home_image_class" src={TamilGirl} />
              <br />
              <br />
              <br />
              <br />
              <div
                className="row"
                style={{ marginLeft: '5px', marginRight: '5px' }}
              >
                {/*<div
                  className="col s6"
                  onClick={() => {
                    playAudio(welcome_en, "en");
                  }}
                >
                  <center>
                    <div className="button_home" style={{ width: "150px" }}>
                      English - ஆங்கிலம்
                    </div>
                  </center>
                </div>*/}
                {/*<div
                  className="col s4"
                  onClick={() => {
                    playAudio(welcome_hi, "hi");
                  }}
                >
                  <div className="button_home">Hindi</div>
                </div>*/}
                <div
                  className="col s12"
                  onClick={() => {
                    playAudio(welcome_hi, 'hi');
                  }}
                >
                  <center>
                    {/*<div className="button_home" style={{ width: "150px" }}>
                      हिंदी
                    </div>*/}
                    <img src={home_button} className="play_button_home" />
                  </center>
                </div>
              </div>
            </div>
            <div className="cols s12 m3 l4"></div>
          </div>
        </div>
        <AppFooter />
      </>
    );
  }
  return <React.Fragment>{showHome()}</React.Fragment>;
}

export default Home;
