const express = require('express');
const app = express();
const http = require('http');
const { Server } = require("socket.io");
const  Redis =require ('ioredis');
// By default, it will connect to localhost:6379.
const redis = new Redis();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {origin:["http://localhost:5173","http://localhost:5000"], methods: ["GET", "POST"]},
});
app.use(express.json())
io.on("connection", (socket) => {
    console.log(`a user connected ${socket.id}`);
    
    try {
      app.post("/sendpayload",async (req, res) => {  
        const payload=await req.body
        if(!payload){
            res.status(400).send("userId and payload are required")
        }
    
        redis.get(payload.userId, (err, result) => {
            if (err) {
              console.error(err);
            } else {
              console.log(result)
              io.to(result).emit("payload", payload);
            }
        })
     })
    } catch (error) {
      console.log(error)
    }


    socket.on("redis-cache", (data) => {
      console.log("socket.id",socket.id)
        redis.set(data.userId,socket.id);
        // redis.get("1", (err, result) => {
        //     if (err) {
        //       console.error(err);
        //     } else {
        //       console.log(result); 
        //     }
        //   })
    });
  });

server.listen(3000, () => { console.log("listening on 3000"); });