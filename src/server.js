const express = require('express');
const app = express();
const http = require('http');
const { Server } = require("socket.io");
const  Redis =require ('ioredis');
const job = require('./cron/cron');
// By default, it will connect to localhost:6379.
let redis;
if(process.env.REDIS_HOST){
  redis = new Redis({
    host:process.env.REDIS_HOST,
    port: 6379
  });
}else{
   redis = new Redis();
}

const server = http.createServer(app);
const io = new Server(server, {
    cors: {origin:["http://localhost:5173","http://localhost:5000","https://algocode-phi.vercel.app"], methods: ["GET", "POST"]},
});
app.use(express.json())
job.start();

app.get("/ping", (req, res) => {
    res.send("pong");
})
io.on("connection", (socket) => {
    console.log(`a user connected ${socket.id}`);
    
    try {
      app.post("/sendpayload",async (req, res) => {  
        console.log("payload data",req.body)
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

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
  });
  