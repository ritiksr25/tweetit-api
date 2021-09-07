// import knex
const knex = require('../knex/knex.js');
// import status codes
const { StatusCodes, Errors } = require('../enums');
// import helper functions
const {
	sendError,
	sendSuccess,
	toTitleCase
} = require('../utility/app.helpers');
const {
	getHashedPassword,
	getDefaultAvatar
} = require('../utility/user.helpers.js');

module.exports.create = async (req, res) => {
	let { email, password, name, username } = req.body;
	email = String(email).toLowerCase().trim();
	password = String(password).trim();
	name = toTitleCase(String(name).trim());
	username = String(username).trim();
	const user = await knex('user')
		.where('email', email)
		.orWhere('username', username)
		.select('id')
		.first();
	if (user)
		return sendError(
			res,
			Errors.account_already_exists,
			StatusCodes.BAD_REQUEST
		);
	const hash = await getHashedPassword(password);
	const avatar = getDefaultAvatar(name);
	const _user = await knex('user')
		.insert({
			username,
			name,
			email,
			password: hash,
			avatar
		})
		.returning('*');
	sendSuccess(res, _user[0]);
};
