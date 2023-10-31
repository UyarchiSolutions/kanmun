const express = require('express');
const router = express.Router();
const shopverify = require('../../controllers/shoptokenverify.controller');
const PrivateChat = require('../../controllers/PrivateChat.controller');
const { SetPass, SellerAuth } = require('../../controllers/sellerAuth.controller');

router.route('/intraction/exp').post(shopverify, PrivateChat.intraction_exhibitor);
router.route('/get/old/chat').get(shopverify, PrivateChat.get_old_chat);
router.route('/getMmesages').get(SellerAuth, PrivateChat.getMmesages);
router.route('/get/old/chat/exhibitor').get(SellerAuth, PrivateChat.get_old_chat);


module.exports = router;
