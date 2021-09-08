const express = require('express');
const router = express.Router();
// controllers
const { tweet } = require('../../../controllers/tweet.controllers');
// middlewares
const { catchErrors } = require('../../../config/error.config');
const { userAuth } = require('../../../middlewares');
const {
	createTweetValidation
} = require('../../../validations/tweet.validations');
// validations
// routes
router.post('/', userAuth, createTweetValidation, catchErrors(tweet));

// export router
module.exports = router;
