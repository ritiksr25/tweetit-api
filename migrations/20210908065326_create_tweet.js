exports.up = async function (knex) {
	await knex.schema.createTable('tweet', table => {
		table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
		table.string('text', 140).notNullable();
		table.boolean('isPinned').defaultTo(false);
		table.uuid('authorId').notNullable();
		table.foreign('authorId').references('user.id').onDelete('CASCADE');
		table.timestamps(true, true);
	});
};

exports.down = async function (knex) {
	await knex.schema.dropTableIfExists('tweet');
};
