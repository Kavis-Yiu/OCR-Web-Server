const error = process.error;

// export the controllers
exports = module.exports = function(req, res, next) {
	// create invalid path error result
	res.locals.returnCode = error.invalid_path[2];
	res.locals.returnJson = process.utils.obj(
		error.invalid_path[0], error.invalid_path[1]
	);
	
	// process next step
	next();
};