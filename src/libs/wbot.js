const {
	default: makeWASocket,
	DisconnectReason,
	fetchLatestBaileysVersion,
	makeInMemoryStore,
} = require('@whiskeysockets/baileys');
const P = require('pino');
const pgAuthState = require('../helpers/pgAuthState');
const db = require('../db/models');

const logger = require('../config/logger');

const wLogger = P({ level: 'warn' });

const retriesQrCodeMap = new Map();
const sessions = [];

async function getWbot(instanceId) {
	const sessionIndex = sessions.findIndex(
		(s) => s.id === parseFloat(instanceId)
	);

	if (sessionIndex === -1) {
		return null;
	}

	return sessions[sessionIndex];
}

async function removeWbot(instanceId, isLogout = true) {
	try {
		const sessionIndex = sessions.findIndex(
			(s) => s.id === parseFloat(instanceId)
		);
		if (sessionIndex !== -1) {
			if (isLogout) {
				sessions[sessionIndex].logout();
			}

			sessions[sessionIndex].ev.removeAllListeners('connection.update');
			sessions[sessionIndex].ws.close();
			sessions.splice(sessionIndex, 1);
		}
	} catch (error) {
		console.log('removeWbot error', error);
	}
}

async function initWbot(instance) {
	// eslint-disable-next-line no-async-promise-executor
	return new Promise(async (resolve) => {
		try {
			const { isLatest, version } = await fetchLatestBaileysVersion();

			logger.info(
				`INSTANCE: ${instance.id} >>> using WA v${version.join(
					'.'
				)}, isLatest: ${isLatest}`
			);
			logger.info(`INSTANCE: ${instance.id} >>> Starting session`);

			let retriesQrCode = 0;
			let wsocket = null;

			const store = await makeInMemoryStore({
				logger: wLogger,
			});

			const { state, saveCreds } = await pgAuthState.usePgAuthState(
				instance
			);

			wsocket = makeWASocket({
				auth: state,
				logger: wLogger,
				printQRInTerminal: true,
			});

			wsocket.webhook = instance.web_hook;

			wsocket.ev.on('connection.update', async (update) => {
				const { connection, lastDisconnect, qr } = update;

				logger.info(
					`INSTANCE: ${instance.id} >>> Socket Connection Update ${
						connection || ''
					} ${lastDisconnect || ''}`
				);

				const statusCode = lastDisconnect?.error?.output?.statusCode;

				if (connection === 'close') {
					const shouldReconnect =
						statusCode !== DisconnectReason.loggedOut;

					if (shouldReconnect) {
						initWbot(instance);
						return;
					}

					if (statusCode === 403) {
						await instance.update({
							status: 'PENDING',
							session: null,
						});

						await db.session.destroy({
							where: {
								instance_id: instance.id,
							},
						});

						removeWbot(instance.id, false);
					}

					if (statusCode === DisconnectReason.loggedOut) {
						await instance.update({
							status: 'CLOSED',
							session: null,
						});

						await db.session.destroy({
							where: {
								instance_id: instance.id,
							},
						});

						removeWbot(instance.id, false);
					}
				}

				if (connection === 'open') {
					await instance.update({
						status: 'CONNECTED',
						qr_code: null,
						retries: 0,
					});

					const sessionIndex = sessions.findIndex(
						(s) => s.id === instance.id
					);

					if (sessionIndex === -1) {
						wsocket.id = instance.id;
						sessions.push(wsocket);
					} else {
						wsocket.id = instance.id;
						sessions[sessionIndex] = wsocket;
					}

					logger.info(
						`INSTANCE: ${instance.id} >>> WhatsApp CONNECTED`
					);
					resolve(wsocket);
				}

				if (qr !== undefined) {
					if (
						retriesQrCodeMap.get(instance.id) &&
						retriesQrCodeMap.get(instance.id) >= 5
					) {
						await instance.update({
							status: 'DISCONNECTED',
							qr_code: null,
						});

						await db.session.destroy({
							where: {
								instance_id: instance.id,
							},
						});

						wsocket.ev.removeAllListeners('connection.update');
						wsocket.ws.close();
						wsocket = null;
						retriesQrCodeMap.delete(instance.id);
					} else {
						logger.info(
							`INSTANCE: ${instance.id} >>> QRCode Generate`
						);
						retriesQrCodeMap.set(instance.id, (retriesQrCode += 1));

						await instance.update({
							qr_code: qr,
							status: 'QRCODE',
							retries: retriesQrCodeMap.get(instance.id),
						});

						const sessionIndex = sessions.findIndex(
							(s) => s.id === instance.id
						);

						if (sessionIndex === -1) {
							wsocket.id = instance.id;
							sessions.push(wsocket);
						}
					}
				}
			});

			wsocket.ev.on('creds.update', saveCreds);
			wsocket.store = store;
			store.bind(wsocket.ev);
		} catch (error) {
			logger.error(`INSTANCE: ${instance.id} >>> initWbot: `, error);
		}
	});
}

module.exports = {
	getWbot,
	removeWbot,
	initWbot,
};
