const express = require('express');

const router = express.Router();
const sponsor = require('../../../controllers/liveStreaming/sponsor.controller');

router.route('/registor').post(sponsor.sponsor_registretion);
router.route('/:page').get(sponsor.get_Sponsor);
router.route('/update/SponsorById/:id').put(sponsor.updateSponsorById);
router.route('/disable/enable/:id').put(sponsor.disable_enable);

module.exports = router;
