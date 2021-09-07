// import knex
const knex = require('../knex/knex.js');
// import status codes
const { StatusCodes, Errors } = require('../enums');
// import helper functions
const { sendError, sendSuccess } = require('../utility/app.helpers');

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
