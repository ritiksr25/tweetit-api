exports.up = async function (knex) {
	await knex.schema.createTable('tweet_tag', table => {
		table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
		table.uuid('tagId').notNullable();
		table.uuid('tweetId').notNullable();
		table.foreign('tagId').references('tag.id').onDelete('NO ACTION');
		table.foreign('tweetId').references('tweet.id').onDelete('CASCADE');
		table.timestamps(true, true);
	});
};

exports.down = async function (knex) {
	await knex.schema.dropTableIfExists('tweet_tag');
};
