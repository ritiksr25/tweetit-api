const express = require('express');
const router = express.Router();
// controllers
const {
	create,
	login,
	changePassword,
	getProfile,
	updateProfile
} = require('../../../controllers/user.controllers');
// middlewares
const { catchErrors } = require('../../../config/error.config');
const { userAuth } = require('../../../middlewares');
// validations
const {
	createUserValidation,
	loginUserValidation,
	changePasswordValidation,
	updateUserValidation
} = require('../../../validations/user.validations');
const {
	paramAndQueryUuidValidations
} = require('../../../validations/common.validations');
const {
	loginRateLimiter,
	changePasswordRateLimiter,
	updateProfileRateLimiter
} = require('../../../middlewares/ratelimit.middlewares');

// routes
router.post('/', createUserValidation, catchErrors(create));
router.post(
	'/login',
	loginRateLimiter,
	loginUserValidation,
	catchErrors(login)
);
router.post(
	'/change-pwd',
	changePasswordRateLimiter,
	changePasswordValidation,
	userAuth,
	catchErrors(changePassword)
);
router.get(
	'/profile',
	paramAndQueryUuidValidations,
	userAuth,
	catchErrors(getProfile)
);
router.post(
	'/profile',
	updateProfileRateLimiter,
	updateUserValidation,
	userAuth,
	catchErrors(updateProfile)
);

// export router
module.exports = router;
