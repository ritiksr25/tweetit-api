require('dotenv').config();

module.exports.RedisConfig = {
	url: process.env.REDIS_URL,
	host: process.env.REDIS_HOST,
	port: process.env.REDIS_PORT,
	password: process.env.REDIS_PASSWORD
};
