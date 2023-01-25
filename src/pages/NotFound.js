import { Text } from '@chakra-ui/react';
import React from 'react';
import CenterCard from '../component/CenterCard';
import Layout from '../component/layout/Layout';

export default function NotFound() {
  return (
    <Layout _header={{ title: '404' }} _body={{ title: 'Page not found' }}>
      <CenterCard
        _box={{ minH: '100%', bg: 'transparent' }}
        _card={{ boxShadow: 'none' }}
      >
        <Text fontSize={30} textAlign="center">
          404
        </Text>
      </CenterCard>
    </Layout>
  );
}
