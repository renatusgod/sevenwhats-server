const expressJwt = require('express-jwt');
// const { expressjwt } = require('express-jwt');"express-jwt": "^6.0.0",
const config = require('./config');

async function isRevoked(_req, _payload, done) {
	done();
}

function jwt() {
	const { secret } = config.jwt;
	return expressJwt({
		secret,
		getToken: function fromHeaderOrQuerystring(req) {
			const token = req.headers.authorization
				? req.headers.authorization.split(' ')[1]
				: req.query.token;
			if (token) return token;
			return null;
		},
		algorithms: ['HS256'],
		isRevoked,
	}).unless({
		path: [
			// public routes that don't require authentication
			/\/v[1-9](\d)*\/(auth|docs|public)\/.*/,
		],
	});
}

module.exports = jwt;
