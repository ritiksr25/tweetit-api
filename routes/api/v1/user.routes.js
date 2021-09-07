const express = require('express');
const router = express.Router();
// controllers
const { create } = require('../../../controllers/user.controllers');
// middlewares
const { catchErrors } = require('../../../config/error.config');
// validations
const {
	createUserValidation
} = require('../../../validations/user.validations');

// routes
router.post('/', createUserValidation, catchErrors(create));

// export router
module.exports = router;
