import { Button } from '@mui/material';
import React, { useRef, useState } from 'react';
import RoomHeader from './RoomHeader';

export const ScreenShareTest = () => {

    const screenShareRef = useRef<HTMLVideoElement | null>(null);
    const [isScreenSharing, setisScreenSharing] = useState(false);

    const startScreenShare = () => {
        setisScreenSharing(true);
        navigator.mediaDevices.getDisplayMedia({ video: true, audio: true})
        .then(stream => {
            console.log(stream);
            if (screenShareRef.current) {
                screenShareRef.current.srcObject = stream;
            }
            
            stream.getVideoTracks()[0].onended = () => {
                endScreenShare();
            }
        });
    };

    const endScreenShare= () => {
        console.log('screen share has ended');
        setisScreenSharing(false);
    }

    const toggleAudio = () => {
        console.log('toggle audio');
    }

    const toggleVideo = () => {
        console.log('toggle video');
    }

    const leaveRoom = () => {
        console.log('leave room'); 
    }

    return (
        <div>
            <RoomHeader startScreenShare={startScreenShare} userAudioStatus={true} userVideoStatus={true} toggleUserAudio={toggleAudio} toggleUserVideo={toggleVideo} leaveRoom={leaveRoom}/>
            {   
                isScreenSharing && 
                <video playsInline autoPlay ref={screenShareRef} />
            }
            {
                !isScreenSharing &&
                <div>
                    <h1>Screen share waiting...</h1>
                    <Button onClick={startScreenShare}>Screen Share</Button>
                </div>
            }
            
        </div>
    )
}
