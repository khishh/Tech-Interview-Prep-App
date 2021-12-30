import React, { createContext, ReactNode, useEffect, useRef, useState } from "react";
import { socket } from "./Socket";
import Peer from 'simple-peer';
import stream from "stream";


export const SocketContext = createContext<SocketContextProps>({} as SocketContextProps);

export const SocketContextProvider = (props: Props) => {
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('')
    const [peers, setPeers] = useState<Peer.Instance[]>([]);
    const [mediaConstraints, setMediaConstraints] = useState({
        video: true, audio: true
    });
    const userVideoRef = useRef<HTMLVideoElement>(document.createElement('video'));
    const peerVideoRef = useRef<PeerVideoRefType[]>([]);
    const userstream = useRef<MediaStream>();

    useEffect(() => {
        socket.on('me', (userId) => setUserId(userId));
    }, []);

    const joinCall = () => {

    }

    const createPeer = (userIdToCall: string, callerId: string, stream: MediaStream) => {
        const peer = new Peer({ initiator: true, trickle: false, stream});

        peer.on('signal', signal => {
            socket.emit('callUser', userIdToCall, callerId, signal);
        });

        return peer;
    }

    const addPeer = (callerId: string, incomingSignalData: Peer.SignalData, stream: MediaStream) => {
        const peer = new Peer({initiator: false, trickle: false, stream});

        peer.on('signal', signal => {
            socket.emit('acceptCall', callerId, signal);
        });

        peer.signal(incomingSignalData);

        return peer;
    }

    return (
        <SocketContext.Provider value= {{
            username,
            peers, 
            mediaConstraints, 
            userVideoRef, 
            peerVideoRef, 
            userstream,
            setUsername,
            createPeer, 
            setPeers, 
            addPeer
        }}>
            {props.children}
        </SocketContext.Provider>
    )
}

type SocketContextProps = {
    username: string, 
    peers: Peer.Instance[],
    mediaConstraints: MediaStreamConstraints,
    userVideoRef: React.MutableRefObject<HTMLVideoElement>,
    peerVideoRef: React.MutableRefObject<PeerVideoRefType[]>,
    userstream: any,
    setUsername: React.Dispatch<React.SetStateAction<string>>,
    createPeer: (userId: string, callerId: string, stream: MediaStream) => Peer.Instance,
    setPeers: React.Dispatch<React.SetStateAction<Peer.Instance[]>>,
    addPeer: (callerId: string, incomingSIgnalData: Peer.SignalData, stream: MediaStream) => Peer.Instance
}

type Props = {
    children: ReactNode
}

type PeerVideoRefType = {
    userId: string,
    username: string,
    peer: Peer.Instance
}