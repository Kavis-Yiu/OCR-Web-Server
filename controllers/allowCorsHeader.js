// export the controllers
exports = module.exports = function(req, res, next) {
	// allow CORS
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-API-Key");
	res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	
	// process next step
	next();
};