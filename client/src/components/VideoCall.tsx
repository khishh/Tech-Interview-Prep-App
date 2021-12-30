import { Grid } from '@mui/material';
import React from 'react';
import { VideoPlayer } from './VideoPlayer';

export const VideoCall = () => {
    return (
        <Grid container>
            <VideoPlayer username='user1' />
            <VideoPlayer username='user2' />
        </Grid>
    )
}