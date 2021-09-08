const express = require('express');
const router = express.Router();
// controllers
const {
	tweet,
	getTweets,
	getUserTweets
} = require('../../../controllers/tweet.controllers');
// middlewares
const { catchErrors } = require('../../../config/error.config');
const { userAuth } = require('../../../middlewares');
// validations
const {
	createTweetValidation
} = require('../../../validations/tweet.validations');
const {
	paramAndQueryUuidValidations
} = require('../../../validations/common.validations');
// routes
router.get('/', userAuth, catchErrors(getTweets));
router.post('/', userAuth, createTweetValidation, catchErrors(tweet));
router.get(
	'/user',
	paramAndQueryUuidValidations,
	userAuth,
	catchErrors(getUserTweets)
);

// export router
module.exports = router;
