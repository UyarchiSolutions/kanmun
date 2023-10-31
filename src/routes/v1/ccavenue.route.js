const express = require('express');
const ccavenue = require("../../controllers/ccavenue.controller");
const router = express.Router();
const shopverify = require('../../controllers/shoptokenverify.controller');
const { SetPass, SellerAuth } = require('../../controllers/sellerAuth.controller');

router.route('/get/payment/url').get(ccavenue.get_paymnent_url);
router.route('/paynow/encript/value').get(ccavenue.pay_now_encript_value);
router.route('/exhibitor/purchese/plan').get(ccavenue.exhibitor_purchese_plan);
router.route('/nearby').get(ccavenue.nearby_value);

router.route('/get/payment/response/:id').get(ccavenue.get_paymant_success_response);
router.route('/exp/get/payment/response/:id').get(SellerAuth, ccavenue.get_paymant_success_response_exp);




router.route('/ccavenue/payent/details').get(ccavenue.get_ccavenue_details);



module.exports = router;