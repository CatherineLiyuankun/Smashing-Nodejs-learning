/**

* Module dependencies.

*/
var connect = require('connect');
var path = require('path');

/**

* Create server.

*/

/**
 * If you are faced the error: "\connect\node_modules\connect\lib\middleware\static.js:144
 * type = mime.lookup(path);
                 ^
 * TypeError: mime.lookup is not a function"
 * you can find the root reason is that lookup() renamed to getType() for mime package.
 * So you can replace the "lookup" to "getType" in static.js
 * and modify "var charset = mime.charsets.getType(type);" to "var charset = mime.getType(type);" in static.js
*/
var server = connect.createServer();

/**

* Handle static files.

*/
var websitePath = path.resolve(__dirname, '..'); // get the upper level folder of __dirname
server.use(connect.static(websitePath + '/website'));

server.use(function (req, res, next) {
    // you always log
    console.error(' %s %s ', req.method, req.url);
    next(); 
  });
  
server.use(function (req, res, next) {
    if ('GET' == req.method && '/images' == req.url.substr(0, 7)) { 
        // serve image
    } else {
        // let other middleware handle it 
        next();  
    }  
});

server.use(function (req, res, next) {
    if ('GET' == req.method && '/' == req.url) {
        // serve index
    } else {
        // let other middleware handle it
        next();
    }
});

server.use(function (req, res, next) {
    // last middleware, if you got here you don't know what to do with this
    res.writeHead(404);
    res.end('Not found'); 
});

/**

* Listen.

*/

server.listen(3000);

