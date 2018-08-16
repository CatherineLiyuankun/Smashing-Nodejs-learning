/**
 * 模块登录 Dependency
 */

var net = require('net');

/**
 * track connection count
 */
var count = 0;
var users = {};

/**
 * create server
 */
var server = net.createServer(function (conn) {
	conn.write(
		'\n > welcometo \033[92mnode-chat\033[39m!' +
		'\n > ' + count + ' other people are connected at this time.' +
		'\n > please write your name and press enter: '
	);

	count++;
	// console.log('\033[90m new connection!\033[39m');

	conn.on('close', function () {
		count--;
		delete users[nickname];
		broadcast('\033[90m > ' + nickname + ' left the room\033[39m\n');
	});

	conn.setEncoding('utf8');

	//current connection's nickname
	var nickname;

	/** 
 	* broadcast
 	*/
	function broadcast(msg, exceptMyself) {
		for (var i in users) {
			if (!exceptMyself || i != nickname) {
				users[i].write(msg);
			}
		}
	}

	conn.on('data', function (data) {
		// delete enter key
		data = data.replace('\r\n', '');

		// the first data should be the nickname user inputed
		if (!nickname) {
			if (users[data]) {
				conn.write('\033[93m > nickname already in use. try again:\033[39m ');
				return;
			} else {
				nickname = data;
				users[nickname] = conn;

				for (var i in users) {
					broadcast('\033[90m > ' + nickname + ' joined the room\033[39m\n');
				}
			}
		} else { // treat as chat message
			broadcast('\033[96m > ' + nickname + ':\033[39m ' + data + '\n', true);
		}
	});
});

/**
 * Listen
 */
server.listen(3000, function () {
	console.log('\033[96m server listening on *:3000\033[39m')
});

