var express = require('express')
    , mongoose = require('mongoose')

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
    User.findById(req.session.loggedIn, function (err, doc) {
      if (err) return next(err);
      res.local('me', doc);
      next();
    });
  } else {
    res.local('authenticated', false);
    next();
  }
});

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/login', function (req, res) {
  res.render('login', {email: ''});
});

app.post('/login', function (req, res, next) {
  User.findOne({ email: req.body.user.email, password: req.body.user.password }, function (err, doc) {
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
  var user = new User(req.body.user);
  user.save(function (err) {
    if (err) return next(err);
    res.redirect('/login/' + user.email);
  });
});

app.get('/login/:email', function (req, res) {
  res.render('login', { email: req.params.email });
});

app.get('/logout', function (req, res) {
  req.session.loggedIn = null;
  res.redirect('/');
})

app.listen(3000);

/*connect to mongodb*/
mongoose.connect('mongodb://127.0.0.1/first-site');

/*define models*/
var Schema = mongoose.Schema;

var User = mongoose.model('User', new Schema({
    first: String
  , last: String
  , email: { type: String, unique: true }
  , password: { type: String, index: true }
}));