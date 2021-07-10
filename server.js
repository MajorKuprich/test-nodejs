'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const fs = require("fs");
const express = require("express");
const https = require("https");
const http = require("http");
const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/../../.env` });
const { PORT = process.env.NODE_PORT } = process.env;
const { BASE_URL, SSL, NODE_KEY, NODE_CERT } = process.env;
const app = express();
const options = SSL ? {
    key: fs.readFileSync(String(NODE_KEY)),
    cert: fs.readFileSync(String(NODE_CERT))
} : {};
const server = SSL ? https.createServer(options, app) : http.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        // origin: `${BASE_URL}:${PORT}`
        origin: `*`
    }
});
let players = [];
io.on('connection', function (socket) {
    console.log('A user connected: ' + socket.id);
    players.push(socket.id);
    if (players.length === 1) {
        io.emit('isPlayerA');
    }
    socket.on('dealCards', function () {
        io.emit('dealCards');
    });
    socket.on('cardPlayed', function (gameObject, isPlayerA) {
        io.emit('cardPlayed', gameObject, isPlayerA);
    });
    socket.on('disconnect', function () {
        console.log('A user disconnected: ' + socket.id);
        players = players.filter((player) => player !== socket.id);
    });
});

let port = 3000;
if(PORT === undefined)port = 3000; else port=PORT;

server.listen(port, function () {
    console.log('Server started!');
});
//# sourceMappingURL=server.js.map
