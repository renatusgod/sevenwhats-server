const db = require('../db/models');
const { wbot } = require('../libs');
const { messageListenerService } = require('./wbot');

async function createSession(session) {
	const createdSession = await db.session
		.create(session)
		.then((resultEntity) => resultEntity.get({ plain: true }));

	return createdSession;
}

async function startSession(instance) {
	try {
		const wsocket = await wbot.initWbot(instance);

		messageListenerService.listenMessage(wsocket);
	} catch (error) {
		console.log(error);
	}
}

module.exports = {
	createSession,
	startSession,
};
