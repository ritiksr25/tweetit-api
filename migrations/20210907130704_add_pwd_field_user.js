exports.up = async function (knex) {
	await knex.schema.table('user', table => {
		table.string('password');
	});
	return;
};

exports.down = async function (knex) {
	await knex.schema.table('user', table => {
		table.dropColumn('password');
	});
};
