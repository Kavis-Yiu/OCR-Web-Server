const error = process.error;

// export the controllers
exports = module.exports = function(req, res, next) {
	// create method not allow error result
	res.locals.returnCode = error.method_not_allow[2];
	res.locals.returnJson = process.utils.obj(
		error.method_not_allow[0], error.method_not_allow[1]
	);
	
	// process next step
	next();
};