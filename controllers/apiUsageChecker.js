// export the controllers
exports = module.exports = function(req, res, next) {
	// check api usage status
	require("../libs/redis").hmget([req.api.token, "usage", "access"], function(err, result) {
		// redis hget error
		if (err) {
			return next(process.error.redis_hmget_error);
		}
		
		req.api.usage = parseInt(result[0]);
		
		// usage exhausted
		if (req.api.usage <= 0) {
			// TODO: send an email to ask if they want to top up the usage
			
			return next(process.error.usage_exhausted);
		}
		
		// retrieve OCR type
		req.api.type = req.path.substr(req.path.lastIndexOf("/") + 1);
		
		// inaccessible OCR service
		if (result[1].indexOf(req.api.type) < 0) {
			// TODO: send an email to ask if they want to add OCR service type
			
			return next(process.error.inaccessible_service);
		}
		
		// proceed next step
		next();
	});
};