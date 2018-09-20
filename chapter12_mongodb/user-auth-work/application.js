/**
 * Module dependencies.
 */
var express = require('express'), 
    mongodb = require('mongodb'),
    bodyParser = require('body-parser'), 
    cookieParser = require('cookie-parser'),
    session = require("express-session");

/**
 * Set up application.
 */
app = express();

/**
 * Middleware.
 */
//parse application/json
app.use(bodyParser.json());
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'my secret'
 })
);

/**
 * Specify your views options.
 */
app.set('view engine', 'jade');
app.set('views', './views');

/**
 * Authentication middleware.
 */
app.use(function(req, res, next){
    if (req.session.loggedIn){
        res.locals.authenticated = true;
        res.app.users.findOne({_id: mongodb.ObjectID(req.session.loggedIn)}, function(err, doc){
            if (err) return next(err);
            res.locals.me = doc;
            next();
        });
    } else {
        res.locals.authenticated = false;
        next();
    }
});

/**
 * Default route.
 */
app.get('/', function(req, res){
    res.render('index');
});

/**
 * Login route.
 */
app.get('/login', function(req, res){
    res.render('login');
});

/**
 * Signup route.
 */
app.get('/signup', function(req, res){
    res.render('signup');
});
//app.listen(3000);

/**
 * Connect to the database.
 */
//var server = new mongodb.Server('127.0.0.1', 27017);
// new mongodb.Db('my-website', server).createCollection(function(err, client){
//     //If error occurs, don't allow the app to start.
//     if (err) throw err;
//     //print out if succeed.
//     console.log('\033[96m + \033[39m connected to mongodb');
//     //set up collection shortcuts
//     app.users = new mongodb.Collection(client, 'users');
// });
var mongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017';
mongoClient.connect(url, function(err, db){
    if (err) {
        throw err;
    }
    console.log('\033[96m + \033[39m connected to mongodb');

    //set up collection shortcuts
    var users = db.collection('users');
    app.users = users;
    // users.ensureIndex('users', 'email', function(err){
    //     if (err) throw err;
    //     client.ensureIndex('users', 'password', function(err){
    //         if (err) throw err;
    //         console.log('\033[96m + \033[39m ensured indexes');
    //     });
    // });  
    users.createIndex({email: 1, password: 1}, function(err, indexName){
        if (err) throw err;
        console.log('created index');
    })

    //listen.  
    app.listen(3000, function(){
        console.log('\033[96m + \033[39m app listen on *:3000');
    });

    
});

/**
 * Signup processing route.
 */
app.post('/signup', function(req, res, next){
    app.users.insertOne(req.body.user, function(err, doc){
        if (err) return next(err);
        //console.log(doc);
        res.redirect('/login/' + doc.ops[0].email);
        //console.log(doc.ops[0]);
    });
});

/**
 * Login route.
 */
app.get('/login/:signupEmail', function(req, res){
    res.render('login', {signupEmail: req.params.signupEmail});
});

/**
 * Login process route.
 */
app.post('/login', function(req, res){
    app.users.findOne({email: req.body.user.email, password: req.body.user.password}, function(err,doc){
        if (err) return next(err);
        if (!doc) return res.send('<p>User not found. Go back and try again</p>');
        req.session.loggedIn = doc._id.toString();
        res.redirect('/');
    });
});

// /**
//  * Logout route.
//  */
app.get('/logout', function(req, res){
    req.session.loggedIn = null;
    res.redirect('/');
});
