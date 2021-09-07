const express = require('express');
const router = express.Router();
// controllers
const {
	toggleFollow,
	getFollowers,
	getFollowing
} = require('../../../controllers/follow.controllers');
// middlewares
const { catchErrors } = require('../../../config/error.config');
const { userAuth } = require('../../../middlewares');
// validations
const {
	paginationValidations,
	paramAndQueryUuidValidations
} = require('../../../validations/common.validations');
// routes
router.post('/toggle-follow/:followingId', userAuth, catchErrors(toggleFollow));
router.get(
	'/get-followers/:userId',
	userAuth,
	paramAndQueryUuidValidations,
	paginationValidations,
	catchErrors(getFollowers)
);
router.get(
	'/get-following/:userId',
	userAuth,
	paramAndQueryUuidValidations,
	paginationValidations,
	catchErrors(getFollowing)
);

// export router
module.exports = router;
