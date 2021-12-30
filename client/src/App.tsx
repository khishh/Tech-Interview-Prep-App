import { Grid, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { socket } from './Socket';
import { VideoCall } from './components/VideoCall';
import { Route, Routes } from 'react-router-dom';
import { Home } from './views/Home';
import { Room } from './views/Room';


function App() {
  socket.on('me', (id) => console.log(id));
  return (
    <>
      <h1>Online Tech Interview Prep App</h1>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </>

  );
}

export default App;
