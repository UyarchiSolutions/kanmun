const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const SlotBookingService = require('../services/SlotBooking.service');

const createSlotBooking = catchAsync(async (req, res) => {
  let userId = req.userId;
  const slotBooking = await SlotBookingService.createSlotBooking(req.body, userId);
  res.status(httpStatus.CREATED).send(slotBooking);
});

const getBooked_Slot = catchAsync(async (req, res) => {
  let userId = req.userId;
  const slotBooking = await SlotBookingService.getBooked_Slot(userId, req.params.id);
  res.status(httpStatus.OK).send(slotBooking);
});

const getBooked_Slot_By_Exhibitor = catchAsync(async (req, res) => {
  let userId = req.userId;
  const slotBooking = await SlotBookingService.getBooked_Slot_By_Exhibitor(userId, req.params.id);
  res.send(slotBooking);
});

module.exports = {
  createSlotBooking,
  getBooked_Slot,
  getBooked_Slot_By_Exhibitor,
};
