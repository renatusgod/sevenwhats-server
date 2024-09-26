const axios = require('axios');
const { getContentType } = require('baileys');
const logger = require('../../config/logger');

const typesMessage = [
	'conversation',
	'imageMessage',
	'videoMessage',
	'extendedTextMessage',
];

function sendMessageWebhook(url, message) {
	axios
		.post(url, message, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer your_token', // If you need to add headers
			},
		})
		.then(() => {})
		.catch((error) =>
			logger.error(`sendMessageWebhook error: ${error?.message}`)
		);
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

function handleMessage(wbot, data) {
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
		sendMessageWebhook(webhook, webMessage);
	}
}

async function listenMessage(wbot) {
	try {
		wbot.ev.on('messages.upsert', async (data) => {
			handleMessage(wbot, data);
		});

		wbot.ev.on('messages.update', (data) => {
			logger.info('listenMessage update:', data);
		});
	} catch (error) {
		logger.error('listenMessage error', error);
	}
}

module.exports = {
	listenMessage,
};
