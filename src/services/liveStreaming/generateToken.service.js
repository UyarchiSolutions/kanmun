const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const Agora = require('agora-access-token');
const moment = require('moment');
const { tempTokenModel, Joinusers, RaiseUsers } = require('../../models/liveStreaming/generateToken.model');
const axios = require('axios'); //
// const appID = '1ba2592b16b74f3497e232e1b01f66b0';
// const appCertificate = '8ae85f97802448c2a47b98715ff90ffb';
// const Authorization = `Basic ${Buffer.from(`61b817e750214d58ba9d8148e7c89a1b:88401de254b2436a9da15b2f872937de`).toString(
//   'base64'
// )}`;
const Dates = require('../Date.serive');

const { v4 } = require('uuid')
const {
  Streamplan,
  StreamPost,
  Streamrequest,
  StreamrequestPost,
  StreamPreRegister,
} = require('../../models/ecomplan.model');
const { request } = require('express');

const { AgoraAppId, UsageAppID } = require('../../models/liveStreaming/AgoraAppId.model');

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const path = require('path');
const AWS = require('aws-sdk');

const generateUid = async (req) => {
  const length = 5;
  const randomNo = Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
  return randomNo;
};

const generateToken = async (req) => {
  let supplierId = req.userId;
  let streamId = req.body.streamId;
  //console.log(streamId)
  let stream = await Streamrequest.findById(streamId);
  if (!streamId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream not found');
  }
  const expirationTimeInSeconds = 3600;
  const uid = await generateUid();
  const uid_cloud = await generateUid();
  const role = req.body.isPublisher ? Agora.RtcRole.PUBLISHER : Agora.RtcRole.SUBSCRIBER;
  const moment_curr = moment(stream.startTime);
  const currentTimestamp = moment_curr.add(stream.Duration, 'minutes');
  const expirationTimestamp = stream.endTime / 1000;
  let value = await tempTokenModel.create({
    ...req.body,
    ...{
      date: moment().format('YYYY-MM-DD'),
      time: moment().format('HHMMSS'),
      supplierId: supplierId,
      streamId: streamId,
      created: moment(),
      Uid: uid,
      participents: 3,
      created_num: new Date(new Date(moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss'))).getTime(),
      expDate: expirationTimestamp * 1000,
      Duration: stream.Duration,
    },
  });
  const token = await geenerate_rtc_token(streamId, uid, role, expirationTimestamp);
  value.token = token;
  value.chennel = streamId;
  value.store = stream._id.replace(/[^a-zA-Z0-9]/g, '');
  let cloud_recording = await generateToken_sub_record(streamId, false, req, value, expirationTimestamp);
  value.cloud_recording = cloud_recording.value.token;
  value.uid_cloud = cloud_recording.value.Uid;
  value.cloud_id = cloud_recording.value._id;
  value.save();
  stream.tokenDetails = value._id;
  stream.tokenGeneration = true;
  stream.goLive = true;
  stream.save();
  req.io.emit(streamId + '_golive', { streamId: streamId });
  return { uid, token, value, cloud_recording, stream };
};
const geenerate_rtc_token = async (chennel, uid, role, expirationTimestamp, agoraID) => {
  let agoraToken = await AgoraAppId.findById(agoraID)
  return Agora.RtcTokenBuilder.buildTokenWithUid(agoraToken.appID.replace(/\s/g, ''), agoraToken.appCertificate.replace(/\s/g, ''), chennel, uid, role, expirationTimestamp);
};
const generateToken_sub_record = async (channel, isPublisher, req, hostIdss, expire) => {
  const expirationTimeInSeconds = 3600;
  const uid = await generateUid();
  const role = isPublisher ? Agora.RtcRole.PUBLISHER : Agora.RtcRole.SUBSCRIBER;
  //console.log(role);
  const moment_curr = moment();
  const currentTimestamp = moment_curr.add(600, 'minutes');
  const expirationTimestamp =
    new Date(new Date(currentTimestamp.format('YYYY-MM-DD') + ' ' + currentTimestamp.format('HH:mm:ss'))).getTime() / 1000;
  let value = await tempTokenModel.create({
    ...req.body,
    ...{
      date: moment().format('YYYY-MM-DD'),
      time: moment().format('HHMMSS'),
      created: moment(),
      Uid: uid,
      chennel: channel,
      participents: 3,
      created_num: new Date(new Date(moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss'))).getTime(),
      expDate: expirationTimestamp * 1000,
      type: 'subhost',
      hostId: hostIdss._id,
    },
  });
  //console.log(role);
  const token = await geenerate_rtc_token(channel, uid, role, expirationTimestamp);
  console.log
  value.token = token;
  value.save();
  return { uid, token, value };
};

const generateToken_sub = async (req) => {
  let body = req.body
  const channel = req.query.id;
  let str = await Streamrequest.findById(channel);
  let users = await Joinusers.find({ streamId: channel }).count();
  let user = await Joinusers.findOne({ streamId: channel, shopId: req.shopId });
  if (!user) {
    user = await Joinusers.create({ shopId: req.shopId, streamId: channel, hostId: str.tokenDetails });
    await Dates.create_date(user);
  }
  let stream = await tempTokenModel.findOne({ streamId: channel, type: 'sub', joinedUser: user._id, shopId: req.shopId });
  if (!stream) {
    const uid = await generateUid();
    const role = Agora.RtcRole.SUBSCRIBER;
    let value = await tempTokenModel.create({
      ...body,
      ...{
        hostId: str.tokenDetails,
        type: 'sub',
        date: moment().format('YYYY-MM-DD'),
        time: moment().format('HHMMSS'),
        created: moment(),
        Uid: uid,
        chennel: channel,
        participents: 3,
        created_num: new Date(new Date(moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss'))).getTime(),
        expDate: str.endTime,
        shopId: req.shopId,
        streamId: channel,
        joinedUser: user._id,
      },
    });
    const token = await geenerate_rtc_token(channel, uid, role, str.endTime / 1000, str.agoraID);
    value.token = token;
    value.save();
    stream = value;
  }
  let userjoin = await Joinusers.findByIdAndUpdate({ _id: user._id }, { latestedToken: stream._id, token: stream._id }, { new: true });
  await get_participents_limit(req);
  req.io.emit(userjoin.last_joined, { leave: true });
  return { stream: stream, user: user };

};

const getHostTokens = async (req) => {
  let time = new Date(new Date(moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss'))).getTime();
  let value = await tempTokenModel.aggregate([
    {
      $sort: {
        created: -1,
      },
    },
    {
      $match: {
        $and: [{ expDate: { $gte: time - 60 } }, { type: { $eq: 'host' } }],
      },
    },
    {
      $lookup: {
        from: 'temptokens',
        localField: '_id',
        foreignField: 'hostId',
        pipeline: [
          {
            $match: {
              $and: [{ active: { $eq: true } }],
            },
          },
          { $group: { _id: null, count: { $sum: 1 } } },
        ],
        as: 'active_users',
      },
    },
    {
      $unwind: {
        path: '$active_users',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'temptokens',
        localField: '_id',
        foreignField: 'hostId',
        pipeline: [
          {
            $match: {
              $and: [{ active: { $eq: false } }],
            },
          },
          { $group: { _id: null, count: { $sum: 1 } } },
        ],
        as: 'total_users',
      },
    },
    {
      $unwind: {
        path: '$total_users',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        type: 1,
        date: 1,
        Uid: 1,
        chennel: 1,
        participents: 1,
        created_num: 1,
        expDate: 1,
        created: 1,
        active_users: { $ifNull: ['$active_users.count', 0] },
        In_active_users: { $ifNull: ['$total_users.count', 0] },
        total_user: { $sum: ['$total_users.count', '$active_users.count'] },
        active: 1,
      },
    },
  ]);
  return value;
};

const gettokenById = async (req) => {
  let value = await tempTokenModel.findById(req.id);
  return value;
};
const gettokenById_host = async (req) => {
  let value = await tempTokenModel.findById(req.id);
  // const uid = await generateUid();
  // const role = Agora.RtcRole.PUBLISHER;
  // const token = await geenerate_rtc_token(value.chennel, uid, role, value.expDate / 1000);
  // value.token = token;
  // value.Uid = uid;
  // value.save();
  // //console.log(role);
  return value;
};
const leave_participents = async (req) => {
  let value = await tempTokenModel.findByIdAndUpdate({ _id: req.query.id }, { active: false }, { new: true });
  return value;
};

const leave_host = async (req) => {
  let value = await tempTokenModel.findByIdAndUpdate({ _id: req.id }, { active: false }, { new: true });
  return value;
};
const join_host = async (req) => {
  let value = await tempTokenModel.findByIdAndUpdate({ _id: req.id }, { active: true }, { new: true });
  return value;
};

const participents_limit = async (req) => {
  let participents = await tempTokenModel.findById(req.id);
  let value = await tempTokenModel.find({ hostId: req.id, active: true }).count();
  return { participents: value >= participents.participents ? false : true };
};

const agora_acquire = async (req, id, agroaID) => {
  let temtoken = id;
  let agoraToken = await AgoraAppId.findById(agroaID);
  console.log(agoraToken, 8888)
  // let temtoken=req.body.id;
  let token = await tempTokenModel.findById(temtoken);
  const Authorization = `Basic ${Buffer.from(agoraToken.Authorization.replace(/\s/g, '')).toString(
    'base64'
  )}`;
  const acquire = await axios.post(
    `https://api.agora.io/v1/apps/${agoraToken.appID.replace(/\s/g, '')}/cloud_recording/acquire`,
    {
      cname: token.chennel,
      uid: token.Uid.toString(),
      clientRequest: {
        resourceExpiredHour: 24,
        scene: 0,
      },
    },
    { headers: { Authorization } }
  );
  token.resourceId = acquire.data.resourceId;
  token.recoredStart = 'acquire';
  token.save();
};

const recording_start = async (req, id) => {
  let token = await tempTokenModel.findOne({ chennel: id, type: 'CloudRecording', recoredStart: { $eq: "acquire" } }).sort({ created: -1 });
  if (token) {
    let str = await Streamrequest.findById(token.streamId);
    let agoraToken = await AgoraAppId.findById(str.agoraID);
    const Authorization = `Basic ${Buffer.from(agoraToken.Authorization.replace(/\s/g, '')).toString(
      'base64'
    )}`;
    let nowDate = moment().format('DDMMYYYY');
    if (token.recoredStart == 'acquire') {
      const resource = token.resourceId;
      const mode = 'mix';
      const start = await axios.post(
        `https://api.agora.io/v1/apps/${agoraToken.appID.replace(/\s/g, '')}/cloud_recording/resourceid/${resource}/mode/${mode}/start`,
        {
          cname: token.chennel,
          uid: token.Uid.toString(),
          clientRequest: {
            token: token.token,
            recordingConfig: {
              maxIdleTime: 15,
              streamTypes: 2,
              channelType: 1,
              videoStreamType: 0,
              transcodingConfig: {
                height: 640,
                width: 1080,
                bitrate: 1000,
                fps: 15,
                mixedVideoLayout: 1,
                backgroundColor: '#FFFFFF',
              },
            },
            recordingFileConfig: {
              avFileType: ['hls', 'mp4'],
            },
            storageConfig: {
              vendor: 1,
              region: 14,
              bucket: 'streamingupload',
              accessKey: 'AKIA3323XNN7Y2RU77UG',
              secretKey: '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',
              fileNamePrefix: [nowDate.toString(), token.store, token.Uid.toString()],
            },
          },
        },
        { headers: { Authorization } }
      );
      token.resourceId = start.data.resourceId;
      token.sid = start.data.sid;
      token.recoredStart = 'start';
      token.save();
      setTimeout(async () => {
        await recording_query(req, token._id, agoraToken);
      }, 3000);
      return start.data;
    }
    else {
      return { message: 'Already Started' };
    }
  }
  else {
    return { message: 'Already Started' };
  }
};
const recording_query = async (req, id, agoraToken) => {
  const Authorization = `Basic ${Buffer.from(agoraToken.Authorization.replace(/\s/g, '')).toString(
    'base64'
  )}`;
  let temtoken = id;
  let token = await tempTokenModel.findById(temtoken);
  if (!token) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream not found');
  }
  const resource = token.resourceId;
  const sid = token.sid;
  const mode = 'mix';
  const query = await axios.get(
    `https://api.agora.io/v1/apps/${agoraToken.appID.replace(/\s/g, '')}/cloud_recording/resourceid/${resource}/sid/${sid}/mode/${mode}/query`,
    { headers: { Authorization } }
  ).then((res) => {
    return res;
  }).catch((err) => {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cloud Recording Query:' + err.message);
  });;

  if (query.data != null) {
    if (query.data.serverResponse != null) {
      if (query.data.serverResponse.fileList != null) {
        if (query.data.serverResponse.fileList.length != 0) {
          if (Array.isArray(query.data.serverResponse.fileList)) {
            token.videoLink = query.data.serverResponse.fileList[0].fileName;
            token.videoLink_array = query.data.serverResponse.fileList;
            let m3u8 = query.data.serverResponse.fileList[0].fileName;
            if (m3u8 != null) {
              let mp4 = m3u8.replace('.m3u8', '_0.mp4')
              token.videoLink_mp4 = mp4;
            }
            token.recoredStart = 'query';
            token.save();
          }
          else {
            token.videoLink = query.data.serverResponse.fileList.fileName;
            let m3u8 = query.data.serverResponse.fileList.fileName;
            if (m3u8 != null) {
              let mp4 = m3u8.replace('.m3u8', '_0.mp4')
              token.videoLink_mp4 = mp4;
            }
            token.recoredStart = 'query';
            token.save();
          }
        }
      }
    }
    return query.data;
  }
  else {
    return { message: "Query failed" };
  }
};

const recording_stop = async (req) => {
  let token = await tempTokenModel.findOne({ chennel: req.body.stream, type: 'CloudRecording', recoredStart: { $eq: "query" } }).sort({ created: -1 });
  if (token) {
    let str = await Streamrequest.findById(token.streamId);
    let agoraToken = await AgoraAppId.findById(str.agoraID);
    const Authorization = `Basic ${Buffer.from(agoraToken.Authorization.replace(/\s/g, '')).toString(
      'base64'
    )}`;
    if (token.recoredStart == 'query') {
      const resource = token.resourceId;
      const sid = token.sid;
      const mode = 'mix';

      const stop = await axios.post(
        `https://api.agora.io/v1/apps/${agoraToken.appID}/cloud_recording/resourceid/${resource}/sid/${sid}/mode/${mode}/stop`,
        {
          cname: token.chennel,
          uid: token.Uid.toString(),
          clientRequest: {},
        },
        {
          headers: {
            Authorization,
          },
        }
      ).then((res) => {
        return res;
      }).catch((err) => {

        throw new ApiError(httpStatus.NOT_FOUND, 'Cloud Recording Stop:' + err.message);
      });

      token.recoredStart = 'stop';
      if (stop.data.serverResponse.fileList.length == 2) {
        token.videoLink = stop.data.serverResponse.fileList[0].fileName;
        token.videoLink_array = stop.data.serverResponse.fileList;
        let m3u8 = stop.data.serverResponse.fileList[0].fileName;
        token.videoLink_mp4 = m3u8;
      }
      token.save();
      return stop;
    }
    else {
      return { message: 'Already Stoped' };
    }
  }
  else {
    return { message: 'Clound not Found' };
  }
};
const recording_updateLayout = async (req) => {
  const acquire = await axios.post(
    `https://api.agora.io/v1/apps/${appID}/cloud_recording/acquire`,
    {
      cname: 'test',
      uid: '16261',
      clientRequest: {
        resourceExpiredHour: 24,
      },
    },
    { headers: { Authorization } }
  );

  return acquire.data;
};

const chat_rooms = async (req) => {
  let value = await tempTokenModel.findById(req.id);
  return value;
};

const get_sub_token = async (req) => {
  let value = await tempTokenModel.aggregate([
    { $match: { $and: [{ _id: { $eq: req.id } }] } },
    {
      $lookup: {
        from: 'temptokens',
        localField: 'hostId',
        foreignField: '_id',
        as: 'active_users',
      },
    },
    { $unwind: '$active_users' },
    {
      $project: {
        _id: 1,
        active: 1,
        archived: 1,
        hostId: 1,
        type: 1,
        date: 1,
        time: 1,
        created: 1,
        Uid: 1,
        chennel: 1,
        participents: 1,
        created_num: 1,
        expDate: 1,
        token: 1,
        hostUid: '$active_users.Uid',
        expDate_host: '$active_users.expDate',
      },
    },
  ]);
  if (value.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'plan_not_found');
  }
  return value[0];
};

const get_sub_golive_details = async (req, io) => {
  let code = req.query.code;
  let streamId = req.query.id;
  let value = await Joinusers.aggregate([
    { $match: { $and: [{ _id: { $eq: req.query.id } }, { shopId: { $eq: req.shopId } }] } },
    {
      $lookup: {
        from: 'temptokens',
        localField: 'latestedToken',
        foreignField: '_id',
        pipeline: [
          {
            $lookup: {
              from: 'temptokens',
              localField: 'hostId',
              foreignField: '_id',
              as: 'active_users',
            },
          },
          // { $unwind: "$active_users" },
          {
            $project: {
              active: 1,
              archived: 1,
              hostId: 1,
              type: 1,
              date: 1,
              time: 1,
              created: 1,
              Uid: 1,
              chennel: 1,
              participents: 1,
              created_num: 1,
              expDate: 1,
              token: 1,
              // hostUid: "$active_users.Uid",
              // expDate_host: "$active_users.expDate",
              // active_users: "$active_users"
            },
          },
        ],
        as: 'temptokens',
      },
    },
    { $unwind: '$temptokens' },
    {
      $lookup: {
        from: 'streamrequests',
        localField: 'streamId',
        foreignField: '_id',
        pipeline: [
          {
            $lookup: {
              from: 'purchasedplans',
              localField: 'planId',
              foreignField: '_id',
              // pipeline: [
              //   {
              //     $lookup: {
              //       from: 'streamplans',
              //       localField: 'planId',
              //       foreignField: '_id',
              //       as: 'streamplans',
              //     },
              //   },
              //   { $unwind: '$streamplans' },
              // ],
              as: 'purchasedplans',
            },
          },
          { $unwind: '$purchasedplans' },
          {
            $lookup: {
              from: 'agoraappids',
              localField: 'agoraID',
              foreignField: '_id',
              as: 'agoraappids',
            },
          },
          {
            $unwind: {
              preserveNullAndEmptyArrays: true,
              path: '$agoraappids',
            },
          },
        ],
        as: 'streamrequests',
      },
    },
    { $unwind: '$streamrequests' },
    {
      $lookup: {
        from: 'streamrequests',
        localField: 'streamId',
        foreignField: '_id',
        pipeline: [
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
                      { $unwind: '$products' },
                      {
                        $lookup: {
                          from: 'intrestedproducts',
                          localField: '_id',
                          foreignField: 'productID',
                          pipeline: [
                            { $match: { $and: [{ userID: req.shopId }] } }
                          ],
                          as: 'intrestedproduct',
                        },
                      },
                      {
                        $unwind: {
                          preserveNullAndEmptyArrays: true,
                          path: '$intrestedproduct',
                        },
                      },
                      {
                        $addFields: {
                          intrested: { $ifNull: ['$intrestedproduct.intrested', false] },
                        },
                      },
                      {
                        $lookup: {
                          from: 'savedproducts',
                          localField: '_id',
                          foreignField: 'productID',
                          pipeline: [
                            { $match: { $and: [{ userID: req.shopId }] } }
                          ],
                          as: 'savedproduct',
                        },
                      },
                      {
                        $unwind: {
                          preserveNullAndEmptyArrays: true,
                          path: '$savedproduct',
                        },
                      },
                      {
                        $addFields: {
                          saved: { $ifNull: ['$savedproduct.saved', false] },
                        },
                      },
                    ],
                    as: 'streamposts',
                  },
                },
                { $unwind: '$streamposts' },
                {
                  $addFields: {
                    image: { $ifNull: ['$streamposts.showImage', '$streamposts.products.image'] },
                  },
                },
                {
                  $project: {
                    _id: 1,
                    active: 1,
                    archive: 1,
                    productId: '$streamposts.productId',
                    productTitle: '$streamposts.products.productTitle',
                    image: 1,
                    categoryId: 'a7c95af4-abd5-4fe0-b685-fd93bb98f5ec',
                    quantity: '$streamposts.quantity',
                    marketPlace: '$streamposts.marketPlace',
                    offerPrice: '$streamposts.offerPrice',
                    postLiveStreamingPirce: '$streamposts.postLiveStreamingPirce',
                    validity: '$streamposts.validity',
                    minLots: '$streamposts.minLots',
                    incrementalLots: '$streamposts.incrementalLots',
                    bookingAmount: '$streamposts.bookingAmount',
                    streamPostId: '$streamposts._id',
                    allowAdd_to_cart: { $gte: ['$streamposts.pendingQTY', '$streamposts.minLots'] },
                    suppierId: 1,
                    DateIso: 1,
                    created: '2023-01-20T11:46:58.201Z',
                    intrested: "$streamposts.intrested",
                    saved: "$streamposts.saved",
                    unit: "$streamposts.unit",
                  },
                },
              ],
              as: 'streamrequestposts',
            },
          },
        ],
        as: 'streamrequests_post',
      },
    },
    { $unwind: '$streamrequests_post' },

    {
      $lookup: {
        from: 'temptokens',
        localField: 'streamId',
        foreignField: 'streamId',
        pipeline: [
          {
            $match: {
              $or: [{ $and: [{ type: { $eq: 'subhost' } }] }, { type: { $eq: 'Supplier' } }],
            },
          },
          {
            $lookup: {
              from: 'sellers',
              localField: 'supplierId',
              foreignField: '_id',
              as: 'subhosts',
            },
          },
          {
            $unwind: {
              preserveNullAndEmptyArrays: true,
              path: '$subhosts',
            },
          },
          {
            $lookup: {
              from: 'sellers',
              localField: 'supplierId',
              foreignField: '_id',
              as: 'suppliers',
            },
          },
          {
            $unwind: {
              preserveNullAndEmptyArrays: true,
              path: '$suppliers',
            },
          },
          {
            $addFields: {
              supplierName: { $ifNull: ['$suppliers.tradeName', '$subhosts.contactName'] },
            },
          },
        ],
        as: 'temptokens_sub',
      },
    },
    {
      $lookup: {
        from: 'raiseusers',
        localField: 'streamId',
        foreignField: 'streamId',
        pipeline: [
          { $match: { $and: [{ shopId: { $eq: req.shopId } }] } }
        ],
        as: 'raiseusers',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$raiseusers',
      },
    },
    {
      $addFields: {
        raise_hands: { $ifNull: ['$raiseusers.status', 'raise'] },
      },
    },
    {
      $addFields: {
        allot_host_1_details: { $cond: { if: { $eq: ['$streamrequests.allot_host_1', 'my self'] }, then: '$streamrequests.suppierId', else: '$streamrequests.allot_host_1' } },
      },
    },
    {
      $lookup: {
        from: 'temptokens',
        localField: 'streamId',
        foreignField: 'streamId',
        pipeline: [{ $match: { $and: [{ type: { $eq: 'raiseHands' } }] } }],
        as: 'raiseID',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$raiseID',
      },
    },
    {
      $addFields: {
        raiseUID: { $ifNull: ['$raiseID.Uid', 0] },
      },
    },
    {
      $project: {
        _id: 1,
        active: '$temptokens.active',
        archived: '$temptokens.archived',
        hostId: '$temptokens.hostId',
        type: '$temptokens.type',
        date: '$temptokens.date',
        time: '$temptokens.time',
        created: '$temptokens.created',
        Uid: '$temptokens.Uid',
        chennel: '$temptokens.chennel',
        participents: '$temptokens.participents',
        created_num: '$temptokens.created_num',
        expDate: '$temptokens.expDate',
        token: '$temptokens.token',
        hostUid: '$temptokens.hostUid',
        expDate_host: '$temptokens.expDate_host',
        temptokens: '$temptokens',
        streamrequests: '$streamrequests',
        chat: '$streamrequests.purchasedplans.chat_Option',
        streamrequests_post: '$streamrequests_post',
        streamrequestposts: '$streamrequests_post.streamrequestposts',
        chat_need: '$streamrequests.chat_need',
        temptokens_sub: '$temptokens_sub',
        joindedUserBan: 1,
        appID: "$streamrequests.agoraappids.appID",
        raise_hands: 1,
        raiseID: "$raiseusers._id",
        raiseUID: 1,
        allot_host_1_details: 1,
        current_raise: "$streamrequests.current_raise",
        last_joined: 1
      },
    },
  ]);
  if (value.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'plan_not_found');
  }
  return value[0];
};
const get_sub_golive = async (req, io) => {
  let code = req.query.code;
  let streamId = req.query.id;
  io.emit(streamId + 'watching_live', { code: code, stream: streamId });
  let value = await Joinusers.aggregate([
    { $match: { $and: [{ _id: { $eq: req.query.id } }, { shopId: { $eq: req.shopId } }] } },
    {
      $lookup: {
        from: 'temptokens',
        localField: 'latestedToken',
        foreignField: '_id',
        pipeline: [
          {
            $lookup: {
              from: 'temptokens',
              localField: 'hostId',
              foreignField: '_id',
              as: 'active_users',
            },
          },
          // { $unwind: "$active_users" },
          {
            $project: {
              active: 1,
              archived: 1,
              hostId: 1,
              type: 1,
              date: 1,
              time: 1,
              created: 1,
              Uid: 1,
              chennel: 1,
              participents: 1,
              created_num: 1,
              expDate: 1,
              token: 1,
              // hostUid: "$active_users.Uid",
              // expDate_host: "$active_users.expDate",
              // active_users: "$active_users"
            },
          },
        ],
        as: 'temptokens',
      },
    },
    { $unwind: '$temptokens' },
    {
      $lookup: {
        from: 'streamrequests',
        localField: 'streamId',
        foreignField: '_id',
        pipeline: [
          {
            $lookup: {
              from: 'purchasedplans',
              localField: 'planId',
              foreignField: '_id',
              // pipeline: [
              //   {
              //     $lookup: {
              //       from: 'streamplans',
              //       localField: 'planId',
              //       foreignField: '_id',
              //       as: 'streamplans',
              //     },
              //   },
              //   { $unwind: '$streamplans' },
              // ],
              as: 'purchasedplans',
            },
          },
          { $unwind: '$purchasedplans' },
          {
            $lookup: {
              from: 'agoraappids',
              localField: 'agoraID',
              foreignField: '_id',
              as: 'agoraappids',
            },
          },
          {
            $unwind: {
              preserveNullAndEmptyArrays: true,
              path: '$agoraappids',
            },
          },
        ],
        as: 'streamrequests',
      },
    },
    { $unwind: '$streamrequests' },
    {
      $lookup: {
        from: 'streamrequests',
        localField: 'streamId',
        foreignField: '_id',
        pipeline: [
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
                      { $unwind: '$products' },
                      {
                        $lookup: {
                          from: 'intrestedproducts',
                          localField: '_id',
                          foreignField: 'productID',
                          pipeline: [
                            { $match: { $and: [{ userID: req.shopId }] } }
                          ],
                          as: 'intrestedproduct',
                        },
                      },
                      {
                        $unwind: {
                          preserveNullAndEmptyArrays: true,
                          path: '$intrestedproduct',
                        },
                      },
                      {
                        $addFields: {
                          intrested: { $ifNull: ['$intrestedproduct.intrested', false] },
                        },
                      },
                      {
                        $lookup: {
                          from: 'savedproducts',
                          localField: '_id',
                          foreignField: 'productID',
                          pipeline: [
                            { $match: { $and: [{ userID: req.shopId }] } }
                          ],
                          as: 'savedproduct',
                        },
                      },
                      {
                        $unwind: {
                          preserveNullAndEmptyArrays: true,
                          path: '$savedproduct',
                        },
                      },
                      {
                        $addFields: {
                          saved: { $ifNull: ['$savedproduct.saved', false] },
                        },
                      },
                    ],
                    as: 'streamposts',
                  },
                },
                { $unwind: '$streamposts' },
                {
                  $addFields: {
                    image: { $ifNull: ['$streamposts.showImage', '$streamposts.products.image'] },
                  },
                },
                {
                  $project: {
                    _id: 1,
                    active: 1,
                    archive: 1,
                    productId: '$streamposts.productId',
                    productTitle: '$streamposts.products.productTitle',
                    image: 1,
                    categoryId: 'a7c95af4-abd5-4fe0-b685-fd93bb98f5ec',
                    quantity: '$streamposts.quantity',
                    marketPlace: '$streamposts.marketPlace',
                    offerPrice: '$streamposts.offerPrice',
                    postLiveStreamingPirce: '$streamposts.postLiveStreamingPirce',
                    validity: '$streamposts.validity',
                    minLots: '$streamposts.minLots',
                    incrementalLots: '$streamposts.incrementalLots',
                    bookingAmount: '$streamposts.bookingAmount',
                    streamPostId: '$streamposts._id',
                    allowAdd_to_cart: { $gte: ['$streamposts.pendingQTY', '$streamposts.minLots'] },
                    suppierId: 1,
                    DateIso: 1,
                    created: '2023-01-20T11:46:58.201Z',
                    intrested: "$streamposts.intrested",
                    saved: "$streamposts.saved",
                    unit: "$streamposts.unit",
                  },
                },
              ],
              as: 'streamrequestposts',
            },
          },
        ],
        as: 'streamrequests_post',
      },
    },
    { $unwind: '$streamrequests_post' },

    {
      $lookup: {
        from: 'temptokens',
        localField: 'streamId',
        foreignField: 'streamId',
        pipeline: [
          {
            $match: {
              $or: [{ $and: [{ type: { $eq: 'subhost' } }] }, { type: { $eq: 'Supplier' } }],
            },
          },
          {
            $lookup: {
              from: 'sellers',
              localField: 'supplierId',
              foreignField: '_id',
              as: 'subhosts',
            },
          },
          {
            $unwind: {
              preserveNullAndEmptyArrays: true,
              path: '$subhosts',
            },
          },
          {
            $lookup: {
              from: 'sellers',
              localField: 'supplierId',
              foreignField: '_id',
              as: 'suppliers',
            },
          },
          {
            $unwind: {
              preserveNullAndEmptyArrays: true,
              path: '$suppliers',
            },
          },
          {
            $addFields: {
              supplierName: { $ifNull: ['$suppliers.tradeName', '$subhosts.contactName'] },
            },
          },
        ],
        as: 'temptokens_sub',
      },
    },
    {
      $lookup: {
        from: 'raiseusers',
        localField: 'streamId',
        foreignField: 'streamId',
        pipeline: [
          { $match: { $and: [{ shopId: { $eq: req.shopId } }] } }
        ],
        as: 'raiseusers',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$raiseusers',
      },
    },
    {
      $addFields: {
        raise_hands: { $ifNull: ['$raiseusers.status', 'raise'] },
      },
    },
    {
      $addFields: {
        allot_host_1_details: { $cond: { if: { $eq: ['$streamrequests.allot_host_1', 'my self'] }, then: '$streamrequests.suppierId', else: '$streamrequests.allot_host_1' } },
      },
    },
    {
      $lookup: {
        from: 'temptokens',
        localField: 'streamId',
        foreignField: 'streamId',
        pipeline: [{ $match: { $and: [{ type: { $eq: 'raiseHands' } }] } }],
        as: 'raiseID',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$raiseID',
      },
    },
    {
      $addFields: {
        raiseUID: { $ifNull: ['$raiseID.Uid', 0] },
      },
    },
    {
      $project: {
        _id: 1,
        active: '$temptokens.active',
        archived: '$temptokens.archived',
        hostId: '$temptokens.hostId',
        type: '$temptokens.type',
        date: '$temptokens.date',
        time: '$temptokens.time',
        created: '$temptokens.created',
        Uid: '$temptokens.Uid',
        chennel: '$temptokens.chennel',
        participents: '$temptokens.participents',
        created_num: '$temptokens.created_num',
        expDate: '$temptokens.expDate',
        token: '$temptokens.token',
        hostUid: '$temptokens.hostUid',
        expDate_host: '$temptokens.expDate_host',
        temptokens: '$temptokens',
        streamrequests: '$streamrequests',
        chat: '$streamrequests.purchasedplans.chat_Option',
        streamrequests_post: '$streamrequests_post',
        streamrequestposts: '$streamrequests_post.streamrequestposts',
        chat_need: '$streamrequests.chat_need',
        temptokens_sub: '$temptokens_sub',
        joindedUserBan: 1,
        appID: "$streamrequests.agoraappids.appID",
        raise_hands: 1,
        raiseID: "$raiseusers._id",
        raiseUID: 1,
        allot_host_1_details: 1,
        current_raise: "$streamrequests.current_raise",
        last_joined: 1
      },
    },
  ]);
  if (value.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'plan_not_found');
  }
  req.io.emit(value[0].last_joined, { leave: true });
  let lastJion = v4();
  value[0].last_joined = lastJion;
  let join_unser = await Joinusers.findByIdAndUpdate({ _id: value[0]._id }, { last_joined: lastJion }, { new: true });
  let streamrequest = await Streamrequest.findById(value[0].chennel);
  if (streamrequest) {
    let index = streamrequest.join_users.findIndex((a) => a == join_unser.shopId);
    if (index == -1) {
      let join = streamrequest.join_users.concat([join_unser.shopId]);
      streamrequest.join_users = join;
    }
    let index_all = streamrequest.Current_join.findIndex((a) => a == join_unser.shopId);
    if (index_all == -1) {
      let join = streamrequest.Current_join.concat([join_unser.shopId]);
      console.log(join,45645)
      streamrequest.Current_join = join;
      streamrequest.streamCurrent_Watching = join.length;
      setTimeout(() => {
        req.io.emit(value[0].chennel + "_current_watching", { streamCurrent_Watching: streamrequest.streamCurrent_Watching })
      }, 100)
    }
    streamrequest.save();

  }


  return value[0];
};

