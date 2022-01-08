import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { VideoPlayer } from "../components/VideoPlayer";
import { socket } from "../Socket";
import { PeerVideoRefType, SocketContext } from "../SocketContext";
import Peer from 'simple-peer';
import { PeerVideoPlayer } from "../components/PeerVideoPlayer";
import { Grid, Typography } from "@mui/material";
import '../index.css';

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import RoomHeader from "../components/RoomHeader";
import Footer from "../components/Footer";
import { minHeight } from "@mui/system";
import SocialMediaShare from "../components/SocialMediaShare";

export const Room = () => {

    const { roomId } = useParams();

    const { userId, username: yourname } = useContext(SocketContext);

    const [calls, setCalls] = useState<Call[]>([]);
    const [code, setCode] = useState('');
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [isScreenRecording, setIsScreenRecording] = useState(false);
    const [userAudioStatus, setUserAudioStatus] = useState(true);
    const [userVideoStatus, setUserVideoStatus] = useState(true);
    const userVideoRef = useRef<HTMLVideoElement | null>(null);
    const peerVideoRef = useRef<PeerVideoRefType[]>([]);
    const userstream = useRef<MediaStream>();
    const userScreenRecordingStream = useRef<MediaStream>();
    const screenShareStream = useRef<MediaStream>();
    const mediaRecorderRef = useRef<MediaRecorder>();

    const audioContext = new AudioContext();

    console.log(`calls size: ${calls.length}`);
    console.log(calls);


    // only once afte mounted
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {

                /// check track
                console.log(stream.getVideoTracks().length);

                if (userVideoRef.current) {
                    userVideoRef.current.srcObject = stream;
                }
                userstream.current = stream;

                socket.emit('joinRoom', roomId!, yourname);
                socket.emit('fetchCode', roomId!);

                socket.on('newUserJoined', usersInTheRoom => {

                    console.log(`${yourname}: you received a list of users in the room trying to join`);
                    console.log(usersInTheRoom);


                    const existingPeers: Peer.Instance[] = [];
                    const existingCalls: Call[] = [];
                    usersInTheRoom.forEach(({ userId, username }) => {
                        if (userId !== socket.id) {
                            const existingPeer = createPeer(userId, socket.id, stream);

                            peerVideoRef.current.push({
                                userId: userId,
                                username: username,
                                peer: existingPeer
                            });

                            existingPeer.on('stream', stream => {
                                console.log('stream from ' + username);
                                console.log(stream.getAudioTracks());


                                setCalls((prevCalls) => [...prevCalls, {
                                    peername: username,
                                    peeruserId: userId,
                                    peer: existingPeer,
                                    stream
                                }]);
                            });

                            existingPeers.push(existingPeer);
                        }

                    });

                });

                socket.on('callingUser', (callerId, signalData, callerUsername) => {
                    console.log(`${yourname}: you are receiving a call from ${callerId}/${callerUsername}`);

                    const peer = addPeer(callerId, signalData, stream);

                    peerVideoRef.current.push({
                        userId: callerId,
                        username: callerUsername,
                        peer: peer
                    });

                    peer.on('stream', stream => {
                        console.log('stream from ' + callerUsername);
                        console.log(stream.getAudioTracks());
                        setCalls((prevCalls) => [...prevCalls, {
                            peeruserId: callerId,
                            peername: callerUsername,
                            peer: peer,
                            stream
                        }]);
                    });

                });

                socket.on('callAccepted', (signalData, acceptedUserId) => {
                    console.log(`${yourname}: your call to ${acceptedUserId} was accepted`);

                    const peerRefWithAcceptedUser = peerVideoRef.current.find((peer: { userId: string; }) => peer.userId === acceptedUserId);
                    if (peerRefWithAcceptedUser) {
                        peerRefWithAcceptedUser.peer.signal(signalData);
                    }
                });

                socket.on('distributeCode', (code) => {
                    setCode(code);
                });
            });

        window.addEventListener('popstate', (event) => {
            leaveRoom();
        });

        return () => {
            console.log('doing useEffect cleanUp...');
            window.removeEventListener('popstate', () => { });
        }
    }, []);

    // anytime after the number of user in the room changes
    useEffect(() => {
        console.log('useEffect: The number of calls changes to ' + calls.length);


        socket.on('userLeft', (leftUserId, leftUsername) => {
            console.log(`${leftUsername} has left the room`);
            console.log(calls);

            const peerRefOfLeftUser = peerVideoRef.current.find((peer: { userId: string; }) => peer.userId === leftUserId);
            if (peerRefOfLeftUser) {
                const remainingCalls = calls.filter((call) => call.peeruserId !== leftUserId);
                console.log(remainingCalls);

                peerRefOfLeftUser.peer.destroy();
                setCalls(remainingCalls);
                peerVideoRef.current = peerVideoRef.current.filter(peer => peer.userId !== leftUserId);

            }
        });

        return () => {
            console.log(`useEffect: socket.off userLeft event`);
            socket.off('userLeft');
        }
    }, [calls.length])

    useEffect(() => {
        console.log('useEffect: somebody is typing code');
    }, [code])

    const createPeer = (userIdToCall: string, callerId: string, stream: MediaStream) => {
        console.log('createPeer');

        const peer = new Peer({ initiator: true, trickle: false, stream });

        peer.on('signal', signal => {
            socket.emit('callUser', userIdToCall, callerId, signal);
        });

        return peer;
    }

    const addPeer = (callerId: string, incomingSignalData: Peer.SignalData, stream: MediaStream) => {
        console.log('addPeer');

        const peer = new Peer({ initiator: false, trickle: false, stream });

        peer.on('signal', signal => {
            socket.emit('acceptCall', callerId, signal);
        });

        peer.signal(incomingSignalData);

        return peer;
    }

    const startScreenShare = () => {
        setIsScreenSharing(true);
        navigator.mediaDevices.getDisplayMedia({ video: true })
            .then(stream => {
                console.log('user stream track ');
                console.log(userstream.current?.getVideoTracks()[0]);

                console.log('user stream');
                console.log(userstream.current);

                console.log('screen stream track ');
                console.log(stream.getVideoTracks()[0]);

                console.log('screen stream');
                console.log(stream);



                //TODO: if user turns off camera and want to share screen, don't need to replace track? but just add
                // let userVideoRef recieve stream from user screen
                if (userVideoRef.current) {
                    userVideoRef.current.srcObject = stream;
                }

                // tell peers connected with this user to replace stream
                calls.forEach(call => {
                    console.log(userstream.current!.getVideoTracks()[0]);

                    call.peer.replaceTrack(
                        // might need to check userstream current is not null for sure
                        userstream.current!.getVideoTracks()[0],
                        stream.getVideoTracks()[0],
                        userstream.current!
                    );
                });

                stream.getVideoTracks()[0].onended = () => {
                    endScreenShare();

                    if (userstream.current) {
                        userVideoRef.current!.srcObject = userstream.current;
                    }

                    calls.forEach(call => {
                        call.peer.replaceTrack(
                            stream.getVideoTracks()[0],
                            userstream.current!.getVideoTracks()[0],
                            userstream.current!
                        );
                    })
                }
            });
    };

    const startRecordingScreen = () => {
        if (navigator.mediaDevices && userstream.current) {

            let recordedChunks: Blob[] = [];

            navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                .then(stream => {

                    console.log(stream.getTracks());

                    const dest = audioContext.createMediaStreamDestination();

                    const peerAudioTracks = calls.reduce((prevVal, curVal) =>
                        [...prevVal, ...curVal.stream.getAudioTracks()]
                        , [] as MediaStreamTrack[]);

                    const allAudioTracks = [...userstream.current!.getAudioTracks(), ...peerAudioTracks];

                    allAudioTracks.forEach(track => {
                        const audioMediaStream = new MediaStream([track]);
                        const audioMediaStreamSource = audioContext.createMediaStreamSource(audioMediaStream);
                        audioMediaStreamSource.connect(dest);
                    });

                    stream.getAudioTracks().forEach(audioTrack => {
                        const audioMediaStream = new MediaStream([audioTrack]);
                        const audioMediaStreamSource = audioContext.createMediaStreamSource(audioMediaStream);
                        audioMediaStreamSource.connect(dest);
                    });

                    const finalScreenStream = dest.stream;

                    // add video track from display media
                    finalScreenStream.addTrack(stream.getVideoTracks()[0]);

                    console.log(finalScreenStream);

                    userScreenRecordingStream.current = finalScreenStream;

                    finalScreenStream.getVideoTracks()[0].onended = () => {
                        console.log('screen record track is abt to stop...');
                        endRecordingScreen();
                    }

                    mediaRecorderRef.current = new MediaRecorder(finalScreenStream);

                    mediaRecorderRef.current.ondataavailable = event => {
                        if (event.data.size > 0) {
                            recordedChunks.push(event.data);
                        }
                    }

                    mediaRecorderRef.current.onstop = event => {
                        console.log('mediaRecorder onStopped called');
                        mediaRecorderRef.current = undefined;

                        const blob = new Blob(recordedChunks, {
                            type: recordedChunks[0].type
                        });
                        recordedChunks = [];
                        const url = URL.createObjectURL(blob);

                        let recordName = prompt('Please enter the name of your recording. Otherwise, the name will be a current time.');

                        if (!recordName) {
                            recordName = new Date().toUTCString();
                        }

                        const link = document.createElement('a');
                        link.href = url;
                        link.download = recordName;
                        link.click();
                    }

                    console.log('mediaRecorder onStart called');
                    mediaRecorderRef.current.start();

                    setIsScreenRecording(true);
                });
        }
    }

    const endRecordingScreen = () => {
        console.log('endRecordingScreen called');
        console.log(mediaRecorderRef.current);

        if (userScreenRecordingStream.current) {
            userScreenRecordingStream.current.getTracks().forEach(track => {
                track.stop();
            });
        }

        if (mediaRecorderRef.current) {
            console.log('mediaRecorder onStart called');
            mediaRecorderRef.current.stop();
            setIsScreenRecording(false);
        }
    }

    const endScreenShare = () => {
        console.log('screen share has ended');
        setIsScreenSharing(false);
    }

    const toggleAudio = () => {
        setUserAudioStatus(prevMicStatus => {
            if (userstream.current) {
                userstream.current.getAudioTracks()[0].enabled = !prevMicStatus
            }
            return !prevMicStatus;
        });
    }

    const toggleVideo = () => {
        setUserVideoStatus(prevVideoStatus => {
            if (userstream.current) {
                userstream.current.getVideoTracks()[0].enabled = !prevVideoStatus;
            }
            return !prevVideoStatus;
        });
    }

    const leaveRoom = () => {
        if (userstream.current) {
            userstream.current.getTracks().forEach(track => {
                console.log(`${track.kind} is stopping...`);
                track.stop();
            });
        }

        socket.emit('leaveRoom', roomId!, userId);
        window.location.href = '/';
    }

    const requestFullScreen = (element: HTMLElement) => {
        element.requestFullscreen()
            .then(res => console.log('full screen mode'))
            .catch(err => console.log('failed to open in full screen mode: ' + err));
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <RoomHeader
                startScreenShare={startScreenShare}
                userAudioStatus={userAudioStatus}
                userVideoStatus={userVideoStatus}
                toggleUserAudio={toggleAudio}
                toggleUserVideo={toggleVideo}
                leaveRoom={leaveRoom}
                isScreenRecording={isScreenRecording}
                startRecordingScreen={startRecordingScreen}
                endRecordingScreen={endRecordingScreen}
            />
            <div style={{ flex: 1, width: '100vw', padding: "64px 0 0" }}>
                {/* <h1>{`You are currently in room : ${roomId}`}</h1> */}

                <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                    <Grid style={{ flex: 1 }} container>
                        <VideoPlayer username={yourname} videoRef={userVideoRef} requestFullScreenMode={requestFullScreen} />
                        {calls.map(call => <PeerVideoPlayer key={call.peeruserId} userId={call.peeruserId} peerUserName={call.peername} peer={call.peer} stream={call.stream} requestFullScreenMode={requestFullScreen} />)}
                    </Grid>
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <CodeMirror
                            value={code}
                            width='100%'
                            maxWidth="50vw"
                            minHeight="80vh"
                            maxHeight="80vh"
                            height="80vh"
                            // style={{
                            //     flexGrow: 5,
                            // }}
                            extensions={[javascript({ jsx: true })]}
                            onChange={(value, viewUpdate) => {
                                console.log('value:', value);
                                socket.emit('codeChanged', roomId!, value);
                            }}
                        />
                        <div style={{
                            flex: 1,
                            // flexGrow: 1,
                        }}>
                            <SocialMediaShare roomId={roomId ? roomId : ''}/>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

type Call = {
    peer: Peer.Instance,
    peername: string,
    peeruserId: string,
    stream: MediaStream
};