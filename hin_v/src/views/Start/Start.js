import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";

import AppNavbar from "../../components/AppNavbar/AppNavbar";
import NewTopHomeNextBar from "../../components/NewTopHomeNextBar/NewTopHomeNextBar";
import NewBottomHomeNextBar from "../../components/NewBottomHomeNextBar/NewBottomHomeNextBar";
//import HomeNextBar from "../../components/HomeNextBar/HomeNextBar";

//icons
import p1Word from "../../assests/Images/Learn/p1Word.jpg";
import p2Sentence from "../../assests/Images/Learn/p2Sentence.jpg";
import p3Para from "../../assests/Images/Learn/p3Para.jpg";
import p1Word_ta from "../../assests/Images/Learn/p1Word_ta.jpg";
import p2Sentence_ta from "../../assests/Images/Learn/p2Sentence_ta.jpg";
import p3Para_ta from "../../assests/Images/Learn/p3Para_ta.jpg";

import p1SeanSpeak from "../../assests/Images/Learn/p1SeanSpeak.jpg";
import p2Listen from "../../assests/Images/Learn/p2Listen.jpg";
import p3Read from "../../assests/Images/Learn/p3Read.jpg";

import new1word from "../../assests/Images/Learn/new1word.png";
import new2sentence from "../../assests/Images/Learn/new2sentence.png";
import new3paragraph from "../../assests/Images/Learn/new3paragraph.png";
import learn_next from "../../assests/Images/learn_next.png";

import { scroll_to_top } from "../../utils/Helper/JSHelper";

