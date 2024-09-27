const { proto, initAuthCreds, BufferJSON } = require('@whiskeysockets/baileys');

const db = require('../db/models');

async function usePgAuthState(instance) {
	const writeData = async (data, file) => {
		try {
			const existing = await db.session.findOne({
				where: {
					instance_id: instance.id,
					name: file,
				},
			});
			if (existing) {
				await existing.update({
					value: JSON.stringify(data, BufferJSON.replacer),
				});
			} else {
				return await db.session.create({
					instance_id: instance.id,
					value: JSON.stringify(data, BufferJSON.replacer),
					name: file,
				});
			}
		} catch (error) {
			console.log('writeData error', error);
			return null;
		}
	};

	const readData = async (file) => {
		try {
			const data = await db.session.findOne({
				where: {
					instance_id: instance.id,
					name: file,
				},
			});

			if (data && data.value !== null) {
				return JSON.parse(data.value, BufferJSON.reviver);
			}

			return null;
		} catch (error) {
			console.log('Read data error', error);
			return null;
		}
	};

	const removeData = async (file) => {
		try {
			await db.session.destroy({
				where: {
					instance_id: instance.id,
					name: file,
				},
			});
		} catch (error) {
			console.log('removeData', error);
		}
	};

	const creds = (await readData('creds')) || initAuthCreds();

	return {
		state: {
			creds,
			keys: {
				get: async (type, ids) => {
					const data = {};
					await Promise.all(
						ids.map(async (id) => {
							let value = await readData(`${type}-${id}`);
							if (type === 'app-state-sync-key' && value) {
								value =
									proto.Message.AppStateSyncKeyData.fromObject(
										value
									);
							}

							data[id] = value;
						})
					);

					return data;
				},
				set: async (data) => {
					const tasks = [];
					// eslint-disable-next-line no-restricted-syntax, guard-for-in
					for (const category in data) {
						// eslint-disable-next-line no-restricted-syntax, guard-for-in
						for (const id in data[category]) {
							const value = data[category][id];
							const key = `${category}-${id}`;
							tasks.push(
								value ? writeData(value, key) : removeData(key)
							);
						}
					}

					await Promise.all(tasks);
				},
			},
		},
		saveCreds: () => {
			return writeData(creds, 'creds');
		},
	};
}

module.exports = {
	usePgAuthState,
};
