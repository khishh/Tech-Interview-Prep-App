import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import MicOffIcon from '@mui/icons-material/MicOff';
import MicIcon from '@mui/icons-material/Mic';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import FaceIcon from '@mui/icons-material/Face';
import FaceRetouchingOffIcon from '@mui/icons-material/FaceRetouchingOff';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import React from 'react';
import { margin } from '@mui/system';

const RoomHeader = (props: RoomHeaderProps) => {
    return (
        <AppBar position='fixed'>
            <Toolbar>
                <Typography>
                    Tech Interview Online App
                </Typography>
                <div style={{position:"absolute", right: "0" }}>
                    <Button style={{ color: 'white' }} onClick={props.startScreenShare}>
                        <div>
                            <ScreenShareIcon style={iconImageStyle} />
                            <Typography style={iconTextStyle} variant='caption'>Share Screen</Typography>
                        </div>
                    </Button>
                    <Button style={{ color: 'white' }} onClick={props.isScreenRecording ? props.endRecordingScreen : props.startRecordingScreen}>
                        {props.isScreenRecording
                            ? <div>
                                <StopCircleIcon style={iconImageStyle} />
                                <Typography style={iconTextStyle} variant='caption'>Stop Recording</Typography>
                            </div>
                            : <div>
                                <PlayCircleFilledWhiteIcon style={iconImageStyle} />
                                <Typography style={iconTextStyle} variant='caption'>Start Recording</Typography>
                            </div>}
                    </Button>
                    <Button style={{ color: 'white' }} onClick={props.toggleUserAudio}>
                        {props.userAudioStatus
                            ? <div>
                                <MicOffIcon style={iconImageStyle} />
                                <Typography style={iconTextStyle} variant='caption'>Mute</Typography>
                            </div>
                            : <div>
                                <MicIcon style={iconImageStyle} />
                                <Typography style={iconTextStyle} variant='caption'>UnMute</Typography>
                            </div>}
                    </Button>
                    <Button style={{ color: 'white' }} onClick={props.toggleUserVideo}>
                        {props.userVideoStatus
                            ? <div>
                                <FaceRetouchingOffIcon style={iconImageStyle} />
                                <Typography style={iconTextStyle} variant='caption'>Camera Off</Typography>
                            </div>
                            : <div>
                                <FaceIcon style={iconImageStyle} />
                                <Typography style={iconTextStyle} variant='caption'>Camera On</Typography>
                            </div>}
                    </Button>
                    <Button style={{ color: 'white' }} onClick={props.leaveRoom}>
                        <div>
                            <ExitToAppIcon style={iconImageStyle} />
                            <Typography style={iconTextStyle} variant='caption'>Exit</Typography>
                        </div>
                    </Button>
                </div>
            </Toolbar>
        </AppBar>
    );
}

const iconImageStyle: React.CSSProperties = {
    display: "block",
    margin: "auto"
}

const iconTextStyle: React.CSSProperties = {
    fontSize: "10px"
};



type RoomHeaderProps = {
    startScreenShare: () => void
    userAudioStatus: boolean
    userVideoStatus: boolean
    toggleUserAudio: () => void
    toggleUserVideo: () => void
    leaveRoom: () => void
    isScreenRecording: boolean
    startRecordingScreen: () => void
    endRecordingScreen: () => void
}

export default RoomHeader;
