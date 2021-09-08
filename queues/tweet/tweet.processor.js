// import knex
const knex = require('../../knex/knex.js');

module.exports.syncTweetTags = async ({ id, text }) => {
	let tags = text
		.split(' ')
		.map(word => word.toLowerCase())
		.filter(word => word.startsWith('#'));
	tags = [...new Set(tags)];
	if (!tags.length) return;
	const tagsInDb = await knex('tag').whereIn('tag', tags).select('id', 'tag');
	if (tagsInDb.length)
		await knex('tag')
			.increment('hits', 1)
			.whereIn(
				'id',
				tagsInDb.map(tag => tag.id)
			);
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
	return allTags;
};
