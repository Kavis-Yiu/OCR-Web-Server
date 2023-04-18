exports = module.exports = {
	env: "dev", // [dev|uat|production]
	server: {
		title: "OCR API Server - ",
		hostname: "127.0.0.1",
		port: 8443,
		crtFile: "/certs/server.crt",
		keyFile: "/certs/server.key",
		url: function(protocol) {
			return protocol+"://"+this.hostname+":"+this.port;
		}
	},
	
	// library configs
	logger: require("./logger"),
	mysql: require("./mysql"),
	ocr: require("./ocr"),
	redis: require("./redis"),
	upload: require("./multer")
};