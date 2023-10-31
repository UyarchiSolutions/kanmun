const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Advertisment } = require('../models/Advertisment.model');

const create_Advertisment = async (body, userId) => {
  const creations = await Advertisment.create({ ...body, ...{ userId: userId } });
  return creations;
};

const get_Advertisment = async (page) => {
  let values = await Advertisment.aggregate([{ $skip: page * 10 }, { $limit: 10 }]);
  let total = await Advertisment.find().count();
  return { values: values, total: total };
};

module.exports = { create_Advertisment, get_Advertisment };
