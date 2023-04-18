// export the controllers
exports = module.exports = function(req, res, next) {
	// check if token exist in redis
	require("../libs/redis").hget([req.api.token, "valid"], function(err, valid) {
		// redis hget error
		if (err) {
			return next(process.error.redis_hget_error);
		}
		
		// inexisted token
		if (valid == null) {
			return next(process.error.incorrect_api_token);
		}
		
		// expired token
		if (parseInt(valid) < process.utils.now()) {
			// TODO: send an email to ask if they want to re-new the token
			
			return next(process.error.expired_api_token);
		}
		
		// proceed next step
		next();
	});
};