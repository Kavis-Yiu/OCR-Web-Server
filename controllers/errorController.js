// export the controllers
exports = module.exports = function(err, req, res, next) {
	// check error type
	if (err instanceof require("multer").MulterError) {
		// create file upload error result
		switch (err.code) {
			case "LIMIT_UNEXPECTED_FILE": {
				res.locals.returnCode = process.error.invalid_upload_field[2];
				res.locals.returnJson = process.utils.obj(
					process.error.invalid_upload_field[0], process.error.invalid_upload_field[1]
				);
			}; break;
			case "LIMIT_FILE_SIZE": {
				res.locals.returnCode = process.error.size_exceed_limit[2];
				res.locals.returnJson = process.utils.obj(
					process.error.size_exceed_limit[0], process.error.size_exceed_limit[1]
				);
			}; break;
			default: {
				res.locals.returnCode = process.error.upload_failure[2];
				res.locals.returnJson = process.utils.obj(
					process.error.upload_failure[0], process.error.upload_failure[1]
				);
			};
		}
	}
	else if (err instanceof Error) {
		// log the other system error
		process.logger.error(err.stack);
		
		// TODO: send an error email to IT
		
		// create other system error result
		res.locals.returnCode = process.error.other_error[2];
		res.locals.returnJson = process.utils.obj(
			process.error.other_error[0], process.error.other_error[1]
		);
	}
	else {
		// create custom error result
		res.locals.returnCode = err[2];
		res.locals.returnJson = process.utils.obj(err[0], err[1]);
	}
	
	// proceed next step
	next();
};