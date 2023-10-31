const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Wallet, Enquiry } = require('../models/agri-exhibitor-wallet.model');
const { Seller } = require('../models/seller.models');
const moment = require('moment');

const createWallet = async (body, userId) => {
  let data = { ...body, ...{ userId: userId, Type: 'Addon' } };
  let values = await Wallet.create(data);
  return values;
};

const createEnquiry = async (body, userId) => {
  const date = moment().format('DD-MM-YYYY');
  let findOrders = await Enquiry.find().count();
  let center = '';
  if (findOrders < 9) {
    center = '0000';
  }
  if (findOrders < 99 && findOrders >= 9) {
    center = '000';
  }
  if (findOrders < 999 && findOrders >= 99) {
    center = '00';
  }
  if (findOrders < 9999 && findOrders >= 999) {
    center = '0';
  }
  let count = findOrders + 1;
  let orderId = `ENQ${center}${count}`;
  let values = { ...body, ...{ date: date, EnquiryId: orderId, userId: userId } };
  const creation = await Enquiry.create(values);
  return creation;
};

const getWallets = async (userId) => {
  let values = await Wallet.aggregate([
    {
      $match: {
        userId: userId,
      },
    },
  ]);
  return values;
};

const getWalletDetails = async (userId) => {
  let values = await Seller.aggregate([
    {
      $match: { _id: userId },
    },
    {
      $lookup: {
        from: 'agriwallets',
        localField: '_id',
        foreignField: 'userId',
        pipeline: [{ $match: { Type: { $eq: 'Addon' } } }, { $group: { _id: null, Amount: { $sum: '$Amount' } } }],
        as: 'totalWalletAmt',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$totalWalletAmt',
      },
    },
    {
      $lookup: {
        from: 'agriwallets',
        localField: '_id',
        foreignField: 'userId',
        pipeline: [{ $match: { Type: { $ne: 'Addon' } } }, { $group: { _id: null, Amount: { $sum: '$Amount' } } }],
        as: 'totalSpendAmt',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$totalSpendAmt',
      },
    },
    {
      $project: {
        _id: 1,
        TotalAddedAmt: { $ifNull: ['$totalWalletAmt.Amount', 0] },
        TotalSpendAmt: { $ifNull: ['$totalSpendAmt.Amount', 0] },

      },
    },
  ]);
  return values[0];
};

module.exports = {
  createWallet,
  createEnquiry,
  getWallets,
  getWalletDetails,
};
