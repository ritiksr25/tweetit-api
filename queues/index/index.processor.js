// import knex
const knex = require('../../knex/knex.js');

module.exports.syncLastActive = async ({ id }) => {
	await knex('user')
		.update({ last_active_at: new Date().toISOString() })
		.where(id, id);
	return;
};
