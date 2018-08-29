/* require('http').request({
    host: '127.0.0.1'
    , port: 3000
    , url: '/'
    , method: 'GET'
    }, function (res) {
        var body = '';
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            console.log('\n  We got: \033[96m' + body + '\033[39m\n');
        });
}).end(); */

var http = require('http'), qs = require('querystring');

function send (theName) {
  http.request({
    host: 'localhost',
    port: 3000,
    url: '/',
    method: 'POST'
  }, function (res) {
       res.setEncoding('utf8');
       res.on('end', function () {
            console.log('\n  \033[90m request complete!\033[39m');
       });

  }).end(qs.stringify({ name: theName }));
}

process.stdout.write('\n  your name: ');
process.stdin.resume();
process.stdin.setEncoding('utf-8');
process.stdin.on('data', function (name) {
  send(name.replace('\n', ''));
});