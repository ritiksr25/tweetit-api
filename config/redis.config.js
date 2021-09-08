const url = require('url');
require('dotenv').config();

const redisURL = url.parse(process.env.REDIS_URL);
const RedisConfig = {
	url: process.env.REDIS_URL,
	host: redisURL.hostname,
	port: redisURL.port
};

if (redisURL.auth) RedisConfig.password = redisURL.auth.split(':')[1];
module.exports.RedisConfig = RedisConfig;
