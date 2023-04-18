// export the controllers
exports = module.exports = function(req, res, next) {
	const now = process.utils.now();
	
	// limit the rate
	require("../libs/redis").hsetnx([req.api.token, "lock", now], function(err, result) {
		// redis set error
		if (err) {
			return next(process.error.redis_hsetnx_error);
		}
		
		// exceeded the rate
		if (!result) {
			return next(process.error.too_many_request);
		}
		
		// set up the lock
		req.api.lock = now;
		
		// proceed next step
		next();
	});
};