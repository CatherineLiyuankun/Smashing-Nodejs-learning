/**
 * Module dependencies.
 */
// path模块可以不用
var express = require('express'),
	blog = require('./blog'),
	pages = require('./pages'),
	tags = require('./tags'),
	route = require('./route'),
	// path = require('path'),
	http = require('http');

var app = express();
console.log("hey");
console.log(__dirname);
console.log(__dirname+"\\public");
// console.log(path.join(__dirname, 'public'));
console.log("hey");
app.use(express.static(__dirname, ''));
// app.use(express.static(__dirname, 'public'));
// app.use(express.static(path.join(__dirname, 'public')));

//blog route
app.get("/blog", blog.home);
app.get("/blog/search", blog.search);
app.get("/blog/create", blog.create);
//pages route
app.get("/pages", pages.home);
app.get("/pages/list", pages.list);
//tags route
app.get("/tags", tags.home);
app.get("/tags/search", tags.search);
// 路由控制
route(app);
// http.createServer(app).listen(3000);
app.listen(3000);