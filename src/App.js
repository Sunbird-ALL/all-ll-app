import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import ContentCreate from './pages/ContentCreate';
import Contents from './pages/Contents';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/content" element={<Contents />} />
        <Route path="/content/add" element={<ContentCreate />} />
        <Route path="/content/:id" element={<ContentCreate />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
