exports.up = async function (knex) {
	await knex.raw('create extension if not exists "uuid-ossp"');
	await knex.schema.createTable('user', table => {
		table
			.uuid('id')
			.defaultTo(knex.raw('uuid_generate_v4()'), { primaryKey: true });
		table.string('username').unique().notNullable();
		table.string('name').notNullable();
		table.string('email').unique().notNullable();
		table.string('phone');
		table.string('location');
		table.string('avatar');
		table.string('bio');
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	await knex.raw('drop extension if exists "uuid-ossp"');
	await knex.schema.dropTable('user');
};
