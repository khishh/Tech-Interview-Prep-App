import { Grid, Paper, Typography } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import Peer from 'simple-peer';
import { VideoPlayer } from './VideoPlayer';

export const PeerVideoPlayer = (props: PeerVideoPlayerProps) => {

    console.log('creating peer video player');

    const videoRef = useRef<HTMLVideoElement>(document.createElement('video'));

    useEffect(() => {
        props.peer.on('stream', (stream) => {
            videoRef.current.srcObject = stream;
        });
        return () => {
            
        }
    }, [])

    return (
        <Paper>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>{props.peerUserName || 'Name'}</Typography>
              <video playsInline muted autoPlay ref={videoRef}/>
            </Grid>
        </Paper>
    )
}

type PeerVideoPlayerProps = {
    peerUserName: string,
    peer: Peer.Instance
}