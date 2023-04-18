// export the redis library
exports = module.exports = require("redis").createClient({
	host: process.config.redis.hostname,
	port: process.config.redis.port
});