// import necessary modules
const multer = require("multer");

// regex pattern
const regex_file_type = new RegExp("("+process.config.upload.format.join("|")+")");

// export the controllers
exports = module.exports = multer({
	dest: process.env.rootDIR + process.config.upload.path,
	limit: {
		fields: 0, files: 1,
		fileSize: process.config.upload.fileSize
	},
	fileFilter: function(req, file, cb) {
		// no upload file
		if (!file) {
			return cb(process.error.no_upload_file);
		}
		
		// uploaded file type not supported
		if (
			file.mimetype.indexOf("image") < 0
			|| !regex_file_type.test(file.mimetype)
		) {
			return cb(process.error.unsupported_formet);
		}
		
		// process following step
		cb(null, true);
		
	}
}).single(process.config.upload.field);