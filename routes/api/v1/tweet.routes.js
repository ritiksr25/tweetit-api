const express = require('express');
const router = express.Router();
// controllers
const {
	tweet,
	getTweets,
	getUserTweets,
	getTweetsByTag,
	togglePinTweet,
	getTags
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
router.post('/', createTweetValidation, userAuth, catchErrors(tweet));
router.get(
	'/user',
	paramAndQueryUuidValidations,
	userAuth,
	catchErrors(getUserTweets)
);
router.post(
	'/toggle-pin/:tweetId',
	paramAndQueryUuidValidations,
	userAuth,
	catchErrors(togglePinTweet)
);
router.get('/tags', userAuth, catchErrors(getTags));
router.get(
	'/:tagId',
	paramAndQueryUuidValidations,
	userAuth,
	catchErrors(getTweetsByTag)
);
// export router
module.exports = router;
