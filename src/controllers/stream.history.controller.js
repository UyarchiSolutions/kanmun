const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const StreamHistory = require('../services/stream.history.service');

const createStreamHistoryService = catchAsync(async (req, res) => {
  const data = await StreamHistory.createStreamHistory(req.body);
  res.send(data);
});

module.exports = { createStreamHistoryService };
