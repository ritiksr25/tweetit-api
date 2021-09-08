// import knex
const knex = require('../knex/knex.js');
// import status codes
const { StatusCodes, Errors } = require('../enums');
// import helper functions
const { sendError, sendSuccess } = require('../utility/app.helpers');

const syncTweetTags = async (id, text) => {
	let tags = text
		.split(' ')
		.map(word => word.toLowerCase())
		.filter(word => word.startsWith('#'));
	tags = [...new Set(tags)];
	if (!tags.length) return;
	const tagsInDb = await knex('tag').whereIn('tag', tags).select('id', 'tag');
	const tagsToSave = tags
		.filter(tag => !tagsInDb.find(t => t.tag === tag))
		.map(tag => ({ tag }));
	let allTags = [...tagsInDb];
	if (tagsToSave.length) {
		const createdTags = await knex('tag').insert(tagsToSave).returning('*');
		allTags = [...allTags, ...createdTags];
	}
	const tagSaveArr = tags.map(tag => {
		return {
			tagId: allTags.filter(_tag => _tag.tag === tag)[0].id,
			tweetId: id
		};
	});
	await knex('tweet_tag').insert(tagSaveArr);
	return;
};

module.exports.tweet = async (req, res) => {
	const { text } = req.body;
	const tweet = await knex('tweet')
		.insert({
			text,
			authorId: req.user.id
		})
		.returning('*');
	await syncTweetTags(tweet[0].id, text);
	return sendSuccess(res, tweet[0]);
};
