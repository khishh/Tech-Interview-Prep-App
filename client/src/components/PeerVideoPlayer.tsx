import { Grid, Paper, Typography, Button } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import Peer from 'simple-peer';
import '../index.css';

export const PeerVideoPlayer = (props: PeerVideoPlayerProps) => {

    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = props.stream;
        }

    }, [props.userId])

    return (
        <Grid item xs={12} md={6}>
            <Paper className='videocall'>
                <video playsInline autoPlay ref={videoRef} />
                <div className="overlay">
                    <div>{props.peerUserName}</div>
                    <Button variant="contained" onClick={() => props.requestFullScreenMode(videoRef.current!)}>View FullScreen</Button>
                </div>                
            </Paper>
        </Grid>
    )
}

type PeerVideoPlayerProps = {
    userId: string,
    peerUserName: string,
    peer: Peer.Instance,
    stream: MediaStream,
    requestFullScreenMode: (element: HTMLElement) => void
}