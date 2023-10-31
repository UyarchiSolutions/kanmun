const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const WalletService = require('../services/agri-exhibitor-wallet.service');

const createWallet = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await WalletService.createWallet(req.body, userId);
  res.send(data);
});

const createEnquiry = catchAsync(async (req, res) => {
  let userId = req.shopId;
  const data = await WalletService.createEnquiry(req.body, userId);
  res.send(data);
});

const getWallets = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await WalletService.getWallets(userId);
  res.send(data);
});

const getWalletDetails = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await WalletService.getWalletDetails(userId);
  res.send(data);
});

module.exports = {
  createWallet,
  createEnquiry,
  getWallets,
  getWalletDetails,
};
