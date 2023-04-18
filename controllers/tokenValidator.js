// regex pattern
const regex_token = new RegExp("^[a-z0-9]{64}$");

// export the controllers
exports = module.exports = function(req, res, next) {
	// retrieve API token in header
	req.api = {
		token: req.get("X-API-Key")
	};
	
	// check token
	if (req.get("X-API-Key") === undefined) {
		return next(process.error.missing_api_token);
	}
	
	// validate token
	if (!regex_token.test(req.api.token)) {
		return next(process.error.invalid_api_token);
	}
	
	// process next step
	next();
};