import { emit } from "process";
import React, { useContext, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import { VideoPlayer } from "../components/VideoPlayer";
import { socket } from "../Socket";
import { SocketContext } from "../SocketContext";
import Peer from 'simple-peer';
import { PeerVideoPlayer } from "../components/PeerVideoPlayer";

type stateType = {
    username: string
}

export const Room = () => {

    const { roomId } = useParams();

    const { userVideoRef, peerVideoRef, userstream, username: yourname, createPeer, peers, setPeers, addPeer, } = useContext(SocketContext);

    useEffect(() => {

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                userVideoRef.current.srcObject = stream;
                userstream.current = stream;

                socket.emit('joinRoom', roomId!, yourname);


                socket.on('newUserJoined', usersInTheRoom => {

                    console.log(`${yourname}: you received a list of users in the room trying to join`);
                    console.log(usersInTheRoom);


                    const peers: Peer.Instance[] = [];
                    usersInTheRoom.forEach(({ userId, username }) => {
                        console.log(userId + " " + socket.id);

                        if (userId != socket.id) {
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

                    const peerRefWithAcceptedUser = peerVideoRef.current.find((peer: { userId: string; }) => peer.userId == acceptedUserId);
                    if (peerRefWithAcceptedUser) {
                        peerRefWithAcceptedUser.peer.signal(signalData);
                    }
                });
            });


    }, [])

    return (
        <>
            <h1>{`You are currently in room : ${roomId}`}</h1>
            <VideoPlayer username={yourname} videoRef={userVideoRef} />
            {peers.map(peer => <PeerVideoPlayer peerUserName="user2" peer={peer} />)}
        </>
    )
}