const get_participents_limit = async (req) => {
  let result = await find_userLimt(req.query.id);
  req.io.emit(req.query.id + '_count', result);

  return result;
};

const get_current_live_stream = async (req) => {
  let stream = await Joinusers.findById(req.query.stream);
  let streamId = stream.streamId;
  var date_now = new Date().getTime();
  let currentLives = await Streamrequest.aggregate([
    { $sort: { startTime: 1 } },
    {
      $match: {
        $and: [
          { _id: { $ne: streamId } },
          { startTime: { $lt: date_now } },
          { streamEnd_Time: { $gt: date_now } },
          { adminApprove: { $eq: 'Approved' } },
        ],
      },
    },
    {
      $lookup: {
        from: 'joinedusers',
        localField: '_id',
        foreignField: 'streamId',
        pipeline: [{ $group: { _id: 1, count: { $sum: 1 } } }],
        as: 'joinedusers',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$joinedusers',
      },
    },
    {
      $lookup: {
        from: 'joinedusers',
        localField: '_id',
        foreignField: 'streamId',
        pipeline: [
          { $match: { shopId: req.shopId } },
          {
            $project: {
              _id: 1,
              active: { $eq: ['$shopId', req.shopId] },
            },
          },
        ],
        as: 'joinedusers_user',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$joinedusers_user',
      },
    },
    {
      $addFields: {
        alreadyJoined: { $ifNull: ['$joinedusers_user.active', false] },
      },
    },
    {
      $lookup: {
        from: 'sellers',
        localField: 'suppierId',
        foreignField: '_id',
        as: 'suppliers',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$suppliers',
      },
    },
    {
      $lookup: {
        from: 'streampreregisters',
        localField: '_id',
        foreignField: 'streamId',
        pipeline: [{ $match: { shopId: req.shopId } }],
        as: 'streampreregister',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$streampreregister',
      },
    },
    {
      $addFields: {
        registerStatus: { $ifNull: ['$streampreregister.status', 'Not Registered'] },
      },
    },
    {
      $addFields: {
        eligible: { $ifNull: ['$streampreregister.eligible', false] },
      },
    },
    {
      $addFields: {
        viewstatus: { $ifNull: ['$streampreregister.viewstatus', ''] },
      },
    },
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
              // pipeline: [{ $match: { $and: [{ afterStreaming: { $eq: 'yes' } }] } }],
              as: 'streamposts',
            },
          },
          { $unwind: '$streamposts' },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
            },
          },
        ],
        as: 'streamrequestposts_count',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$streamrequestposts_count',
      },
    },

    // { $match: { $and: [{ registerStatus: { $in: ['Not Registered', 'Unregistered'] } }] } },
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
                // { $match: { $and: [{ afterStreaming: { $eq: 'yes' } }] } },
                {
                  $lookup: {
                    from: 'products',
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'products',
                  },
                },
                { $unwind: '$products' },
                {
                  $addFields: {
                    productTitle: '$products.productTitle',
                  },
                },
                {
                  $project: {
                    _id: 1,
                    productTitle: 1,
                  },
                },
              ],
              as: 'streamposts',
            },
          },
          { $unwind: '$streamposts' },

          {
            $group: {
              _id: null,
              productTitle: { $push: '$streamposts.productTitle' },
            },
          },
        ],
        as: 'streamrequestposts',
      },
    },
    { $unwind: '$streamrequestposts' },
    {
      $project: {
        _id: 1,
        active: 1,
        archive: 1,
        post: 1,
        communicationMode: 1,
        sepTwo: 1,
        adminApprove: 1,
        activelive: 1,
        tokenGeneration: 1,
        bookingAmount: 1,
        streamingDate: 1,
        streamingTime: 1,
        discription: 1,
        streamName: 1,
        suppierId: 1,
        postCount: 1,
        startTime: 1,
        DateIso: 1,
        created: 1,
        Duration: 1,
        chat: 1,
        endTime: 1,
        max_post_per_stream: 1,
        noOfParticipants: 1,
        planId: 1,
        tokenDetails: 1,
        golive: { $gt: ['$noOfParticipants', '$joinedusers.count'] },
        goLive: 1,
        joinedusers_user: '$joinedusers_user',
        alreadyJoined: 1,
        suppliersName: '$suppliers.contactName',
        registerStatus: 1,
        eligible: 1,
        viewstatus: 1,
        status: 1,
        streamrequestposts_count: 1,
        streamEnd_Time: 1,
        productArray: '$streamrequestposts.productTitle',
        image: 1,
        teaser: 1,
        // streamrequestposts:"$streamrequestposts"
      },
    },
    { $limit: 5 },
  ]);
  return currentLives;
};
const find_userLimt = async (channel) => {
  const user = await StreamPreRegister.find({ streamId: channel, status: 'Registered' }).count();
  const stream = await Streamrequest.findById(channel);
  return { userActive: user, noOfParticipants: stream.noOfParticipants };
};

