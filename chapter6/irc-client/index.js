/**
 * http://colloquy.info/downloads.html
 */

var net = require('net');

// var client0 = net.connect(3000, 'localhost');
// client0.on('connect', function (params) {
	
// });

// var client = net.connect(6667, 'irc.freenode.net');
var client = net.connect(6667, 'chat.freenode.net');
client.setEncoding('utf-8');

client.on('connect', function () {
	client.write('NICK mynick\r\n');
	client.write('USER mynick 0 * :realname\r\n');
	client.write('JOIN #node.js\r\n');
});

