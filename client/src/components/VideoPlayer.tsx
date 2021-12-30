import { Grid, Paper, Theme, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useContext } from 'react';
import { SocketContext } from '../SocketContext';


export const VideoPlayer = (props: Props) => {    

    return (
        <Paper>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>{props.username || 'Name'}</Typography>
              <video playsInline muted autoPlay ref={props.videoRef}/>
            </Grid>
        </Paper>
    )
};

type Props = {
    username: string
    videoRef: any
}