const { Queue, Worker } = require('bullmq');
const { Queues } = require('../enums/queues.enum');
const indexQueue = new Queue(Queues.INDEX_QUEUE);

module.exports.createIndexJob = async data => {
	console.log('createIndexJob', data);
	await indexQueue.add('index', data);
};

new Worker(Queues.INDEX_QUEUE, async job => {
	console.log(job.name);
});
