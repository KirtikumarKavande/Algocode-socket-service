const express = require('express');
const app = express();
const http = require('http');
const { Server } = require("socket.io");
const  Redis =require ('ioredis');
// By default, it will connect to localhost:6379.
const redis = new Redis();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {origin:"http://localhost:5173", methods: ["GET", "POST"]},
});

io.on("connection", (socket) => {
    console.log(`a user connected ${socket.id}`);
    
    socket.on("redis-cache", (data) => {
        redis.set(data.userId,socket.id);
        redis.get("1", (err, result) => {
            if (err) {
              console.error(err);
            } else {
              console.log(result); 
            }
          })
    });
  });

server.listen(3000, () => { console.log("listening on 3000"); });