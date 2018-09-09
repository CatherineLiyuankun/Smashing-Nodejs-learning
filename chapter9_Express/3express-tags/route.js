/**
 * Module dependencies.
 */

module.exports = function(app) {
	app.get("/hello", function(req, res, next) {
		console.log("hello");
		next();
	});
};