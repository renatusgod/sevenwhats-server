const { sendMessageService } = require('../services/wbot');
const catchAsync = require('../utils/catchAsync');

const sendMessage = catchAsync(async (req, res) => {
	const { chatId, message, apikey } = req.body;
	const { instanceId } = req.params;

	if (!apikey){
		res.send({ status: 'error', message: 'apikey is invalid' });	
	}

	const result = await sendMessageService.sendMessagePublic(
		instanceId,
		chatId,
		message,
        apikey
	);

	res.send(result);
});

module.exports = {
    sendMessage
};
