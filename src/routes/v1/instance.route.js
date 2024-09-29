const express = require('express');
const validate = require('../../middlewares/validate');
const instanceValidation = require('../../validations/instance.validation');
const instanceController = require('../../controllers/instance.controller');
const { grantAccess } = require('../../middlewares/validateAccessControl');
const { resources } = require('../../config/roles');

const router = express.Router();

router
	.route('/')
	.get(
		validate(instanceValidation.getInstances),
		instanceController.getInstances
	)
	.post(
		validate(instanceValidation.getInstances),
		instanceController.createInstance
	);

router
	.route('/:instanceId')
	.get(
		grantAccess('readAny', resources.INSTANCE),
		validate(instanceValidation.getInstance),
		instanceController.getInstance
	)
	.patch(
		grantAccess('updateAny', resources.INSTANCE),
		validate(instanceValidation.updateInstance),
		instanceController.updateInstance
	)
	.delete(
		grantAccess('deleteAny', resources.INSTANCE),
		validate(instanceValidation.deleteInstance),
		instanceController.deleteInstance
	);

router
	.route('/:instanceId/start-instance')
	.post(
		grantAccess('createAny', resources.INSTANCE),
		validate(instanceValidation.instanceId),
		instanceController.startInstance
	);

router
	.route('/:instanceId/restart-instance')
	.post(
		grantAccess('createAny', resources.INSTANCE),
		validate(instanceValidation.instanceId),
		instanceController.restartInstance
	);

router
	.route('/:instanceId/qrcode')
	.post(
		grantAccess('readyAny', resources.INSTANCE),
		validate(instanceValidation.instanceId),
		instanceController.qrcode
	);

router
	.route('/:instanceId/send-message')
	.post(
		grantAccess('createAny', resources.INSTANCE),
		validate(instanceValidation.sendMessage),
		instanceController.sendMessage
	);

module.exports = router;
