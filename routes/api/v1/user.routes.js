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

// routes
router.post('/', createUserValidation, catchErrors(create));
router.post('/login', loginUserValidation, catchErrors(login));
router.post(
	'/change-pwd',
	userAuth,
	changePasswordValidation,
	catchErrors(changePassword)
);
router.post(
	'/change-pwd',
	userAuth,
	changePasswordValidation,
	catchErrors(changePassword)
);
router.get('/profile', userAuth, catchErrors(getProfile));
router.post(
	'/profile',
	userAuth,
	updateUserValidation,
	catchErrors(updateProfile)
);

// export router
module.exports = router;
