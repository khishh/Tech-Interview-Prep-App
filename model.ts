import Peer from 'simple-peer';
export interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    me: (userId: string) => void;
    newUserJoined: (users: user[]) => void;
    callingUser: (caller: string, signalData: Peer.SignalData, callerUsername: string) => void;
    callAccepted: (signalData: Peer.SignalData, acceptedUserId: string) => void;
    distributeCode: (newCode: string) => void;
    userLeft: (leftUserId: string, leftUsername: string) => void;
}

export type user = {
    userId: string, 
    username: string
}
  
export interface ClientToServerEvents {
    hello: () => void;
    createRoom: (username: string, callback: (roomId: string | null) => void) => void;
    joinRoom: (roomId: string, username: string) => void;
    callUser: (userToCall: string, caller: string, signalData: Peer.SignalData) => void;
    acceptCall: (caller: string, signalData: Peer.SignalData) => void;
    fetchCode: (roomId: string) => void;
    codeChanged: (roomId: string, newCode: string) => void;
    leaveRoom: (roomId: string, leavingUserId: string) => void;
}
  
export interface InterServerEvents {
    // ping: () => void;
}
  
export interface SocketData {
    name: string;
    age: number;
}

