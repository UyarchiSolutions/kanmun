const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const Agora = require('agora-access-token');
const moment = require('moment');
const { Groupchat } = require('../../models/liveStreaming/chat.model');
const { Shop } = require('../../models/b2b.ShopClone.model');
const { Usertimeline, PropertyTimeline, StreamTimeline } = require('../../models/timeline.model');
const { Streamplan, StreamPost, Streamrequest, StreamrequestPost } = require('../../models/ecomplan.model');
const Supplier = require('../../models/supplier.model');
const config = require('../../config/config');
const jwt = require('jsonwebtoken');
const { tempTokenModel, Joinusers } = require('../../models/liveStreaming/generateToken.model');
const { CodeBuild } = require('aws-sdk');

const logger = require("../../config/logger");

const romove_message = async (req, io) => {
  //console.log(req)
  let message = await Groupchat.findById(req._id);
  message.removeMessage = true;
  message.save();
  io.sockets.emit(req.channel + "remove_image", message);
}

const ban_user_chat = async (req, io) => {
  let joinuser = await Joinusers.findById(req.joinuser);
  joinuser.joindedUserBan = true;
  joinuser.save();
  //console.log(joinuser)
  io.sockets.emit(req.joinuser + "ban_chat", joinuser);

}
const leave_subhost = async (req, io) => {
  let token = await tempTokenModel.findByIdAndUpdate({ _id: req.tokenId }, { mainhostLeave: true }, { new: true });
  io.sockets.emit(req.streamId + req.uid, { req, token });
}
const stream_view_change = async (req, io) => {
  let stream = await tempTokenModel.updateMany({ chennel: req.streamId }, { bigSize: false }, { new: true });
  let token = await tempTokenModel.findByIdAndUpdate({ _id: req.tokenId }, { bigSize: req.bigSize }, { new: true });
  // console.log(stream)
  // console.log(token)
  io.sockets.emit(req.streamId + "stream_view_change", { req, token, stream });
}

const host_controll_audio = async (req, io) => {
  let token = await tempTokenModel.findById(req.tokenId);
  let res = await tempTokenModel.findOne({ Uid: req.userId, chennel: token.chennel })
  let result = await tempTokenModel.findByIdAndUpdate({ _id: res._id }, req, { new: true })
  result.controlledBy = 'mainhost'
  result.save();
  // , req, { new: true }
  // let res = await tempTokenModel.findByIdAndUpdate({ _id: token }, req, { new: true })
  io.sockets.emit(result._id + result.Uid + "_audio", { req, result });
}
const host_controll_video = async (req, io) => {
  let token = await tempTokenModel.findById(req.tokenId);
  let res = await tempTokenModel.findOne({ Uid: req.userId, chennel: token.chennel })
  let result = await tempTokenModel.findByIdAndUpdate({ _id: res._id }, req, { new: true })
  result.controlledBy = 'mainhost'
  result.save();
  // , req, { new: true }
  // let res = await tempTokenModel.findByIdAndUpdate({ _id: token }, req, { new: true })
  io.sockets.emit(result._id + result.Uid + "_video", { req, result });
}
const host_controll_all = async (req, io) => {
  let token = await tempTokenModel.findById(req.tokenId);
  let res = await tempTokenModel.findOne({ Uid: req.userId, chennel: token.chennel })
  let result = await tempTokenModel.findByIdAndUpdate({ _id: res._id }, { ...req, ...{ video: true, audio: true } }, { new: true })
  result.controlledBy = 'mainhost'
  result.save();
  // , req, { new: true }
  // let res = await tempTokenModel.findByIdAndUpdate({ _id: token }, req, { new: true })
  io.sockets.emit(result._id + result.Uid + "_all", { req, result });
}

