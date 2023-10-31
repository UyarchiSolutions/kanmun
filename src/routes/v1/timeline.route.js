const express = require('express');
const timeline = require('../../controllers/timeline.controller');
const router = express.Router();


router.route('/type/getName/:type').get(timeline.createSupplierBuyerwithType);

module.exports = router;
