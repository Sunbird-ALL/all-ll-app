import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import content_list from '../../utils/Const/Const';

import { scroll_to_top } from '../../utils/Helper/JSHelper';

/*chakra*/
import AppFooter from '../../components2/AppFooter/AppFooter';

function ContentList() {
  const [sel_lang, set_sel_lang] = useState(
    localStorage.getItem('apphomelang')
      ? localStorage.getItem('apphomelang')
      : 'en'
  );
  const [sel_cource, set_sel_cource] = useState(
    localStorage.getItem('apphomecource')
      ? localStorage.getItem('apphomecource')
      : 'Listen & Speak'
  );

  useEffect(() => {
    localStorage.setItem('apphomelang', sel_lang);
  }, [sel_lang]);
  useEffect(() => {
    localStorage.setItem('apphomecource', sel_cource);
  }, [sel_cource]);

  const [extractContent, setExtractContent] = useState([]);
  const [load_cnt, set_load_cnt] = useState(0);
  useEffect(() => {
    if (load_cnt == 0) {
      set_load_cnt(load_cnt => Number(load_cnt + 1));
      scroll_to_top('smooth');
      //extract title
      let tempContent = [];
      const content_count = Object.keys(content_list).length;
      const content_keys = Object.keys(content_list);
      content_keys.forEach(key => {
        tempContent.push({
          title: content_list[key].title,
          key: key,
        });
      });
      setExtractContent(tempContent);
    }
  }, [load_cnt]);

  function showContentList() {
    return (
      <>
        <div className="container">
          <br />
          <div className="row">
            <div className="col s12 m12 l2"></div>
            <div className="col s12 m12 l8 content_list">
              <div className="row">
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
                    <option value="ta">Tamil</option>
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
              <center>
                {extractContent.map((item, index) => {
                  return (
                    <Link to={'/proto2/contentstudy/' + item.key}>
                      <div
                        className="content_view cur_pointer"
                        key={'content_list_' + index}
                      >
                        {item.title}
                      </div>
                    </Link>
                  );
                })}
              </center>
            </div>
            <div className="cols s12 m4 l4"></div>
          </div>
        </div>
        <AppFooter />
      </>
    );
  }
  return <React.Fragment>{showContentList()}</React.Fragment>;
}

export default ContentList;
