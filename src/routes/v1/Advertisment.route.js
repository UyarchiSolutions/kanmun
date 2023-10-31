const express = require('express');
const router = express.Router();
const AdvertismentController = require('../../controllers/Advertisment.controller');
const authorization = require('../../controllers/tokenVerify.controller');

router.route('/').post(authorization, AdvertismentController.create_Advertisment);
router.route('/get/Advertisment/:page').get(AdvertismentController.get_Advertisment);

module.exports = router;
