const { getWbot } = require('../../libs/wbot');
const logger = require('../../config/logger');

async function sendMessage(instanceId, remoteJid, text) {
	const wbot = await getWbot(instanceId);

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
