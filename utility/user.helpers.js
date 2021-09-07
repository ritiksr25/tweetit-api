const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JwtConfig } = require('../config/jwt.config');
const { generateHash } = require('./app.helpers');

module.exports.getHashedPassword = async password => {
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);
	return hash;
};

module.exports.getDefaultAvatar = name =>
	`https://i2.wp.com/ui-avatars.com/api//${name}/128/random`;

module.exports.comparePasswords = async (password, hash) => {
	const isMatch = await bcrypt.compare(password, hash);
	return isMatch;
};

module.exports.generateToken = async id => {
	const token = await jwt.sign({ id }, JwtConfig.JWT_PRIVATE_KEY, {
		algorithm: JwtConfig.JWT_ALGORITHM,
		issuer: JwtConfig.JWT_ISSUER,
		audience: JwtConfig.JWT_AUDIENCE,
		jwtid: generateHash(10)
	});
	return token;
};
