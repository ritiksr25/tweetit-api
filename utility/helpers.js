const { StatusCodes } = require('../common/enums');
const { AppConfig } = require('../config/app.config');

module.exports.sendError = (res, message, status) => {
	return res.status(status).json({
		statusCode: status,
		message,
		error: true,
		data: null
	});
};

module.exports.sendSuccess = (res, data, token) => {
	if (token) {
		return res
			.status(StatusCodes.OK)
			.header(AppConfig.TOKEN_HEADER, token)
			.json({
				statusCode: StatusCodes.OK,
				message: 'success',
				error: false,
				data
			});
	}
	res.status(StatusCodes.OK).json({
		statusCode: StatusCodes.OK,
		message: 'success',
		error: false,
		data
	});
};

module.exports.toTitleCase = str => {
	return str
		.toLowerCase()
		.split(' ')
		.map(word => {
			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join(' ');
};
