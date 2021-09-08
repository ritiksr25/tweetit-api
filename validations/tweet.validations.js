const { sendError } = require('../utility/app.helpers');
const { StatusCodes, Errors } = require('../enums');

module.exports.createTweetValidation = (req, res, next) => {
	const { text } = req.body;
	if (!text || String(text).trim().length > 140)
		return sendError(res, Errors.tweet_length, StatusCodes.BAD_REQUEST);
	return next();
};
