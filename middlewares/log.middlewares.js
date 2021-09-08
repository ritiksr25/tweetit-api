const chalk = require('chalk');
const _ = require('lodash');
const { formatHrTime } = require('../utility/app.helpers');
const { getFromCache, setInCache } = require('../services/cache.service');
const { createSyncLastActiveJob } = require('../queues/index/index.queue');

module.exports.logRequestMiddleware = async (req, res, next) => {
	const startTime = new Date();
	const startTimeHrt = process.hrtime();
	res.on('finish', async () => {
		const requestDuration = formatHrTime(process.hrtime(startTimeHrt));
		const statusCode = res.statusCode < 400 ? 200 : res.statusCode;
		let body = {};
		let statusLogColor;
		if (statusCode < 400) {
			statusLogColor = chalk.green;
		} else if (statusCode < 500) {
			statusLogColor = chalk.yellow;
		} else {
			statusLogColor = chalk.red;
		}

		console.log(
			chalk.cyan(`[${startTime.toLocaleString()}]`),
			chalk.magenta(req.method),
			req.originalUrl,
			statusLogColor(statusCode),
			chalk.yellow(`${Math.round(requestDuration * 100) / 100} ms`)
		);
		if (req.body && Object.keys(req.body).length) {
			body = _.omit(req.body, ['password', 'newPassword']);
			console.log(chalk.blue(JSON.stringify(body, null, 2)));
		}

		if (req.user && req.user.id) {
			const isLastActiveTimeInCache = await getFromCache(
				`recent session:${req.user.id}`
			);
			if (!isLastActiveTimeInCache) {
				await createSyncLastActiveJob({ id: req.user.id });
				setInCache(
					`recent session:${req.user.id}`,
					String(new Date().toISOString()),
					5 * 60
				);
			}
		}
	});
	next();
};
