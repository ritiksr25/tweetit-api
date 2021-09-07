const { sendError, getMissingFieldError } = require('../utility/app.helpers');
const { StatusCodes, Errors } = require('../enums');

const emailRegex = /^\S+@\S+\.\S+/,
	passwordRegex = /^[\S]{8,}/,
	phoneRegex = /(^[6-9]{1}[0-9]{9}$)/,
	urlRegex =
		/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)$/;

module.exports.createUserValidation = (req, res, next) => {
	const { name, email, username, password, avatar } = req.body;
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
		return sendError(res, Errors.invalid_pwd, StatusCodes.BAD_REQUEST);
	if (avatar && !urlRegex.test(String(avatar).trim()))
		return sendError(
			res,
			getMissingFieldError('avatar url'),
			StatusCodes.BAD_REQUEST
		);
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

module.exports.changePasswordValidation = (req, res, next) => {
	const { password, newPassword } = req.body;
	if (!password || !passwordRegex.test(String(password).trim()))
		return sendError(res, Errors.invalid_pwd, StatusCodes.BAD_REQUEST);
	if (!newPassword || !passwordRegex.test(String(newPassword).trim()))
		return sendError(res, Errors.invalid_pwd, StatusCodes.BAD_REQUEST);
	if (String(password).trim() === String(newPassword).trim())
		return sendError(res, Errors.same_pwd, StatusCodes.BAD_REQUEST);
	return next();
};

module.exports.updateUserValidation = (req, res, next) => {
	const { phone, avatar } = req.body;
	if (phone && !phoneRegex.test(String(phone).trim()))
		return sendError(
			res,
			getMissingFieldError('phone'),
			StatusCodes.BAD_REQUEST
		);
	if (avatar && !urlRegex.test(String(avatar).trim()))
		return sendError(
			res,
			getMissingFieldError('avatar url'),
			StatusCodes.BAD_REQUEST
		);
	return next();
};
