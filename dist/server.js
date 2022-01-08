"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const app = express_1.default();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
const port = process.env.PORT || 8080;
const roomInfo = new Map();
const userInfo = new Map();
console.log(process.env.NODE_ENV);
// if(process.env.NODE_ENV === 'production') {
app.use(express_1.default.static(path_1.default.join(__dirname, "client", "build")));
app.get("*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "client", "build", "index.html"));
});
// }
console.log(__dirname);
io.on("connection", (socket) => {
    console.log(socket.id);
    socket.emit('me', socket.id);
    socket.on('disconnect', () => {
        console.log('User disconnected!');
    });
    socket.on('createRoom', (username, callback) => {
        const roomId = uuid_1.v4();
        console.log(`${username} create a new room ${roomId}`);
        roomInfo.set(roomId, {
            code: "// Type your code here"
        });
        callback(roomId);
    });
    socket.on('joinRoom', (roomId, username) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`${username} join room ${roomId}`);
        yield socket.join(roomId);
        userInfo.set(socket.id, {
            username: username
        });
        console.log(userInfo.get(socket.id));
        // fetch all users in this room and broadcast user lists to everyone in the room
        const clients = io.sockets.adapter.rooms.get(roomId);
        console.log(`This room : ${roomId} has ${clients ? clients.size : 0} clients`);
        const users = [];
        clients.forEach(client => {
            users.push({ userId: client, username: userInfo.get(client).username });
        });
        console.log(users);
        io.to(socket.id).emit('newUserJoined', users);
        // socket.broadcast.to(roomId).emit('newUserJoined', users);
    }));
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
//# sourceMappingURL=server.js.map