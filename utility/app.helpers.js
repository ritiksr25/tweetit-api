const { StatusCodes } = require('../enums');
const { AppConfig } = require('../config/app.config');

module.exports.getMissingFieldError = field =>
	`Please provide a valid ${field}`;

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

module.exports.generateHash = length => {
	let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let code = '';
	for (let i = 0; i < length; i++) {
		code += chars[Math.round(Math.random() * (chars.length - 1))];
	}
	return code;
};

const NS_PER_SEC = 1e9;
const NS_TO_MS = 1e6;

module.exports.formatHrTime = hrt => {
	return (hrt[0] * NS_PER_SEC + hrt[1]) / NS_TO_MS;
};
