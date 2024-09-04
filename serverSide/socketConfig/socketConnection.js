import {Server} from "socket.io";
import express from "express";
import http from "http";

const empathAiApp = express();

const server = http.createServer(empathAiApp);

const io = new Server(server, {
    cors:{
        origin:process.env.URL,
        methods:['GET','POST'],
        credentials: true
    }
})

const userSocketMap = {} ; // this map stores socket id corresponding the user id; userId -> socketId

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

io.on('connection', (socket)=>{
    const carerId = socket.handshake.query.userId;
    if(carerId){
        userSocketMap[carerId] = socket.id;
    }

    
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect',()=>{
        if(carerId){
            delete userSocketMap[carerId];
        }
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
})

export {empathAiApp, server, io};