import { Box, Card, CardBody, HStack, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import CenterCard from '../component/CenterCard';
import Layout from '../component/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaMicrophone, FaPlus } from 'react-icons/fa';
import Menus from '../component/Menus';

const menu = [
  {
    title: 'About',
    link: '/about',
    icon: <FaPlus />,
  },
  { title: 'Contact us', link: '/contact-us', icon: <FaMicrophone /> },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <Layout _header={{ title: 'Home' }} _body={{ title: 'Starting from page' }}>
      <Menus menus={menu} />
    </Layout>
  );
}
