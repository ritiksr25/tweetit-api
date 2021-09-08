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
	getDefaultAvatar,
	comparePasswords,
	generateToken
} = require('../utility/user.helpers.js');
const { setInCache, getFromCache } = require('../services/cache.service.js');

module.exports.create = async (req, res) => {
	let { email, password, name, username, avatar, bio } = req.body;
	email = String(email).toLowerCase().trim();
	password = String(password).trim();
	name = toTitleCase(String(name).trim());
	username = String(username).trim();
	bio = String(bio).trim();
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
	if (avatar) avatar = String(avatar).trim();
	else avatar = getDefaultAvatar(name);
	const _user = await knex('user')
		.insert({
			username,
			name,
			email,
			password: hash,
			avatar,
			bio
		})
		.returning('*');
	setInCache(`user:${_user[0].id}`, JSON.stringify(_user[0]));
	sendSuccess(res, _user[0]);
};

module.exports.login = async (req, res) => {
	let { email, password, username } = req.body;
	if (email) email = String(email).toLowerCase().trim();
	if (username) username = String(username).trim();
	password = String(password).trim();
	const user = await knex('user')
		.where('email', email ? email : '')
		.orWhere('username', username ? username : '')
		.select('id', 'password')
		.first();
	const isValidPwd = await comparePasswords(password, user.password);
	if (!user || !isValidPwd)
		return sendError(res, Errors.invalid_credentials, StatusCodes.BAD_REQUEST);
	const token = await generateToken(user.id);
	return sendSuccess(res, null, token);
};

module.exports.changePassword = async (req, res) => {
	const { id } = req.user;
	const { password, newPassword } = req.body;
	const user = await knex('user').where('id', id).select('password').first();
	const isValidPwd = await comparePasswords(password, user.password);
	if (!user || !isValidPwd)
		return sendError(res, Errors.old_pwd_not_matched, StatusCodes.BAD_REQUEST);
	const hash = await getHashedPassword(newPassword);
	await knex('user').where('id', id).update({ password: hash });
	sendSuccess(res, null);
};

module.exports.getProfile = async (req, res) => {
	const { userId } = req.query;
	const id = userId || req.user.id;
	const user = await knex('user')
		.where('id', id)
		.select(
			'id',
			'username',
			'name',
			'email',
			'avatar',
			'bio',
			'location',
			'created_at',
			'updated_at'
		)
		.first();
	if (!user)
		return sendError(res, Errors.user_not_found, StatusCodes.BAD_REQUEST);
	if (userId && userId !== req.user.id) {
		const following = await knex('follow')
			.select('id')
			.where('followerId', req.user.id)
			.andWhere('followingId', userId)
			.first();
		user['isFollowing'] = following ? false : true;
	}
	sendSuccess(res, user);
};

module.exports.updateProfile = async (req, res) => {
	const { id } = req.user;
	const { name, phone, location, avatar, bio } = req.body;
	let user;
	user = await getFromCache(`user:${id}`);
	if (user) user = JSON.parse(user);
	if (!user)
		user = await knex('user')
			.where('id', id)
			.select('id', 'name', 'phone', 'location', 'avatar', 'bio')
			.first();

	if (!user)
		return sendError(res, Errors.user_not_found, StatusCodes.BAD_REQUEST);
	const _user = await knex('user')
		.where('id', id)
		.update({
			name: name ? name : user.name,
			phone: phone ? phone : user.phone,
			location: location ? location : user.location,
			avatar: avatar ? avatar : user.avatar,
			bio: bio ? bio : user.bio
		})
		.returning('*');
	setInCache(`user:${id}`, JSON.stringify(_user[0]));
	sendSuccess(res, _user[0]);
};
