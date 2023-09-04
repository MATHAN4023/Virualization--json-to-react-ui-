
const express = require('express');
const http = require('http');
const port = 5000;


const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });


io.on('connection', (socket) => {

    socket.on('send-message-react', (message) => {
        console.log(message)
        io.emit('message-from-node', message);
    });

    socket.on('process-result', (result) => {
        console.log(result)
        io.emit('message-to-react', result);
    }); 
   

    socket.on('disconnect', () => {
        console.log("disconnect");
    });
});


server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

