const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const PrivateChat = require('../services/PrivateChat.service');

const intraction_exhibitor = catchAsync(async (req, res) => {
  let value = await PrivateChat.intraction_exhibitor(req);
  res.send(value);
});

const get_old_chat = catchAsync(async (req, res) => {
  let value = await PrivateChat.get_old_chat(req);
  res.send(value);
});

const getMmesages = catchAsync(async (req, res) => {
  const value = await PrivateChat.getMmesages(req);
  res.send(value);
});

module.exports = {
  intraction_exhibitor,
  get_old_chat,
  getMmesages,
};
