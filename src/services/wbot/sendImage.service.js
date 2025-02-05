const fs = require('fs');
const { getWbot } = require('../../libs/wbot');
const logger = require('../../config/logger');
const request = require('../../utils/request');

async function sendImage(instanceId, remoteJid, caption, link, mimetype, file) {
	const wbot = await getWbot(instanceId);

	if (!wbot) {
		return { instance: 'off' };
	}

	let options;

	if (!file && link) {
		const response = await request.get(link, {
			responseType: 'arraybuffer',
		});

		if (response?.status === 200) {
			options = {
				image: Buffer.from(response.data, 'binary'),
				filename: 'asdasdad.jpg',
				caption,
				mimetype: response.headers['content-type'],
			};
		}
	} else {
		options = {
			image: fs.readFileSync(file.path),
			caption,
			mimetype: file.mimetype,
		};
	}

	try {
		const result = await wbot.sendMessage(remoteJid, { ...options });

		return result;
	} catch (error) {
		logger.error('sendImage error', error);
	} finally {
		// Excluindo o arquivo após o uso
		if (file) {
			fs.unlink(file.path, (err) => {
				if (err) {
					console.error('Erro ao excluir o arquivo:', err);
				}
				console.log('Arquivo excluído com sucesso.');
			});
		}
	}
}

module.exports = {
	sendImage,
};
