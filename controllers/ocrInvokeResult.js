// export the controllers
exports = module.exports = function(req, res, next) {
	// create the execution command
	const cmd = req.api.type + process.config.ocr.engine+' en-US "'+req.file.path+'"';
	
	// invoke the OCR engine
	require("child_process").exec(cmd, {
		cwd: process.env.rootDIR,
		timeout: process.config.ocr.timeout,
		windowHide: true
	}, function(err, stdout, stderr) {
		// child process exec error
		if (err) {
			return next(
				"SIGTERM" == err.signal?
					process.error.parsing_timeout:
					process.error.engine_failure
			);
		}
		
		try {
			// parse the OCR result into json
			const data = /*JSON.parse(stdout)*/
			{
				err: 0, res: {
					nameInEng: "CHAN, Siu Ming",
					nameInChi: "陳小明",
					ccCode: "2867 3057 2832",
					dateOfBirth: "21-02-1987",
					HKID: "H683336(5)",
					isValid: false,
					isAdult: true
				}
			};
			
			// check error
			if (data.err) {
				return next(process.error[err]);
			}
			
			// create the OCR result response
			res.locals.returnCode = 200;
			res.locals.returnJson = process.utils.obj(
				0, "OK", data.res
			);
		}
		catch (err) {
			return next(process.error.parse_json_failure);
		}
		
		// proceed next step
		next();
	});
};