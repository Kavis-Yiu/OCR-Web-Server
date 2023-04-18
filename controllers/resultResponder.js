// export the controllers
exports = module.exports = function(req, res) {
	// send the result in json
	res.status(
		res.locals.returnCode
	).json(
		res.locals.returnJson
	);
	
	// log the output for development
	process.logger.info(
		req.method+" "+req.originalUrl.split("?").shift()+(
			req.api? " "+JSON.stringify(req.api): ""
		)
	);
	process.logger.info(
		"RESPONSE"+" "+res.locals.returnCode+" - "+(
			"OPTIONS" === req.method?
				"Pre-Flight Response OK":
				JSON.stringify(res.locals.returnJson)
		)
	);
};