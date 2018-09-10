
/**
 * Module dependencies.
 */

var express = require('express');
var search = require('./search');
var path = require('path');
var http = require('http');

var app = express();

/**
 * Configure.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('view options', { layout: false });

/**
 * Routes.
 */
app.get('/', function (req, res) {
  res.render('index');
});

app.get('/search', function (req, res, next) {
  search(req.query.q, function (err, tweets) {
    if (err) {
      return next(err);
    }
    res.render('search', { results: tweets, search: req.query.q});
  });
});

app.get('/send', function (req, res) {
  console.log(req.header('host'));
  console.log(req.is('json'));
  console.log(res.header('content-type'));
  res.send([1,2,3]);
})

app.get('/redirect', function (req, res) {
  res.redirect('/');
});

app.get('/user/:name?', function (req, res) {
  req.params.name  =  req.params.name || 'No name'
  res.end(req.params.name);
});

function secure (req, res, next) {
  var login = false;
  if (!login) {
    return res.send(403);
  } else {
    next();
  }
}

app.get('/me', secure, function (res, req, next) {
  next();
});

// app.error(function (err, req, res, next) {
//   if (err.message == 'Bad twitter response') {
//     res.render('twitter-error');
//   } else {
//     next();
//   }
// });

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
