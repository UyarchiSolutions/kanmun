const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Usermessage, Interaction } = require('../models/PrivateChat.model');
const { Seller } = require('../models/seller.models');
const moment = require('moment');
const { Shop, AttendanceClone, AttendanceClonenew } = require('../models/b2b.ShopClone.model');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const {
  Streamplan,
  StreamPost,
  Streamrequest,
  StreamrequestPost,
  StreamPreRegister,
  streamPlanlink,
  Slab,
  shopNotification,
  PlanSlot,
  Instestedproduct,
  Savedproduct,
  Notify,
  Streampostprice,
} = require('../models/ecomplan.model');

const intraction_exhibitor = async (req) => {
  const { channel } = req.body;
  let shopId = req.shopId;
  let intraction = await Interaction.findOne({ exhibitorId: channel, visitorId: shopId });
  if (!intraction) {
    intraction = await Interaction.create({ exhibitorId: channel, visitorId: shopId });
  }
  // console.log(intraction)
  return intraction;
};

const recived_message = async (data, io, header) => {
  const intr = await Interaction.findById(data.chat);
  const payload = jwt.verify(header.token, config.jwt.secret);
  const userss = await Shop.findOne({ _id: payload._id, active: true });
  let streamName = '';
  if (data.stream != null) {
    let stream = await Streamrequest.findById(data.stream);
    if (stream) {
      streamName = stream.streamName;
    }
  }
  if (intr) {
    if (userss) {
      let shopId = payload._id;
      let msg = await Usermessage.create({
        exhibitorId: intr.exhibitorId,
        visitorId: shopId,
        sender: shopId,
        channel: data.chat,
        msg: data.msg,
        streamId: data.stream,
        streamName: streamName,
        sendBy: 'visitor',
      });
      intr.last_modify = moment();
      intr.save();
      io.sockets.emit(data.chat, msg);
    }
  }
};

const recived_message_exp = async (data, io, header) => {
  const intr = await Interaction.findById(data.chat);
  const payload = jwt.verify(header.token, config.jwt.secret);
  const userss = await Seller.findOne({ _id: payload._id, active: true });
  // let streamName = '';
  // if (data.stream != null) {
  //   let stream = await Streamrequest.findById(data.stream);
  //   if (stream) {
  //     streamName = stream.streamName;
  //   }
  // }
  if (intr) {
    if (userss) {
      let shopId = payload._id;
      let msg = await Usermessage.create({
        exhibitorId: intr.exhibitorId,
        visitorId: intr.visitorId,
        sender: shopId,
        channel: data.chat,
        msg: data.msg,
        sendBy: 'exhibitor',
      });
      intr.last_modify = moment();
      intr.save();
      io.sockets.emit(data.chat, msg);
    }
  }
};


const same_user_jion_exhibitor = async (data, io, header) => {
  // console.log(data,header);
  const payload = jwt.verify(header.token, config.jwt.secret);
  const userss = await Seller.findOne({ _id: payload._id, active: true });
  // console.log(userss)
  if (userss) {
    console.log(data.stream + userss._id);
    io.sockets.emit(data.stream + userss._id, { code: data.code });
  }
};

const get_old_chat = async (req) => {
  let channel = req.query.chat;
  let page = req.query.page == '' || req.query.page == null || req.query.page == null ? 0 : parseInt(req.query.page);
  let message = await Usermessage.aggregate([
    { $match: { $and: [{ channel: { $eq: channel } }, { visitorShow: { $eq: true } }] } },
    { $sort: { createdAt: -1 } },
    { $skip: 50 * page },
    { $limit: 50 },
    { $sort: { createdAt: 1 } },
  ]);
  let next = await Usermessage.aggregate([
    { $match: { $and: [{ channel: { $eq: channel } }, { visitorShow: { $eq: true } }] } },
    { $sort: { createdAt: -1 } },
    { $skip: 50 * (page + 1) },
    { $limit: 50 },
  ]);
  return { message, next: next.length != 0 };
};

const getMmesages = async (req) => {
  let exhibitorId = req.userId;
  let values = await Interaction.aggregate([
    {
      $match: {
        exhibitorId: exhibitorId,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'visitorId',
        foreignField: '_id',
        as: 'visitors',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$visitors',
      },
    },
    {
      $lookup: {
        from: 'usermessages',
        localField: '_id',
        foreignField: 'channel',
        pipeline: [
          { $sort: { createdAt: -1 } },
          { $limit: 1 }
        ],
        as: 'usermessages',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$usermessages',
      },
    },
    {
      $project: {
        _id: 1,
        exhibitorId: 1,
        visitorId: 1,
        last_modify: 1,
        SName: "$visitors.SName",
        userinteractions: "$usermessages.msg",
        latestMesaage: "$usermessages.createdAt"
      }
    },
    { $sort: { latestMesaage: -1 } }
  ]);
  return values;
};

module.exports = {
  intraction_exhibitor,
  recived_message,
  get_old_chat,
  same_user_jion_exhibitor,
  getMmesages,
  recived_message_exp
};
