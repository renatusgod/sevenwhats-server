const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { instanceService } = require('../services');
const {
	sendMessageService,
	sendMediaService,
	sendImageService,
} = require('../services/wbot');

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

const restartInstance = catchAsync(async (req, res) => {
	const instance = await instanceService.restartInstance(
		req.params.instanceId
	);
	res.send(instance);
});

const logout = catchAsync(async (req, res) => {
	await instanceService.logout(req.params.instanceId);
	res.send({ status: 'CLOSED' });
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

const sendMedia = catchAsync(async (req, res) => {
	const { remoteJid, fileUrl, fileBase64, caption, fileName, mimetype } =
		req.body;
	const { instanceId } = req.params;

	const result = await sendMediaService.sendMedia(
		instanceId,
		remoteJid,
		fileUrl,
		fileBase64,
		caption,
		fileName,
		mimetype
	);

	res.send(result);
});

const sendImage = catchAsync(async (req, res) => {
	const { remoteJid, caption, link, mimetype } = req.body;
	const { instanceId } = req.params;

	const result = await sendImageService.sendImage(
		instanceId,
		remoteJid,
		caption,
		link,
		mimetype,
		req.file
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
	restartInstance,
	logout,
	qrcode,
	sendMessage,
	sendMedia,
	sendImage,
};
