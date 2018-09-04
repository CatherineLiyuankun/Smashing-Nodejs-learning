var express = require('express');

var app = express();

app.use(require('simple-bodyparser')());
app.use(express.static('public'));

var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection', function (socket) {
    console.log('Someone connected');
    socket.on('join', function (name) {
        console.log(name);
        socket.nickname = name;
        socket.broadcast.emit('announcement', name + ' joined the chat.');
    });
    socket.on('text', function (msg, fn) {
        socket.broadcast.emit('text', socket.nickname, msg);
        fn(Date.now());
    });
});

server.listen(3004);
