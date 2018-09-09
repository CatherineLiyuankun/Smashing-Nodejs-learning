/**

* Module dependencies

*/
var connect = require('connect');
var users = require('./static/users');
var cookieParser = require('cookie-parser');//cookie-parser - previously cookieParser
var bodyParser = require('body-parser'); //https://www.npmjs.com/package/body-parser
var session = require('express-session'); //express-session - previously session
// var RedisStore = require('connect-redis')(session); //https://www.npmjs.com/package/connect-redis

/**
 * If you are faced the error: "\connect\node_modules\connect\lib\middleware\static.js:144
 * type = mime.lookup(path);
                 ^
 * TypeError: mime.lookup is not a function"
 * you can find the root reason is that lookup() renamed to getType() for mime package.
 * So you can replace the "lookup" to "getType" in static.js
 * and modify "var charset = mime.charsets.getType(type);" to "var charset = mime.getType(type);" in static.js
*/
var server = connect(
	connect.logger('dev')
);

server.use(cookieParser());
// server.use(session({ store: new RedisStore, secret: 'my app secret' }));
server.use(session({ secret: 'my app secret' }));
server.use(bodyParser());

server.use(function (req, res, next) {
	if (!req.session) {
	  return next(new Error('oh no')) // handle error
	}
	next(); // otherwise continue
});
server.use(function (req, res, next) {

	if ('/' == req.url && req.session && req.session.logged_in) {

		res.writeHead(200, { 'Content-Type': 'text/html' });

		res.end(

			'Welcome back, <b>' + req.session.name + '</b>. '

			+ '<a href="/logout">Logout</a>'

		);

	} else {

		next();

	}

});

server.use(function (req, res, next) {

	if ('/' == req.url && 'GET' == req.method) {

		res.writeHead(200, { 'Content-Type': 'text/html' });

		res.end([

			'<form action="/login" method="POST">'

			, '<fieldset>'

			, '<legend>Please log in</legend>'

			, '<p>User: <input type="text" name="user"></p>'

			, '<p>Password: <input type="password" name="password"></p>'

			, '<button>Submit</button>'

			, '</fieldset>'

			, '</form>'

		].join(''));

	} else {

		next();

	}

});

server.use(function (req, res, next) {

	if ('/login' == req.url && 'POST' == req.method) {

		res.writeHead(200);

		if (!users[req.body.user] || req.body.password != users[req.body.user].password) {

			res.end('Bad username/password');

		} else {

			req.session.logged_in = true;  //error  req.session  undefined  after use 'connect-redis'

			req.session.name = users[req.body.user].name;

			res.end('Authenticated!');

		}

	} else {

		next();

	}

});


server.use(function (req, res, next) {

	if ('/logout' == req.url) {

		req.session.logged_in = false;

		res.writeHead(200);

		res.end('Logged out!');

	} else {

		next();

	}

});


server.listen(3000);
