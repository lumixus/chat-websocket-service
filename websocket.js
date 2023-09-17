import express from "express"
import {createServer} from "node:http"
import {Server} from "socket.io"
import dotenv from "dotenv"

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    socket.broadcast.emit('newConnection', {msg: `${socket.id} connected`});
    io.emit('get-client-count', {clientCount: io.engine.clientsCount})
    socket.on('chat message', (msg) =>  {
        io.emit('new message', {msg: msg, sender: socket.id});
    })
    console.log(`a user connected to ${socket.id}`);

    socket.on('disconnect', () => {
        socket.broadcast.emit('userDisconnected', {msg: `${socket.id} disconnected`, clientCount: io.engine.clientsCount});
    })
})


server.listen(process.env.NODE_ENV === "production" ? process.env.PORT : 8080, () => {
    console.log("Websocket server started at ", process.env.NODE_ENV === "production" ? process.env.PORT : 8080);
})