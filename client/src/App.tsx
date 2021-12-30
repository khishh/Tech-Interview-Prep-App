import { Grid, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { socket } from './SocketContext';
import { VideoCall } from './components/VideoCall';
import { Route, Routes } from 'react-router-dom';
import { Home } from './views/Home';


function App() {
  socket.on('me', (id) => console.log(id));
  return (
    <>
      <h1>Online Tech Interview Prep App</h1>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>

  );
}

export default App;
