import React, { createContext, ReactNode, useEffect, useRef, useState } from "react";
import { socket, resetSocket } from "./Socket";
import Peer from 'simple-peer';

export const SocketContext = createContext<SocketContextProps>({} as SocketContextProps);

export const SocketContextProvider = (props: Props) => {
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('')
    const [peers, setPeers] = useState<Peer.Instance[]>([]);
    const [code, setCode] = useState('');
    const [mediaConstraints, setMediaConstraints] = useState({
        video: true, audio: true
    });
    const userVideoRef = useRef<HTMLVideoElement>(document.createElement('video'));
    const peerVideoRef = useRef<PeerVideoRefType[]>([]);
    const userstream = useRef<MediaStream>();

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

    const onDisconnect = () => {
        setPeers([]);
        setCode('');
        userVideoRef.current = document.createElement('video');
        peerVideoRef.current = [];
        userstream.current = undefined;

        // resetSocket();
        // socket.connect();
    }

    return (
        <SocketContext.Provider value= {{
            userId,
            username,
            peers, 
            mediaConstraints, 
            userVideoRef, 
            peerVideoRef, 
            userstream,
            code,
            setUsername,
            setCode,
            createPeer, 
            setPeers, 
            addPeer,
            onDisconnect
        }}>
            {props.children}
        </SocketContext.Provider>
    )
}

type SocketContextProps = {
    userId: string,
    username: string, 
    peers: Peer.Instance[],
    mediaConstraints: MediaStreamConstraints,
    userVideoRef: React.MutableRefObject<HTMLVideoElement>,
    peerVideoRef: React.MutableRefObject<PeerVideoRefType[]>,
    userstream: React.MutableRefObject<MediaStream | undefined>,
    code: string,
    setUsername: React.Dispatch<React.SetStateAction<string>>,
    setCode: React.Dispatch<React.SetStateAction<string>>,
    createPeer: (userId: string, callerId: string, stream: MediaStream) => Peer.Instance,
    setPeers: React.Dispatch<React.SetStateAction<Peer.Instance[]>>,
    addPeer: (callerId: string, incomingSIgnalData: Peer.SignalData, stream: MediaStream) => Peer.Instance,
    onDisconnect: () => void;
}

type Props = {
    children: ReactNode
}

type PeerVideoRefType = {
    userId: string,
    username: string,
    peer: Peer.Instance
}

type Call = {
    peer: Peer.Instance,
    peername: string,
    peeruserId: string
};
