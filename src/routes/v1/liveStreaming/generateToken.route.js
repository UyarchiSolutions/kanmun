const express = require('express');
const validate = require('../../../middlewares/validate');
const authValidation = require('../../../validations/auth.validation');
const authController = require('../../../controllers/auth.controller');
const auth = require('../../../middlewares/auth');
const supplierAuth = require('../../../controllers/supplier.authorizations');
const shopverify = require('../../../controllers/shoptokenverify.controller');
const subhostVerify = require('../../../controllers/subhostVefify.controller');
const { SetPass, SellerAuth } = require('../../../controllers/sellerAuth.controller');
const authorization = require('../../../controllers/tokenVerify.controller');

const router = express.Router();
const generateToken = require('../../../controllers/liveStreaming/generateToken.controller');

router.route('/getToken').post(SellerAuth, generateToken.generateToken);
router.get('/getHostTokens', generateToken.getHostTokens);
router.get('/gettoken/byId', generateToken.gettokenById);
router.get('/gettoken/host/byId', generateToken.gettokenById_host);
router.get('/getparticipents/limit', generateToken.participents_limit);
router.put('/leave/participents/limit', generateToken.leave_participents);
router.get('/leave/host', generateToken.leave_host);
router.get('/join/host/admin', generateToken.join_host);
router.post('/recording/acquire', generateToken.agora_acquire);
router.post('/recording/start', generateToken.recording_start);
router.post('/recording/query', generateToken.recording_query);
router.post('/recording/stop', generateToken.recording_stop);
router.post('/recording/updateLayout', generateToken.recording_updateLayout);
router.post('/chat/room/details', generateToken.chat_rooms);
router.route('/getsub/token/user').get(shopverify, generateToken.get_sub_token);
router.route('/getsub/token/golive').get(shopverify, generateToken.get_sub_golive);
router.route('/getsub/token/golive/details').get(shopverify, generateToken.get_sub_golive_details);
router.route('/getsub/token/single').post(shopverify, generateToken.get_sub_token_single);
router.route('/participents/limit/all').get(generateToken.get_participents_limit);
router.route('/get/current/live/stream').get(shopverify, generateToken.get_current_live_stream);
router.route('/remove/hostlive/now').get(generateToken.remove_host_live);
router.route('/create/subhost/token').post(SellerAuth, generateToken.create_subhost_token);
router.route('/create/raice/your/token').post(generateToken.create_raice_token);
router.route('/production/livestream/generateToken/supplier').post(SellerAuth, generateToken.production_supplier_token);
router.route('/production/livestream/generateToken/supplier/cloudrecording').post(generateToken.production_supplier_token_cloudrecording);
router.route('/production/livestream/generateToken/watchamin').post(generateToken.production_supplier_token_watchamin);
router.route('/get/live/stream/videos').get(generateToken.get_stream_complete_videos);
router.route('/download/video/aws').get(generateToken.videoConverter);


router.route('/cloud/recording/start').get(generateToken.cloud_recording_start);
router.route('/get/cloud/recording').get(authorization, generateToken.get_cloude_recording);
router.route('/start/raicehands/admin').post(authorization, generateToken.start_rice_user_hands_admin).get(authorization, generateToken.get_raise_hands_admin);


router.route('/start/raicehands').post(SellerAuth, generateToken.start_rice_user_hands).get(SellerAuth, generateToken.get_raise_hands);
router.route('/raise/appove').post(SellerAuth, generateToken.approve_request);
router.route('/raise/reject').post(SellerAuth, generateToken.reject_request);
router.route('/raise/pending').post(SellerAuth, generateToken.pending_request);
router.route('/get/raise/hand/user').post(SellerAuth, generateToken.get_raise_hand_user);


router.route('/jion/now/live').post(shopverify, generateToken.jion_now_live);
router.route('/end/raise_hands').post(shopverify, generateToken.pending_request);
router.route('/raise/request').post(shopverify, generateToken.raise_request);
router.route('/get/raise/visitor').post(shopverify, generateToken.get_raise_hand_user);


// admin
router.route('/raise/appove/admin').post(authorization, generateToken.approve_request);
router.route('/raise/reject/admin').post(authorization, generateToken.reject_request);
router.route('/raise/pending/admin').post(authorization, generateToken.pending_request);
router.route('/get/raise/hand/user/admin').post(authorization, generateToken.get_raise_hand_user);



router.route('/push/notification/send').post(generateToken.push_notification);




module.exports = router;
