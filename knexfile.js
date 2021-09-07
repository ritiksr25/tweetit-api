require('dotenv').config();
module.exports = {
	development: {
		client: 'postgresql',
		connection: {
			host: process.env.PG_DEV_HOST,
			database: process.env.PG_DEV_DB,
			user: process.env.PG_DEV_USER,
			password: process.env.PG_DEV_PASSWORD,
			charset: 'utf8'
		}
	},

	staging: {
		client: 'postgresql',
		connection: {
			host: process.env.PG_STAGING_HOST,
			database: process.env.PG_STAGING_DB,
			user: process.env.PG_STAGING_USER,
			password: process.env.PG_STAGING_PASSWORD,
			charset: 'utf8'
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: 'knex_migrations'
		}
	},

	production: {
		client: 'postgresql',
		connection: {
			host: process.env.PG_PROD_HOST,
			database: process.env.PG_PROD_DB,
			user: process.env.PG_PROD_USER,
			password: process.env.PG_PROD_PASSWORD,
			charset: 'utf8'
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: 'knex_migrations'
		}
	}
};