const admin_allow_controls = async (req, io) => {
  let token = await tempTokenModel.findById(req.tokenId);
  let res = await tempTokenModel.findOne({ Uid: req.userId, chennel: token.chennel })
  let result = await tempTokenModel.findByIdAndUpdate({ _id: res._id }, { ...req, ...{ mainhostLeave: false } }, { new: true })
  result.controlledBy = 'mainhost'
  result.save();
  io.sockets.emit(result._id + result.Uid + "allow_stream", { req, result });
}
const startStop_post = async (req, io) => {
  // let dateIso = new Date(new Date(moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss'))).getTime();
  // let stream = await Joinusers.findById(req.id)
  // let user = await Shop.findById(stream.shopId)
  // let data = await Groupchat.create({ ...req, ...{ created: moment(), dateISO: dateIso, userName: user.SName, userType: "buyer", shopId: stream.shopId, joinuser: req.id } })

  let post = await StreamPost.findById(req.streampostsId);
  if (req.start) {
    let streamStart = new Date().getTime();
    await StreamPost.findByIdAndUpdate({ _id: req.streampostsId }, { streamStart: streamStart }, { new: true });
  }
  if (req.end) {
    let streamEnd = new Date().getTime();
    await StreamPost.findByIdAndUpdate({ _id: req.streampostsId }, { streamEnd: streamEnd }, { new: true });

  }

  // post.save();

  let value = await Streamrequest.aggregate([
    { $match: { $and: [{ adminApprove: { $eq: "Approved" } }, { _id: { $eq: req.streamId } }] } },
    {
      $lookup: {
        from: 'streamrequestposts',
        localField: '_id',
        foreignField: 'streamRequest',
        pipeline: [
          {
            $lookup: {
              from: 'streamposts',
              localField: 'postId',
              foreignField: '_id',
              pipeline: [
                {
                  $lookup: {
                    from: 'products',
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'products',
                  },
                },
                { $unwind: "$products" },
                {
                  $project: {
                    _id: 1,
                    productTitle: "$products.productTitle",
                    productImage: "$products.image",
                    productId: 1,
                    categoryId: 1,
                    quantity: 1,
                    marketPlace: 1,
                    offerPrice: 1,
                    postLiveStreamingPirce: 1,
                    validity: 1,
                    minLots: 1,
                    incrementalLots: 1,
                    suppierId: 1,
                    DateIso: 1,
                    created: 1,
                    streamStart: 1,
                    streamEnd: 1
                  }
                }
              ],
              as: 'streamposts',
            },
          },
          { $unwind: "$streamposts" },
          {
            $project: {
              _id: 1,
              productTitle: "$streamposts.productTitle",
              productId: "$streamposts.productId",
              quantity: "$streamposts.quantity",
              marketPlace: "$streamposts.marketPlace",
              offerPrice: "$streamposts.offerPrice",
              postLiveStreamingPirce: "$streamposts.postLiveStreamingPirce",
              validity: "$streamposts.validity",
              minLots: "$streamposts.minLots",
              incrementalLots: "$streamposts.incrementalLots",
              productImage: "$streamposts.productImage",
              streamStart: "$streamposts.streamStart",
              streamEnd: "$streamposts.streamEnd",
              streampostsId: "$streamposts._id"

            }
          }
        ],
        as: 'streamrequestposts',
      },
    },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'suppierId',
        foreignField: '_id',
        as: 'suppliers',
      },
    },
    { $unwind: "$suppliers" },
    {
      $lookup: {
        from: 'streamrequestposts',
        localField: '_id',
        foreignField: 'streamRequest',
        pipeline: [
          { $match: { $and: [{ streamStart: { $ne: null } }, { streamEnd: { $eq: null } }] } },
          { $group: { _id: null, count: { $sum: 1 } } }
        ],
        as: 'streamrequestposts_start',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$streamrequestposts_start',
      },
    },
    {
      $addFields: {
        streamPending: { $ifNull: ['$streamrequestposts_start.count', false] },
      },
    },
    {
      $project: {
        _id: 1,
        supplierName: "$suppliers.primaryContactName",
        active: 1,
        archive: 1,
        post: 1,
        communicationMode: 1,
        sepTwo: 1,
        bookingAmount: 1,
        streamingDate: 1,
        streamingTime: 1,
        discription: 1,
        streamName: 1,
        suppierId: 1,
        postCount: 1,
        DateIso: 1,
        created: 1,
        planId: 1,
        streamrequestposts: "$streamrequestposts",
        adminApprove: 1,
        Duration: 1,
        startTime: 1,
        endTime: 1,
        streamPending: 1

      }
    },

  ])
  io.sockets.emit(req.streamId + "postStart", { post, value });

}

const current_live_jion_count = async (req, io) => {

}



const cost_connect_live_now = async (socket) => {
  // console.log(socket.timeline,87687667)
  if (socket.timeline != null) {
    const timeline = await Usertimeline.findByIdAndUpdate({ _id: socket.timeline }, { socketId: socket.id }, { new: true });
    logger.info(`user Connected -> ${timeline.userName} - ${timeline.mobileNumber}`)
  }
}

