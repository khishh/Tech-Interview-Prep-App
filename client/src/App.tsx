import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { Room } from './pages/Room';
import './index.css';

function App() {
  return (
    <div className="grid place-items-center" style={{ width: "100%"}}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:roomId" element={<Home />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </div>

  );
}

export default App;
