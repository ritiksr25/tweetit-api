const bcrypt = require('bcryptjs');

module.exports.getHashedPassword = async password => {
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);
	return hash;
};

module.exports.getDefaultAvatar = name =>
	`https://i2.wp.com/ui-avatars.com/api//${name}/128/random`;