const livestream_joined = async (streamId, socket, io) => {
  // console.log(98765789765546)
  let timeline = socket.timeline;
  let userId = socket.userId;

  const userTimeline = await Usertimeline.findById(socket.timeline);
  console.log(11111)
  if (userTimeline) {
    console.log(2222)
    if (userTimeline.userId == userId) {
      console.log(33333);
      // console.log(78908765678, true, streamId)
      let stream = await StreamTimeline.create({
        timeline: timeline,
        userId: userId,
        streamId: streamId,
        usertimeline: timeline,
        Device: userTimeline.Device,
        IN: new Date().getTime(),
      })
      userTimeline.streamingTimelineID = stream._id;
      userTimeline.streamId = streamId;
      userTimeline.save();

      let streamrequest = await Streamrequest.findById(streamId);
      if (streamrequest) {
        console.log(44444);
        // streamrequest.join_users = streamrequest.join_users == null ? [] : streamrequest.join_users;
        // streamrequest.Current_join = streamrequest.Current_join == null ? [] : streamrequest.Current_join;
        let index = streamrequest.join_users.findIndex((a) => a == userId);
        console.log(index, 78678765)
        if (index == -1) {
          let join = streamrequest.join_users.concat([userId]);
          streamrequest.join_users = join;
        }
        let index_all = streamrequest.Current_join.findIndex((a) => a == userId);
        if (index_all == -1) {
          let join = streamrequest.Current_join.concat([userId]);
          streamrequest.Current_join = join;
          streamrequest.streamCurrent_Watching = join.length;
        }
        streamrequest.save();
        setTimeout(() => {
          io.sockets.emit(streamId + "_current_watching", { streamCurrent_Watching: streamrequest.streamCurrent_Watching })
        }, 100)
      }
    }
    else {
      // console.log(78908765678, false)
    }
  }
}

const livestream_leave = async (streamId, socket, io) => {
  let timeline = socket.timeline;
  let userId = socket.userId;
  console.log(socket.timeline, 798678675)
  if (socket.timeline != null) {
    const userTimeline = await Usertimeline.findById(timeline);
    console.log(userTimeline)
    // console.log(userTimeline, 9876898797657)
    if (userTimeline) {
      if (userTimeline.userId == userId) {
        let stream = await StreamTimeline.findById(userTimeline.streamingTimelineID);
        if (stream) {
          stream.OUT = new Date().getTime();
          stream.status = "END";
          stream.save();
        }
        userTimeline.streamingTimelineID = null;
        userTimeline.streamId = null;
        userTimeline.save();
        let streamrequest = await Streamrequest.findById(streamId);
        let join = streamrequest.Current_join;
        if (streamrequest) {
          let index = streamrequest.Current_join.findIndex((a) => a == userId);
          console.log(index, 786876)
          if (index != -1) {
            join.splice(index, 1);
            console.log(join, 767687876)
            streamrequest.Current_join = join
            streamrequest.streamCurrent_Watching = join.length;
          }

          streamrequest.save();
          io.sockets.emit(streamId + "_current_watching", { streamCurrent_Watching: streamrequest.streamCurrent_Watching })
        }
      }
    }
  }
}



const auth_details = async (socket, token, next) => {
  try {
    const payload = jwt.verify(token, config.jwt.secret);
    socket.timeline = payload.timeline;
    socket.role = payload.role;
    socket.userId = payload._id;
    return next();
  } catch {
    return next();
  }
}

const user_Disconect = async (socket, io) => {
  console.log("user disconnetced", 8767868, socket.timeline)
  let timeline = socket.timeline;
  let userId = socket.userId;
  let streamId;
  if (socket.timeline != null) {
    const userTimeline = await Usertimeline.findById(timeline);

    if (userTimeline) {
      if (userTimeline.streamId != null && userTimeline.userId == userId) {
        streamId = userTimeline.streamId;
        let stream = await StreamTimeline.findById(userTimeline.streamingTimelineID);
        if (stream) {
          stream.OUT = new Date().getTime();
          stream.status = "END";
          stream.save();
        }
        userTimeline.streamingTimelineID = null;
        userTimeline.streamId = null;
        userTimeline.save();
        let streamrequest = await Streamrequest.findById(streamId);
        if (streamrequest != null) {
          let index = streamrequest.Current_join.findIndex((a) => a == userId);
          let join = streamrequest.Current_join;
          if (index != -1) {
            let counts = streamrequest.streamCurrent_Watching - 1 >= 0 ? streamrequest.streamCurrent_Watching - 1 : 0;
            join.splice(index, 1);
            streamrequest = await Streamrequest.findByIdAndUpdate({ _id: streamrequest._id }, { streamCurrent_Watching: join.length, Current_join: join });
            io.sockets.emit(streamId + "_current_watching", { streamCurrent_Watching: counts })

          }
          // streamrequest.streamCurrent_Watching = streamrequest.streamCurrent_Watching - 1 >= 0 ? streamrequest.streamCurrent_Watching - 1 : 0;
        }
      }
    }
  }
}




module.exports = {
  startStop_post,
  leave_subhost,
  host_controll_audio,
  host_controll_video,
  host_controll_all,
  admin_allow_controls,
  stream_view_change,
  romove_message,
  ban_user_chat,
  current_live_jion_count,
  cost_connect_live_now,
  livestream_joined,
  auth_details,
  livestream_leave,
  user_Disconect
};