function Start() {
  const [sel_lang, set_sel_lang] = useState(
    localStorage.getItem("apphomelang")
      ? localStorage.getItem("apphomelang")
      : "hi"
  );
  const [sel_level, set_sel_level] = useState(
    localStorage.getItem("apphomelevel")
      ? localStorage.getItem("apphomelevel")
      : "Word"
  );
  const [sel_cource, set_sel_cource] = useState(
    localStorage.getItem("apphomecource")
      ? localStorage.getItem("apphomecource")
      : "Listen & Speak"
  );

  const [sel_lang_text, set_sel_lang_text] = useState(
    localStorage.getItem("apphomelang")
      ? localStorage.getItem("apphomelang") === "hi"
        ? "हिंदी"
        : "English"
      : "English"
  );

  useEffect(() => {
    localStorage.setItem("apphomelang", sel_lang);
  }, [sel_lang]);
  useEffect(() => {
    localStorage.setItem("apphomelevel", sel_level);
  }, [sel_level]);
  useEffect(() => {
    localStorage.setItem("apphomecource", sel_cource);
  }, [sel_cource]);

  const [load_cnt, set_load_cnt] = useState(0);
  useEffect(() => {
    if (load_cnt == 0) {
      set_load_cnt((load_cnt) => Number(load_cnt + 1));
      scroll_to_top("smooth");
    }
  }, [load_cnt]);

  function showStart() {
    return (
      <>
        <div className="">
          <div className="row">
            <div className="col s12 m2 l3"></div>
            <div className="col s12 m8 l6 main_layout">
              {/*<AppNavbar navtitle="What would you like to do now?" />*/}
              <br />
              <NewTopHomeNextBar
                nextlink={"startlearn"}
                resultnextlang={sel_lang}
              />
              {/*<font className="lang_font_inactive">{sel_lang_text}</font>{" "}
              <font
                onClick={() => {
                  let temp_dt = sel_lang === "hi" ? "en" : "hi";
                  localStorage.setItem("apphomelang", temp_dt);
                  window.location.reload();
                }}
                className="lang_font_select"
              >
                Try in {sel_lang_text === "हिंदी" ? "English" : "हिंदी"}?
              </font>
              <br />*/}
              <div className="row">
                <div className="col s12">
                  <center>
                    <div className="lang_select_div">
                      <div className="col s6">
                        <div
                          className={
                            sel_lang === "en"
                              ? "lang_select_div_active"
                              : "lang_select_div_inactive"
                          }
                          onClick={() => {
                            let temp_dt = "en";
                            localStorage.setItem("apphomelang", temp_dt);
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
                            sel_lang === "hi"
                              ? "lang_select_div_active"
                              : "lang_select_div_inactive"
                          }
                          onClick={() => {
                            let temp_dt = "hi";
                            localStorage.setItem("apphomelang", temp_dt);
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
                {/*<div className="col s12">
                  <br />
                  <div className="col s6">
                    <div
                      className={
                        sel_lang === "en"
                          ? "button_learn_active"
                          : "button_learn"
                      }
                      onClick={() => set_sel_lang("en")}
                    >
                      English - ஆங்கிலம்
                    </div>
                  </div>
                  <div className="col s6">
                    <div
                      className={
                        sel_lang === "hi"
                          ? "button_learn_active"
                          : "button_learn"
                      }
                      onClick={() => set_sel_lang("hi")}
                    >
                      हिंदी
                    </div>
                  </div>
                </div>*/}
                <div className="col s12">
                  <br />
                  <br />
                  <div className="learn_level_div">
                    <Link
                      to={"/startlearn"}
                      onClick={() => {
                        set_sel_level("Word");
                        localStorage.setItem("apphomelevel", "Word");
                      }}
                    >
                      <div class="col s2">
                        <div className="learn_level_div_start">
                          <img src={new1word} className="learn_level_img" />
                        </div>
                      </div>
                      <div class="col s8">
                        <div className="learn_level_div_middle">
                          <font className="learn_title">
                            {sel_lang === "en" ? "Word" : "शब्द"}
                          </font>
                          <br />
                          <font className="learn_sub_title">
                            Learn to say single word
                          </font>
                        </div>
                      </div>
                      <div class="col s2">
                        <img src={learn_next} className="learn_next_img" />
                      </div>
                    </Link>
                  </div>
                  <br />
                  <div className="learn_level_div">
                    <Link
                      to={"/startlearn"}
                      onClick={() => {
                        set_sel_level("Word");
                        localStorage.setItem("apphomelevel", "Sentence");
                      }}
                    >
                      <div class="col s2">
                        <div className="learn_level_div_start">
                          <img src={new2sentence} className="learn_level_img" />
                        </div>
                      </div>
                      <div class="col s8">
                        <div className="learn_level_div_middle">
                          <font className="learn_title">
                            {sel_lang === "en" ? "Sentence" : "वाक्य"}
                          </font>
                          <br />
                          <font className="learn_sub_title">
                            Learn to say single sentence
                          </font>
                        </div>
                      </div>
                      <div class="col s2">
                        <img src={learn_next} className="learn_next_img" />
                      </div>
                    </Link>
                  </div>
                  <br />
                  <div className="learn_level_div">
                    <Link
                      to={"/startlearn"}
                      onClick={() => {
                        set_sel_level("Word");
                        localStorage.setItem("apphomelevel", "Paragraph");
                      }}
                    >
                      <div class="col s2">
                        <div className="learn_level_div_start">
                          <img
                            src={new3paragraph}
                            className="learn_level_img"
                          />
                        </div>
                      </div>
                      <div class="col s8">
                        <div className="learn_level_div_middle">
                          <font className="learn_title">
                            {sel_lang === "en" ? "Paragraph" : "अनुच्छेद"}
                          </font>
                          <br />
                          <font className="learn_sub_title">
                            Learn to say single paragraph
                          </font>
                        </div>
                      </div>
                      <div class="col s2">
                        <img src={learn_next} className="learn_next_img" />
                      </div>
                    </Link>
                  </div>
                  {/*<br />
                  <div className="col s4">
                    <img
                      className={
                        sel_level === "Word"
                          ? "icon_image_active"
                          : "icon_image"
                      }
                      onClick={() => set_sel_level("Word")}
                      src={sel_lang == "en" ? p1Word : p1Word_ta}
                    />
                  </div>
                  <div className="col s4">
                    <img
                      className={
                        sel_level === "Sentence"
                          ? "icon_image_active"
                          : "icon_image"
                      }
                      onClick={() => set_sel_level("Sentence")}
                      src={sel_lang == "en" ? p2Sentence : p2Sentence_ta}
                    />
                  </div>
                  <div className="col s4">
                    <img
                      className={
                        sel_level === "Paragraph"
                          ? "icon_image_active"
                          : "icon_image"
                      }
                      onClick={() => set_sel_level("Paragraph")}
                      src={sel_lang == "en" ? p3Para : p3Para_ta}
                    />
                    </div>*/}
                </div>
                {/*<div className="col s12">
                  <br />
                  <div className="col s4">
                    <img
                      className={
                        sel_cource === "See & Speak"
                          ? "icon_image_active icon_cource"
                          : "icon_image icon_cource"
                      }
                      onClick={() => set_sel_cource("See & Speak")}
                      src={p1SeanSpeak}
                    />
                  </div>
                  <div className="col s6">
                    <img
                      className={
                        sel_cource === "Listen & Speak"
                          ? "icon_image_active icon_cource"
                          : "icon_image icon_cource"
                      }
                      onClick={() => set_sel_cource("Listen & Speak")}
                      src={p2Listen}
                    />
                  </div>
                  <div className="col s6">
                    <img
                      className={
                        sel_cource === "Read & Speak"
                          ? "icon_image_active icon_cource"
                          : "icon_image icon_cource"
                      }
                      onClick={() => set_sel_cource("Read & Speak")}
                      src={p3Read}
                    />
                  </div>
                </div>*/}
                {/*<div className="col s12">
                  <Select
                    label="Select Language"
                    multiple={false}
                    options={{
                      classes: "",
                      dropdownOptions: {
                        alignment: "left",
                        autoTrigger: true,
                        closeOnClick: true,
                        constrainWidth: true,
                        coverTrigger: true,
                        hover: false,
                        inDuration: 150,
                        onCloseEnd: null,
                        onCloseStart: null,
                        onOpenEnd: null,
                        onOpenStart: null,
                        outDuration: 250,
                      },
                    }}
                    value={sel_lang}
                    onChange={(e) => set_sel_lang(e.target.value)}
                    s={12}
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="hi">Tamil</option>
                  </Select>
                </div>
                <div className="col s12">
                  <Select
                    label="Select Level"
                    multiple={false}
                    options={{
                      classes: "",
                      dropdownOptions: {
                        alignment: "left",
                        autoTrigger: true,
                        closeOnClick: true,
                        constrainWidth: true,
                        coverTrigger: true,
                        hover: false,
                        inDuration: 150,
                        onCloseEnd: null,
                        onCloseStart: null,
                        onOpenEnd: null,
                        onOpenStart: null,
                        outDuration: 250,
                      },
                    }}
                    value={sel_level}
                    onChange={(e) => set_sel_level(e.target.value)}
                    s={12}
                  >
                    <option value="Word">Word</option>
                    <option value="Sentence">Sentence</option>
                    <option value="Paragraph">Paragraph</option>
                  </Select>
                </div>
                <div className="col s12">
                  <Select
                    label="Select Course"
                    multiple={false}
                    options={{
                      classes: "",
                      dropdownOptions: {
                        alignment: "left",
                        autoTrigger: true,
                        closeOnClick: true,
                        constrainWidth: true,
                        coverTrigger: true,
                        hover: false,
                        inDuration: 150,
                        onCloseEnd: null,
                        onCloseStart: null,
                        onOpenEnd: null,
                        onOpenStart: null,
                        outDuration: 250,
                      },
                    }}
                    value={sel_cource}
                    onChange={(e) => set_sel_cource(e.target.value)}
                    s={12}
                  >
                    <option value="See & Speak">See & Speak</option>
                    <option value="Listen & Speak">Listen & Speak</option>
                    <option value="Read & Speak">Read & Speak</option>
                  </Select>
                  </div>*/}
              </div>
              <br />
              <div>
                {/*<NewBottomHomeNextBar
                  nextlink={"startlearn"}
                  resultnextlang={sel_lang}
                />*/}
              </div>
            </div>
            <div className="cols s12 m2 l3"></div>
          </div>
        </div>
      </>
    );
  }
  return <React.Fragment>{showStart()}</React.Fragment>;
}

export default Start;