const remove_host_live = async (req) => {
  let stream = await Streamrequest.findById(req.query.id);
  if (stream) {
    stream = await Streamrequest.findByIdAndUpdate(
      { _id: req.query.id },
      { status: 'Completed', streamEnd_Time: moment(), end_Status: 'Terminated' },
      { new: true }
    );
  }
  req.io.emit(req.query.id + 'admin_action', { remove: true });
  return { removed: 'success' };
};

const create_subhost_token = async (req) => {
  let supplierId = req.userId;
  let streamId = req.body.streamId;
  //console.log(streamId)
  let stream = await Streamrequest.findById(streamId);
  let value = await tempTokenModel.findOne({ streamId: stream._id, supplierId: supplierId });
  if (!value) {
    if (!streamId) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Stream not found');
    }
    const uid = await generateUid();
    const expirationTimestamp = stream.endTime / 1000;
    value = await tempTokenModel.create({
      ...req.body,
      ...{
        date: moment().format('YYYY-MM-DD'),
        time: moment().format('HHMMSS'),
        supplierId: supplierId,
        streamId: streamId,
        created: moment(),
        Uid: uid,
        created_num: new Date(new Date(moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss'))).getTime(),
        expDate: expirationTimestamp * 1000,
        Duration: stream.Duration,
        type: 'subhost',
      },
    });
    const token = await geenerate_rtc_token(streamId, uid, Agora.RtcRole.PUBLISHER, expirationTimestamp, stream.agoraID);
    value.token = token;
    value.chennel = streamId;
    value.save();
    stream.tokenGeneration = true;
    stream.goLive = true;
    stream.save();
  }
  req.io.emit(streamId + '_golive', { streamId: streamId });
  req.io.emit(value.last_joined, { leave: true });
  await production_supplier_token_cloudrecording(req, streamId, stream.agoraID);
  return value;
};

const create_raice_token = async (req) => {
  let streamId = req.body.streamId;
  //console.log(streamId)
  let stream = await Streamrequest.findById(streamId);
  let value = await tempTokenModel.findOne({ streamId: stream._id, type: 'raice-your-hand' });
  if (!value) {
    if (!streamId) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Stream not found');
    }
    const uid = await generateUid();
    const expirationTimestamp = stream.endTime / 1000;
    value = await tempTokenModel.create({
      ...req.body,
      ...{
        date: moment().format('YYYY-MM-DD'),
        time: moment().format('HHMMSS'),
        streamId: streamId,
        created: moment(),
        Uid: uid,
        created_num: new Date(new Date(moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss'))).getTime(),
        expDate: expirationTimestamp * 1000,
        Duration: stream.Duration,
        type: 'raice-your-hand',
      },
    });
    const token = await geenerate_rtc_token(streamId, uid, Agora.RtcRole.PUBLISHER, expirationTimestamp);
    value.token = token;
    value.chennel = streamId;
    value.store = stream._id.replace(/[^a-zA-Z0-9]/g, '');
    value.save();
  }

  return value;
};

const production_supplier_token = async (req) => {
  let supplierId = req.userId;
  let streamId = req.body.streamId;
  let stream = await Streamrequest.findById(streamId);
  if (!stream) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream not found');
  }
  value = await tempTokenModel.findOne({ supplierId: supplierId, chennel: streamId });
  //console.log(value)
  if (!value) {
    const uid = await generateUid();
    const role = req.body.isPublisher ? Agora.RtcRole.PUBLISHER : Agora.RtcRole.SUBSCRIBER;
    const expirationTimestamp = stream.endTime / 1000;
    value = await tempTokenModel.create({
      ...req.body,
      ...{
        date: moment().format('YYYY-MM-DD'),
        time: moment().format('HHMMSS'),
        supplierId: supplierId,
        streamId: streamId,
        created: moment(),
        Uid: uid,
        created_num: new Date(new Date(moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss'))).getTime(),
        expDate: expirationTimestamp * 1000,
        Duration: stream.Durationm,
        type: 'Supplier',
      },
    });
    const token = await geenerate_rtc_token(streamId, uid, role, expirationTimestamp, stream.agoraID);
    value.token = token;
    value.chennel = streamId;
    value.save();
    stream.tokenGeneration = true;
    stream.goLive = true;
    stream.save();
  }

  req.io.emit(streamId + value.supplierId, { streamId: streamId });
  req.io.emit(streamId + '_golive', { streamId: streamId });
  // console.log(streamId);
  await production_supplier_token_cloudrecording(req, streamId, stream.agoraID);
  return value;
};

const production_supplier_token_cloudrecording = async (req, id, agroaID) => {
  let streamId = id;
  // let streamId = req.body.streamId;
  let agoraToken = await AgoraAppId.findById(agroaID)
  let stream = await Streamrequest.findById(streamId);
  if (!stream) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream not found');
  }
  // console.log(stream);
  value = await tempTokenModel.findOne({ chennel: streamId, type: 'CloudRecording', recoredStart: { $in: ["query", 'start',] } });
  if (!value) {
    const uid = await generateUid();
    const role = Agora.RtcRole.SUBSCRIBER;
    const expirationTimestamp = stream.endTime / 1000;
    value = await tempTokenModel.create({
      ...req.body,
      ...{
        date: moment().format('YYYY-MM-DD'),
        time: moment().format('HHMMSS'),
        created: moment(),
        Uid: uid,
        chennel: stream._id,
        created_num: new Date(new Date(moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss'))).getTime(),
        expDate: expirationTimestamp * 1000,
        type: 'CloudRecording',
      },
    });
    const token = await geenerate_rtc_token(stream._id, uid, role, expirationTimestamp, agroaID);
    value.token = token;
    value.store = stream._id.replace(/[^a-zA-Z0-9]/g, '');
    value.save();
    if (value.videoLink == '' || value.videoLink == null) {
      await agora_acquire(req, value._id, agroaID);
    }
  } else {
    // try {
    let token = value;
    const resource = token.resourceId;
    const sid = token.sid;
    // console.log(1234567890123456, resource)
    const mode = 'mix';
    const Authorization = `Basic ${Buffer.from(agoraToken.Authorization.replace(/\s/g, '')).toString(
      'base64'
    )}`;
    // //console.log(`https://api.agora.io/v1/apps/${appID}/cloud_recording/resourceid/${resource}/sid/${sid}/mode/${mode}/query`);
    await axios.get(
      `https://api.agora.io/v1/apps/${agoraToken.appID.replace(/\s/g, '')}/cloud_recording/resourceid/${resource}/sid/${sid}/mode/${mode}/query`,
      { headers: { Authorization } }
    ).then((res) => {

    }).catch(async (error) => {
      await tempTokenModel.findByIdAndUpdate({ _id: value._id }, { recoredStart: "stop" }, { new: true });
      const uid = await generateUid();
      const role = Agora.RtcRole.SUBSCRIBER;
      const expirationTimestamp = stream.endTime / 1000;
      value = await tempTokenModel.create({
        ...req.body,
        ...{
          date: moment().format('YYYY-MM-DD'),
          time: moment().format('HHMMSS'),
          created: moment(),
          Uid: uid,
          chennel: stream._id,
          created_num: new Date(new Date(moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss'))).getTime(),
          expDate: expirationTimestamp * 1000,
          type: 'CloudRecording',
        },
      });
      const token = await geenerate_rtc_token(stream._id, uid, role, expirationTimestamp, agroaID);
      value.token = token;
      value.store = stream._id.replace(/[^a-zA-Z0-9]/g, '');
      value.save();
      await agora_acquire(req, value._id, agroaID);
    });
  }
  return value;
};

const production_supplier_token_watchamin = async (req) => {
  let streamId = req.body.streamId;
  let stream = await Streamrequest.findById(streamId);
  if (!stream) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream not found');
  }
  value = await tempTokenModel.findOne({ chennel: streamId, type: 'adminwatch' });
  // console.log(stream)
  if (!value) {
    const uid = await generateUid();
    const role = Agora.RtcRole.SUBSCRIBER;
    const expirationTimestamp = stream.endTime / 1000;
    value = await tempTokenModel.create({
      ...req.body,
      ...{
        date: moment().format('YYYY-MM-DD'),
        time: moment().format('HHMMSS'),
        created: moment(),
        Uid: uid,
        chennel: stream._id,
        created_num: new Date(new Date(moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss'))).getTime(),
        expDate: expirationTimestamp * 1000,
        type: 'adminwatch',
      },
    });

    const token = await geenerate_rtc_token(stream._id, uid, role, expirationTimestamp, stream.agoraID);
    value.token = token;
    let agoraToken = await AgoraAppId.findById(stream.agoraID)
    value.appID = agoraToken.appID
    value.save();
  }
  stream = await Streamrequest.aggregate([
    { $match: { $and: [{ _id: { $eq: streamId } }] } },
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
                { $unwind: '$products' },
                {
                  $project: {
                    _id: 1,
                    productTitle: '$products.productTitle',
                    productId: 1,
                    categoryId: 1,
                    quantity: 1,
                    marketPlace: 1,
                    offerPrice: 1,
                    // postLiveStreamingPirce: 1,
                    validity: 1,
                    minLots: 1,
                    incrementalLots: 1,
                    suppierId: 1,
                    DateIso: 1,
                    created: 1,
                    // afterStreaming: 1,
                    bookingAmount: 1,
                    discription: 1,
                    images: 1,
                    location: 1,
                    orderedQTY: 1,
                    pendingQTY: 1,
                    productId: 1,
                    video: 1,
                    define_QTY: 1,
                    define_UNIT: 1,
                    booking_charge: 1,
                    booking_percentage: 1,
                    pack_discription: 1,
                    dispatchPincode: 1,
                    transaction: 1,
                    dispatchLocation: 1,
                    unit: 1,
                  },
                },
              ],
              as: 'streamposts',
            },
          },
          { $unwind: '$streamposts' },
          {
            $project: {
              _id: 1,
              productTitle: '$streamposts.productTitle',
              productId: '$streamposts.productId',
              quantity: '$streamposts.quantity',
              marketPlace: '$streamposts.marketPlace',
              offerPrice: '$streamposts.offerPrice',
              // postLiveStreamingPirce: '$streamposts.postLiveStreamingPirce',
              validity: '$streamposts.validity',
              minLots: '$streamposts.minLots',
              incrementalLots: '$streamposts.incrementalLots',
              // afterStreaming: '$streamposts.afterStreaming',
              bookingAmount: '$streamposts.bookingAmount',
              discription: '$streamposts.discription',
              images: '$streamposts.images',
              location: '$streamposts.location',
              orderedQTY: '$streamposts.orderedQTY',
              pendingQTY: '$streamposts.pendingQTY',
              productId: '$streamposts.productId',
              video: '$streamposts.video',
              define_QTY: '$streamposts.define_QTY',
              define_UNIT: '$streamposts.define_UNIT',
              booking_charge: '$streamposts.booking_charge',
              booking_percentage: '$streamposts.booking_percentage',
              pack_discription: '$streamposts.pack_discription',
              dispatchPincode: '$streamposts.dispatchPincode',
              transaction: '$streamposts.transaction',
              dispatchLocation: '$streamposts.dispatchLocation',
              unit: '$streamposts.unit'
            },
          },
        ],
        as: 'streamrequestposts',
      },
    },
    {
      $lookup: {
        from: 'sellers',
        localField: 'suppierId',
        foreignField: '_id',
        as: 'sellers',
      },
    },
    { $unwind: '$sellers' },
    {
      $lookup: {
        from: 'streampreregisters',
        localField: '_id',
        foreignField: 'streamId',
        pipeline: [{ $match: { status: { $eq: 'Registered' } } }, { $group: { _id: null, count: { $sum: 1 } } }],
        as: 'streampreregisters',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$streampreregisters',
      },
    },
    {
      $addFields: {
        registeredUsers: { $ifNull: ['$streampreregisters.count', 0] },
      },
    },
    {
      $lookup: {
        from: 'purchasedplans',
        localField: 'planId',
        foreignField: '_id',
        as: 'purchasedplans',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$purchasedplans',
      },
    },
    {
      $addFields: {
        max_post_per_stream: { $ifNull: ['$purchasedplans.max_post_per_stream', 0] },
      },
    },
    {
      $lookup: {
        from: 'sellers',
        localField: 'allot_chat',
        foreignField: '_id',
        as: 'allot_chat_lookup',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$allot_chat_lookup',
      },
    },
    {
      $addFields: {
        allot_chat_name: { $ifNull: ['$allot_chat_lookup.contactName', null] },
      },
    },
    {
      $lookup: {
        from: 'sellers',
        localField: 'allot_host_1',
        foreignField: '_id',
        as: 'allot_host_1_lookup',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$allot_host_1_lookup',
      },
    },
    {
      $addFields: {
        allot_host_1_name: { $ifNull: ['$allot_host_1_lookup.contactName', null] },
      },
    },
    {
      $lookup: {
        from: 'sellers',
        localField: 'allot_host_2',
        foreignField: '_id',
        as: 'allot_host_2_lookup',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$allot_host_2_lookup',
      },
    },
    {
      $addFields: {
        allot_host_2_name: { $ifNull: ['$allot_host_2_lookup.contactName', null] },
      },
    },
    {
      $lookup: {
        from: 'sellers',
        localField: 'allot_host_3',
        foreignField: '_id',
        as: 'allot_host_3_lookup',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$allot_host_3_lookup',
      },
    },
    {
      $addFields: {
        allot_host_3_name: { $ifNull: ['$allot_host_3_lookup.contactName', null] },
      },
    },
    {
      $lookup: {
        from: 'purchasedplans',
        localField: 'planId',
        foreignField: '_id',
        as: 'purchasedplans',
      },
    },
    {
      $unwind: '$purchasedplans',
    },
    {
      $lookup: {
        from: 'temptokens',
        localField: '_id',
        foreignField: 'streamId',
        pipeline: [{ $match: { $and: [{ type: { $eq: 'host' } }] } }],
        as: 'temptokens',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$temptokens',
      },
    },
    {
      $project: {
        _id: 1,
        supplierName: '$sellers.contactName',
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
        streamrequestposts: '$streamrequestposts',
        adminApprove: 1,
        tokenGeneration: 1,
        tokenDetails: 1,
        Duration: 1,
        startTime: 1,
        endTime: 1,
        registeredUsers: 1,
        noOfParticipants: 1,
        max_post_per_stream: 1,
        status: 1,
        allot_chat_name: 1,
        allot_host_1_name: 1,
        allot_host_2_name: 1,
        allot_host_3_name: 1,
        no_of_host: '$purchasedplans.no_of_host',
        allot_host_1: 1,
        allot_host_2: 1,
        allot_host_3: 1,
        allot_chat: 1,
        temptokens: '$temptokens',
        uploadLink: 1,
        uploadDate: 1,
        uploadStatus: 1,
        Location: 1,
        transaction: 1
      },
    },
  ])


  return { value, stream: stream[0] };
};

const get_stream_complete_videos = async (req) => {
  let streamId = req.query.id;
  let value = await Streamrequest.aggregate([
    { $match: { $and: [{ _id: { $eq: streamId } }] } },
    {
      $lookup: {
        from: 'temptokens',
        localField: '_id',
        foreignField: 'streamId',
        pipeline: [
          {
            $match: {
              $and: [
                { type: { $eq: 'CloudRecording' } },
                { $or: [{ recoredStart: { $eq: 'stop' } }, { recoredStart: { $eq: 'query' } }] },
              ],
            },
          },
        ],
        as: 'temptokens',
      },
    },
  ]);
  if (value.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream not found');
  }

  return value[0];
};

const fs = require('fs');
const { TokenList } = require('twilio/lib/rest/oauth/v1/token');

const videoConverter = async () => {
  const inputFilePath =
    'https://streamingupload.s3.ap-south-1.amazonaws.com/f7e4c26bade144a8a848ae24385e4a4e/16293/43d33e0a3a4f4ddbfa1e6098fb5248e0_5f304c8b-f8ca-42dc-a354-1845528f41fd.m3u8';
  const outputFilePath = 'output1.mp4';

  ffmpeg(inputFilePath)
    .outputOptions('-c', 'copy')
    .output(outputFilePath)
    .on('end', (e) => {
      //console.log('Conversion completed successfully', e);
    })
    .on('error', (err) => {
      // console.error('Error while converting:', err);
    })
    .run();
  //console.log(outputFilePath)
  const s3 = new AWS.S3({
    accessKeyId: 'AKIA3323XNN7Y2RU77UG',
    secretAccessKey: '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',
    region: 'ap-south-1',
  });
  const bucketName = 'realestatevideoupload';

  // Read the file from the local file system
  const fileContent = fs.readFileSync(outputFilePath);

  // Upload the file to S3
  const params = {
    Bucket: bucketName,
    Key: outputFilePath,
    Body: fileContent,
  };
  s3.upload(params, (err, data) => {
    if (err) {
      // console.error(err);
    } else {
      //console.log(`File uploaded successfully. Location: ${data.Location}`);
    }
  });
};

const cloud_recording_start = async (req) => {

  // let recording=await tempTokenModel.findById(req.query.id);

  let token = await tempTokenModel.findById(req.query.id);
  // console.log(token)
  const resource = token.resourceId;
  const sid = token.sid;
  const mode = 'mix';
  // //console.log(`https://api.agora.io/v1/apps/${appID}/cloud_recording/resourceid/${resource}/sid/${sid}/mode/${mode}/query`);
  const query = await axios.get(
    `https://api.agora.io/v1/apps/${appID}/cloud_recording/resourceid/${resource}/sid/${sid}/mode/${mode}/query`,
    { headers: { Authorization } }
  );

  return query.data;
  // return recording;

};

const get_cloude_recording = async (req) => {
  let streamid = req.query.id;
  let stream = await tempTokenModel.find({ streamId: streamid, type: 'CloudRecording', recoredStart: { $ne: "Pending" } });
  return stream;

}
const start_rice_user_hands = async (req) => {
  let streamId = req.body.stream;
  let stream = await Streamrequest.findById(streamId);
  let supplierId = req.userId;
  if (!stream) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream not found');
  }
  let value = await tempTokenModel.findOne({ chennel: streamId, type: "raiseHands" });
  //console.log(value)
  if (!value) {
    const uid = await generateUid();
    const role = req.body.isPublisher ? Agora.RtcRole.PUBLISHER : Agora.RtcRole.SUBSCRIBER;
    const expirationTimestamp = stream.endTime / 1000;
    value = await tempTokenModel.create({
      ...req.body,
      ...{
        date: moment().format('YYYY-MM-DD'),
        time: moment().format('HHMMSS'),
        supplierId: supplierId,
        streamId: streamId,
        created: moment(),
        Uid: uid,
        created_num: new Date(new Date(moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss'))).getTime(),
        expDate: expirationTimestamp * 1000,
        Duration: stream.Durationm,
        type: 'raiseHands',
      },
    });
    const token = await geenerate_rtc_token(streamId, uid, role, expirationTimestamp, stream.agoraID);
    value.token = token;
    value.chennel = streamId;
    // value.save();

  }
  stream.raise_hands = !stream.raise_hands;
  stream.save();
  value.raise_hands = stream.raise_hands;
  value.save();
  req.io.emit(streamId + '_raise_hands_start', { raise_hands: stream.raise_hands });

  if (!stream.raise_hands && stream.current_raise != null) {
    await pending_request_switch(req, stream.current_raise);
  }
  return value;


}

const start_rice_user_hands_admin = async (req) => {
  let streamId = req.body.stream;
  let stream = await Streamrequest.findById(streamId);
  let supplierId = stream.suppierId;
  if (!stream) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream not found');
  }
  let value = await tempTokenModel.findOne({ chennel: streamId, type: "raiseHands" });
  //console.log(value)
  if (!value) {
    const uid = await generateUid();
    const role = req.body.isPublisher ? Agora.RtcRole.PUBLISHER : Agora.RtcRole.SUBSCRIBER;
    const expirationTimestamp = stream.endTime / 1000;
    value = await tempTokenModel.create({
      ...req.body,
      ...{
        date: moment().format('YYYY-MM-DD'),
        time: moment().format('HHMMSS'),
        supplierId: supplierId,
        streamId: streamId,
        created: moment(),
        Uid: uid,
        created_num: new Date(new Date(moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss'))).getTime(),
        expDate: expirationTimestamp * 1000,
        Duration: stream.Durationm,
        type: 'raiseHands',
      },
    });
    const token = await geenerate_rtc_token(streamId, uid, role, expirationTimestamp, stream.agoraID);
    value.token = token;
    value.chennel = streamId;
    // value.save();

  }
  stream.raise_hands = !stream.raise_hands;
  stream.save();
  value.raise_hands = stream.raise_hands;
  value.save();
  req.io.emit(streamId + '_raise_hands_start', { raise_hands: stream.raise_hands });

  if (!stream.raise_hands && stream.current_raise != null) {
    await pending_request_switch(req, stream.current_raise);
  }
  return value;


}

const pending_request_switch = async (req, raiseid) => {
  let raise = await RaiseUsers.findById(raiseid);
  if (!raise) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Raise not found');
  }
  let stream = await Streamrequest.findById(raise.streamId);
  stream.current_raise = null;
  stream.save();
  raise.status = 'end';
  raise.sort = 0;
  raise.save();
  req.io.emit(raise._id + '_status', { message: "end" });
  return raise;
}

const get_raise_hands = async (req) => {

  let streamId = req.query.stream;
  let find = await Streamrequest.aggregate([
    { $match: { $and: [{ _id: { $eq: streamId } }] } },
    {
      $lookup: {
        from: 'raiseusers',
        localField: '_id',
        foreignField: 'streamId',
        pipeline: [
          {
            $lookup: {
              from: 'b2bshopclones',
              localField: 'shopId',
              foreignField: '_id',
              as: 'shops',
            },
          },
          {
            $unwind: {
              preserveNullAndEmptyArrays: true,
              path: '$shops',
            },
          },
          {
            $addFields: {
              raised_count: { $cond: { if: { $eq: ['$status', 'end'] }, then: 0, else: "$raised_count" } }
            },
          },
          {
            $project: {
              _id: 1,
              SName: "$shops.SName",
              AgriImage: "$shops.AgriImage",
              tradeName: "$shops.tradeName",
              mobile: "$shops.mobile",
              address: "$shops.address",
              country: "$shops.country",
              state: "$shops.state",
              companyName: "$shops.companyName",
              designation: "$shops.designation",
              email: "$shops.email",
              address: "$shops.address",
              streamId: 1,
              shopId: 1,
              tempID: 1,
              status: 1,
              createdAt: 1,
              raised_count: 1,
              already_joined: 1,
              updatedAt: 1,
              dateISO: 1,
              sortData: 1,
              sort: 1,
              AgriImage: "$shops.AgriImage",
            }
          }
        ],
        as: 'raiseusers',
      },
    },

  ])
  if (find.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream not found');
  }

  return find[0];
}

const get_raise_hands_admin = async (req) => {

  let streamId = req.query.stream;
  let find = await Streamrequest.aggregate([
    { $match: { $and: [{ _id: { $eq: streamId } }] } },
    {
      $lookup: {
        from: 'raiseusers',
        localField: '_id',
        foreignField: 'streamId',
        pipeline: [
          {
            $lookup: {
              from: 'b2bshopclones',
              localField: 'shopId',
              foreignField: '_id',
              as: 'shops',
            },
          },
          {
            $unwind: {
              preserveNullAndEmptyArrays: true,
              path: '$shops',
            },
          },
          {
            $addFields: {
              raised_count: { $cond: { if: { $eq: ['$status', 'end'] }, then: 0, else: "$raised_count" } }
            },
          },
          {
            $project: {
              _id: 1,
              SName: "$shops.SName",
              mobile: "$shops.mobile",
              address: "$shops.address",
              country: "$shops.country",
              state: "$shops.state",
              companyName: "$shops.companyName",
              designation: "$shops.designation",
              streamId: 1,
              shopId: 1,
              tempID: 1,
              status: 1,
              createdAt: 1,
              raised_count: 1,
              already_joined: 1,
              updatedAt: 1,
              dateISO: 1
            }
          }
        ],
        as: 'raiseusers',
      },
    },
    {
      $lookup: {
        from: 'purchasedplans',
        localField: 'planId',
        foreignField: '_id',
        as: 'purchasedplans',
      },
    },
    { $unwind: '$purchasedplans' },
    {
      $addFields: {
        RaiseHands: '$purchasedplans.RaiseHands'
      },
    },
    {
      $addFields: {
        raise_hands_control: '$purchasedplans.raisehandcontrol'
      },
    },

  ])
  if (find.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream not found');
  }

  return find[0];
}

const raise_request = async (req) => {
  let shopId = req.shopId;
  let streamId = req.body.streamId;
  let stream = await Streamrequest.findById(streamId);
  if (!stream) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream not found');
  }
  let temp = await tempTokenModel.findOne({ chennel: streamId, type: "raiseHands" });
  if (!temp) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Waiting For user Start hand Raise');
  }
  let raise = await RaiseUsers.findOne({ streamId: streamId, shopId: shopId, tempID: temp._id, status: { $eq: "end" } });
  if (raise) {
    raise = await RaiseUsers.findByIdAndUpdate({ _id: raise._id }, { status: 'Pending', raised_count: (raise.raised_count + 1) }, { new: true });
  }
  if (!raise) {
    raise = await RaiseUsers.create({ streamId: streamId, shopId: shopId, tempID: temp._id, });
  }

  raise.status = "Pending"
  raise.raised_count = raise.raised_count + 1;
  raise.sortData = moment();
  raise.sort = 1;
  raise.dateISO = moment();
  raise.save();

  raise = await RaiseUsers.aggregate([
    { $match: { $and: [{ _id: { $eq: raise._id } }] } },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shops',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$shops',
      },
    },
    {
      $project: {
        _id: 1,
        SName: "$shops.SName",
        tradeName: "$shops.tradeName",
        mobile: "$shops.mobile",
        address: "$shops.address",
        country: "$shops.country",
        state: "$shops.state",
        companyName: "$shops.companyName",
        designation: "$shops.designation",
        email: "$shops.email",
        address: "$shops.address",
        AgriImage: "$shops.AgriImage",
        streamId: 1,
        shopId: 1,
        tempID: 1,
        status: 1,
        createdAt: 1,
        raised_count: 1,
        already_joined: 1,
        updatedAt: 1,
        dateISO: 1,
        sortData: 1,
        sort: 1
      }
    }
  ])
  raise[0].status = 'Pending';
  raise[0].dateISO = moment();
  raise[0].sortData = moment();
  raise[0].sort = 1;
  req.io.emit(streamId + '_raise_hands_request', raise[0]);
  return raise;
}


