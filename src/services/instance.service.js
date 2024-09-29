const httpStatus = require('http-status');
const { getOffset } = require('../utils/query');
const ApiError = require('../utils/ApiError');
const db = require('../db/models');
const sessionService = require('./session.service');
const config = require('../config/config');
const logger = require('../config/logger');

async function getInstanceModelById(instanceId) {
	const instance = await db.instance.findOne({
		where: { id: instanceId },
	});

	return instance;
}

async function getInstanceById(instanceId) {
	const instance = await db.instance.findOne({
		where: { id: instanceId },
		attributes: [
			'id',
			'name',
			'web_hook',
			'events',
			'qr_code',
			'status',
			'created_date_time',
		],
		raw: true,
	});

	return instance;
}

async function getInstances(req) {
	const { page: defaultPage, limit: defaultLimit } = config.pagination;
	const { page = defaultPage, limit = defaultLimit } = req.query;
	const { userId } = req.user;

	const offset = getOffset(page, limit);

	const instances = await db.instance.findAndCountAll({
		where: { user_id: userId },
		attributes: [
			'id',
			'name',
			'web_hook',
			'events',
			'qr_code',
			'status',
			'created_date_time',
			'created_date_time',
		],
		offset,
		limit,
		raw: true,
	});

	return instances;
}

async function createInstance(req) {
	const {
		webHook,
		events,
		status = 'OPENING',
		isMultiDevice = false,
	} = req.body;

	const createdInstance = await db.instance.create({
		user_id: req.user.userId,
		web_hook: webHook,
		is_multi_device: isMultiDevice,
		events,
		status,
	});

	sessionService.startSession(createdInstance);

	return {
		id: createdInstance.id,
		name: createdInstance.name,
		web_hook: createdInstance.web_hook,
		events: createdInstance.events,
		qr_code: createdInstance.qr_code,
		status: createdInstance.status,
		created_date_time: createdInstance.created_date_time,
		modified_date_time: createdInstance.modified_date_time,
	};
}

async function startInstance(req) {
	const instance = await getInstanceModelById(req.params.instanceId);

	if (!instance) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Instance not found');
	}

	sessionService.startSession(instance);

	return instance;
}

async function deleteInstanceById(instanceId) {
	const deletedInstance = await db.instance.destroy({
		where: { id: instanceId },
	});

	if (!deletedInstance) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Instance not found');
	}

	return deletedInstance;
}

async function updateInstance(req) {
	const updatedInstance = await db.instance
		.update(
			{
				...{
					web_hook: req.body.webHook,
					events: req.body.events,
					name: req.body.name,
				},
			},
			{
				where: { id: req.params.instanceId },
				returning: true,
				plain: true,
				raw: true,
			}
		)
		.then((data) => data[1]);

	sessionService.restartInstance(updatedInstance.id);

	return {
		id: updatedInstance.id,
		name: updatedInstance.name,
		web_hook: updatedInstance.web_hook,
		events: updatedInstance.events,
		qr_code: updatedInstance.qr_code,
		status: updatedInstance.status,
		created_date_time: updatedInstance.created_date_time,
		modified_date_time: updatedInstance.modified_date_time,
	};
}

async function startAllSessions() {
	logger.info('<<< INICIANDO TODAS AS INSTANCIAS >>>');

	try {
		const instances = await db.instance.findAll({
			where: { status: 'CONNECTED' },
		});

		if (instances.length > 0) {
			instances.forEach((instance) => {
				sessionService.startSession(instance);
			});
		}
	} catch (error) {
		logger.error('startAllSessions', error);
	}
}

async function restartInstance(instanceId) {
	const instance = await getInstanceModelById(instanceId);

	if (!instance) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Instance not found');
	}

	sessionService.restartSession(instance);

	return instance;
}

async function qrcode(instanceId) {
	const instance = await getInstanceById(instanceId);

	if (!instance) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Instance not found');
	}

	return {
		status: instance.status,
		qrcode: instance.qr_code,
	};
}

module.exports = {
	getInstanceModelById,
	getInstanceById,
	getInstances,
	createInstance,
	deleteInstanceById,
	updateInstance,
	startInstance,
	restartInstance,
	startAllSessions,
	qrcode,
};
