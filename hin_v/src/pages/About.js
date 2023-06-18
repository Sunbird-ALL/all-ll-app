import React from 'react';
import Layout from '../component/layout/Layout';

export default function About() {
  return (
    <Layout
      _header={{ title: 'About' }}
      _body={{ title: 'Starting from page' }}
    >
      <div>About</div>
    </Layout>
  );
}
