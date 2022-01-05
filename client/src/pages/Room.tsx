import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { VideoPlayer } from "../components/VideoPlayer";
import { socket } from "../Socket";
import { PeerVideoRefType, SocketContext } from "../SocketContext";
import Peer from 'simple-peer';
import { PeerVideoPlayer } from "../components/PeerVideoPlayer";
import { Grid } from "@mui/material";
import '../index.css';

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import RoomHeader from "../components/RoomHeader";

export const Room = () => {

    const { roomId } = useParams();

    // const { userVideoRef, peerVideoRef, userstream, userId, username: yourname, peers, setPeers, createPeer, addPeer, code, setCode, onUserLeft } = useContext(SocketContext);
    const { userId, username: yourname } = useContext(SocketContext);

    // const [peers, setPeers] = useState<Peer.Instance[]>([]);
    const [calls, setCalls] = useState<Call[]>([]);
    const [code, setCode] = useState('');
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const userVideoRef = useRef<HTMLVideoElement>();
    const peerVideoRef = useRef<PeerVideoRefType[]>([]);
    const userstream = useRef<MediaStream>();
    const screenShareStream = useRef<MediaStream>();


    // console.log(`peers size: ${peers.length}`);
    console.log(`calls size: ${calls.length}`);

    // console.log(peers);
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
                                // existingCalls.push({ 
                                //     peername: username, 
                                //     peeruserId: userId,
                                //     peer: existingPeer,
                                //     stream
                                // });
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
                    // setPeers((prevPeers) => [...prevPeers, ...existingPeers]);
                    // setCalls((prevCalls) => [...prevCalls, ...existingCalls]);
                });

                socket.on('callingUser', (callerId, signalData, callerUsername) => {
                    console.log(`${yourname}: you are receiving a call from ${callerId}/${callerUsername}`);

                    const peer = addPeer(callerId, signalData, stream);

                    peerVideoRef.current.push({
                        userId: callerId,
                        username: callerUsername,
                        peer: peer
                    });

                    // setPeers((prevPeers) => [...prevPeers, peer]);

                    peer.on('stream', stream => {
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

        // socket.on('userLeft', (leftUserId, leftUsername) => {
        //     console.log(`${leftUsername} has left the room`);

        //     onUserLeft(leftUserId);
        //     console.log(peers);

        //     const peerRefOfLeftUser = peerVideoRef.current.find((peer: { userId: string; }) => peer.userId === leftUserId);
        //     if (peerRefOfLeftUser) {
        //         const remainingPeers = peers.filter((peer) => peer !== peerRefOfLeftUser.peer);
        //         console.log(remainingPeers);

        //         peerRefOfLeftUser.peer.destroy();
        //         setPeers(remainingPeers);
        //         peerVideoRef.current = peerVideoRef.current.filter(peer => peer.userId !== leftUserId);

        //     }
        // });

        window.addEventListener('popstate', (event) => {
            if (userstream.current) {
                userstream.current.getTracks().forEach(track => {
                    console.log(`${track.kind} is stopping...`);
                    track.stop();
                });
            }

            socket.emit('leaveRoom', roomId!, userId);
            window.location.href = '/';
        });

        return () => {
            console.log('doing useEffect cleanUp...');
            window.removeEventListener('popstate', () => { });
        }
    }, []);

    // anytime after the number of user in the room changes
    useEffect(() => {
        // console.log('useEffect: The number of peers changes to ' + peers.length);
        console.log('useEffect: The number of calls changes to ' + calls.length);


        socket.on('userLeft', (leftUserId, leftUsername) => {
            console.log(`${leftUsername} has left the room`);
            // console.log(peers);
            console.log(calls);

            const peerRefOfLeftUser = peerVideoRef.current.find((peer: { userId: string; }) => peer.userId === leftUserId);
            if (peerRefOfLeftUser) {
                // const remainingPeers = peers.filter((peer) => peer !== peerRefOfLeftUser.peer);
                const remainingCalls = calls.filter((call) => call.peeruserId !== leftUserId);
                console.log(remainingCalls);

                peerRefOfLeftUser.peer.destroy();
                // setPeers(remainingPeers);
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

    const endScreenShare = () => {
        console.log('screen share has ended');
        setIsScreenSharing(false);
    }

    return (
        <>
            <RoomHeader startScreenShare={startScreenShare} />
            <h1>{`You are currently in room : ${roomId}`}</h1>

            <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                <Grid style={{ flex: 1 }} container>
                    <VideoPlayer username={yourname} videoRef={userVideoRef} />
                    {/* {peers.map(peer => <PeerVideoPlayer userId="userId" peerUserName="user2" peer={peer} />)} */}
                    {calls.map(call => <PeerVideoPlayer key={call.peeruserId} userId={call.peeruserId} peerUserName={call.peername} peer={call.peer} stream={call.stream} />)}
                </Grid>
                <div style={{ flex: 1 }}>
                    <CodeMirror
                        value={code}
                        width='100%'
                        height="500px"
                        extensions={[javascript({ jsx: true })]}
                        onChange={(value, viewUpdate) => {
                            console.log('value:', value);
                            socket.emit('codeChanged', roomId!, value);
                        }}
                    />
                </div>
            </div>

        </>
    )
}

type Call = {
    peer: Peer.Instance,
    peername: string,
    peeruserId: string,
    stream: MediaStream
};