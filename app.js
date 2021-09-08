const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const app = express();

const cors = require('cors');
const { AppConfig } = require('./config/app.config');
const { notFound, sendErrors } = require('./config/error.config');
const { sendSuccess } = require('./utility/app.helpers');
const { logRequestMiddleware } = require('./middlewares/log.middlewares');
require('dotenv').config();

module.exports = () => {
	app.use(compression());
	app.use(helmet());
	app.use(cors({ exposedHeaders: AppConfig.TOKEN_HEADER }));
	app.use(express.json({ extended: true }));
	app.use(express.urlencoded({ extended: true }));
	app.use(logRequestMiddleware);
	if (AppConfig.NODE_ENV === 'production') {
		console.log = console.warn = console.error = () => {};
	}

	//Routes
	app.get('/', (req, res) => sendSuccess(res, null));
	app.use('/api/v1/users', require('./routes/api/v1/user.routes'));
	app.use('/api/v1/follows', require('./routes/api/v1/follow.routes'));
	app.use('/api/v1/tweets', require('./routes/api/v1/tweet.routes'));
	// 404 route
	app.use('*', notFound);

	//Error Handlers
	app.use(sendErrors);

	// Allowing headers
	app.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');
		res.header(
			'Access-Control-Allow-Headers',
			'Origin, X-Requested-With, Content-Type, Accept'
		);
		res.header('Access-Control-Allow-Credentials', true);
		res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
		next();
	});

	//starting up server
	(async () => {
		try {
			app.listen(AppConfig.PORT);
			console.info(
				`NODE_ENV: ${AppConfig.NODE_ENV}\nServer is up and running on Port ${AppConfig.PORT}`
			);
		} catch (err) {
			console.info('Error in running server.');
		}
	})();
};
