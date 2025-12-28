const express = require('express');
const webhookController = require('../controllers/webhookController');

const router = express.Router();

router.post('/zobot', webhookController.handleZobotWebhook);

module.exports = router;
