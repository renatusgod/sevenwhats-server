const { getWbot } = require('../../libs/wbot');
const logger = require('../../config/logger');
const ApiError = require('../../utils/ApiError');

async function sendMessage(instanceId, remoteJid, text) {
	const wbot = await getWbot(instanceId);

	if (!wbot) {
		return { instance: 'off' };
	}

	try {
		const result = await wbot.sendMessage(remoteJid, {
			text,
		});

		return result;
	} catch (error) {
		logger.error('sendMessage error', error);
	}
}

module.exports = {
	sendMessage,
};
