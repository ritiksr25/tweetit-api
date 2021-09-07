exports.up = async function (knex) {
    await knex.schema.alterTable('user', table => {
        table.primary('id');
    })
	await knex.schema.table('follow', table => {
		table
			.foreign('followerId')
			.references('user.id')
			.onDelete('CASCADE')
			.onUpdate('CASCADE');
		table
			.foreign('followingId')
			.references('user.id')
			.onDelete('CASCADE')
			.onUpdate('CASCADE');
	});
	return;
};

exports.down = async function (knex) {
	await knex.schema.alterTable('user', table => {
        table.dropPrimary();
    })
    await knex.schema.table('follow', table => {
		table.dropForeign('followerId');
		table.dropForeign('followingId');
	});

};
