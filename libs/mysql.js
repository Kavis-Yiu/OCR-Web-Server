// export the mysql library
exports = module.exports = require("mysql").createPool({
	host: process.config.mysql.hostname,
	user: process.config.mysql.username,
	password: process.config.mysql.password,
	database: process.config.mysql.database,
	port: process.config.mysql.port,
	timezone: process.config.mysql.timezone,
	connectionLimit: process.config.mysql.conLimit,
	dateStrings: true
});