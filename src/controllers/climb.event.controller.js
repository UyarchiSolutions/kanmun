const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const ClimbEventService = require('../services/climb.event.service');

const getDatasBy_Event = catchAsync(async (req, res) => {
  const data = await ClimbEventService.getDatasBy_Event(req);
  res.send(data);
});

const getSlotDetails_WithCandidate = catchAsync(async (req, res) => {
  const data = await ClimbEventService.getSlotDetails_WithCandidate(req);
  res.send(data);
});

const getCandidateBySlot = catchAsync(async (req, res) => {
  const data = await ClimbEventService.getCandidateBySlot(req);
  res.send(data);
});

const getTestCandidates = catchAsync(async (req, res) => {
  const data = await ClimbEventService.getTestCandidates();
  res.send(data);
});

module.exports = {
  getDatasBy_Event,
  getSlotDetails_WithCandidate,
  getCandidateBySlot,
  getTestCandidates,
};
