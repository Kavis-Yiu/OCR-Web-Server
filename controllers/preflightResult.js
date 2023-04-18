// export the controllers
exports = module.exports = function(req, res, next) {
	// set the pre-flight response
	res.locals.returnCode = 204;
	
	// process next step
	next();
};