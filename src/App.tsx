import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Editor, Dashboard } from './pages';

export const App = () => {
  return (
    <Routes>
      <Route path="/editor/" element={<Dashboard />} />
      <Route path="/editor/:page" element={<Editor />} />
    </Routes>
  );
};
