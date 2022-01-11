import React, { createContext, ReactNode, useEffect, useRef, useState } from "react";
import { socket } from "./Socket";
import Peer from 'simple-peer';

export const SocketContext = createContext<SocketContextProps>({} as SocketContextProps);

export const SocketContextProvider = (props: Props) => {
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('')
    const [mediaConstraints, setMediaConstraints] = useState({
        video: true, audio: true
    });


    useEffect(() => {
        socket.on('me', (userId) => {
            setUserId(userId);
            console.log(userId);
        });

        socket.io.on('reconnect_attempt', (attemptNumber) => {
            console.log(`reconnect attempt for ${attemptNumber} times`);
        });

        socket.io.on('reconnect', (attemptNumber) => {
            console.log(`socket reconnected after attempt of ${attemptNumber} times`);
        });
    }, []);

    const createPeer = (userIdToCall: string, callerId: string, stream: MediaStream) => {
        const peer = new Peer({ initiator: true, trickle: false, stream });

        peer.on('signal', signal => {
            socket.emit('callUser', userIdToCall, callerId, signal);
        });

        return peer;
    }

    const addPeer = (callerId: string, incomingSignalData: Peer.SignalData, stream: MediaStream) => {

        const peer = new Peer({ initiator: false, trickle: false, stream });

        peer.on('signal', signal => {
            socket.emit('acceptCall', callerId, signal);
        });

        peer.signal(incomingSignalData);

        return peer;
    }

    return (
        <SocketContext.Provider value={{
            userId,
            username,
            mediaConstraints,
            setUsername,
            createPeer,
            addPeer
        }}>
            {props.children}
        </SocketContext.Provider>
    )
}

type SocketContextProps = {
    userId: string,
    username: string,
    mediaConstraints: MediaStreamConstraints,
    setUsername: React.Dispatch<React.SetStateAction<string>>,
    createPeer: (userId: string, callerId: string, stream: MediaStream) => Peer.Instance,
    addPeer: (callerId: string, incomingSIgnalData: Peer.SignalData, stream: MediaStream) => Peer.Instance,
}

type Props = {
    children: ReactNode
}

export type PeerVideoRefType = {
    userId: string,
    username: string,
    peer: Peer.Instance
}