const approve_request = async (req) => {
  let raiseid = req.body.raise;
  let raise = await RaiseUsers.findById(raiseid);
  if (!raise) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Raise not found');
  }
  let stream = await Streamrequest.findById(raise.streamId);
  stream.current_raise = raise._id;
  stream.save();
  raise.status = 'approved';
  raise.sort = 2;
  raise.save();
  console.log(raise._id, 987867676675)
  req.io.emit(raise._id + '_status', { message: "approved" });
  return raise;
}

const pending_request = async (req) => {
  let raiseid = req.body.raise;
  let raise = await RaiseUsers.findById(raiseid);
  if (!raise) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Raise not found');
  }
  let stream = await Streamrequest.findById(raise.streamId);
  stream.current_raise = null;
  stream.save();
  raise.status = 'end';
  raise.sort = 0;
  raise.re = 0;
  raise.already_joined = true;
  raise.save();
  req.io.emit(raise._id + '_status', { message: "end" });
  req.io.emit(stream._id + '_raise_hands_request', raise);
  return raise;
}

const reject_request = async (req) => {
  let raiseid = req.body.raise;
  let raise = await RaiseUsers.findById(raiseid);
  if (!raise) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Raise not found');
  }
  let stream = await Streamrequest.findById(raise.streamId);
  stream.current_raise = null;
  stream.save();
  raise.sort = 0;
  raise.status = 'rejected';
  raise.save();
  req.io.emit(raise._id + '_status', { message: "rejected" });
  return raise;
}

