// export the controllers
exports = module.exports = function(req, res, next) {
	// nothing to delete
	if (!req.file) {
		// process next step
		return next();
	}
	
	// remove the uploaded file
	require("fs").unlink(req.file.path, function(error) {
		// fail to unlink the uploaded file
		if (error) {
			process.logger.error(error.stack);
			
			// TODO: send an error email to IT
		}
		
		// proceed next step
		next();
	});
};