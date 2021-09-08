const { Queue, Worker, QueueEvents } = require('bullmq');
const { Queues } = require('../../enums/queues.enum');
const { redisConfigObj } = require('../common');
const { syncLastActive } = require('./index.processor');
const IndexQueue = new Queue(Queues.INDEX_QUEUE, {
	connection: redisConfigObj
});
const queueEvents = new QueueEvents(Queues.INDEX_QUEUE);

queueEvents.on('active', ({ jobId, prev }) => {
	console.log(`Job ${jobId} is now active; previous status was ${prev}`);
});
queueEvents.on('completed', ({ jobId, returnvalue }) => {
	console.log(`${jobId} has completed and returned ${returnvalue}`);
});
queueEvents.on('failed', ({ jobId, failedReason }) => {
	console.log(`${jobId} has failed with reason ${failedReason}`);
});

module.exports.createSyncLastActiveJob = async data => {
	await IndexQueue.add('syncLastActiveJob', data);
};

new Worker(
	Queues.INDEX_QUEUE,
	async job => {
		if (job.name === 'syncLastActiveJob') {
			const resp = await syncLastActive(job.data);
			return resp;
		}
	},
	{ connection: redisConfigObj }
);
