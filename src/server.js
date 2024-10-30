const express = require('express');
const app = express();
const http = require('http');
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
    cors: {origin:"http://localhost:5173", methods: ["GET", "POST"]},
});

io.on("connection", (socket) => {
    console.log(`a user connected ${socket.id}`);
    
    socket.on("send_message", (data) => {
        console.log(data);
    //   socket.broadcast.emit("receive_message", data);
    });
  });

server.listen(3000, () => { console.log("listening on 3000"); });