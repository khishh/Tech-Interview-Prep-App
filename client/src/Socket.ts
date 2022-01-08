import { io, Socket, Manager } from "socket.io-client";
import {ServerToClientEvents, ClientToServerEvents} from '../../model'

// please note that the types are reversed
let socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:8080');

export const resetSocket = () => {
    socket = io('http://localhost:8080');
}

export {socket};



