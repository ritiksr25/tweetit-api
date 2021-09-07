const { AppConfig } = require('../config/app.config');
const { Errors, StatusCodes } = require('../enums');
const { verifyToken } = require('../utility/user.helpers');

module.exports.userAuth = async (req, res, next) => {
	const token = req.header(AppConfig.TOKEN_HEADER);
	if (!token)
		return sendError(res, Errors.access_denied, StatusCodes.NOT_AUTHORIZED);
	try {
		const decodedPayload = verifyToken(token);
		req.user = decodedPayload;
		return next();
	} catch (err) {
		console.log(err.message);
		return sendError(res, Errors.access_denied, StatusCodes.NOT_AUTHORIZED);
	}
};
