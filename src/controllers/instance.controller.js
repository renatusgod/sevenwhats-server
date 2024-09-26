const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { instanceService } = require('../services');
const { sendMessageService } = require('../services/wbot');

const createInstance = catchAsync(async (req, res) => {
	const instance = await instanceService.createInstance(req);
	res.send(instance);
});

const getInstances = catchAsync(async (req, res) => {
	const instances = await instanceService.getInstances(req);
	res.send(instances);
});

const getInstance = catchAsync(async (req, res) => {
	const instance = await instanceService.getInstanceById(
		req.params.instanceId
	);

	if (!instance) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Instance not found');
	}

	res.send(instance);
});

const deleteInstance = catchAsync(async (req, res) => {
	await instanceService.deleteInstanceById(req.params.instanceId);
	res.send({ success: true });
});

const updateInstance = catchAsync(async (req, res) => {
	const instance = await instanceService.updateInstance(req);

	if (!instance) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Instance not found');
	}

	res.send(instance);
});

const startInstance = catchAsync(async (req, res) => {
	const instance = await instanceService.startInstance(req);
	res.send(instance);
});

const qrcode = catchAsync(async (req, res) => {
	const { instanceId } = req.params;
	const result = await instanceService.qrcode(instanceId);
	res.send(result);
});

const sendMessage = catchAsync(async (req, res) => {
	const { chatId, message } = req.body;
	const { instanceId } = req.params;

	const result = await sendMessageService.sendMessage(
		instanceId,
		chatId,
		message
	);

	res.send(result);
});

module.exports = {
	createInstance,
	getInstances,
	getInstance,
	deleteInstance,
	updateInstance,
	startInstance,
	qrcode,
	sendMessage,
};
