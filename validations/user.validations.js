const { sendError, getMissingFieldError } = require('../utility/app.helpers');
const { StatusCodes, Errors } = require('../enums');

const emailRegex = /^\S+@\S+\.\S+/,
	passwordRegex = /^[\S]{8,}/;

module.exports.createUserValidation = (req, res, next) => {
	const { name, email, username, password } = req.body;
	if (!name)
		return sendError(
			res,
			getMissingFieldError('name'),
			StatusCodes.BAD_REQUEST
		);
	if (!email || !emailRegex.test(String(email).trim()))
		return sendError(
			res,
			getMissingFieldError('email'),
			StatusCodes.BAD_REQUEST
		);
	if (!username)
		return sendError(res, getMissingFieldError('username'), StatusCodes.B);
	if (!password || !passwordRegex.test(String(password).trim()))
		return sendError(res, Errors.invalid_pwd, StatusCodes.B);
	return next();
};

module.exports.loginUserValidation = (req, res, next) => {
	const { email, password, username } = req.body;
	if (!username && !email)
		return sendError(res, Errors.invalid_credentials, StatusCodes.BAD_REQUEST);
	if (email && !emailRegex.test(String(email).trim()))
		return sendError(res, Errors.invalid_credentials, StatusCodes.BAD_REQUEST);
	if (!password || !passwordRegex.test(String(password).trim()))
		return sendError(res, Errors.invalid_credentials, StatusCodes.BAD_REQUEST);
	return next();
};
