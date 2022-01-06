import { Grid, Paper, Typography, Button } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import Peer from 'simple-peer';
import '../index.css';

export const PeerVideoPlayer = (props: PeerVideoPlayerProps) => {


    console.log('PeerVideoPlayer rerendered ...' + props.userId);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        console.log('useEffect: PeerVideoPlayer userId has changed!');

        if (videoRef.current) {
            videoRef.current.srcObject = props.stream;
        }

    }, [props.userId])

    return (
        <Grid item xs={12} md={6}>
            <Paper >
                <Typography style={{ padding: '10' }} variant="h5" gutterBottom>{props.peerUserName || 'Name'}</Typography>
                <video playsInline autoPlay ref={videoRef} />
                {/* temporary fullscreen */}
                <button onClick={() => props.requestFullScreenMode(videoRef.current!)}>FullScreen</button>
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