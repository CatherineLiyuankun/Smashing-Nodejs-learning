/**
 * Module dependencies.
 */

exports.home = function(req, res, next) {
	console.log(req.url);
	res.end("<b>"+req.url+"</b>");
	next();
};
exports.search = function(req, res) {
	console.log(req.url);

};
exports.create = function(req, res) {
	console.log(req.url);
};