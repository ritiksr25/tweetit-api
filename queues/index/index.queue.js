const { Queue, Worker, QueueEvents } = require('bullmq');
const { RedisConfig } = require('../../config/redis.config');
const { Queues } = require('../../enums/queues.enum');
const { syncLastActive } = require('./index.processor');
const IndexQueue = new Queue(Queues.INDEX_QUEUE, {
	connection: RedisConfig
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
	{ connection: RedisConfig }
);
