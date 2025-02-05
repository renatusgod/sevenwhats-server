const axios = require('axios');
const logger = require('../config/logger');

function post(url, body) {
	axios
		.post(url, body, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer your_token', // If you need to add headers
			},
		})
		.then(() => {})
		.catch((error) => logger.error(`post error: ${error?.message}`));
}

async function get(url, type) {
	const response = await axios.get(url, type);

	return response;
}

module.exports = {
	post,
	get,
};
