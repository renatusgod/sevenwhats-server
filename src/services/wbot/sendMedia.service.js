const { getWbot } = require('../../libs/wbot');
const logger = require('../../config/logger');
const request = require('../../utils/request');

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

	if (!wbot) {
		return { instance: 'off' };
	}

	let document;

	if (fileUrl) {
		const response = await request.get(fileUrl);

		if (response?.status === 200) {
			document = Buffer.from(response.data, 'binary');;
		}
		
	} else if (fileBase64) {
		document = Buffer.from(fileBase64, 'base64');
	}

	if (!document) {
		return { data: 'Arquivo inválido' }
	}

	try {
		const options = {
			document: document,
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
