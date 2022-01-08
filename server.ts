require('dotenv').config()
import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData, user } from './model';

const app = express();
const server = http.createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const port = process.env.PORT || 8080;

type UserInfoType = {
    username: string
};

type RoomInfoType = {
    code: string
}

const roomInfo: Map<string, RoomInfoType> = new Map<string, RoomInfoType>();

const userInfo: Map<string, UserInfoType> = new Map<string, UserInfoType>();

console.log(process.env.NODE_ENV);


if(process.env.NODE_ENV === 'production') {

    app.use(express.static(path.join(__dirname, "client", "build")))

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "client", "build", "index.html"));
    });

}



console.log(__dirname);

io.on("connection", (socket) => {
    console.log(socket.id);
    socket.emit('me', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected!');
      });

    socket.on('createRoom', (username, callback) => {
        const roomId: string = uuidv4();
        console.log(`${username} create a new room ${roomId}`);
        roomInfo.set(roomId, {
            code: "// Type your code here"
        });
        callback(roomId);
    });

    socket.on('joinRoom', async (roomId, username) => {
        console.log(`${username} join room ${roomId}`);
        
        await socket.join(roomId);

        userInfo.set(socket.id, {
            username: username
        }); 
        console.log(userInfo.get(socket.id));
        

        // fetch all users in this room and broadcast user lists to everyone in the room
        const clients = io.sockets.adapter.rooms.get(roomId);
        console.log(`This room : ${roomId} has ${clients ? clients.size : 0} clients`);
        const users :user[] = [];

        clients.forEach(client => {
            users.push({ userId: client, username: userInfo.get(client).username}); 
        });

        console.log(users);
        

        io.to(socket.id).emit('newUserJoined', users);
        // socket.broadcast.to(roomId).emit('newUserJoined', users);
    });

    socket.on('callUser', (userToCall, caller, signalData) => {
        console.log(`server receives a call from ${userInfo.get(caller).username} to ${userInfo.get(userToCall).username}`);
        io.to(userToCall).emit('callingUser', caller, signalData, userInfo.get(socket.id).username);
    });

    socket.on('acceptCall', (callerId, signalData) => {
        console.log(`Call from ${userInfo.get(callerId).username} has been accepted by ${userInfo.get(socket.id).username}`);
        io.to(callerId).emit('callAccepted', signalData, socket.id);
    });

    socket.on('leaveRoom', (roomId, userId) => {
        console.log(`${userId} is leaving room ${roomId}...`);
        socket.broadcast.to(roomId).emit('userLeft', userId, userInfo.get(socket.id).username);
        socket.leave(roomId);
        
        socket.disconnect();
        // delete userInfo[userId];
        userInfo.delete(socket.id);
    });

    socket.on('codeChanged', (roomId, code) => {
        console.log(code);
        roomInfo.set(roomId, {
            code: code
        });
        io.to(roomId).emit('distributeCode', code);
    });

    socket.on('fetchCode', (roomId) => {
        io.to(socket.id).emit('distributeCode', roomInfo.get(roomId).code);
    });

});



server.listen(port, () => {
    console.log(`Timezones by location application is running on port ${port}.`);
});