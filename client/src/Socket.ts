import { io, Socket } from "socket.io-client";
import {ServerToClientEvents, ClientToServerEvents} from '../../model'

const endpoint = process.env.NODE_ENV === 'production' ? 'https://tech-interview-prep-app.herokuapp.com/' : 'http://localhost:8080';
let socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(endpoint);


export {socket};



