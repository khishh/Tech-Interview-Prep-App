export interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    me: (id: string) => void;
  }
  
export interface ClientToServerEvents {
    hello: () => void;
    createRoom: (username: string) => void;
    joinRoom: (roomId: string, username: string) => void;
}
  
export interface InterServerEvents {
    // ping: () => void;
}
  
export interface SocketData {
    name: string;
    age: number;
}

