// export the controllers
exports = module.exports = function(req, res, next) {
	// no need to update usage
	if (!req.api.lock) {
		// process next step
		return next();
	}
	
	// reduce the usage by 1
	require("../libs/redis").hset([req.api.token, "usage", req.api.usage - 1], function(error, result) {
		// redis hset error
		if (error) {
			process.logger.error(error.stack);
			
			// TODO: send an error email to IT
		}
		
		// proceed next step
		next();
	});
};