// import necessary modules
const sizeOf = require("image-size");

// export the controllers
exports = module.exports = function(req, res, next) {
	// retrieve the uploaded image dimension
	const dm = sizeOf(req.file.path);
	
	// uploaded image size not within limit
	if (
		process.config.imgSize[0] > dm.width
		|| process.config.upload.imgSize[0] > dm.height
		|| process.config.upload.imgSize[1] < dm.width
		|| process.config.upload.imgSize[1] < dm.height
	) {
		return next(process.error.exceed_resolution_limit);
	}
	
	// proceed next step
	next();
};