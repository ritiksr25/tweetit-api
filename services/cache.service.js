const { promisify } = require('util');
const redis = require('redis');
const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);

module.exports.getFromCache = async key => {
	const data = await getAsync(key);
	return data;
};

module.exports.setInCache = (key, value, expiry) => {
	if (expiry) client.setex(key, exp, value);
	else client.set(key, value);
};

module.exports.deleteFromCache = key => {
	client.del(key);
	return;
};
