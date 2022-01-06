import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import React from 'react';

const RoomHeader = (props: RoomHeaderProps) => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar>
                <Toolbar>
                    <Typography>
                        Tech Interview Online App
                    </Typography>
                    <Button style={{ color: 'white' }} onClick={props.startScreenShare}>Screen Share</Button>
                    <Button style={{ color: 'white' }} onClick={props.toggleUserAudio}>
                        { props.userAudioStatus ? "Mute" : "UnMute"}
                    </Button>
                    <Button style={{ color: 'white' }} onClick={props.toggleUserVideo}>
                        { props.userVideoStatus ? "Turn Off Camera" : "Turn On Camara"}
                    </Button>
                    <Button style={{ color: 'white' }} onClick={props.leaveRoom}>Leave Room</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

type RoomHeaderProps = {
    startScreenShare: () => void
    userAudioStatus: boolean
    userVideoStatus: boolean
    toggleUserAudio: () => void
    toggleUserVideo: () => void
    leaveRoom: () => void
}

export default RoomHeader;
