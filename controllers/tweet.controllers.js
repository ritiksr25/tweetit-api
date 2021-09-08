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

module.exports.togglePinTweet = async (req, res) => {
	const { tweetId } = req.params;
	const tweet = await knex('tweet')
		.update({
			isPinned: knex.raw('NOT ??', ['isPinned'])
		})
		.where('id', tweetId)
		.andWhere('authorId', req.user.id)
		.returning('id', 'isPinned');

	return sendSuccess(res, tweet);
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
		.orderBy('tweet.isPinned', 'desc')
		.orderBy('tweet.created_at', 'desc');
	return sendSuccess(res, tweets);
};

module.exports.getTags = async (req, res) => {
	const tags = await knex('tag')
		.select('id', 'tag', 'hits')
		.orderBy('hits', 'desc');
	return sendSuccess(res, tags);
};

module.exports.getTweetsByTag = async (req, res) => {
	const { tagId } = req.params;
	const tweets = await knex('tweet')
		.leftJoin('user', 'tweet.authorId', 'user.id')
		.whereIn(
			'tweet.id',
			knex('tweet_tag').select('tweetId').where('tagId', tagId)
		)
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
		);
	return sendSuccess(res, tweets);
};
