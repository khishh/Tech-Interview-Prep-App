import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from './model';

const app = express();
const server = http.createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('server is running'));

io.on("connection", (socket) => {
    console.log(socket.id);
    socket.emit('me', socket.id);

    socket.on('createRoom', (username) => {
        const roomId: string = uuidv4();
        console.log(`${username} create a new room ${roomId}`);
        
    });

    socket.on('joinRoom', (roomId, username) => {
        console.log(`${username} join room ${roomId}`);
        
    })

    // socket.emit("noArg");
    // socket.emit("basicEmit", 1, "2", Buffer.from([3]));
    // socket.emit("withAck", "4", (e) => {
    //     // e is inferred as number
    // });

    // // works when broadcast to all
    // io.emit("noArg");

    // // works when broadcasting to a room
    // io.to("room1").emit("basicEmit", 1, "2", Buffer.from([3]));
});

server.listen(port, () => {
    console.log(`Timezones by location application is running on port ${port}.`);
});