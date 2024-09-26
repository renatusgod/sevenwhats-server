const Joi = require('@hapi/joi');

const createInstance = {
	body: Joi.object().keys({
		name: Joi.string().max(255),
		webHook: Joi.string().max(255),
		events: Joi.string().max(255),
	}),
};

const getInstances = {
	query: Joi.object().keys({
		limit: Joi.number().min(1),
		page: Joi.number().min(1),
	}),
};

const getInstance = {
	params: Joi.object().keys({
		instanceId: Joi.number().required(),
	}),
};

const updateInstance = {
	params: Joi.object().keys({
		instanceId: Joi.string().required(),
	}),
	body: Joi.object()
		.keys({
			name: Joi.string().max(255),
			webHook: Joi.string().max(255),
			events: Joi.string().max(255),
		})
		.min(1),
};

const deleteInstance = {
	params: Joi.object().keys({
		instanceId: Joi.string(),
	}),
};

const instanceId = {
	params: Joi.object().keys({
		instanceId: Joi.string(),
	}),
};

const sendMessage = {
	params: Joi.object().keys({
		instanceId: Joi.string().required(),
	}),
	body: Joi.object()
		.keys({
			chatId: Joi.string().required(),
			message: Joi.string().required(),
		})
		.min(1),
};

module.exports = {
	createInstance,
	getInstances,
	getInstance,
	updateInstance,
	deleteInstance,
	instanceId,
	sendMessage,
};
