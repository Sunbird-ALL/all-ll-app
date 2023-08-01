import React, { useState,useEffect } from 'react';
import { FaHome, FaUser, FaUserGraduate,FaFileAudio } from 'react-icons/fa';
import { useWindowSize } from '../../utils/helper';

import Footer from '../../components/contentCreation/layout/Footer';

export default function AppFooter({ hideNavigation, selectedLanguage,source }) {
  const [width, height] = useWindowSize();

  const menues = [
    {
      title: 'I am a Student',
      link: `/exploreandlearn?hideNavigation=${hideNavigation}&language=${selectedLanguage}&source=${source}`,
      icon: <FaUser/>,
    },
    {
      title: 'I am a Teacher',
      link: `/content?hideNavigation=${hideNavigation}&language=${selectedLanguage}&source=${source}`,
      icon: <FaUserGraduate />,
    },
    {
      title: 'Play and Learn',
      link: `/playandlearn?hideNavigation=${hideNavigation}&language=${selectedLanguage}&source=${source}`,
      icon: <FaFileAudio />,
    }
  ];

  return (
    <div className="">
      <div className="row">
        <div className="cols s12">
          <Footer menues={hideNavigation === 'true' ? [] : menues} width={'100%'} />
        </div>
      </div>
    </div>
  );
}
