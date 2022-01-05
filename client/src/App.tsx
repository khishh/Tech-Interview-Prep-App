import React, { Fragment } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { Room } from './pages/Room';
import { ScreenShareTest } from './components/ScreenShareTest';
import './index.css';

function App() {
  return (
    <div className="grid place-items-center" style={{ width: "100%"}}>
      {/* <h1 className="text-2xl p-3">Online Tech Interview Prep App</h1> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:roomId" element={<Home />} />
        <Route path="/room/:roomId" element={<Room />} />
        <Route path="/screenshare" element={<ScreenShareTest />} />
      </Routes>
    </div>

  );
}

export default App;
