exports.up = async function (knex) {
	await knex.schema.createTable('tag', table => {
		table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
		table.string('tag').notNullable();
		table.integer('hits').defaultTo(0);
		table.timestamps(true, true);
	});
};

exports.down = async function (knex) {
	await knex.schema.dropTableIfExists('tag');
};
