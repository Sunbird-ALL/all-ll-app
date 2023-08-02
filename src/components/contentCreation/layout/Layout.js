import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Center,
  ChakraProvider,
  theme,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FaHome, FaUser, FaUserGraduate,FaFileAudio } from 'react-icons/fa';
import { useWindowSize } from '../../../utils/helper';
import AppBar from './AppBar';
import Footer from './Footer';
import Header from './Header';


export default function App({ isHideLayout, ...props }) {
  return !isHideLayout ? <Layout {...props} /> : props?.children;
}

function Layout({ _header, _body, children,hideNavigation, selectedLanguage, source}) {
  const { title, ...__body } = _body ? _body : {};
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
    <ChakraProvider theme={theme}>
      <Center>
        <Box w={width} h={height} shadow="md">
          <AppBar />
          <Header {..._header} />
          <Card m="4" mt="0" rounded={6} {...__body}>
            {title ? (
              <CardHeader bg="red.100" roundedTop={6} {...__body?._cardHeader}>
                {title}
              </CardHeader>
            ) : (
              <React.Fragment />
            )}
            <CardBody {...__body?._body}>{children}</CardBody>
          </Card>
          <Footer menues={hideNavigation === 'true' ? [] : menues} width={width} />
        </Box>
      </Center>
    </ChakraProvider>
  );
}
