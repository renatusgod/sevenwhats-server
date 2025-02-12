const express = require('express');
const publicController = require('../../controllers/public.controller');

const router = express.Router();

router
    .route('/:instanceId/send-message')
    .post(publicController.sendMessage);

module.exports = router;
