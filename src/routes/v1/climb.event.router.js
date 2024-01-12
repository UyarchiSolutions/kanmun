const express = require('express');
const router = express.Router();
const ClimbEventController = require('../../controllers/climb.event.controller');

router.route('/').get(ClimbEventController.getDatasBy_Event);
router.route('/slots/details').get(ClimbEventController.getSlotDetails_WithCandidate);
router.route('/getCandidateBySlot/:date/:time/:attended').get(ClimbEventController.getCandidateBySlot);
router.route('/getTestCandidates').get(ClimbEventController.getTestCandidates);
module.exports = router;
