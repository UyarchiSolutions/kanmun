const httpStatus = require('http-status');
const { Slot, Slotseperation, Event, EventCreation } = require('../models/slot.model');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const { purchasePlan } = require('../models/purchasePlan.model');
const { Streamrequest, PlanSlot } = require('../models/ecomplan.model');
const Seller = require('../models/seller.models');

const createSlot = async (body) => {
  const { chooseTime, Duration, date, Type, eventId } = body;
  const isoDateTime = moment(`${date}T${chooseTime}`).toDate();
  const Start = moment(`${date}T${chooseTime}`).valueOf();
  const end = moment(Start).add(Duration, 'minutes').valueOf();
  const startFormat = moment(`${date}T${chooseTime}`).format('HH:mm');
  const endFormat = moment(Start).add(Duration, 'minutes').format('HH:mm');
  const findExist = await Slot.findOne({ date: date, startFormat: startFormat, endFormat: endFormat });
  // if (findExist) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'This Slot Already Available');
  // }
  // const existSlot = await find_exist_slot(Start, end);
  // console.log(existSlot);
  const data = {
    chooseTime: isoDateTime,
    start: Start,
    end: end,
    Type: Type,
    startFormat: startFormat,
    endFormat: endFormat,
    Duration: Duration,
    date: date,
    eventId: eventId,
  };

  const creation = await Slot.create(data);
  return creation;
};

