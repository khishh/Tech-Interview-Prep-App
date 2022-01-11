import { Button, Grid, Paper, Typography } from '@mui/material';
import React from 'react';
import '../index.css';


export const VideoPlayer = (props: Props) => {

    return (
        <Grid item xs={12} md={6}>
            <Paper className='videocall'>
                <video playsInline muted autoPlay ref={props.videoRef} />
                <div className="overlay">
                    <div>{props.username}</div>
                    <Button variant="contained" onClick={() => props.requestFullScreenMode(props.videoRef.current!)}>View FullScreen</Button>
                </div>
            </Paper>

        </Grid>
    )
};

type Props = {
    username: string
    videoRef: React.MutableRefObject<HTMLVideoElement | null>
    requestFullScreenMode: (element: HTMLElement) => void
}