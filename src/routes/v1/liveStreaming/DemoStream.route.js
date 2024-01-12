const express = require('express');
const validate = require('../../../middlewares/validate');
const authValidation = require('../../../validations/auth.validation');
const authController = require('../../../controllers/auth.controller');
const auth = require('../../../middlewares/auth');
const authorization = require('../../../controllers/tokenVerify.controller');

const router = express.Router();
const demostream = require('../../../controllers/liveStreaming/DemoStream.controller');

const { SellerAuth } = require('../../../controllers/sellerAuth.controller');

router.route('/send/livestream/link').post(authorization, demostream.send_livestream_link);
router.route('/demo/request').post(SellerAuth, demostream.send_livestream_link_demo);
router.route('/chat/turn/on').get(demostream.turn_on_chat);
router.route('/join_live').get(demostream.join_live);
router.route('/end_live').get(demostream.end_live);

router.route('/leave/admin').get(demostream.leave_admin_call);

router.route('/interviewer/list').get(demostream.get_interviewer_list);

router.route('/demo/request').get(SellerAuth, demostream.get_demo_requests);
router.route('/get/livestream/details').get(demostream.get_stream_details);
router.route('/verify/token/stream').get(demostream.get_stream_verify);
router.route('/verify/token/stream/buyer').get(demostream.get_stream_verify_buyer);
router.route('/get/stream/details').get(demostream.get_stream_details_check);
router.route('/get/stream/details/golive').get(demostream.get_stream_details_check_golive);
router.route('/go/live/stream').get(demostream.get_stream_details_check);
router.route('/join/stream/buyer').post(demostream.join_stream_buyer);
router.route('/join/stream/candidate').post(demostream.join_stream_candidate);
router.route('/get/buyer/token').get(demostream.get_buyer_token);
// router.route('/register/buyer/stream').get(demostream.stream_register_buyer);
router.route('/get/get_add_to_cart').get(demostream.get_get_add_to_cart);
router.route('/add-to-cart').post(demostream.add_to_cart);
router.route('/razorpay/success/confirmorder').post(demostream.confirmOrder_razerpay);
router.route('/success/confirmorder').post(demostream.confirmOrder_cod);
router.route('/end/stream').get(demostream.end_stream);
router.route('/main/go/live').get(demostream.go_live);
router.route('/buyer/go/live').get(demostream.buyer_go_live_stream);
router.route('/get/DemoStream/By/Admin/:page').get(authorization, demostream.get_DemoStream_By_Admin);
router.route('/get/my/orders/buyer').get(demostream.my_orders_buyer);
router.route('/view/order/details').get(demostream.view_order_details);
router.route('/get/exhibitor/order').get(demostream.get_exhibitor_order);
router.route('/visitor/interested').post(demostream.visitor_interested).get(demostream.visitor_interested_get);
router.route('/visitor/saved').post(demostream.visitor_saved).get(demostream.visitor_saved_get);
router.route('/manage/Demo/Stream/:page').get(demostream.manageDemoStream);

router.route('/exhibitor/interested').get(demostream.exhibitor_interested_get);
router.route('/exhibitor/myprofile').get(demostream.exhibitor_myprofile);
router.route('/visitor/myprofile').get(demostream.visitor_myprofile);

router.route('/send/sms/now').get(demostream.send_sms_now);
router.route('/verify/sms/now').post(demostream.verify_otp);

router.route('/multible/sms/send').post(demostream.send_multible_sms_send);
router.route('/start/cloud/record').get(demostream.start_cloud_record);
router.route('/verification/sms/send').get(demostream.verification_sms_send);

router.route('/Feedback').post(demostream.createFeedBack);
router.route('/Feedback/:id').get(demostream.getFeedbackById).put(demostream.updateFeedback);
router.route('/Feedback/pagination/:page').get(demostream.getFeedbackWithPagination);
router.route('/TechIssue').post(demostream.createTecIssues);
router.route('/TechIssue/:id').put(demostream.update_TechIssue);
router.route('/TechIssue/pagination/:page').get(demostream.get_TechIssue);
router.route('/get/IssuesWith/Pagination/:page').get(demostream.getIssuesWithPagination);
router.route('/issueResolve/:id').put(demostream.issueResolve);
router.route('/get/completed/stream').get(demostream.get_completed_stream);
router.route('/post/request/demo').post(demostream.demorequest);
router.route('/get/request/demo').get(authorization, demostream.get_demo_request);
router.route('/send/request/demo').post(authorization, demostream.send_request_link);
router.route('/getDatas').get(demostream.getDatas);

// router.route('').get(demostream.send_sms_now);




router.route('/toggle/raise/hands').get(demostream.toggle_raise_hand);
router.route('/raise/my/hands').get(demostream.raise_my_hands);
router.route('/accept/raise/hands').get(demostream.accept_raise_hands);
router.route('/end/raise/hands').get(demostream.end_raise_hands);

router.route('/leave/raise/hands').get(demostream.leave_raise_hands);



router.route('/stop/recording').get(demostream.stop_recording);


module.exports = router;
