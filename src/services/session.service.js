const db = require('../db/models');
const { wbot } = require('../libs');
const { messageListenerService } = require('./wbot');
const logger = require('../config/logger');

async function createSession(session) {
	const createdSession = await db.session
		.create(session)
		.then((resultEntity) => resultEntity.get({ plain: true }));

	return createdSession;
}

async function startSession(instance) {
	try {
		const session = await wbot.getWbot(instance.id);

		if (session) {
			return;
		}

		const wsocket = await wbot.initWbot(instance);

		messageListenerService.listenMessage(wsocket);
	} catch (error) {
		logger.error(`startSession error: ${error?.message}`);
	}
}

async function restartSession(instance) {
	try {
		await wbot.removeWbot(instance.id, false);

		startSession(instance);
	} catch (error) {
		logger.error(`restartSession error: ${error?.message}`);
	}
}

module.exports = {
	createSession,
	startSession,
	restartSession,
};
