import { Button, Grid, Paper, Typography } from '@mui/material';
import React from 'react';
import '../index.css';


export const VideoPlayer = (props: Props) => {

    return (
        // <Paper>
        <Grid item xs={12} md={6}>
            <Paper className='videocall'>
                {/* <Typography align="center" variant="h5" gutterBottom>{props.username || 'Name'}</Typography> */}
                <video playsInline autoPlay ref={props.videoRef} />
                <div className="overlay">
                    <div>{props.username}</div>
                    <Button variant="contained" onClick={() => props.requestFullScreenMode(props.videoRef.current!)}>View FullScreen</Button>
                </div>
                {/* temporary fullscreen */}
                {/* <button onClick={() => props.requestFullScreenMode(props.videoRef.current!)}>FullScreen</button> */}
            </Paper>

        </Grid>
    )
};

type Props = {
    username: string
    videoRef: React.MutableRefObject<HTMLVideoElement | null>
    requestFullScreenMode: (element: HTMLElement) => void
}