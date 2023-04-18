// import necessary modules
const router = require("express").Router();

// to be delete
const dummy_token = "8e35c2cd3bf6641bdb0e2050b76932cbb2e6034a0ddacc1d9bea82a6ba57f7cf";

// services end points
const OCR_SERVICE = {
	HKID: "/ocr/v1/hkid"
};

// all involved controllers
const
	allowCorsHeader = require("../controllers/allowCorsHeader"),
	preflightResult = require("../controllers/preflightResult"),
	tokenValidator = require("../controllers/tokenValidator"),
	tokenVerifier = require("../controllers/tokenVerifier"),
	apiUsageChecker = require("../controllers/apiUsageChecker"),
	apiUsageLimiter = require("../controllers/apiUsageLimiter"),
	imgFileUploader = require("../controllers/imgFileUploader"),
	imgFileVerifier = require("../controllers/imgFileVerifier"),
	ocrInvokeResult = require("../controllers/ocrInvokeResult"),
	errorController = require("../controllers/errorController"),
	imgFileUnlinker = require("../controllers/imgFileUnlinker"),
	apiUsageUpdater = require("../controllers/apiUsageUpdater"),
	apiLockReleaser = require("../controllers/apiLockReleaser"),
	badMethodResult = require("../controllers/badMethodResult"),
	routes404Result = require("../controllers/routes404Result"),
	resultResponder = require("../controllers/resultResponder");

// setup routes
router.use(allowCorsHeader);

// pre-flight path
router.options("*", [
	preflightResult,
	resultResponder
]);

// OCR for HKID
router.post(OCR_SERVICE.HKID, [
	tokenValidator, tokenVerifier,
	apiUsageChecker, apiUsageLimiter,
	imgFileUploader, imgFileVerifier,
	ocrInvokeResult,
	errorController,
	imgFileUnlinker, apiUsageUpdater, apiLockReleaser,
	resultResponder
]);

// route for bad methods
router.all(Object.values(OCR_SERVICE), [
	badMethodResult,
	resultResponder
]);

// inexisted path
router.use("*", [
	routes404Result,
	resultResponder
]);

// export the router
exports = module.exports = router;