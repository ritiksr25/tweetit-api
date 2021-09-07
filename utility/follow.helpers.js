// import knex
const knex = require('../knex/knex.js');

module.exports.isUserFollowingOrFollower = async (userId, otherUserId) => {
	const isUserFollowingOrFollower = await knex('follow')
		.select('follow.id')
		.whereRaw(
			'("followerId" = :userId and "followingId" = :otherUserId) or ("followerId" = :otherUserId and "followingId" = :userId)',
			{ userId, otherUserId }
		)
		.first();
	return isUserFollowingOrFollower;
};
