var express = require('express'),
    request = require('superagent');

var app = express();

app.use(require('simple-bodyparser')());
app.use(express.static('public'));

var server = require('http').createServer(app);
var io = require('socket.io')(server);

var apiKey = 'bb1814da2a9119fa5197b5e616750fd7'
    , currentSong
    , dj;

function elect(socket) {
  dj = socket;
  io.sockets.emit('announcement', socket.nickname + ' is the new DJ');
  socket.emit('elected');
  socket.dj = true;
  socket.on('disconnect', function () {
    dj = null;
    // console.log( socket.in(socket.nickname) );
    socket.leave(socket.nickname);
    io.sockets.emit('announcement', 'the dj left, next one to join become the dj');
  });
}

io.on('connection', function (socket) {
    console.log('Someone connected');
    socket.on('join', function (name) {
        console.log(name);
        socket.nickname = name;
        socket.broadcast.emit('announcement', name + ' joined the chat.');
        if (!dj) {
            elect(socket);
        } else {
            socket.emit('song', currentSong);
        }
    });
    socket.on('text', function (msg, fn) {
        socket.broadcast.emit('text', socket.nickname, msg);
        fn(Date.now());
    });

    socket.on('search', function (q, fn) {
		// var url = 'http://tinysong.com/s/' + encodeURIComponent(q) + '?key=' + apiKey + '&format=json';
		var url = 'https://api.github.com/search/repositories?q=' + encodeURIComponent(q) + '+language:assembly&sort=stars&order=descn';
        console.log(url);
        request(url, function (err, res) {
			if (200 === res.status) {
                fn(JSON.parse(res.text));
            } else {
                console.log(err);
            }
		});
	});

	socket.on('song', function (song) {
		if (socket.dj) {
			currentSong = song;
			socket.broadcast.emit('song', song);
		}	
	});
});

server.listen(3004);
