// import knex
const knex = require('../knex/knex.js');
// import helper functions
const { sendError, sendSuccess } = require('../utility/app.helpers');
const { createSyncTweetTagsJob } = require('../queues/tweet/tweet.queue.js');

module.exports.tweet = async (req, res) => {
	const { text } = req.body;
	const tweet = await knex('tweet')
		.insert({
			text,
			authorId: req.user.id
		})
		.returning('*');
	await createSyncTweetTagsJob({ id: tweet[0].id, text });
	return sendSuccess(res, tweet[0]);
};

module.exports.getTweets = async (req, res) => {
	const tweets = await knex('tweet')
		.leftJoin('user', 'tweet.authorId', 'user.id')
		.select(
			'tweet.id',
			'text',
			'isPinned',
			'authorId',
			'tweet.created_at',
			'username',
			'avatar',
			'name',
			'location',
			'bio'
		)
		.whereIn(
			'tweet.authorId',
			knex('follow')
				.select('follow.followingId')
				.where('followerId', req.user.id)
		)
		.orderBy('tweet.created_at', 'desc');
	return sendSuccess(res, tweets);
};

module.exports.getUserTweets = async (req, res) => {
	const { userId } = req.query;
	const authorId = userId || req.user.id;
	const tweets = await knex('tweet')
		.select('id', 'text', 'isPinned', 'created_at')
		.where('authorId', authorId)
		.orderBy('tweet.created_at', 'desc');
	return sendSuccess(res, tweets);
};
