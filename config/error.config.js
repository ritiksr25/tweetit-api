const { sendError } = require("../utility/helpers");
const { Errors, StatusCodes } = require("../common/enums");

module.exports.catchErrors = middlewareFunction => {
	return async (req, res, next) => {
		try {
			await middlewareFunction(req, res, next);
		} catch (err) {
			next(err);
		}
	};
};

// not found routes
module.exports.notFound = (req, res) => {
	sendError(res, Errors.not_found_route, StatusCodes.NOT_FOUND);
};

module.exports.sendErrors = (err, req, res, next) => {
	//logging error for backend console
	console.log(err);
	//sending to frontend
	sendError(res, Errors.internal_error, err.status || StatusCodes.SERVER_ERROR);
};
