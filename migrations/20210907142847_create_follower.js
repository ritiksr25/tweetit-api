exports.up = async function (knex) {
	await knex.schema.createTable('follow', table => {
		table
			.uuid('id')
			.defaultTo(knex.raw('uuid_generate_v4()'), { primaryKey: true });
		table.uuid('followingId').notNullable();
		table.uuid('followerId').notNullable();
		table.timestamps(true, true);
	});
	return;
};

exports.down = async function (knex) {
	await knex.schema.dropTableIfExists('follow');
	return;
};
