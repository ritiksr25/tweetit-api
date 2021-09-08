const { promisify } = require('util');
const redis = require('redis');
const { RedisConfig } = require('../config/redis.config');

const client = redis.createClient({ url: RedisConfig.url });
client.on('error', function (error) {
	console.error(error);
});
const getAsync = promisify(client.get).bind(client);

module.exports.getFromCache = async key => {
	const data = await getAsync(key);
	return data;
};

module.exports.setInCache = (key, value, expiry) => {
	if (expiry) client.setex(key, expiry, value);
	else client.set(key, value);
};

module.exports.deleteFromCache = key => {
	client.del(key);
	return;
};
