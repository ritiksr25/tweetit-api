exports.up = async function (knex) {
	await knex.schema.table('user', table => {
		table.timestamp('last_active_at');
	});
	return;
};

exports.down = async function (knex) {
	await knex.schema.table('user', table => {
		table.dropColumn('last_active_at');
	});
};
