const { Queue, Worker, QueueEvents } = require('bullmq');
const { Queues } = require('../../enums/queues.enum');
const { syncTweetTags } = require('./tweet.processor');
const TweetQueue = new Queue(Queues.TWEET_QUEUE);
const queueEvents = new QueueEvents(Queues.TWEET_QUEUE);

queueEvents.on('active', ({ jobId, prev }) => {
	console.log(`Job ${jobId} is now active; previous status was ${prev}`);
});
queueEvents.on('completed', ({ jobId, returnvalue }) => {
	console.log(`${jobId} has completed and returned ${returnvalue}`);
});
queueEvents.on('failed', ({ jobId, failedReason }) => {
	console.log(`${jobId} has failed with reason ${failedReason}`);
});

module.exports.createSyncTweetTagsJob = async data => {
	await TweetQueue.add('syncTweetTagsJob', data);
};

new Worker(Queues.TWEET_QUEUE, async job => {
	if (job.name === 'syncTweetTagsJob') {
		const resp = await syncTweetTags(job.data);
		return resp;
	}
});
