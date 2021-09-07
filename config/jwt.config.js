require('dotenv').config();

module.exports.JwtConfig = {
	JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
	JWT_ALGORITHM: process.env.JWT_ALGORITHM,
	JWT_ISSUER: process.env.JWT_ALGORITHM,
	JWT_AUDIENCE: process.env.JWT_ALGORITHM
};
