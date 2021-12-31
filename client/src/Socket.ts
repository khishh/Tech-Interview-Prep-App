import { io, Socket, Manager } from "socket.io-client";
import {ServerToClientEvents, ClientToServerEvents} from '../../server/model'

// please note that the types are reversed
const manager = new Manager('http://localhost:3001');
let socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:3001');

export const resetSocket = () => {
    socket = io('http://localhost:3001');
}

export {socket};



