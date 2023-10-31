const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');

const PrivateChatSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    exhibitorId: {
      type: String,
    },
    visitorId: {
      type: String,
    },
    sender: {
      type: String,
    },
    exhibitorShow: {
      type: Boolean,
      default: true,
    },
    visitorShow: {
      type: Boolean,
      default: true,
    },
    channel: {
      type: String,
    },
    msg: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    sendBy: {
      type: String,
    },
    streamId: {
      type: String,
    },
    streamName: {
      type: String,
    },
  },
  { timestamps: true }
);

const Usermessage = mongoose.model('usermessage', PrivateChatSchema);

const CommunicationSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    exhibitorId: {
      type: String,
    },
    visitorId: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    last_modify: {
      type: Date,
    },
  },
  { timestamps: true }
);
const Interaction = mongoose.model('userinteraction', CommunicationSchema);

module.exports = {
  Usermessage,
  Interaction,
};
