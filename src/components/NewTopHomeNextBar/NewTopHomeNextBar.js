import React, { useState, useEffect } from 'react';

import { useParams, useNavigate, Link } from 'react-router-dom';
import home from '../../assests/Images/home.png';
import menu from '../../assests/Images/menu.png';
import next from '../../assests/Images/next.png';
import refresh from '../../assests/Images/refresh.svg';
import { getLayout } from '../../utils/helper';

const NewTopHomeNextBar = props => {
  const { trylink, nextlink, ishomeback, resultnextlang } = props;

  return (
    <div className="app_footbar_remove">
      <div className="row">
        {ishomeback ? (
          <>
            <div className="col s6 home_icon_div">
              <Link to={'/'}>
                <img src={home} className="home_icon_new"></img>
              </Link>
            </div>
            <div className="col s6 menu_icon_div">
              <Link to={'/start'}>
                <img src={menu} className="menu_icon_new"></img>
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="col s12 home_icon_div">
              <Link to={'/'}>
                <img src={home} className="home_icon_new"></img>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NewTopHomeNextBar;
