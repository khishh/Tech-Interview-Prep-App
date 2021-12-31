import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { VideoPlayer } from "../components/VideoPlayer";
import { socket } from "../Socket";
import { SocketContext } from "../SocketContext";
import Peer from 'simple-peer';
import { PeerVideoPlayer } from "../components/PeerVideoPlayer";
import { Grid } from "@mui/material";
import '../index.css';

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

// type stateType = {
//     username: string
// }

var count = 0;

export const Room = () => {

    const { roomId } = useParams();

    const { userVideoRef, peerVideoRef, userstream, userId, username: yourname, createPeer, peers, setPeers, addPeer, code, setCode, onDisconnect} = useContext(SocketContext);

    console.log(`peers size: ${peers.length}`);
    

    useEffect(() => {

        // if(!socket.connected) {
        //     socket.connect();
        // }

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                userVideoRef.current.srcObject = stream;
                userstream.current = stream;

                socket.emit('joinRoom', roomId!, yourname);
                socket.emit('fetchCode', roomId!);

                socket.on('newUserJoined', usersInTheRoom => {

                    console.log(`${yourname}: you received a list of users in the room trying to join`);
                    console.log(usersInTheRoom);


                    const peers: Peer.Instance[] = [];
                    usersInTheRoom.forEach(({ userId, username }) => {
                        console.log(userId + " " + socket.id);

                        if (userId !== socket.id) {
                            const peer = createPeer(userId, socket.id, stream);

                            peerVideoRef.current.push({
                                userId: userId,
                                username: username,
                                peer: peer
                            });
                            peers.push(peer);
                        }

                    });
                    setPeers(peers);
                });

                socket.on('callingUser', (callerId, signalData, callerUsername) => {
                    console.log(`${yourname}: you are receiving a call from ${callerId}/${callerUsername}`);

                    const peer = addPeer(callerId, signalData, stream);

                    peerVideoRef.current.push({
                        userId: callerId,
                        username: callerUsername,
                        peer: peer
                    });

                    setPeers((prevPeers) => [...prevPeers, peer]);
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

                socket.on('userLeft', (leftUserId, leftUsername) => {
                    console.log(`${leftUsername} has left the room`);
                    
                    const peerRefOfLeftUser = peerVideoRef.current.find((peer: { userId: string; }) => peer.userId === leftUserId);
                    if(peerRefOfLeftUser) {
                        const remainingPeers = peers.filter((peer) => peer !== peerRefOfLeftUser.peer);
                        console.log(`remainingPeers size : ${remainingPeers.length}`);
                        peerRefOfLeftUser.peer.destroy();
                        setPeers(remainingPeers);
                        peerVideoRef.current = peerVideoRef.current.filter(peer => peer.userId !== leftUserId);
                        console.log(`peerVideoRef size : ${peerVideoRef.current.length}`);
                        
                    }
                });
            });

            window.addEventListener('popstate', (event) => {
                if(userstream.current) {
                    userstream.current.getTracks().forEach(track => {
                        console.log(`${track.kind} is stopping...`);
                        track.stop();
                    });
                    
                } 
                socket.emit('leaveRoom', roomId!, userId);
                // socket.removeAllListeners();
                // onDisconnect();
                window.location.href = '/';
            });

            return () => {
                console.log('useEffect returning callback called');
                window.removeEventListener('popstate', () => {});
            }
    }, [])

    return (
        <>
            <h1>{`You are currently in room : ${roomId}`}</h1>
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                <Grid style={{ flex: 1 }} container>
                    <VideoPlayer username={yourname} videoRef={userVideoRef} />
                    {peers.map(peer => <PeerVideoPlayer peerUserName="user2" peer={peer} />)}
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