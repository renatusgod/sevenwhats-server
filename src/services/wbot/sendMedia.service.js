const { getWbot } = require('../../libs/wbot');
const logger = require('../../config/logger');

async function sendMedia(
	instanceId,
	remoteJid,
	fileUrl,
	fileBase64,
	caption,
	fileName,
	mimetype
) {
	const wbot = await getWbot(instanceId);

	try {
		const options = {
			document: fileBase64 ? Buffer.from(fileBase64, 'base64') : fileUrl,
			caption,
			fileName,
			mimetype,
		};

		const result = await wbot.sendMessage(remoteJid, {
			...options,
		});

		return result;
	} catch (error) {
		logger.error('sendMessage error', error);
	}
}

module.exports = {
	sendMedia,
};
