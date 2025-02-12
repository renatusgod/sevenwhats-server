const { getWbot } = require('../../libs/wbot');
const logger = require('../../config/logger');
const db = require('../../db/models');
const userService = require('../user.service');
// const instanceService = require('../instance.service');

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

async function sendMessagePublic(instanceId, remoteJid, text, apikey) {
	 // recupera usuario com apikey
	 const user = await userService.getUserByApiKey(apikey);

	 if (!user) {
		return { status: 'error', message: 'user not found' };
	 }

	 // recupera instancias dos usuario
	 const instance = await getInstanceById(instanceId);

	 // verificar se a instancia pertence so usuario
	 if (!instance || instance.user_id != user.id) {
		return { status: 'error', message: 'instance not found' };
	 }

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

async function getInstanceById(instanceId) {
	const instance = await db.instance.findOne({
		where: { id: instanceId },
		attributes: [
			'id',
			'user_id',
		],
		raw: true,
	});

	return instance;
}

module.exports = {
	sendMessage,
	sendMessagePublic,
};
