import { Grid, Paper, Typography } from '@mui/material';
import React from 'react';
import '../index.css';


export const VideoPlayer = (props: Props) => {

    return (
        // <Paper>
        <Grid item xs={12} md={6}>
            <Paper>
                <Typography align="center" variant="h5" gutterBottom>{props.username || 'Name'}</Typography>
                <video playsInline muted autoPlay ref={props.videoRef} />
            </Paper>

        </Grid>
        // </Paper>
    )
};

type Props = {
    username: string
    videoRef: any
}