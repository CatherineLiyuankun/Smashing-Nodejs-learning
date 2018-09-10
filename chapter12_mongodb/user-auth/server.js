var express = require('express')
    , mongodb = require('mongodb')

/*set up application*/
var app = express.createServer();

/*middleware*/
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: 'my secret' }));

/*view options*/
app.set('view engine', 'jade');
app.set('view options', { layout: false });

/*authenticetion middleware*/
app.use(function (req, res, next) {
  if (req.session.loggedIn) {
    res.local('authenticated', true);
    app.users.findOne({ _id: mongodb.ObjectID.createFromHexString(req.session.loggedIn) }, function (err, doc) {
      if (err) return next(err);
      res.local('me', doc);
      next();
    });
  } else {
    res.local('authenticated', false);
    next();
  }
});

/**
 * Routes
 */
app.get('/', function (req, res) {
  res.render('index');
});

app.get('/login', function (req, res) {
  res.render('login', {email: ''});
});

app.post('/login', function (req, res, next) {
  app.users.findOne({ email: req.body.user.email, password: req.body.user.password }, function (err, doc) {
    if (err) return next(err);
    if (!doc) return res.send('<p>User Not Found</p>');
    req.session.loggedIn = doc._id.toString();
    res.redirect('/');
  });
});

app.get('/signup', function (req, res) {
  res.render('signup');
});

app.post('/signup', function (req, res, next) {
  app.users.insert(req.body.user, function (err, doc) {
    if (err) return next(err);
    res.redirect('/login/' + doc[0].email);
  });
});

app.get('/login/:email', function (req, res) {
  res.render('login', { email: req.params.email });
});

app.get('/logout', function (req, res) {
  req.session.loggedIn = null;
  res.redirect('/');
})

/*connect to mongodb*/
var server = new mongodb.Server('127.0.0.1', 27017);

new mongodb.Db('first-site', server).open(function (err, client) {
  if (err) console.log(err);

  console.log('\033[96m + \033[39m connected to mongodb');
  app.users = new mongodb.Collection(client, 'users');

  client.ensureIndex('users', 'email', function (err) {
    if (err) throw err;

    client.ensureIndex('users', 'password', function (err) {
      if (err) throw err;
      console.log('\033[96m + \033[39m index created!');

      app.listen(3000, function() {
        console.log('\033[96m + \033[39m server listen 3000');
      });
    });
  });
});
