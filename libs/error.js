// export the error message list
exports = module.exports = {
	// server error
	other_error: [-1, "Something went wrong, please contact our IT", 503],
	redis_connection_error: [-2, "Server error, please try again", 503],
	redis_hget_error: [-3, "Server error, please try again", 503],
	redis_hmget_error: [-4, "Server error, please try again", 503],
	redis_hsetnx_error: [-5, "Server error, please try again", 503],
	
	// authorizer, usage checker
	invalid_path: [-10, "Invalid API path", 404],
	method_not_allow: [-11, "Method not allow", 405],
	missing_api_token: [-12, "Missing API token", 400],
	invalid_api_token: [-13, "Invalid API token", 400],
	incorrect_api_token: [-14, "Incorrect API token", 401],
	expired_api_token: [-15, "Expired API token", 403],
	usage_exhausted: [-16, "Usage exhausted", 406],
	inaccessible_service: [-17, "Inaccessible service", 403],
	too_many_request: [-18, "Too many requests", 429],
	
	// upload checker
	upload_failure: [-30, "File upload failure", 400],
	invalid_upload_field: [-31, "Invalid upload field", 400],
	no_upload_file: [-32, "Missing upload file", 400],
	size_exceed_limit: [-33, "File size exceed limit", 413],
	unsupported_formet: [-34, "Unsupported image formet", 400],
	exceed_resolution_limit: [-35, "Image resolution exceeds limit", 400],
	
	// OCR engine
	engine_failure: [-40, "Unable to parse the image", 504],
	parsing_timeout: [-41, "Unable to parse the image", 504],
	parse_json_failure: [-42, "Unable to parse the image", 503],
};