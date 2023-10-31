const httpStatus = require('http-status');
const { StreamHistory } = require('../models/stream.history.model');
const ApiError = require('../utils/ApiError');
const moment = require('moment');

const createStreamHistory = async (body) => {
  let values = await StreamHistory.create(body);
  return values;
};

module.exports = {
  createStreamHistory,
};
