import { io, Socket } from "socket.io-client";
import {ServerToClientEvents, ClientToServerEvents} from '../../server/model'

// please note that the types are reversed
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:3001');

export {socket};



