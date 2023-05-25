import React from 'react';
import Layout from '../component/layout/Layout';
import { FaUser, FaUserGraduate } from 'react-icons/fa';
import Menus from '../component/Menus';

const menu = [
  {
    title: 'I am a Teacher',
    link: '/content',
    icon: <FaUserGraduate />,
  },
  { title: 'I am a Student', link: '/proto2/', icon: <FaUser /> },
];

export default function Home() {
  return (
    <Layout _header={{ title: 'Home' }} _body={{ title: 'Starting from page' }}>
      <Menus menus={menu} />
    </Layout>
  );
}
