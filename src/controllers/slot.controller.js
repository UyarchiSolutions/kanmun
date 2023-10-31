const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const SlotService = require('../services/slot.service');

const SlotCreation = catchAsync(async (req, res) => {
  const data = await SlotService.createSlot(req.body);
  res.send(data);
});

const Fetch_Slot = catchAsync(async (req, res) => {
  const data = await SlotService.Fetch_Slot(req.query);
  res.send(data);
});

const UpdateSlotById = catchAsync(async (req, res) => {
  const data = await SlotService.UpdateSlotById(req.params.id, req.body);
  res.send(data);
});

const DeleteSlotById = catchAsync(async (req, res) => {
  const data = await SlotService.DeleteSlotById(req.params.id);
  res.send(data);
});

const getSlots_Minutse_Wise = catchAsync(async (req, res) => {
  const data = await SlotService.getSlots_Minutse_Wise();
  res.send(data);
});

const getDetailsForSlotChoosing = catchAsync(async (req, res) => {
  const data = await SlotService.getDetailsForSlotChoosing();
  res.send(data);
});

const getSlotsWitdSort = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await SlotService.getSlotsWitdSort(req.body, userId);
  res.send(data);
});

const getSlots_by_SlotInfo = catchAsync(async (req, res) => {
  const data = await SlotService.getSlots_by_SlotInfo(req.query);
  res.send(data);
});

const getSlots_Duraions = catchAsync(async (req, res) => {
  const data = await SlotService.getSlots_Duraions(req.query);
  res.send(data);
});

const getStreamBySlots = catchAsync(async (req, res) => {
  const data = await SlotService.getStreamBySlots(req.params.id);
  res.send(data);
});

const getSlots_Details_Streaming = catchAsync(async (req, res) => {
  const data = await SlotService.getSlots_Details_Streaming(req.params.id);
  res.send(data);
});

const createEvents = catchAsync(async (req, res) => {
  const data = await SlotService.createEvents(req.body);
  res.send(data);
});

const getEvents = catchAsync(async (req, res) => {
  const data = await SlotService.getEvents();
  res.send(data);
});

const getEventsByEventId = catchAsync(async (req, res) => {
  const data = await SlotService.getEventsByEventId(req.params.id);
  res.send(data);
});

const getSlotsByEvent = catchAsync(async (req, res) => {
  const data = await SlotService.getSlotsByEvent(req);
  res.send(data);
});

module.exports = {
  SlotCreation,
  Fetch_Slot,
  UpdateSlotById,
  DeleteSlotById,
  getSlots_Minutse_Wise,
  getDetailsForSlotChoosing,
  getSlotsWitdSort,
  getSlots_by_SlotInfo,
  getSlots_Duraions,
  getStreamBySlots,
  getSlots_Details_Streaming,
  createEvents,
  getEvents,
  getEventsByEventId,
  getSlotsByEvent,
};