const jion_now_live = async (req) => {
  let raiseid = req.body.raise;
  let raise = await RaiseUsers.findById(raiseid);
  if (!raise) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Raise not found');
  }
  let stream = await Streamrequest.findById(raise.streamId);

  if (stream.current_raise != raiseid) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Line Busy');
  }
  raise.already_joined = true;
  raise.save();
  raise = await RaiseUsers.aggregate([
    { $match: { $and: [{ _id: { $eq: raise._id } }] } },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shops',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$shops',
      },
    },
    {
      $lookup: {
        from: 'temptokens',
        localField: 'tempID',
        foreignField: '_id',
        as: 'temptokens',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$temptokens',
      },
    },
    {
      $project: {
        _id: 1,
        SName: "$shops.SName",
        mobile: "$shops.mobile",
        address: "$shops.address",
        country: "$shops.country",
        state: "$shops.state",
        companyName: "$shops.companyName",
        designation: "$shops.designation",
        streamId: 1,
        shopId: 1,
        tempID: 1,
        status: 1,
        Uid: "$temptokens.Uid",
        chennel: "$temptokens.chennel",
        token: "$temptokens.token",
        expDate: "$temptokens.expDate",
        already_joined: 1,
        updatedAt: 1,
        createdAt: 1,
        dateISO: 1,
        sortData: 1,
        sort: 1
      }
    }
  ])
  if (raise.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Raise not found');
  }

  req.io.emit(raise[0].streamId + "_raise_user_jion", raise[0])
  return raise[0];
}



