const httpStatus = require('http-status');
const { SlotBooking } = require('../models/SlotBooking.model');
const ApiError = require('../utils/ApiError');
const { purchasePlan } = require('../models/purchasePlan.model');
const { Slotseperation } = require('../models/slot.model');
const moment = require('moment');

const createSlotBooking = async (body, userId) => {
  const { arr } = body;
  let err;
  for (let i = 0; i < arr.length; i++) {
    let slot = arr[i];
    let findAvailableSlot = await Slotseperation.findOne({
      PlanId: slot.planId,
      userId: userId,
      SlotType: slot.Type,
      Duration: slot.duration,
    });
    if (!findAvailableSlot || findAvailableSlot.Slots <= 0) {
      err = true;
      break;
    }
    let usedSlots = findAvailableSlot.usedSlots + 1;
    let availableSlot = findAvailableSlot.Slots - 1;
    findAvailableSlot = await Slotseperation.findByIdAndUpdate(
      { _id: findAvailableSlot._id },
      { Slots: availableSlot, usedSlots: usedSlots },
      { new: true }
    );
    let data = {
      slotId: slot.slotId,
      Durations: slot.duration,
      slotType: slot.Type,
      PlanId: slot.planId,
      userId: userId,
      streamPlanId: findAvailableSlot.streamPlanId,
    };
    await SlotBooking.create(data);
  }
  if (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Max Slot Finished');
  }
  return body;
};

const getBooked_Slot = async (userId, id) => {
  console.log(userId);
  let val = await SlotBooking.aggregate([
    { $match: { userId: userId, PlanId: id } },
    {
      $lookup: {
        from: 'slots',
        localField: 'slotId',
        foreignField: '_id',
        as: 'slots',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$slots',
      },
    },
    {
      $lookup: {
        from: 'streamrequests',
        localField: 'slotId',
        foreignField: 'slotId',
        pipeline: [{ $match: { suppierId: userId } }],
        as: 'Stream',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$Stream',
      },
    },
  ]);
  return val;
};

const getBooked_Slot_By_Exhibitor = async (userId, planId) => {

  let date_now = new Date().getTime();
  let val = await SlotBooking.aggregate([
    { $match: { $and: [{ userId: { $eq: userId } }, { PlanId: { $eq: planId } }, { status: { $ne: "Booked" } }] } },
    {
      $lookup: {
        from: 'slots',
        localField: 'slotId',
        pipeline: [
          {
            $addFields: {
              slotExpire: {
                $cond: { if: { $lt: ['$end', date_now] }, then: true, else: false },
              },
            },
          },
        ],
        foreignField: '_id',
        as: 'slots',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$slots',
      },
    },
    {
      $addFields: {
        slotExpire: "$slots.slotExpire",
      },
    },
  ]);
  return val;
};

module.exports = {
  createSlotBooking,
  getBooked_Slot,
  getBooked_Slot_By_Exhibitor,
};
