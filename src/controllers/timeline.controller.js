const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const timeline = require('../services/timeline.service');

const createTimeline = catchAsync(async (req, res) => {
    const value = await timeline.createTimeline(req);
    res.status(httpStatus.NO_CONTENT).send(value);

});

module.exports = {
    createTimeline
};
