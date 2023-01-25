import {
  Box,
  Card,
  CardBody,
  CardHeader,
  ChakraProvider,
  theme,
} from '@chakra-ui/react';
import React from 'react';
import { FaHome, FaMicrophone, FaPhone, FaPlus, FaUser } from 'react-icons/fa';
import AppBar from './AppBar';
import Footer from './Footer';
import Header from './Header';

export default function App({ isHideLayout, ...props }) {
  return !isHideLayout ? <Layout {...props} /> : props?.children;
}
function Layout({ _header, _body, children }) {
  const { title, ...__body } = _body ? _body : {};
  const menues = [
    {
      title: 'Home',
      icon: <FaHome />,
      route: '/',
    },
    {
      title: 'About',
      icon: <FaUser />,
      route: '/about',
    },
    {
      title: 'Contact',
      icon: <FaPhone />,
      route: '/contact',
    },
  ];
  return (
    <ChakraProvider theme={theme}>
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
        <CardBody>{children}</CardBody>
      </Card>
      <Box>
        <Footer menues={menues} />
      </Box>
    </ChakraProvider>
  );
}
