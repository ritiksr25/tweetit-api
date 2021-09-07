const { StatusCodes } = require('../enums');
const { sendError, getMissingFieldError } = require('../utility/app.helpers');
const uuidRegex =
	/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

module.exports.paramAndQueryUuidValidations = (req, res, next) => {
	const params = req.params;
	for (let i = 0; i < Object.values(params).length; i++) {
		const param = Object.values(params)[i];
		if (param && !uuidRegex.test(param)) {
			return sendError(
				res,
				getMissingFieldError(Object.keys(params)[i]),
				StatusCodes.BAD_REQUEST
			);
		}
	}
	const queries = req.query;
	for (let i = 0; i < Object.values(queries).length; i++) {
		const query = Object.values(queries)[i];
		if (query && !uuidRegex.test(param)) {
			return sendError(
				res,
				getMissingFieldError(Object.keys(queries)[i]),
				StatusCodes.BAD_REQUEST
			);
		}
	}
	return next();
};

module.exports.paginationValidations = (req, res, next) => {
	const { page, perPage } = req.query;
	if (page && !isNaN(page)) req.query.page = parseInt(page);
	if (perPage && !isNaN(perPage)) req.query.perPage = parseInt(perPage);
	return next();
};
