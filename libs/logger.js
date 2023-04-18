// export the logger library
exports = module.exports = require("simple-node-logger").createRollingFileLogger({
	errorEventName: process.config.log.level,
	dateFormat: process.config.log.dateFormat,
	fileNamePattern: process.config.log.fileNamePattern,
	logDirectory: process.env.rootDIR + process.config.log.path
});