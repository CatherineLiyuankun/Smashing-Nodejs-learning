var express = require('express')
    , wsio = require('websocket.io');

var app = express.createServer();
var ws = wsio.attach(app);

var postions = {}
    , total = 0;

app.use(express.static('public'));

/*listen on connections*/
ws.on('connection', function (socket) {
  function broadcast (msg) {
    for (var i=0, l = ws.clients.length; i<l; i++) {
      if (ws.clients[i] && ws.clients[i].id != i) {
        ws.clients[i].send(msg);
      }
    }
  }

  //give socket its id
  socket.id = ++total;

  socket.on('message' ,function (msg) {
    //set postion
    try {
      var pos = JSON.parse(msg);
    } catch(e) {
      return;
    }

    postions[socket.id] = pos;
    broadcast(JSON.stringify({ type: 'position', pos: pos, id: socket.id }));
  });

  socket.on('close', function () {
    console.log(postions);
    delete postions[socket.id]
    broadcast(JSON.stringify({ type: 'disconnect', id: socket.id }));
  });

  socket.send(JSON.stringify(postions));
});

app.listen(3000);