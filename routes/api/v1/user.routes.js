const express = require('express');
const router = express.Router();
// controllers
const { create, login } = require('../../../controllers/user.controllers');
// middlewares
const { catchErrors } = require('../../../config/error.config');
// validations
const {
	createUserValidation,
	loginUserValidation
} = require('../../../validations/user.validations');

// routes
router.post('/', createUserValidation, catchErrors(create));
router.post('/login', loginUserValidation, catchErrors(login));

// export router
module.exports = router;
