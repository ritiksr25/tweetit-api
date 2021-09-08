exports.up = async function (knex) {
	await knex.schema.alterTable('tag', table => {
		table.integer('hits').defaultsTo(1).alter();
	});
	return;
};

exports.down = async function (knex) {
	await knex.schema.alterTable('tag', table => {
		table.integer('hits').defaultsTo(1).alter();
	});
};
