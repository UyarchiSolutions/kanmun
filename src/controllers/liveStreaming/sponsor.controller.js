const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const sponsor = require('../../services/liveStreaming/sponsor.service');

const sponsor_registretion = catchAsync(async (req, res) => {
  const data = await sponsor.sponsor_registretion(req);
  res.status(httpStatus.CREATED).send(data);
});

const get_Sponsor = catchAsync(async (req, res) => {
  const data = await sponsor.get_Sponsor(req.params.page);
  res.send(data);
});

const updateSponsorById = catchAsync(async (req, res) => {
  const data = await sponsor.updateSponsorById(req.params.id, req.body);
  res.send(data);
});

const disable_enable = catchAsync(async (req, res) => {
  const data = await sponsor.disable_enable(req.params.id, req.body);
  res.send(data);
});

module.exports = {
  sponsor_registretion,
  get_Sponsor,
  updateSponsorById,
  disable_enable,
};
