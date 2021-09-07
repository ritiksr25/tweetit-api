const express = require('express');
const router = express.Router();
// controllers
const { toggleFollow } = require('../../../controllers/follow.controllers');
// middlewares
const { catchErrors } = require('../../../config/error.config');
const { userAuth } = require('../../../middlewares');
// validations
// routes
router.post('/toggle-follow/:followingId', userAuth, catchErrors(toggleFollow));
// export router
module.exports = router;
