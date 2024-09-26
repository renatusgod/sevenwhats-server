const httpStatus = require('http-status');
const { roles } = require('../config/roles');
const ApiError = require('../utils/ApiError');
const db = require('../db/models');

async function isOwned(resource, req) {
	switch (resource) {
		case 'user':
			return req.user.userId === parseFloat(req.params.userId);
		case 'instance': {
			const instance = await db.instance.findOne({
				where: {
					id: req.params.instanceId,
					user_id: req.user.userId,
				},
			});

			return !!instance;
		}

		default:
			break;
	}
}

function grantAccess(action, resource) {
	return async (req, _res, next) => {
		try {
			const isOwnedUser = await isOwned(resource, req);
			const modifiedAction = isOwnedUser
				? action.replace('Any', 'Own')
				: action;

			const permission = roles
				.can(JSON.stringify(req.user.roleId))
				[modifiedAction](resource);

			if (!permission.granted) {
				throw new ApiError(
					httpStatus.FORBIDDEN,
					"You don't have enough permission to perform this action"
				);
			}
			next();
		} catch (error) {
			next(error);
		}
	};
}

module.exports = { grantAccess };
