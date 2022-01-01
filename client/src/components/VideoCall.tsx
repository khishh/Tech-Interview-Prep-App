import { Grid } from '@mui/material';
import React, { useContext } from 'react';
import { SocketContext } from '../SocketContext';
import { VideoPlayer } from './VideoPlayer';
import '../index.css';

// export const VideoCall = () => {

//     // tentative 
//     const { username, userVideoRef } = useContext(SocketContext);
//     return (
//         <Grid container>
//             <VideoPlayer username={username} videoRef={userVideoRef}/>
//             <VideoPlayer username='user2' videoRef={userVideoRef}/>
//         </Grid>
//     )
// }