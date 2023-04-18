// export the controllers
exports = module.exports = function(req, res, next) {
	// no need to unlock
	if (!req.api.lock) {
		// process next step
		return next();
	}
	
	// unset the api lock
	require("../libs/redis").hdel([req.api.token, "lock"], function(error, result) {
		// redis hdel error
		if (error) {
			process.logger.error(error.stack);
			
			// TODO: send an error email to IT
		}
		
		//unset the lock
		delete req.api.lock;
		
		// proceed next step
		next();
	});
};