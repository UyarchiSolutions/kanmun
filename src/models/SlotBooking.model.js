const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');

const SlotBookingSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    slotDate: {
      type: String,
    },
    fromTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    Durations: {
      type: String,
    },
    slotType: String,
    PlanId: String,
    status: {
      type: String,
      default: 'pending',
    },
    userId: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    SlotDuration: {
      type: Number,
    },
    slotId: {
      type: String,
    },
    streamPlanId: {
      type: String,
    },
    timeline: {
      type: Array,
      default: [],
    }
  },
  { timestamps: true }
);

const SlotBooking = mongoose.model('SlotBooking', SlotBookingSchema);

module.exports = { SlotBooking };