const get_raise_hand_user = async (req) => {
  let raise = req.query.id;
  let user = await RaiseUsers.aggregate([
    { $match: { $and: [{ _id: { $eq: raise } }] } },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shops',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$shops',
      },
    },
    {
      $project: {
        _id: 1,
        SName: "$shops.SName",
        mobile: "$shops.mobile",
        address: "$shops.address",
        country: "$shops.country",
        state: "$shops.state",
        companyName: "$shops.companyName",
        designation: "$shops.designation",
      }
    }
  ]);
  if (user.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Raise User Not Found');
  }
  return user[0];
}


const { Users } = require('../../models/B2Busers.model');

const push_notification = async (req) => {
  const { text, title, image, user } = req.body

  let userss = await Users.findById(user);
  if (userss) {
    if (userss.fcmToken.length != 0) {
      const admin = require('../firebase.service');
      const token = userss.fcmToken;
      const message = {
        tokens: token,
        notification: {
          title: text,
          body: title,
          image: image
        },
        // topic: 'your-topic', // Replace with the topic or device token you want to send the notification to
      };
      let messages = await admin
        .messaging()
        .sendEachForMulticast(message)
        .then((response) => {
          return response;
        })
        .catch((error) => console.log(error));

      return messages;
    }
    else {
      return { message: "device Not found" }
    }
  }
  return { message: "user Not found" }
};


module.exports = {
  generateToken,
  getHostTokens,
  gettokenById,
  participents_limit,
  leave_participents,
  leave_host,
  join_host,
  agora_acquire,
  recording_start,
  recording_query,
  recording_stop,
  recording_updateLayout,
  generateToken_sub,
  gettokenById_host,
  chat_rooms,
  get_sub_token,
  get_sub_golive,
  get_participents_limit,
  remove_host_live,
  create_subhost_token,
  create_raice_token,
  production_supplier_token,
  production_supplier_token_cloudrecording,
  production_supplier_token_watchamin,
  get_stream_complete_videos,
  videoConverter,
  get_current_live_stream,
  cloud_recording_start,
  get_cloude_recording,
  start_rice_user_hands,
  get_raise_hands,
  raise_request,
  approve_request,
  reject_request,
  pending_request,
  jion_now_live,
  get_raise_hand_user,

  // raise Hands
  start_rice_user_hands_admin,
  get_raise_hands_admin,
  push_notification
};
