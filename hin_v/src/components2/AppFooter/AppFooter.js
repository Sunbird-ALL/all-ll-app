import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Center,
  ChakraProvider,
  theme,
} from '@chakra-ui/react';
import React from 'react';
import { FaHome, FaUser, FaUserGraduate } from 'react-icons/fa';
import { useWindowSize } from '../../utils/helper';

import Footer from '../../component/layout/Footer';

export default function AppFooter({ hideNavigation, removeData }) {
  const [width, height] = useWindowSize();

  const menues = [
    {
      title: 'Home',
      link: '/proto2/all',
      icon: <FaHome />,
    },
    {
      title: 'I am a Teacher',
      link: '/content',
      icon: <FaUserGraduate />,
    },
    {
      title: 'I am a Student',
      link: '/proto2/',
      icon: <FaUser style={{ color: 'red' }} />,
    },
  ];
  const menues2 = [
    {
      title: 'I am a Student',
      link: `/proto3/all`,
      icon: <FaUser style={{ color: 'red' }} />,
    },
  ];

  return (
    <div className="">
      <div className="row">
        <div className="cols s12">
          <Footer menues={hideNavigation ? menues2 : menues} width={'100%'} />
        </div>
      </div>
    </div>
  );
}
