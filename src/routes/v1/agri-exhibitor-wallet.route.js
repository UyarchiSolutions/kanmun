const express = require('express');
const router = express.Router();
const { SetPass, SellerAuth } = require('../../controllers/sellerAuth.controller');
const shopverify = require('../../controllers/shoptokenverify.controller');

const WalletController = require('../../controllers/agri-exhibitor-wallet.controller');
router.route('/').post(SellerAuth, WalletController.createWallet);
router.route('/Enquiry').post(shopverify, WalletController.createEnquiry);
router.route('/getWallets').get(SellerAuth, WalletController.getWallets);
router.route('/getWallet/Details').get(SellerAuth, WalletController.getWalletDetails);
module.exports = router;
