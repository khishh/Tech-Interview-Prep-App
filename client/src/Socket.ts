import { io, Socket, Manager } from "socket.io-client";
import {ServerToClientEvents, ClientToServerEvents} from '../../model'

// please note that the types are reversed

const endpoint = process.env.NODE_ENV === 'production' ? 'https://tech-interview-prep-app.herokuapp.com/' : 'http://localhost:8080';
let socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(endpoint);

export const resetSocket = () => {
    socket = io(endpoint);
}

export {socket};



