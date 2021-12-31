import React, { Fragment } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Home } from './views/Home';
import { Room } from './views/Room';
import './index.css';

function App() {
  return (
    <div className="grid place-items-center">
      <h1 className="text-2xl p-3">Online Tech Interview Prep App</h1>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </div>

  );
}

export default App;
