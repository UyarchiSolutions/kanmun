const express = require('express');
const streamhistoryController = require('../../controllers/stream.history.controller');
const router = express.Router();

router.route('/').post(streamhistoryController.createStreamHistoryService);

module.exports = router;
