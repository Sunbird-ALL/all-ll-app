import React, { useState, useEffect } from "react";

import { useParams, useNavigate, Link } from "react-router-dom";
import home from "../../assests/Images/home.png";
import menu from "../../assests/Images/menu.png";
import next_nav from "../../assests/Images/next_nav.png";
import refresh from "../../assests/Images/refresh.svg";

const NewBottomHomeNextBar = (props) => {
  const { trylink, nextlink, ishomeback, resultnextlang } = props;
  return (
    <div className="app_footbar_remove">
      <div className="row" style={{ padding: "5px" }}>
        {nextlink != "" ? (
          <>
            <div className="col s6 center">
              <Link to={ishomeback ? "/start" : "/"} className="hide">
                <img src={ishomeback ? menu : home} className="home_icon"></img>
              </Link>
            </div>
            <div className="col s6 center">
              <Link
                to={"/" + (trylink ? trylink : nextlink)}
                onClick={() =>
                  localStorage.setItem("apphomelang", resultnextlang)
                }
              >
                <img
                  src={trylink ? refresh : next_nav}
                  className={trylink ? "home_icon" : "next_nav"}
                ></img>
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="col s12 center hide">
              <Link to={ishomeback ? "/start" : "/"}>
                <img src={ishomeback ? menu : home} className="home_icon"></img>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NewBottomHomeNextBar;
