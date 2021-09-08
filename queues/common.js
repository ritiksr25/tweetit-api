const { RedisConfig } = require('../config/redis.config');

module.exports.redisConfigObj = {
	host: RedisConfig.host,
	port: RedisConfig.port,
	password: RedisConfig.password
};
