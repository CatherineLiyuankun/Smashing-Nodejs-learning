// to avoid wanrning: (node:19256) [DEP0022] DeprecationWarning: os.tmpDir() is deprecated. Use os.tmpdir() instead.
var os = require('os'); 
os.tmpDir = os.tmpdir;

var connect = require('connect');
var busboy = require('connect-busboy'); //https://www.npmjs.com/package/connect-busboy
var cookieParser = require('cookie-parser');//cookie-parser - previously cookieParser

var bodyParser = require('body-parser'); //https://www.npmjs.com/package/body-parser
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
    // connect.bodyParser(), // deprecated  https://www.npmjs.com/package/connect
    connect.static('static')
);

// server.use(bodyParser.text({ type: 'text/html' }));
// server.use(bodyParser.text({ type: 'text/plain' }));
// server.use(bodyParser.text({ type: 'multipart/form-data' }));
// server.use(bodyParser.json({ type: 'application/*+json' }));

server.use(busboy());
server.use(cookieParser());
server.use(function (req, res, next) {
  console.log('Cookies: ', req.cookies);

  req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    console.log(filename);
  });
  req.pipe(req.busboy);

    if ('POST' == req.method) {
      // console.log(req.body.file); //error  req.body.file  undefined  
    } else {
  
      next();
  
    }

/*     if ('POST' == req.method && req.body.file) {

        fs.readFile(req.body.file.path, 'utf8', function (err, data) {
    
          if (err) {
    
            res.writeHead(500);
    
            res.end('Error!');
    
            return;
    
          }
    
    
          res.writeHead(200, { 'Content-Type': 'text/html' });
    
          res.end([
    
              '<h3>File: ' + req.body.file.name + '</h3>'
    
            , '<h4>Type: ' + req.body.file.type + '</h4>'
    
            , '<h4>Contents:</h4><pre>' + data + '</pre>'
    
          ].join(''));
    
        });
    
      } else {
    
        next();
    
      } */
  
  });

  server.listen(3000);
