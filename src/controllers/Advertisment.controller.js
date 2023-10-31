const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const AdvertismentService = require('../services/Advertisment.service');

const create_Advertisment = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await AdvertismentService.create_Advertisment(req.body, userId);
  res.send(data);
});

const get_Advertisment = catchAsync(async (req, res) => {
  const data = await AdvertismentService.get_Advertisment(req.params.page);
  res.send(data);
});

module.exports = {
  create_Advertisment,
  get_Advertisment,
};
