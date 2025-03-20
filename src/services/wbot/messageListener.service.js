const axios = require('axios');
const { getContentType } = require('@whiskeysockets/baileys');
const logger = require('../../config/logger');

const typesMessage = [
	'conversation',
	'imageMessage',
	'videoMessage',
	'extendedTextMessage',
];

async function sendMessageWebhook(url, message) {
	// axios
	// 	.post(url, message, {
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 			Authorization: 'Bearer your_token', // If you need to add headers
	// 		},
	// 	})
	// 	.then((response) => {
	// 		logger.info('webhook sended to instanceId ' + message.instanceId + ': ' + JSON.stringify(response));
	// 	})
	// 	.catch((error) =>
	// 		logger.error(`webhook sended to instanceId ${message.instanceId}: ${error?.message}`)
	// 	);

	try {
		const {data} = await axios.post(url, message, {
			headers: {
				'Content-Type': 'application/json'
			}
		});
	
		if (!data) {
			logger.info('webhook whitout response to instanceId ' + message.instanceId);
			return;
		}
	
		if (data.status === 200) {
			logger.info('webhook sended to instanceId ' + message.instanceId + ': ' + data.statusText);
			return;
		}

		logger.error(`webhook sended to instanceId ${message.instanceId}: ${error?.message}`);
	} catch (error) {
		logger.error(`webhook sended to instanceId ${message.instanceId}: ${error?.message}`);
	}
}

function getTypeMessage(message) {
	return getContentType(message.message);
}

// eslint-disable-next-line no-unused-vars
function getBodyMessage(message) {
	const type = getTypeMessage(message);

	const types = {
		conversation: message.message.conversation,
		imageMessage: message.message.imageMessage?.caption,
		videoMessage: message.message.videoMessage?.caption,
		extendedTextMessage: message.message.extendedTextMessage?.text,
	};

	const objKey = Object.keys(types).find((key) => key === type);

	if (!objKey) {
		logger.warn(
			`#### Nao achou o type 152: ${type} ${JSON.stringify(message)}`
		);

		return;
	}

	return types[type];
}

function handleMessage(wbot, data, instanceId) {
	const [webMessage] = data.messages;

	if (!webMessage) {
		return;
	}

	const { webhook } = wbot;

	const typeMessage = getTypeMessage(webMessage);

	if (!typesMessage.includes(typeMessage)) {
		return;
	}

	if (webhook) {
		sendMessageWebhook(webhook, { ...webMessage, instanceId: instanceId });
	}
}

async function listenMessage(wbot, instanceId) {
	try {
		wbot.ev.on('messages.upsert', async (data) => {
			logger.info('listenMessage upsert to instanceId ' + instanceId + ': ' + JSON.stringify(data));
			handleMessage(wbot, data, instanceId);
		});

		wbot.ev.on('messages.update', (data) => {
			logger.info('listenMessage update to instanceId ' + instanceId + ': ' + JSON.stringify(data));
		});
	} catch (error) {
		logger.error('listenMessage error', error);
	}
}

module.exports = {
	listenMessage,
};
