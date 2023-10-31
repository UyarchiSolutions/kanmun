const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');

const SlotSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    Type: String,
    Duration: Number,
    chooseTime: {
      type: Date,
    },
    start: Number,
    end: Number,
    active: {
      type: Boolean,
      default: true,
    },
    startFormat: String,
    endFormat: String,
    Status: {
      type: String,
      default: 'Pending',
    },
    date: {
      type: String,
    },
    eventId: {
      type: String,
    },
  },
  { timestamps: true }
);

const Slot = mongoose.model('slot', SlotSchema);

const SlotseperationSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    SlotType: {
      type: String,
    },
    Duration: Number,
    PlanId: {
      type: String,
    },
    Slots: Number,
    usedSlots: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: 'Pending',
    },
    active: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: String,
    },
    streamPlanId: {
      type: String,
    },
  },
  { timestamps: true }
);

const Slotseperation = mongoose.model('Slotseperation', SlotseperationSchema);

const EventSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    date: {
      type: String,
    },
    From: {
      type: String,
    },
    to: {
      type: String,
    },
    EventName: {
      type: String,
    },
    eventId: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Event = mongoose.model('agriEvent', EventSchema);

const EventCreationSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    EventName: {
      type: String,
    },
    arr: {
      type: Array,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const EventCreation = mongoose.model('eventCreation', EventCreationSchema);

module.exports = { Slot, Slotseperation, Event, EventCreation };
