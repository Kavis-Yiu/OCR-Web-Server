const config = require("./config");

// process environment settings
process.env.rootDIR = __dirname;
process.env.NODE_ENV = config.env;
process.env.APP_URL = config.server.url("https");

process.config = config;
process.error = require("./libs/error");
process.logger = require("./libs/logger");
process.title = config.server.title + process.env.APP_URL;
process.utils = require("./libs/utils");

// import neccessary modules
const express = require("express");
const app = express();
const fs = require("fs");

// process exception controller
process.on("uncaughtException", process.logger.error);

// application settings
app.set("etag", false); // disable etag in header
app.set("trust proxy", true); // for getting the correct IP
app.set("x-powered-by", false); // disable x-powered-by in header

// application controllers
app.use(express.json());
app.use(express.urlencoded({
	extended: false
}));

// application routes
app.use(require("./routes"));

// create the HTTPS server
require("https").createServer({
	// fetch the cert and key for SSL
	key: fs.readFileSync(__dirname + config.server.keyFile),
	cert: fs.readFileSync(__dirname + config.server.crtFile)
}, app).listen(config.server.port, function() {
	// server started
	process.logger.info("Started - "+process.env.APP_URL);
});