// import knex
const knex = require('../knex/knex.js');
// import status codes
const { StatusCodes, Errors } = require('../enums');
// import helper functions
const { sendError, sendSuccess } = require('../utility/app.helpers');
const { isUserFollowingOrFollower } = require('../utility/follow.helpers.js');

module.exports.toggleFollow = async (req, res) => {
	const { followingId } = req.params;
	const { id } = req.user;
	const follow = await knex('follow')
		.where('followerId', id)
		.andWhere('followingId', followingId)
		.select('id')
		.first();
	if (follow) {
		await knex('follow').del().where('id', follow.id);
		return sendSuccess(res, null);
	}
	await knex('follow').insert({
		followerId: id,
		followingId: followingId
	});
	return sendSuccess(res, null);
};

module.exports.getFollowers = async (req, res) => {
	const { userId } = req.params;
	const { page = 1, perPage = 20 } = req.query;
	const offset = (page - 1) * perPage;
	if (userId !== req.user.id) {
		const _isUserFollowingOrFollower = await isUserFollowingOrFollower(
			req.user.id,
			userId
		);
		if (!_isUserFollowingOrFollower)
			return sendError(res, Errors.access_denied, StatusCodes.NOT_AUTHORIZED);
	}
	const pagination = {};
	const totalFollowers = await knex('follow').count('* as count').first();
	const followers = await knex('follow')
		.where('followingId', userId)
		.leftJoin('user', 'follow.followerId', 'user.id')
		.select('follow.id', 'user.id', 'user.name', 'user.username', 'user.avatar')
		.orderBy([{ createdAt: 'desc' }])
		.offset(offset)
		.limit(perPage);
	pagination.totalCount = totalFollowers.count;
	pagination.perPage = perPage;
	pagination.page = page;
	pagination.totalPages = Math.ceil(totalFollowers.count / perPage);

	return sendSuccess(res, { followers, pagination });
};

module.exports.getFollowing = async (req, res) => {
	const { userId } = req.params;
	const { page = 1, perPage = 20 } = req.query;
	const offset = (page - 1) * perPage;
	if (userId !== req.user.id) {
		const isUserFollowingOrFollower = await isUserFollowingOrFollower(
			req.user.id,
			userId
		);
		if (!isUserFollowingOrFollower)
			return sendError(res, Errors.access_denied, StatusCodes.NOT_AUTHORIZED);
	}
	const pagination = {};
	const totalFollowers = await knex('follow').count('* as count').first();
	const following = await knex('follow')
		.where('followerId', userId)
		.leftJoin('user', 'follow.followingId', 'user.id')
		.select('follow.id', 'user.id', 'user.name', 'user.username', 'user.avatar')
		.orderBy([{ createdAt: 'desc' }])
		.offset(offset)
		.limit(perPage);
	pagination.totalCount = totalFollowers.count;
	pagination.perPage = perPage;
	pagination.page = page;
	pagination.totalPages = Math.ceil(totalFollowers.count / perPage);

	return sendSuccess(res, { following, pagination });
};