const find_exist_slot = async (start, end) => {
  // let condition_1 = { $and: [{ start: { $lt: start } }, { end: { $gte: end } }] };
  // let condition_2 = { $and: [{ start: { $gte: start } }, { end: { $lte: end } }] };
  // let condition_3 = { $and: [{ start: { $lte: start } }, { start: { $gt: end } }] };
  // let condition_4 = { $and: [{ end: { $gt: start } }, { end: { $lt: end } }] };

  let condition_1 = { $and: [{ $lt: ['$start', start] }] };
  let condition_2 = { $and: [{ $lte: ['$start', start] }, { $gte: ['$end', end] }] };
  let condition_3 = { $and: [{ $lte: ['$start', start] }, { $gt: ['$start', end] }] };
  let condition_4 = { $and: [{ $gt: ['$end', start] }, { $lt: ['$end', end] }] };

  // let condition_1 = { $and: [{ start: { $lt: start } }, { end: { $gte: end } }] };
  // let condition_2 = { $and: [{ start: { $gte: start } }, { end: { $lte: end } }] };
  // let condition_3 = { $and: [{ start: { $lte: start } }, { start: { $gt: end } }] };
  // let condition_4 = { $and: [{ end: { $gt: start } }, { end: { $lt: end } }] };

  let slotmatch = await Slot.aggregate([
    // { $match: { $or: [condition_1, condition_2, condition_3, condition_4] } },
    {
      $addFields: {
        duration: {
          $cond: {
            if: { $and: [condition_1] },
            then: 'cond-1',
            else: {
              $cond: {
                if: { $and: [condition_2] },
                then: 'cond2',
                else: {
                  $cond: {
                    if: { $and: [condition_3] },
                    then: 'cond-3',
                    else: {
                      $cond: {
                        if: { $and: [condition_4] },
                        then: 'cond-4',
                        else: 'Completed',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    { $match: { $and: [{ duration: { $ne: 'Completed' } }] } },
  ]);
  if (slotmatch.length != 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This Slot Already Available');
  }

  return slotmatch;
};

const Fetch_Slot = async (query) => {
  let { Type, Duration, start, end, date } = query;
  let TypeMatch = { _id: { $ne: null } };
  let DuarationMatch = { _id: { $ne: null } };
  let startMatch = { _id: { $ne: null } };
  let endMatch = { _id: { $ne: null } };
  let dateMatch = { _id: { $ne: null } };

  if (Type) {
    TypeMatch = { Type: Type };
  }

  if (Duration) {
    DuarationMatch = { Duration: parseInt(Duration) };
  }

  if (start) {
    startMatch = { startFormat: start };
  }

  if (end) {
    endMatch = { endFormat: end };
  }
  if (date) {
    dateMatch = { date: date };
  }

  const values = await Slot.aggregate([{ $match: { $and: [TypeMatch, DuarationMatch, startMatch, endMatch, dateMatch] } }]);
  return values;
};

const UpdateSlotById = async (id, body) => {
  let values = await Slot.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Slot Not Availbale');
  }
  values = await Slot.findByIdAndUpdate({ _id: id }, body, { new: true });
  return values;
};

const DeleteSlotById = async (id) => {
  let values = await Slot.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Slot Not Availbale');
  }
  await values.remove();
  return values;
};

const getSlots_Minutse_Wise = async () => {
  const currentDateTime = moment().format('YYYY-MM-DD');
  console.log(currentDateTime);
  let value = await Slot.aggregate([
    { $match: { date: { $gte: currentDateTime } } },
    {
      $group: {
        _id: {
          Type: '$Type',
          Duration: '$Duration',
          // startFormat: '$startFormat',
          // endFormat: '$endFormat',
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        Type: '$_id.Type',
        Duration: '$_id.Duration',
        count: '$count',
        startFormat: '$_id.startFormat',
        endFormat: '$_id.endFormat',
      },
    },
  ]);

  return value;
};

const getDetailsForSlotChoosing = async () => {
  let val = await Slot.aggregate([
    {
      $group: {
        _id: {
          date: '$date',
        },
      },
    },
    {
      $project: {
        _id: 0,
        date: '$_id.date',
      },
    },
  ]);
  let datas = await Slot.aggregate([
    {
      $group: {
        _id: '$Type',
        documents: { $push: '$$ROOT' },
      },
    },
  ]);
  return { dates: val, datas: datas };
};

const getSlotsWitdSort = async (data, userId) => {
  const { PlanId } = data;
  let value = await purchasePlan.findById(PlanId);
  if (!value) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Plan Not Availbale');
  }

  let values = await purchasePlan.aggregate([
    {
      $match: {
        _id: PlanId,
      },
    },
    {
      $lookup: {
        from: 'slotseperations',
        localField: '_id',
        foreignField: 'PlanId',
        pipeline: [{ $match: { userId: userId, Slots: { $gt: 0 } } }],
        as: 'available',
      },
    },
    {
      $project: {
        _id: 1,
        planType: 1,
        status: 1,
        planName: 1,
        slotInfo: '$available',
      },
    },
  ]);
  let datas;
  if (values.length > 0) {
    datas = values[0];
  }

  let matchdata = [];
  datas.slotInfo.forEach((e) => {
    let val = { Type: e.SlotType, Duration: e.Duration };
    matchdata.push(val);
  });

  let val = await Slot.aggregate([
    {
      $match: {
        $or: matchdata,
      },
    },
    {
      $group: {
        _id: '$Type',
        documents: { $push: '$$ROOT' },
      },
    },
  ]);
  let val2 = await Slot.aggregate([
    {
      $group: {
        _id: {
          date: '$date',
        },
      },
    },
    {
      $project: {
        _id: 0,
        date: '$_id.date',
      },
    },
  ]);
  return { val: val, dates: val2 };
  // return values
};

const getSlots_by_SlotInfo = async (query) => {
  console.log(query);
  const { id, type, duration } = query;
  let duratrionMatch = { active: true };
  if (duration != '') {
    duratrionMatch = { Duration: parseInt(duration) };
  }

  // let values = await Slot.aggregate([
  //   {
  //     $match: {
  //       $and: [duratrionMatch, { Type: type }],
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: 'slotbookings',
  //       localField: '_id',
  //       foreignField: 'slotId',
  //       pipeline: [{ $match: { streamPlanId: query.id } }],
  //       as: 'slot',
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: 'streamrequests',
  //       localField: '_id',
  //       foreignField: 'slotId',
  //       as: 'streams',
  //     },
  //   },
  // ]);

  // let values = await Slotseperation.aggregate([
  //   {
  //     $match: {
  //       streamPlanId: id,
  //       SlotType: type,
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: 'slotbookings',
  //       localField: 'streamPlanId',
  //       foreignField: 'streamPlanId',
  //       as: 'slotbookings',
  //     },
  //   },
  // ]);

  let values = await PlanSlot.aggregate([
    {
      $match: {
        streamPlanId: id,
        slotType: type,
      },
    },
    {
      $addFields: { duration: { $toString: '$Duration' } },
    },
    {
      $lookup: {
        from: 'streamplans',
        let: { calculatedDuration: '$duration' },
        pipeline: [
          {
            $lookup: {
              from: 'slotbookings',
              localField: '_id',
              foreignField: 'streamPlanId',
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ['$slotType', type] },
                        { $eq: ['$Durations', '$$calculatedDuration'] },
                        { $eq: ['$streamPlanId', id] },
                      ],
                    },
                  },
                },
                {
                  $lookup: {
                    from: 'slots',
                    localField: 'slotId',
                    foreignField: '_id',
                    pipeline: [
                      // {
                      //   $match: {
                      //     Type: '$$slotType',
                      //   },
                      // },
                      {
                        $lookup: {
                          from: 'streamrequests',
                          localField: '_id',
                          foreignField: 'slotId',
                          // pipeline: [
                          //   {
                          //     $match: { streamPlanId: id },
                          //   },
                          // ],
                          as: 'Stream',
                        },
                      },
                    ],
                    as: 'slots',
                  },
                },
                {
                  $unwind: '$slots',
                },
              ],
              as: 'slotbook',
            },
          },
          {
            $unwind: '$slotbook',
          },
        ],
        as: 'streamplan',
      },
    },
    {
      $unwind: '$streamplan',
    },
    {
      $project: {
        _id: 1,
        slotType: 1,
        streamPlanId: 1,
        Duration: 1,
        // slotbook: '$streamplan.slotbook',
        slotId: '$streamplan.slotbook.slots._id',
        start: { $ifNull: ['$streamplan.slotbook.slots.start', 'Not Booked yet slot'] },
        end: { $ifNull: ['$streamplan.slotbook.slots.end', 'Not Booked yet slot'] },
        date: { $ifNull: ['$streamplan.slotbook.slots.date', 'Not Booked yet slot'] },
        stream: { $ifNull: [{ $size: '$streamplan.slotbook.slots.Stream' }, 0] },
      },
    },
    {
      $group: {
        _id: '$slotId',
        doc: { $first: '$$ROOT' },
      },
    },
    {
      $replaceRoot: { newRoot: '$doc' },
    },
  ]);

  return values;
};

const getSlots_Duraions = async () => {
  let values = await Slot.aggregate([
    {
      $group: {
        _id: {
          Duration: '$Duration',
        },
      },
    },
    {
      $project: {
        _id: 0,
        Durations: '$_id.Duration',
      },
    },
  ]);
  return values;
};

// Streamrequest

const getStreamBySlots = async (id) => {
  const currentUnixTimestamp = moment().valueOf();

  let values = await Streamrequest.aggregate([
    {
      $match: {
        slotId: id,
      },
    },
    {
      $lookup: {
        from: 'sellers',
        localField: 'suppierId',
        foreignField: '_id',
        as: 'Suppliers',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$Suppliers',
      },
    },
    {
      $addFields: {
        isBetweenTime: {
          $and: [{ $lt: ['$startTime', currentUnixTimestamp] }, { $gte: ['$streamEnd_Time', currentUnixTimestamp] }],
        },
      },
    },
    {
      $addFields: {
        PendingStatus: { $and: [{ $gt: ['$startTime', currentUnixTimestamp] }] },
      },
    },
    {
      $addFields: {
        StreamStatus: {
          $cond: {
            if: { $eq: ['$isBetweenTime', true] },
            then: 'Onlive',
            else: 'Completed',
          },
        },
      },
    },
    {
      $addFields: {
        PendingStatus: {
          $cond: {
            if: { $eq: ['$PendingStatus', true] },
            then: 'Pending',
            else: '$StreamStatus',
          },
        },
      },
    },
  ]);

  let slot = await Slot.findById(id);

  return { values, slot };
};

const getSlots_Details_Streaming = async (slotId) => {
  const currentUnixTimestamp = moment().valueOf();

  let values = await Streamrequest.aggregate([
    {
      $match: {
        slotId: slotId,
      },
    },
    {
      $addFields: {
        isBetweenTime: {
          $and: [{ $gte: ['$startTime', currentUnixTimestamp] }, { $lt: ['$streamEnd_Time', currentUnixTimestamp] }],
        },
      },
    },
    {
      $addFields: {
        PendingStatus: { $and: [{ $gte: ['$startTime', currentUnixTimestamp] }] },
      },
    },
    {
      $addFields: {
        StreamStatus: {
          $cond: {
            if: { $eq: ['$isBetweenTime', true] },
            then: 'Onlive',
            else: 'Completed',
          },
        },
      },
    },
    {
      $addFields: {
        PendingStatus: {
          $cond: {
            if: { $eq: ['$PendingStatus', true] },
            then: 'Pending',
            else: '$StreamStatus',
          },
        },
      },
    },
  ]);
  return values;
};

const createEvents = async (body) => {
  let { arr, EventName } = body;
  let creations = await EventCreation.create(body);
  arr.forEach(async (e) => {
    let data = { ...e, ...{ EventName: EventName, eventId: creations._id } };
    await Event.create(data);
  });
  return creations;
};

const getEvents = async () => {
  let values = await EventCreation.aggregate([
    {
      $match: {
        active: true,
      },
    },
  ]);
  return values;
};

const getEventsByEventId = async (id) => {
  let values = await EventCreation.findById(id);
  return values;
};

const getSlotsByEvent = async (req) => {
  const { id, date, from, to, type, duration, fromDate, toDate } = req.query;
  let idMatch = { active: true };
  let dateMatch = { active: true };
  let FromMatch = { active: true };
  let ToMatch = { active: true };
  let TypeMatch = { active: true };
  let DurationMatch = { active: true };
  let DateDurationMatch = { active: true };

  if (id != 'null' && id) {
    idMatch = { eventId: id };
  }
  if (date != 'null' && date) {
    dateMatch = { date: date };
  }
  if (from && from != 'null') {
    FromMatch = { startFormat: from };
  }
  if (to && to != 'null') {
    ToMatch = { endFormat: to };
  }
  if (type && type != 'null') {
    TypeMatch = { Type: type };
  }

  if (duration && duration != 'null') {
    DurationMatch = { Duration: parseInt(duration) };
  }

  if ((fromDate && fromDate != 'null', toDate && toDate != 'null')) {
    DateDurationMatch = { date: { $gte: fromDate, $lte: toDate } };
  }

  const values = await Slot.aggregate([
    {
      $match: { $and: [idMatch, dateMatch, FromMatch, ToMatch, TypeMatch, DurationMatch, DateDurationMatch] },
    },
  ]);
  return values;
};

module.exports = {
  createSlot,
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
