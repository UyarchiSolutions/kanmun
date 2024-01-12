const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const moment = require('moment');
const { AgoraAppId } = require('../../models/liveStreaming/AgoraAppId.model');
const Dates = require('../Date.serive');
const paymentgatway = require('../paymentgatway.service');
const axios = require('axios');
const {
  Product,
  Stock,
  ConfirmStock,
  LoadingExecute,
  BillRaise,
  ManageBill,
  ShopList,
} = require('../../models/product.model');
const {
  Demoseller,
  Demostream,
  Demopost,
  Demobuyer,
  Demoorder,
  Demoorderproduct,
  DemostreamToken,
  Democart,
  Democartproduct,
  Demopaymnt,
  DemoInstested,
  Demosavedproduct,
  Demootpverify,
  Democloudrecord,
  Feedback,
  TechIssue,
  Demorequest,
  Demoraisehands
} = require('../../models/liveStreaming/DemoStream.model');
const jwt = require('jsonwebtoken');
const agoraToken = require('./AgoraAppId.service');
const emailservice = require('../email.service');

const { Seller } = require('../../models/seller.models');

const secret = 'demoStream';
const Agora = require('agora-access-token');
const sms_send_seller = async (link, mobile) => {
  mobile = 91 + '' + mobile;
  console.log(mobile);
  console.log(link);
  let message = `Dear Client, Thanks for your interest in our services. You can test our service by using this link https://ag23.site/s/${link} - AgriExpoLive2023(An Ookam company event)`;
  let reva = await axios.get(
    `http://panel.smsmessenger.in/api/mt/SendSMS?user=ookam&password=ookam&senderid=OOKAMM&channel=Trans&DCS=0&flashsms=0&number=${mobile}&text=${message}&route=6&peid=1701168700339760716&DLTTemplateId=1707168958870053466`
  );
  console.log(reva.data);
  return reva.data;
};
const sms_send_seller_assessment = async (link, mobile) => {
  mobile = 91 + '' + mobile;
  console.log(mobile)
  console.log(link)
  // let message = `Dear Client, Thanks for your interest in our services. You can test our service by using this link https://ag23.site/s/${'a/' + link} - AgriExpoLive2023(An Ookam company event)`;
  let message = `Dear Client, Thanks for your interest in our services. You can test our service by using this link https://ag23.site/s/${'a/' + link
    } - AgriExpoLive2023(An Ookam company event)`;
  let reva = await axios.get(
    `http://panel.smsmessenger.in/api/mt/SendSMS?user=ookam&password=ookam&senderid=OOKAMM&channel=Trans&DCS=0&flashsms=0&number=${mobile}&text=${message}&route=6&peid=1701168700339760716&DLTTemplateId=1707168958870053466`
  );
  console.log(reva.data);
  return reva.data;
};
const geenerate_rtc_token = async (chennel, uid, role, expirationTimestamp, agoraID) => {
  let agoraToken = await AgoraAppId.findById(agoraID);
  console.log(chennel, uid, role, expirationTimestamp, agoraID, agoraToken);
  return Agora.RtcTokenBuilder.buildTokenWithUid(
    agoraToken.appID.replace(/\s/g, ''),
    agoraToken.appCertificate.replace(/\s/g, ''),
    chennel,
    uid,
    role,
    expirationTimestamp
  );
};
const generateUid = async () => {
  const length = 5;
  const randomNo = Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
  return randomNo;
};

const { v4: uuidv4 } = require('uuid');
function generateUniqueID() {
  const uuid = uuidv4(); // Generate a UUID
  const uniqueID = uuid.replace(/-/g, '').slice(0, 10); // Remove dashes and take the first 10 characters
  return uniqueID;
}

const demorequest = async (req) => {
  const { mobileNumber, name, location } = req.body;
  let user = await Demoseller.findOne({ phoneNumber: mobileNumber });
  if (!user) {
    user = await Demoseller.create({ phoneNumber: mobileNumber, dateISO: moment(), name: name });
  } else {
    user.name = name;
    user.save();
  }
  let demostream = await Demorequest.create({
    userID: user._id,
    dateISO: moment(),
    phoneNumber: mobileNumber,
    name: name,
    location: location,
  });
  return demostream;
};

const get_demo_request = async (req) => {
  let page = req.query.page == '' || req.query.page == null || req.query.page == null ? 0 : req.query.page;
  let currentDate = new Date().getTime();

  let demostream = await Demorequest.aggregate([
    { $sort: { dateISO: -1 } },
    {
      $lookup: {
        from: 'demostreams',
        localField: 'streamID',
        foreignField: '_id',
        pipeline: [
          {
            $addFields: {
              endtrue: { $ifNull: ['$endTime', false] },
            },
          },
          {
            $addFields: {
              status: {
                $cond: {
                  if: { $eq: ['$endtrue', false] },
                  then: '$status',
                  else: {
                    $cond: {
                      if: { $lt: ['$endTime', currentDate] },
                      then: 'Completed',
                      else: '$status',
                    },
                  },
                },
              },
            },
          },
          {
            $addFields: {
              otp_verifiyed_status: {
                $cond: {
                  if: { $lt: ['$tokenExp', currentDate] },
                  then: 'Expired',
                  else: '$otp_verifiyed_status',
                },
              },
            },
          },
          { $limit: 1 },
        ],
        as: 'demostreams',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$demostreams',
      },
    },
    {
      $project: {
        _id: 1,
        phoneNumber: 1,
        streamID: 1,
        dateISO: 1,
        streamName: {
          $ifNull: ['$demostreams.streamName', 'nill'],
        },
        status: {
          $ifNull: ['$demostreams.status', 'nill'],
        },
        otp_verifiyed_status: {
          $ifNull: ['$demostreams.otp_verifiyed_status', 'nill'],
        },
        location: 1,
        name: 1,
        userID: 1,
      },
    },
    {
      $skip: 10 * page,
    },
    { $limit: 10 },
  ]);
  let next = await Demorequest.aggregate([
    { $sort: { dateISO: -1 } },
    {
      $skip: 10 * (page + 1),
    },
    { $limit: 10 },
  ]);
  return { demostream, next: next.length != 0 };
};

const send_request_link = async (req) => {
  let transaction = req.query.transaction;
  let userID = req.userId;
  let demorequest = await Demorequest.findById(req.query.id);
  if (!demorequest) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Demo Request Not Found');
  }
  let user = await Demoseller.findById(demorequest.userID);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found');
  }
  const id = generateUniqueID();
  let streamCount = await Demostream.find().count();
  console.log(moment().add(15, 'minutes').format('hh:mm a'));
  let demostream = await Demostream.create({
    userID: user._id,
    dateISO: moment(),
    phoneNumber: user.phoneNumber,
    name: user.name,
    streamName: 'Demo Stream - ' + (parseInt(streamCount) + 1),
    createdBy: userID,
    _id: id,
    transaction: transaction,
    tokenExp: moment().add(demorequest.type == 'demo' ? 30 : 45, 'minutes'),
    demoType: 'seller',
  });
  // endTime: moment().add(15, 'minutes'),
  const payload = {
    _id: user._id,
    streamID: demostream._id,
    type: 'demostream',
  };
  let valitity = jwt.sign(payload, secret, {
    expiresIn: '45m', // Set token expiration to 30 minutes
  });
  if (demorequest.type == 'demo') {
    valitity = jwt.sign(payload, secret, {
      expiresIn: '30m', // Set token expiration to 30 minutes
    });
  }
  demostream.streamValitity = valitity;
  demostream.save();
  demorequest.streamID = demostream._id;
  demorequest.save();
  let product = await Product.find().limit(10);
  let demopoat = [];
  if (transaction == 'Without Transaction') {
    product = await Product.find({ category: 'fde82b92-5caf-4539-af90-1fd15cfd389f' }).limit(10);
  }
  // return new Promise(async (resolve) => {
  let element = product;
  let streampost0 = await Demopost.create({
    productTitle: element[0].productTitle,
    streamID: demostream._id,
    productID: element[0]._id,
    image: element[0].image,
    userID: user._id,
    dateISO: moment(),
    quantity: 1200,
    pendingQTY: 1200,
    marketPlace: 50,
    offerPrice: 30,
    minLots: 10,
    incrementalLots: 5,
  });
  let streampost1 = await Demopost.create({
    productTitle: element[1].productTitle,
    streamID: demostream._id,
    productID: element[1]._id,
    image: element[1].image,
    userID: user._id,
    dateISO: moment(),
    quantity: 1500,
    pendingQTY: 1500,
    marketPlace: 100,
    offerPrice: 80,
    minLots: 6,
    incrementalLots: 5,
  });
  let streampost2 = await Demopost.create({
    productTitle: element[2].productTitle,
    streamID: demostream._id,
    productID: element[2]._id,
    image: element[2].image,
    userID: user._id,
    dateISO: moment(),
    quantity: 2000,
    pendingQTY: 2000,
    marketPlace: 50,
    offerPrice: 30,
    minLots: 11,
    incrementalLots: 5,
  });
  let streampost3 = await Demopost.create({
    productTitle: element[3].productTitle,
    streamID: demostream._id,
    productID: element[3]._id,
    image: element[3].image,
    userID: user._id,
    dateISO: moment(),
    quantity: 1000,
    pendingQTY: 1000,
    marketPlace: 60,
    offerPrice: 50,
    minLots: 20,
    incrementalLots: 5,
  });
  let streampost4 = await Demopost.create({
    productTitle: element[4].productTitle,
    streamID: demostream._id,
    productID: element[4]._id,
    image: element[4].image,
    userID: user._id,
    dateISO: moment(),
    quantity: 1200,
    pendingQTY: 1200,
    marketPlace: 50,
    offerPrice: 30,
    minLots: 25,
    incrementalLots: 5,
  });
  let streampost5 = await Demopost.create({
    productTitle: element[5].productTitle,
    streamID: demostream._id,
    productID: element[5]._id,
    image: element[5].image,
    userID: user._id,
    dateISO: moment(),
    quantity: 500,
    pendingQTY: 500,
    marketPlace: 90,
    offerPrice: 75,
    minLots: 10,
    incrementalLots: 5,
  });
  let streampost6 = await Demopost.create({
    productTitle: element[6].productTitle,
    streamID: demostream._id,
    productID: element[6]._id,
    image: element[6].image,
    userID: user._id,
    dateISO: moment(),
    quantity: 2500,
    pendingQTY: 2500,
    marketPlace: 60,
    offerPrice: 40,
    minLots: 20,
    incrementalLots: 5,
  });

  let streampost7 = await Demopost.create({
    productTitle: element[7].productTitle,
    streamID: demostream._id,
    productID: element[7]._id,
    image: element[7].image,
    userID: user._id,
    dateISO: moment(),
    quantity: 2800,
    pendingQTY: 2800,
    marketPlace: 50,
    offerPrice: 30,
    minLots: 5,
    incrementalLots: 5,
  });
  let streampost8 = await Demopost.create({
    productTitle: element[8].productTitle,
    streamID: demostream._id,
    productID: element[8]._id,
    image: element[8].image,
    userID: user._id,
    dateISO: moment(),
    quantity: 600,
    pendingQTY: 600,
    marketPlace: 40,
    offerPrice: 25,
    minLots: 8,
    incrementalLots: 5,
  });
  let streampost9 = await Demopost.create({
    productTitle: element[9].productTitle,
    streamID: demostream._id,
    productID: element[9]._id,
    image: element[9].image,
    userID: user._id,
    dateISO: moment(),
    quantity: 700,
    pendingQTY: 700,
    marketPlace: 30,
    offerPrice: 19,
    minLots: 3,
    incrementalLots: 5,
  });
  demopoat.push(streampost0);
  demopoat.push(streampost1);
  demopoat.push(streampost2);
  demopoat.push(streampost3);
  demopoat.push(streampost4);
  demopoat.push(streampost5);
  demopoat.push(streampost6);
  demopoat.push(streampost7);
  demopoat.push(streampost8);
  demopoat.push(streampost9);
  // if (demopoat.length == 10) {
  console.log(await sms_send_seller(demostream._id, user.phoneNumber));
  // console.log(emailservice.sendDemolink(['bharathiraja996574@gmail.com', 'bharathi@uyarchi.com', 'mps.bharathiraja@gmail.com'], demostream._id));
  return { demopoat, demostream };
};
const get_demo_requests = async (req) => {
  let userID = req.userId;
  let stream = await Demostream.find({ createdBy: userID });

  return stream;
};
const send_livestream_link_demo = async (req) => {
  let userID = req.userId;
  let seller = await Seller.findById(userID);
  if (!seller) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Seller Not Fount');
  }
  let streamcount = await Demostream.find({ createdBy: userID }).count();
  if (streamcount < 5) {
    // Seller
    const { transaction } = req.body;
    let user = await Demoseller.findOne({ phoneNumber: seller.mobileNumber });
    if (!user) {
      user = await Demoseller.create({ phoneNumber: seller.mobileNumber, dateISO: moment(), name: seller.tradeName });
    } else {
      user.name = seller.tradeName;
      user.save();
    }
    const id = generateUniqueID();
    // let streamCount = await Demostream.find().count();
    // console.log(moment().add(15, 'minutes').format('hh:mm a'));
    let demostream = await Demostream.create({
      userID: user._id,
      dateISO: moment(),
      phoneNumber: seller.mobileNumber,
      name: seller.tradeName,
      streamName: 'Demo Stream - ' + (parseInt(streamcount) + 1),
      createdBy: userID,
      _id: id,
      transaction: transaction,
      tokenExp: moment().add(30, 'minutes'),
      type: 'demo',
    });
    // endTime: moment().add(15, 'minutes'),
    const payload = {
      _id: user._id,
      streamID: demostream._id,
      type: 'demostream',
    };
    let valitity = jwt.sign(payload, secret, {
      expiresIn: '30m', // Set token expiration to 30 minutes
    });

    demostream.streamValitity = valitity;
    demostream.save();
    let product = await Product.find().limit(10);
    let demopoat = [];
    if (transaction == 'Without Transaction') {
      product = await Product.find({ category: 'fde82b92-5caf-4539-af90-1fd15cfd389f' }).limit(10);
    }
    // return new Promise(async (resolve) => {
    let element = product;
    let streampost0 = await Demopost.create({
      productTitle: element[0].productTitle,
      streamID: demostream._id,
      productID: element[0]._id,
      image: element[0].image,
      userID: user._id,
      dateISO: moment(),
      quantity: 1200,
      pendingQTY: 1200,
      marketPlace: 50,
      offerPrice: 30,
      minLots: 10,
      incrementalLots: 5,
    });
    let streampost1 = await Demopost.create({
      productTitle: element[1].productTitle,
      streamID: demostream._id,
      productID: element[1]._id,
      image: element[1].image,
      userID: user._id,
      dateISO: moment(),
      quantity: 1500,
      pendingQTY: 1500,
      marketPlace: 100,
      offerPrice: 80,
      minLots: 6,
      incrementalLots: 5,
    });
    let streampost2 = await Demopost.create({
      productTitle: element[2].productTitle,
      streamID: demostream._id,
      productID: element[2]._id,
      image: element[2].image,
      userID: user._id,
      dateISO: moment(),
      quantity: 2000,
      pendingQTY: 2000,
      marketPlace: 50,
      offerPrice: 30,
      minLots: 11,
      incrementalLots: 5,
    });
    let streampost3 = await Demopost.create({
      productTitle: element[3].productTitle,
      streamID: demostream._id,
      productID: element[3]._id,
      image: element[3].image,
      userID: user._id,
      dateISO: moment(),
      quantity: 1000,
      pendingQTY: 1000,
      marketPlace: 60,
      offerPrice: 50,
      minLots: 20,
      incrementalLots: 5,
    });
    let streampost4 = await Demopost.create({
      productTitle: element[4].productTitle,
      streamID: demostream._id,
      productID: element[4]._id,
      image: element[4].image,
      userID: user._id,
      dateISO: moment(),
      quantity: 1200,
      pendingQTY: 1200,
      marketPlace: 50,
      offerPrice: 30,
      minLots: 25,
      incrementalLots: 5,
    });
    let streampost5 = await Demopost.create({
      productTitle: element[5].productTitle,
      streamID: demostream._id,
      productID: element[5]._id,
      image: element[5].image,
      userID: user._id,
      dateISO: moment(),
      quantity: 500,
      pendingQTY: 500,
      marketPlace: 90,
      offerPrice: 75,
      minLots: 10,
      incrementalLots: 5,
    });
    let streampost6 = await Demopost.create({
      productTitle: element[6].productTitle,
      streamID: demostream._id,
      productID: element[6]._id,
      image: element[6].image,
      userID: user._id,
      dateISO: moment(),
      quantity: 2500,
      pendingQTY: 2500,
      marketPlace: 60,
      offerPrice: 40,
      minLots: 20,
      incrementalLots: 5,
    });

    let streampost7 = await Demopost.create({
      productTitle: element[7].productTitle,
      streamID: demostream._id,
      productID: element[7]._id,
      image: element[7].image,
      userID: user._id,
      dateISO: moment(),
      quantity: 2800,
      pendingQTY: 2800,
      marketPlace: 50,
      offerPrice: 30,
      minLots: 5,
      incrementalLots: 5,
    });
    let streampost8 = await Demopost.create({
      productTitle: element[8].productTitle,
      streamID: demostream._id,
      productID: element[8]._id,
      image: element[8].image,
      userID: user._id,
      dateISO: moment(),
      quantity: 600,
      pendingQTY: 600,
      marketPlace: 40,
      offerPrice: 25,
      minLots: 8,
      incrementalLots: 5,
    });
    let streampost9 = await Demopost.create({
      productTitle: element[9].productTitle,
      streamID: demostream._id,
      productID: element[9]._id,
      image: element[9].image,
      userID: user._id,
      dateISO: moment(),
      quantity: 700,
      pendingQTY: 700,
      marketPlace: 30,
      offerPrice: 19,
      minLots: 3,
      incrementalLots: 5,
    });
    demopoat.push(streampost0);
    demopoat.push(streampost1);
    demopoat.push(streampost2);
    demopoat.push(streampost3);
    demopoat.push(streampost4);
    demopoat.push(streampost5);
    demopoat.push(streampost6);
    demopoat.push(streampost7);
    demopoat.push(streampost8);
    demopoat.push(streampost9);
    // if (demopoat.length == 10) {
    await sms_send_seller(demostream._id, seller.mobileNumber);
    // console.log(emailservice.sendDemolink(['bharathiraja996574@gmail.com', 'bharathi@uyarchi.com', 'mps.bharathiraja@gmail.com'], demostream._id));
    return { demopoat, demostream };
  } else {
    return { message: 'Count Reachecd' };
  }
};

const send_livestream_link_ryh = async (req) => {
  let userID = req.userId;
  const { phoneNumber, name, transaction, type } = req.body;
  let user = await Demoseller.findOne({ phoneNumber: phoneNumber });
  if (!user) {
    user = await Demoseller.create({ phoneNumber: phoneNumber, dateISO: moment(), name: name });
  } else {
    user.name = name;
    user.save();
  }
  const id = generateUniqueID();
  let streamCount = await Demostream.find().count();
  let demostream = await Demostream.create({
    userID: user._id,
    dateISO: moment(),
    phoneNumber: phoneNumber,
    name: name,
    streamName: 'Demo Stream - ' + (parseInt(streamCount) + 1),
    createdBy: userID,
    _id: id,
    transaction: transaction,
    tokenExp: type == moment().add(10, 'days'),
    type: type,
  });
  const payload = {
    _id: user._id,
    streamID: demostream._id,
    type: 'demostream',
  };
  let valitity = jwt.sign(payload, secret, {
    expiresIn: '10d',
  });
  demostream.streamValitity = valitity;
  demostream.save();
  await sms_send_seller(demostream._id, phoneNumber);

  return { demostream };
}

const send_livestream_link = async (req) => {
  let userID = req.userId;
  const { phoneNumber, name, transaction, type } = req.body;
  let user = await Demoseller.findOne({ phoneNumber: phoneNumber });
  if (!user) {
    user = await Demoseller.create({ phoneNumber: phoneNumber, dateISO: moment(), name: name });
  } else {
    user.name = name;
    user.save();
  }
  const id = generateUniqueID();
  let streamCount = await Demostream.find().count();
  let demostream = await Demostream.create({
    userID: user._id,
    dateISO: moment(),
    phoneNumber: phoneNumber,
    name: name,
    streamName: type == 'demo' ? 'Demo Stream - ' + (parseInt(streamCount) + 1) : 'Agriexpo2024-Meet',
    createdBy: userID,
    _id: id,
    transaction: transaction,
    tokenExp: type == 'demo' ? moment().add(30, 'minutes') : moment().add(10, 'days'),
    type: type,
  });
  const payload = {
    _id: user._id,
    streamID: demostream._id,
    type: 'demostream',
  };
  let valitity = jwt.sign(payload, secret, {
    expiresIn: '10d',
  });
  if (type == 'demo') {
    valitity = jwt.sign(payload, secret, {
      expiresIn: '30m',
    });
  }
  demostream.streamValitity = valitity;
  demostream.save();
  let product = await Product.find().limit(10);
  let demopoat = [];
  if (transaction == 'Without Transaction') {
    product = await Product.find({ category: 'fde82b92-5caf-4539-af90-1fd15cfd389f' }).limit(10);
  }
  // return new Promise(async (resolve) => {
  let element = product;
  let streampost0 = await Demopost.create({
    productTitle: element[0].productTitle,
    streamID: demostream._id,
    productID: element[0]._id,
    image: element[0].image,
    userID: user._id,
    dateISO: moment(),
    quantity: 1200,
    pendingQTY: 1200,
    marketPlace: 50,
    offerPrice: 30,
    minLots: 10,
    incrementalLots: 5,
  });
  let streampost1 = await Demopost.create({
    productTitle: element[1].productTitle,
    streamID: demostream._id,
    productID: element[1]._id,
    image: element[1].image,
    userID: user._id,
    dateISO: moment(),
    quantity: 1500,
    pendingQTY: 1500,
    marketPlace: 100,
    offerPrice: 80,
    minLots: 6,
    incrementalLots: 5,
  });
  let streampost2 = await Demopost.create({
    productTitle: element[2].productTitle,
    streamID: demostream._id,
    productID: element[2]._id,
    image: element[2].image,
    userID: user._id,
    dateISO: moment(),
    quantity: 2000,
    pendingQTY: 2000,
    marketPlace: 50,
    offerPrice: 30,
    minLots: 11,
    incrementalLots: 5,
  });
  let streampost3 = await Demopost.create({
    productTitle: element[3].productTitle,
    streamID: demostream._id,
    productID: element[3]._id,
    image: element[3].image,
    userID: user._id,
    dateISO: moment(),
    quantity: 1000,
    pendingQTY: 1000,
    marketPlace: 60,
    offerPrice: 50,
    minLots: 20,
    incrementalLots: 5,
  });
  let streampost4 = await Demopost.create({
    productTitle: element[4].productTitle,
    streamID: demostream._id,
    productID: element[4]._id,
    image: element[4].image,
    userID: user._id,
    dateISO: moment(),
    quantity: 1200,
    pendingQTY: 1200,
    marketPlace: 50,
    offerPrice: 30,
    minLots: 25,
    incrementalLots: 5,
  });
  let streampost5 = await Demopost.create({
    productTitle: element[5].productTitle,
    streamID: demostream._id,
    productID: element[5]._id,
    image: element[5].image,
    userID: user._id,
    dateISO: moment(),
    quantity: 500,
    pendingQTY: 500,
    marketPlace: 90,
    offerPrice: 75,
    minLots: 10,
    incrementalLots: 5,
  });
  let streampost6 = await Demopost.create({
    productTitle: element[6].productTitle,
    streamID: demostream._id,
    productID: element[6]._id,
    image: element[6].image,
    userID: user._id,
    dateISO: moment(),
    quantity: 2500,
    pendingQTY: 2500,
    marketPlace: 60,
    offerPrice: 40,
    minLots: 20,
    incrementalLots: 5,
  });

  let streampost7 = await Demopost.create({
    productTitle: element[7].productTitle,
    streamID: demostream._id,
    productID: element[7]._id,
    image: element[7].image,
    userID: user._id,
    dateISO: moment(),
    quantity: 2800,
    pendingQTY: 2800,
    marketPlace: 50,
    offerPrice: 30,
    minLots: 5,
    incrementalLots: 5,
  });
  let streampost8 = await Demopost.create({
    productTitle: element[8].productTitle,
    streamID: demostream._id,
    productID: element[8]._id,
    image: element[8].image,
    userID: user._id,
    dateISO: moment(),
    quantity: 600,
    pendingQTY: 600,
    marketPlace: 40,
    offerPrice: 25,
    minLots: 8,
    incrementalLots: 5,
  });
  let streampost9 = await Demopost.create({
    productTitle: element[9].productTitle,
    streamID: demostream._id,
    productID: element[9]._id,
    image: element[9].image,
    userID: user._id,
    dateISO: moment(),
    quantity: 700,
    pendingQTY: 700,
    marketPlace: 30,
    offerPrice: 19,
    minLots: 3,
    incrementalLots: 5,
  });
  demopoat.push(streampost0);
  demopoat.push(streampost1);
  demopoat.push(streampost2);
  demopoat.push(streampost3);
  demopoat.push(streampost4);
  demopoat.push(streampost5);
  demopoat.push(streampost6);
  demopoat.push(streampost7);
  demopoat.push(streampost8);
  demopoat.push(streampost9);
  // if (demopoat.length == 10) {
  await sms_send_seller(demostream._id, phoneNumber);

  // console.log(emailservice.sendDemolink(['bharathiraja996574@gmail.com', 'bharathi@uyarchi.com', 'mps.bharathiraja@gmail.com'], demostream._id));

  return { demopoat, demostream };
  // }
  // });
};

const send_livestream_link_assessment = async (req) => {
  let userID = req.userId;
  const { phoneNumber, name, transaction, type } = req.body;
  let user = await Demoseller.findOne({ phoneNumber: phoneNumber });
  if (!user) {
    user = await Demoseller.create({ phoneNumber: phoneNumber, dateISO: moment(), name: name });
  } else {
    user.name = name;
    user.candidate = req.body.candidate;
    user.save();
  }
  const id = generateUniqueID();
  let demostream = await Demostream.create({
    userID: user._id,
    dateISO: moment(),
    phoneNumber: phoneNumber,
    name: name,
    streamName: "JOBS - WARMY - Assessment",
    createdBy: userID,
    _id: id,
    transaction: transaction,
    tokenExp: type == moment().add(1, 'days'),
    type: type,
    candidate: req.body.candidate,
  });
  const payload = {
    _id: user._id,
    streamID: demostream._id,
    type: 'demostream',
  };
  let valitity = jwt.sign(payload, secret, {
    expiresIn: '10d',
  });

  demostream.streamValitity = valitity;
  demostream.save();
  await sms_send_seller_assessment(demostream._id, phoneNumber);
  return { demostream };
};

const verifyToken = async (req) => {
  console.log(req.query.id);

  const token = await Demostream.findById(req.query.id);
  if (!token) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Link');
  }
  console.log(token.streamValitity)
  try {
    const payload = jwt.verify(token.streamValitity, 'demoStream');
  } catch (err) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Link has Expired');
  }
  let user = await Demoseller.findById(token.userID);
  let mobileNumber = user.phoneNumber;
  return { token, mobileNumber };
};
const get_stream_verify_buyer = async (req) => {
  console.log(req.query.id);
  const token = await Demostream.findById(req.query.id);
  if (!token) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Link');
  }
  try {
    const payload = jwt.verify(token.streamValitity, 'demoStream');
  } catch (err) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Link has Expired');
  }
  const joined = await DemostreamToken.findById(req.query.join);
  if (joined) {
    token.joined = joined.streamID == token._id ? true : false;
  }
  return token;
};

const get_stream_details_check = async (req) => {
  const token = await Demostream.findById(req.query.id);
  if (!token) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Link');
  }
  try {
    const payload = jwt.verify(token.streamValitity, 'demoStream');
  } catch (err) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Link has Expired');
  }
  const streampost = await Demopost.aggregate([
    { $match: { $and: [{ streamID: req.query.id }] } },
    {
      $lookup: {
        from: 'democartproducts',
        localField: '_id',
        foreignField: 'streamrequestpostId',
        pipeline: [
          {
            $lookup: {
              from: 'democarts',
              localField: 'streamingCart',
              foreignField: '_id',
              pipeline: [
                { $match: { $and: [{ status: { $ne: 'ordered' } }] } },
                {
                  $project: {
                    _id: 1,
                  },
                },
              ],
              as: 'streamingcarts',
            },
          },
          { $unwind: '$streamingcarts' },
          { $match: { $and: [{ cardStatus: { $eq: true } }, { add_to_cart: { $eq: true } }] } },
          { $group: { _id: null, count: { $sum: '$cartQTY' } } },
        ],
        as: 'stream_cart',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$stream_cart',
      },
    },
    {
      $lookup: {
        from: 'demoorderproducts',
        localField: '_id',
        foreignField: 'postId',
        pipeline: [{ $group: { _id: null, count: { $sum: '$purchase_quantity' } } }],
        as: 'stream_checkout',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$stream_checkout',
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productID',
        foreignField: '_id',
        as: 'products',
      },
    },

    { $unwind: '$products' },
    {
      $project: {
        _id: 1,
        productTitle: '$products.productTitle',
        image: '$products.image',
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
        streamEnd: 1,
        stream_cart: { $ifNull: ['$stream_cart.count', 0] },
        stream_checkout: { $ifNull: ['$stream_checkout.count', 0] },
      },
    },
  ]);
  const agora = await DemostreamToken.findOne({ streamID: req.query.id, type: 'HOST' });
  const agoraID = await AgoraAppId.findById(token.agoraID);
  const allowed_count = await DemostreamToken.find({ golive: true, status: 'resgistered', streamID: token._id }).count();
  return { token, streampost, agora, agoraID, allowed_count };
};

const get_stream_details_check_golive = async (req) => {
  const token = await Demostream.findById(req.query.id);
  if (!token) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Link');
  }
  try {
    const payload = jwt.verify(token.streamValitity, 'demoStream');
  } catch (err) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Link has Expired');
  }
  const streampost = await Demopost.aggregate([
    { $match: { $and: [{ streamID: req.query.id }] } },
    {
      $lookup: {
        from: 'democartproducts',
        localField: '_id',
        foreignField: 'streamrequestpostId',
        pipeline: [
          {
            $lookup: {
              from: 'democarts',
              localField: 'streamingCart',
              foreignField: '_id',
              pipeline: [
                { $match: { $and: [{ status: { $ne: 'ordered' } }] } },
                {
                  $project: {
                    _id: 1,
                  },
                },
              ],
              as: 'streamingcarts',
            },
          },
          { $unwind: '$streamingcarts' },
          { $match: { $and: [{ cardStatus: { $eq: true } }, { add_to_cart: { $eq: true } }] } },
          { $group: { _id: null, count: { $sum: '$cartQTY' } } },
        ],
        as: 'stream_cart',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$stream_cart',
      },
    },
    {
      $lookup: {
        from: 'demoorderproducts',
        localField: '_id',
        foreignField: 'postId',
        pipeline: [{ $group: { _id: null, count: { $sum: '$purchase_quantity' } } }],
        as: 'stream_checkout',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$stream_checkout',
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productID',
        foreignField: '_id',
        as: 'products',
      },
    },

    { $unwind: '$products' },
    {
      $project: {
        _id: 1,
        productTitle: '$products.productTitle',
        image: '$products.image',
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
        streamEnd: 1,
        stream_cart: { $ifNull: ['$stream_cart.count', 0] },
        stream_checkout: { $ifNull: ['$stream_checkout.count', 0] },
      },
    },
  ]);
  const agora = await DemostreamToken.findOne({ streamID: req.query.id, type: 'HOST' });
  const agoraID = await AgoraAppId.findById(token.agoraID);
  const allowed_count = await DemostreamToken.find({ golive: true, status: 'resgistered', streamID: token._id }).count();
  await cloude_recording_stream(token._id, token.agoraID, token.endTime);

  const raise = await DemostreamToken.aggregate([
    { $match: { $and: [{ streamID: { $eq: req.query.id } }, { raise_hands: { $eq: true } }] } },
    {
      $lookup: {
        from: 'demobuyers',
        localField: 'userID',
        foreignField: '_id',
        as: 'demobuyers',
      },
    },
    { $unwind: '$demobuyers' },
    {
      $project: {
        name: "$demobuyers.name",
        phoneNumber: "$demobuyers.phoneNumber",
        _id: 1,
        date: 1,
        dateISO: 1,
        live: 1,
        raise_hands: 1
      }
    }
  ])

  return { token, raise, streampost, agora, agoraID, allowed_count };
};

const go_live_stream = async (req) => {
  const token = await Demostream.findById(req.query.id);
  if (!token) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Link');
  }
  try {
    const payload = jwt.verify(token.streamValitity, 'demoStream');
  } catch (err) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Link has Expired');
  }
  const streampost = await Demopost.find({ streamID: req.query.id });

  return { token, streampost };
};

const join_stream_candidate = async (req) => {
  const { phoneNumber, name, type } = req.body;

  const streamId = req.query.id;
  const stream = await Demostream.findById(streamId);

  if (!stream) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream not found');
  }

  if (stream.candidate != phoneNumber) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You are Not a Valid User');
  }

  if (stream.condidate_join == true) {
    throw new ApiError(httpStatus.NOT_FOUND, 'This Number has already logged In');
  }
  let user = await Demobuyer.findOne({ phoneNumber: phoneNumber });

  if (!user) {
    user = await Demobuyer.create({ phoneNumber: phoneNumber, name: name, dateISO: moment(), type });
  } else {
    user.name = name;
    user.type = type;
    user.save();
  }


  let demotoken = await DemostreamToken.findOne({ userID: user._id, streamID: stream._id });
  if (!demotoken) {
    // const uid = await generateUid();
    // const role = Agora.RtcRole.PUBLISHER;
    // let expirationTimestamp = moment().add(15, 'minutes') / 1000;
    // const token = await geenerate_rtc_token(stream._id, uid, role, expirationTimestamp, stream.agoraID);
    demotoken = await DemostreamToken.create({
      // expirationTimestamp: moment().add(15, 'minutes'),
      streamID: streamId,
      type: 'BUYER',
      // uid: uid,
      agoraID: stream.agoraID,
      // token: token,
      channel: streamId,
      dateISO: moment(),
      userID: user._id,
      usertype: type
    });
  }
  let register = await DemostreamToken.find({ streamID: demotoken.streamID, status: 'resgistered' }).count();
  stream.condidate_join = true;
  if (stream.type == 'demo') {
    if (register < 5) {
      demotoken.golive = true;
      if (stream.status == 'Pending') {
        stream.status = 'Ready';
      }
    } else {
      demotoken.golive = false;
    }
  }
  else if (stream.type == 'assessment') {
    if (register < 5) {
      demotoken.golive = true;
      if (stream.status == 'Pending') {
        stream.status = 'Ready';
      }
    } else {
      demotoken.golive = false;
    }
  }
  else {
    if (register < 300) {
      demotoken.golive = true;
      if (stream.status == 'Pending') {
        stream.status = 'Ready';
      }
    } else {
      demotoken.golive = false;
    }
  }
  stream.save();
  demotoken.status = 'resgistered';
  demotoken.save();
  setTimeout(async () => {
    register = await DemostreamToken.find({ streamID: demotoken.streamID, status: 'resgistered' }).count();
    req.io.emit(demotoken.streamID + '_buyer_registor', { register });

    let interviewvers = await DemostreamToken.aggregate([
      { $match: { $and: [{ _id: { $eq: demotoken._id } }] } },
      {
        $lookup: {
          from: 'demobuyers',
          localField: 'userID',
          foreignField: '_id',
          as: 'demobuyers',
        },
      },
      { $unwind: '$demobuyers' },

      {
        $project: {
          name: "$demobuyers.name",
          phoneNumber: "$demobuyers.phoneNumber",
          _id: 1,
          date: 1,
          dateISO: 1,
          live: 1
        }
      }
    ])
    if (interviewvers.length != 0) {
      req.io.emit(demotoken.streamID + '_candidate', interviewvers[0]);
    }
  }, 300);
  return demotoken;
};

const join_stream_buyer = async (req) => {
  const { phoneNumber, name, Institution_name, location } = req.body;

  const streamId = req.query.id;

  let user = await Demobuyer.findOne({ phoneNumber: phoneNumber });

  if (!user) {
    user = await Demobuyer.create({ phoneNumber: phoneNumber, name: name, dateISO: moment() });
  } else {
    user.name = name;
    user.Institution_name = Institution_name;
    user.location = location;
    user.save();
  }

  const stream = await Demostream.findById(streamId);
  if (!stream) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream not found');
  }

  let demotoken = await DemostreamToken.findOne({ userID: user._id, streamID: stream._id });
  if (!demotoken) {
    // const uid = await generateUid();
    // const role = Agora.RtcRole.PUBLISHER;
    // let expirationTimestamp = moment().add(15, 'minutes') / 1000;
    // const token = await geenerate_rtc_token(stream._id, uid, role, expirationTimestamp, stream.agoraID);
    demotoken = await DemostreamToken.create({
      // expirationTimestamp: moment().add(15, 'minutes'),
      streamID: streamId,
      type: 'BUYER',
      // uid: uid,
      agoraID: stream.agoraID,
      // token: token,
      channel: streamId,
      dateISO: moment(),
      userID: user._id,
    });
  }

  let register = await DemostreamToken.find({ streamID: demotoken.streamID, status: 'resgistered' }).count();
  if (stream.type == 'demo') {
    if (register < 5) {
      demotoken.golive = true;
      if (stream.status == 'Pending') {
        stream.status = 'Ready';
        stream.save();
      }
    } else {
      demotoken.golive = false;
    }
  }
  else if (stream.type == 'assessment') {
    if (register < 5) {
      demotoken.golive = true;
      if (stream.status == 'Pending') {
        stream.status = 'Ready';
        stream.save();
      }
    } else {
      demotoken.golive = false;
    }
  }
  else {
    if (register < 300) {
      demotoken.golive = true;
      if (stream.status == 'Pending') {
        stream.status = 'Ready';
        stream.save();
      }
    } else {
      demotoken.golive = false;
    }
  }

  demotoken.status = 'resgistered';
  demotoken.save();

  setTimeout(async () => {
    register = await DemostreamToken.find({ streamID: demotoken.streamID, status: 'resgistered' }).count();
    req.io.emit(demotoken.streamID + '_buyer_registor', { register });

    let interviewvers = await DemostreamToken.aggregate([
      { $match: { $and: [{ _id: { $eq: demotoken._id } }] } },
      {
        $lookup: {
          from: 'demobuyers',
          localField: 'userID',
          foreignField: '_id',
          as: 'demobuyers',
        },
      },
      { $unwind: '$demobuyers' },

      {
        $project: {
          name: "$demobuyers.name",
          phoneNumber: "$demobuyers.phoneNumber",
          _id: 1,
          date: 1,
          dateISO: 1,
          live: 1

        }
      }
    ])
    if (interviewvers.length != 0) {
      req.io.emit(demotoken.streamID + '_interviewer', interviewvers[0]);
    }

  }, 300);
  console.log(demotoken.streamID + '_buyer_registor', 987887678678);
  return demotoken;
};

const buyer_go_live_stream = async (req) => {
  let demotoken = await DemostreamToken.findById(req.query.id);
  if (!demotoken) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream not found');
  }
  const stream = await Demostream.findById(demotoken.streamID);
  if (demotoken.token == null) {
    const uid = await generateUid();
    const role = Agora.RtcRole.SUBSCRIBER;
    let expirationTimestamp = stream.endTime / 1000;
    const token = await geenerate_rtc_token(stream._id, uid, role, expirationTimestamp, stream.agoraID);
    demotoken.expirationTimestamp = stream.endTime;
    demotoken.uid = uid;
    demotoken.token = token;
    demotoken.save();
  }
  if (stream.type == 'assessment') {
    await cloude_recording_stream(stream._id, stream.agoraID, stream.endTime);
  }
  return demotoken;
};


const get_interviewer_list = async (req) => {
  let id = req.query.id;

  let interviewvers = await DemostreamToken.aggregate([
    { $match: { $and: [{ streamID: { $eq: id } }, { usertype: { $ne: "Candidate" } }] } },
    {
      $lookup: {
        from: 'demobuyers',
        localField: 'userID',
        foreignField: '_id',
        as: 'demobuyers',
      },
    },
    { $unwind: '$demobuyers' },

    {
      $project: {
        name: "$demobuyers.name",
        phoneNumber: "$demobuyers.phoneNumber",
        _id: 1,
        date: 1,
        dateISO: 1,
        live: 1

      }
    }


  ])
  let candidate = await DemostreamToken.aggregate([
    { $match: { $and: [{ streamID: { $eq: id } }, { usertype: { $eq: "Candidate" } }] } },
    {
      $lookup: {
        from: 'demobuyers',
        localField: 'userID',
        foreignField: '_id',
        as: 'demobuyers',
      },
    },
    { $unwind: '$demobuyers' },

    {
      $project: {
        name: "$demobuyers.name",
        phoneNumber: "$demobuyers.phoneNumber",
        _id: 1,
        date: 1,
        dateISO: 1,
        live: 1

      }
    }

  ])

  return { interviewvers, candidate }
};


const join_live = async (req) => {
  let token = await DemostreamToken.findByIdAndUpdate({ _id: req.query.id }, { live: true }, { new: true });
  console.log(token._id + "_jion_now")
  req.io.emit(token._id + "_jion_now", token);

  return token;
}

const end_live = async (req) => {
  let token = await DemostreamToken.findByIdAndUpdate({ _id: req.query.id }, { live: false }, { new: true });
  console.log(token._id + "_jion_now")
  req.io.emit(token._id + "_jion_now", token);
  return token;

}

const leave_admin_call = async (req) => {
  let token = await DemostreamToken.findByIdAndUpdate({ _id: req.query.id }, { live: false }, { new: true });
  console.log(token._id + "_jion_now")
  req.io.emit(token._id + "_jion_now", token);
  return token;

}

const get_buyer_token = async (req) => {
  let join_token = req.query.id;

  let demotoken = await DemostreamToken.findById(join_token);
  if (!demotoken) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Join token not found');
  }
  const stream = await Demostream.findById(demotoken.streamID);
  if (!stream) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream not found');
  }
  const appID = await AgoraAppId.findById(stream.agoraID);
  if (!stream) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream not found');
  }

  const streampost = await Demopost.aggregate([
    {
      $match: {
        $and: [{ streamID: { $eq: demotoken.streamID } }],
      },
    },
    {
      $lookup: {
        from: 'demosavedproducts',
        localField: '_id',
        foreignField: 'productID',
        pipeline: [{ $match: { $and: [{ userID: { $eq: join_token } }] } }],
        as: 'demosavedproducts',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$demosavedproducts',
      },
    },
    {
      $addFields: {
        saved: { $ifNull: ['$demosavedproducts.saved', false] },
      },
    },
    {
      $lookup: {
        from: 'demointresteds',
        localField: '_id',
        foreignField: 'productID',
        pipeline: [{ $match: { $and: [{ userID: { $eq: join_token } }] } }],
        as: 'demointresteds',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$demointresteds',
      },
    },
    {
      $addFields: {
        interested: { $ifNull: ['$demointresteds.intrested', false] },
      },
    },
  ]);

  return { demotoken, stream, appID, streampost };
};

const stream_register_buyer = async (req) => {
  let join_token = req.query.id;
  let demotoken = await DemostreamToken.findById(join_token);
  let register = await DemostreamToken.find({ streamID: demotoken.streamID, status: 'resgistered' }).count();
  if (register < 5) {
    demotoken.golive = true;
  } else {
    demotoken.golive = false;
  }
  demotoken.status = 'resgistered';
  demotoken.save();

  setTimeout(async () => {
    register = await DemostreamToken.find({ streamID: demotoken.streamID, status: 'resgistered' }).count();
    req.io.emit(demotoken.streamID + '_buyer_registor', { register });
  }, 300);
  return demotoken;
};

const get_get_add_to_cart = async (req) => {
  let temp = req.query.streamId;
  let temptoken = await DemostreamToken.findById(temp);
  if (!temptoken) {
    throw new ApiError(httpStatus.NOT_FOUND, 'cart not found 🖕');
  }
  let stream = await Demostream.findById(temptoken.streamID);
  if (!stream) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream found 🖕');
  }
  let value = await Democart.findOne({ userId: temp, streamId: stream._id, status: { $ne: 'ordered' } });

  return value;
};

const addTocart = async (req) => {
  // //console.log("asdas",2321312)
  let shopId = req.shopId;
  let streamId = req.body.streamId;
  let cart = req.body.cart;
  // //console.log(cart)
  let value = await Democart.findOne({ userId: req.body.userId, streamId: streamId, status: { $ne: 'ordered' } });
  // //console.log(value, 12312)
  if (!value) {
    value = await Democart.create({ cart: cart, shopId: shopId, streamId: streamId, userId: req.body.userId });
    cart.forEach(async (a) => {
      // streamingCart
      let obj = { ...a, ...{ streamingCart: value._id, streamrequestpostId: a._id, userId: req.body.userId } };
      delete obj._id;
      await Democartproduct.create(obj);
    });
    await Dates.create_date(value);
  } else {
    await Democartproduct.updateMany({ streamingCart: value._id }, { $set: { cardStatus: false } }, { new: true });
    // value.cart = cart;
    cart.forEach(async (a) => {
      // streamingCart
      let cartproduct = await Democartproduct.findOne({ streamingCart: value._id, streamrequestpostId: a._id });
      // //console.log(cartproduct)
      if (cartproduct) {
        cartproduct.cartQTY = a.cartQTY;
      } else {
        let obj = { ...a, ...{ streamingCart: value._id, streamrequestpostId: a._id } };
        delete obj._id;
        cartproduct = await Democartproduct.create(obj);
      }
      cartproduct.cardStatus = true;
      cartproduct.add_to_cart = a.add_to_cart;
      cartproduct.save();
    });
    // //console.log(value)
    // //console.log(value)
    value = await Democart.findByIdAndUpdate({ _id: value._id }, { cart: cart }, { new: true });
  }

  let cart_value = await emit_cart_qty(req, streamId);
  console.log(cart_value);
  return value;
};

const emit_cart_qty = async (req, streamId) => {
  let socket_cart = await Demopost.aggregate([
    { $match: { $and: [{ streamID: streamId }] } },
    {
      $lookup: {
        from: 'democartproducts',
        localField: '_id',
        foreignField: 'streamrequestpostId',
        pipeline: [
          {
            $lookup: {
              from: 'democarts',
              localField: 'streamingCart',
              foreignField: '_id',
              pipeline: [
                { $match: { $and: [{ status: { $ne: 'ordered' } }] } },
                {
                  $project: {
                    _id: 1,
                  },
                },
              ],
              as: 'streamingcarts',
            },
          },
          { $unwind: '$streamingcarts' },
          { $match: { $and: [{ cardStatus: { $eq: true } }, { add_to_cart: { $eq: true } }] } },
          { $group: { _id: null, count: { $sum: '$cartQTY' } } },
        ],
        as: 'stream_cart',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$stream_cart',
      },
    },
    {
      $lookup: {
        from: 'demoorderproducts',
        localField: '_id',
        foreignField: 'postId',
        pipeline: [{ $group: { _id: null, count: { $sum: '$purchase_quantity' } } }],
        as: 'stream_checkout',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$stream_checkout',
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productID',
        foreignField: '_id',
        as: 'products',
      },
    },

    { $unwind: '$products' },
    {
      $project: {
        _id: 1,
        productTitle: '$products.productTitle',
        productImage: '$products.image',
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
        streamEnd: 1,
        stream_cart: { $ifNull: ['$stream_cart.count', 0] },
        stream_checkout: { $ifNull: ['$stream_checkout.count', 0] },
      },
    },
  ]);

  req.io.emit(streamId + 'cart_qty', socket_cart);
  return socket_cart;
};

const confirmOrder_cod = async (shopId, body, req) => {
  let orders;
  let streamId = body.OdrerDetails.cart;
  return new Promise(async (resolve) => {
    let cart = await Democart.findById(streamId);
    if (!cart || cart.status == 'ordered') {
      throw new ApiError(httpStatus.NOT_FOUND, 'cart not found 🖕');
    }
    orders = await addstreaming_order(shopId, body, cart);
    let paymantss = await add_odrerPayment_cod(shopId, body, orders);
    cart.cart.forEach(async (e) => {
      await addstreaming_order_product(shopId, e, orders);
    });
    cart.status = 'ordered';
    cart.save();
    // await emit_cart_qty(req,body.OdrerDetails.streamId);
    resolve(orders);
  });
};
const confirmOrder_razerpay = async (shopId, body, req) => {
  // let orders;
  let streamId = body.OdrerDetails.cart;
  //console.log(body);
  //console.log(streamId);
  if (body.PaymentDatails != null) {
    let payment = await paymentgatway.verifyRazorpay_Amount(body.PaymentDatails);
    let collectedAmount = payment.amount / 100;
    let collectedstatus = payment.status;
    if (collectedstatus == 'captured' && collectedAmount == body.OdrerDetails.Amount) {
      return new Promise(async (resolve) => {
        let cart = await Democart.findById(streamId);
        if (!cart || cart.status == 'ordered') {
          throw new ApiError(httpStatus.NOT_FOUND, 'cart not found 🖕');
        }
        let orders = await addstreaming_order(shopId, body, cart, collectedAmount);
        let paymantss = await add_odrerPayment(shopId, body, orders, payment);
        cart.cart.forEach(async (e) => {
          await addstreaming_order_product(shopId, e, orders);
        });
        cart.status = 'ordered';
        cart.save();
        // return orders;
        resolve(orders);
      });
    }
  }
};

const addstreaming_order = async (shopId, body, cart) => {
  const serverdate = moment().format('YYYY-MM-DD');
  let Buy = await Demoorder.find({ date: serverdate }).count();
  let centerdata = '';
  if (Buy < 9) {
    centerdata = '0000';
  }
  if (Buy < 99 && Buy >= 9) {
    centerdata = '000';
  }
  if (Buy < 999 && Buy >= 99) {
    centerdata = '00';
  }
  if (Buy < 9999 && Buy >= 999) {
    centerdata = '0';
  }
  let BillId = '';
  let totalcounts = Buy + 1;
  BillId = 'OD' + centerdata + totalcounts;
  let value = await Demoorder.create({
    ...{
      orderId: BillId,
    },
    ...body.OdrerDetails,
  });
  await Dates.create_date(value);
  return value;
};

const addstreaming_order_product = async (shopId, event, order) => {
  let value = await Demoorderproduct.create({
    orderId: order._id,
    postId: event._id,
    productId: event.postId,
    purchase_quantity: event.cartQTY,
    shopId: shopId,
    purchase_price: event.offerPrice,
    streamId: order.streamId,
    streamPostId: event.postId,
  });
  let post = await Demopost.findById(event.postId);
  if (post) {
    let total = 0;
    if (post.orderedQTY) {
      total = post.orderedQTY + event.cartQTY;
    } else {
      total = event.cartQTY;
    }
    post.orderedQTY = total;
    post.pendingQTY = post.quantity - total;
    post.save();
  }
  await Dates.create_date(value);
  return value;
};

const add_odrerPayment = async (shopId, body, orders, payment) => {
  let orderDetails = body.OdrerDetails;
  let currentDate = moment().format('YYYY-MM-DD');
  let currenttime = moment().format('HHmmss');
  let value = await Demopaymnt.create({
    shopId: shopId,
    paidAmt: orderDetails.Amount,
    date: currentDate,
    time: currenttime,
    created: moment(),
    orderId: orders._id,
    type: 'customer',
    paymentMethod: 'Gateway',
    reorder_status: false,
    onlinepaymentId: payment.id,
    onlineorderId: payment.order_id,
    paymentTypes: 'Online',
    paymentGatway: 'razorpay',
    streamId: orderDetails.streamId,
    bookingtype: orderDetails.bookingtype,
    totalAmount: orderDetails.totalAmount,
  });
  await Dates.create_date(value);
  return value;
};
const add_odrerPayment_cod = async (shopId, body, orders) => {
  let orderDetails = body.OdrerDetails;
  let currentDate = moment().format('YYYY-MM-DD');
  let currenttime = moment().format('HHmmss');
  let value = await Demopaymnt.create({
    shopId: shopId,
    paidAmt: 0,
    date: currentDate,
    time: currenttime,
    created: moment(),
    orderId: orders._id,
    type: 'customer',
    paymentMethod: 'COD',
    reorder_status: false,
    paymentTypes: 'cod',
    streamId: orderDetails.streamId,
  });
  await Dates.create_date(value);
  return value;
};

const end_stream = async (req) => {
  let value = await Demostream.findByIdAndUpdate(
    { _id: req.query.id },
    { status: 'Completed', streamEnd_Time: moment(), userList: [], end_Status: 'HostLeave' },
    { new: true }
  );
  req.io.emit(req.query.id + '_stream_end', { value: true });
  return value;
};
const go_live = async (req) => {
  const uid = await generateUid();
  const role = Agora.RtcRole.PUBLISHER;
  let demostream = await Demostream.findById(req.query.id);
  let expirationTimestamp;
  if (demostream.agoraID == null) {
    let agoraID = await agoraToken.token_assign(6000, demostream._id, 'demo');
    expirationTimestamp = moment().add(30, 'minutes') / 1000;
    if (demostream.type == 'demo') {
      agoraID = await agoraToken.token_assign(105, demostream._id, 'demo');
      expirationTimestamp = moment().add(15, 'minutes') / 1000;
    }
    if (demostream.type == 'assessment') {
      agoraID = await agoraToken.token_assign(330, demostream._id, 'demo');
      expirationTimestamp = moment().add(30, 'minutes') / 1000;
    }

    if (agoraID) {
      demostream.agoraID = agoraID.element._id;
    }
  }
  const token = await geenerate_rtc_token(demostream._id, uid, role, expirationTimestamp, demostream.agoraID);
  if (!demostream) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Link');
  }
  let demotoken = await DemostreamToken.findOne({ type: 'HOST', streamID: demostream._id });
  if (!demotoken) {
    demotoken = await DemostreamToken.create({
      expirationTimestamp: expirationTimestamp * 1000,
      streamID: demostream._id,
      type: 'HOST',
      uid: uid,
      agoraID: demostream.agoraID,
      token: token,
      channel: demostream._id,
      dateISO: moment(),
      userID: demostream.userID,
    });
    demostream.startTime = moment();
    demostream.endTime = expirationTimestamp * 1000;
    demostream.status = 'On-Going';
    demostream.save();
    req.io.emit(demostream._id + 'stream_on_going', demostream);
  }

  await cloude_recording_stream(demostream._id, demostream.agoraID, demostream.endTime);
  return demotoken;
};

const get_DemoStream_By_Admin = async (page, id) => {
  let currentDate = new Date().getTime();
  const data = await Demostream.aggregate([
    { $sort: { dateISO: -1 } },
    { $match: { createdBy: id, demoType: { $ne: 'seller' } } },
    {
      $addFields: {
        endtrue: { $ifNull: ['$endTime', false] },
      },
    },
    {
      $addFields: {
        status: {
          $cond: {
            if: { $eq: ['$endtrue', false] },
            then: '$status',
            else: {
              $cond: {
                if: { $lt: ['$endTime', currentDate] },
                then: 'Completed',
                else: '$status',
              },
            },
          },
        },
      },
    },
    {
      $addFields: {
        otp_verifiyed_status: {
          $cond: {
            if: { $lt: ['$tokenExp', currentDate] },
            then: 'Expired',
            else: '$otp_verifiyed_status',
          },
        },
      },
    },
    {
      $skip: 10 * page,
    },
    { $limit: 10 },
  ]);

  const total = await Demostream.aggregate([
    { $sort: { dateISO: -1 } },
    { $match: { createdBy: id } },
    {
      $addFields: {
        status: {
          $cond: {
            if: { $lt: ['$endTime', currentDate] },
            then: 'Completed',
            else: '$status',
          },
        },
      },
    },
    {
      $addFields: {
        otp_verifiyed_status: {
          $cond: {
            if: { $lt: ['$tokenExp', currentDate] },
            then: 'Expired',
            else: '$otp_verifiyed_status',
          },
        },
      },
    },
  ]);

  return { data: data, total: total.length };
};

const manageDemoStream = async (page) => {
  const data = await Demostream.aggregate([
    { $sort: { dateISO: -1 } },
    { $match: { _id: { $ne: null } } },
    { $lookup: { from: 'b2busers', localField: 'createdBy', foreignField: '_id', as: 'users' } },
    { $unwind: { preserveNullAndEmptyArrays: true, path: '$users' } },
    {
      $project: {
        _id: 1,
        expired: 1,
        livestart: 1,
        userList: 1,
        status: 1,
        userID: 1,
        dateISO: 1,
        phoneNumber: 1,
        name: 1,
        streamName: 1,
        streamValitity: 1,
        agoraID: 1,
        endTime: 1,
        createdBy: { $ifNull: ['$users.name', 'Nill'] },
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);

  const total = await Demostream.aggregate([
    { $match: { _id: { $ne: null } } },
    { $lookup: { from: 'b2busers', localField: 'createdBy', foreignField: '_id', as: 'users' } },
    { $unwind: { preserveNullAndEmptyArrays: true, path: '$users' } },
    {
      $project: {
        _id: 1,
        expired: 1,
        livestart: 1,
        userList: 1,
        status: 1,
        userID: 1,
        dateISO: 1,
        phoneNumber: 1,
        name: 1,
        streamName: 1,
        streamValitity: 1,
        agoraID: 1,
        endTime: 1,
        createdBy: { $ifNull: ['$users.name', 'Nill'] },
      },
    },
  ]);

  return { data: data, total: total.length };
};

const my_orders_buyer = async (req) => {
  let userId = req.query.id;
  let value = await Demoorder.aggregate([
    { $match: { $and: [{ userId: { $eq: userId } }] } },
    {
      $lookup: {
        from: 'demostreams',
        localField: 'streamId',
        foreignField: '_id',
        as: 'demostreams',
      },
    },
    { $unwind: '$demostreams' },
    {
      $lookup: {
        from: 'demopayments',
        localField: '_id',
        foreignField: 'orderId',
        as: 'demopayments',
      },
    },
    { $unwind: '$demopayments' },
  ]);
  return value;
};

const view_order_details = async (req) => {
  let userId = req.query.id;

  let value = await Demoorder.aggregate([
    { $match: { $and: [{ _id: { $eq: userId } }] } },
    {
      $lookup: {
        from: 'demoorderproducts',
        localField: '_id',
        foreignField: 'orderId',
        pipeline: [
          {
            $lookup: {
              from: 'demoposts',
              localField: 'postId',
              foreignField: '_id',
              as: 'demoposts',
            },
          },
          { $unwind: '$demoposts' },
        ],
        as: 'demoorderproducts',
      },
    },
    {
      $lookup: {
        from: 'demostreams',
        localField: 'streamId',
        foreignField: '_id',
        as: 'demostreams',
      },
    },
    { $unwind: '$demostreams' },
    {
      $lookup: {
        from: 'demostreamtokens',
        localField: 'userId',
        foreignField: '_id',
        pipeline: [
          {
            $lookup: {
              from: 'demobuyers',
              localField: 'userID',
              foreignField: '_id',
              as: 'demobuyers',
            },
          },
          { $unwind: '$demobuyers' },
        ],
        as: 'demostreamtokens',
      },
    },
    { $unwind: '$demostreamtokens' },
    {
      $lookup: {
        from: 'demopayments',
        localField: '_id',
        foreignField: 'orderId',
        as: 'demopayments',
      },
    },
    { $unwind: '$demopayments' },
  ]);

  if (value.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Link');
  }
  return value[0];
};

const get_exhibitor_order = async (req) => {
  let streamId = req.query.id;
  let value = await Demoorder.aggregate([
    { $match: { $and: [{ streamId: { $eq: streamId } }] } },
    {
      $lookup: {
        from: 'demostreamtokens',
        localField: 'userId',
        foreignField: '_id',
        pipeline: [
          {
            $lookup: {
              from: 'demobuyers',
              localField: 'userID',
              foreignField: '_id',
              as: 'demobuyers',
            },
          },
          { $unwind: '$demobuyers' },
        ],
        as: 'demostreamtokens',
      },
    },
    { $unwind: '$demostreamtokens' },
  ]);
  return value;
};

const visitor_interested = async (req) => {
  const { postID, streamID, userID } = req.body;

  let interested = await DemoInstested.findOne({ productID: postID, streamID: streamID, userID: userID });

  if (!interested) {
    interested = await DemoInstested.create({
      interested: true,
      productID: postID,
      streamID: streamID,
      userID: userID,
      DateIso: moment(),
      created: moment(),
      intrested: true,
    });
  }
  return interested;
};
const visitor_saved = async (req) => {
  const { postID, streamID, userID } = req.body;

  let saveproducts = await Demosavedproduct.findOne({ productID: postID, streamID: streamID, userID: userID });

  if (!saveproducts) {
    saveproducts = await Demosavedproduct.create({
      saved: true,
      productID: postID,
      streamID: streamID,
      userID: userID,
      DateIso: moment(),
      created: moment(),
      intrested: true,
    });
  }
  return saveproducts;
};

const visitor_interested_get = async (req) => {
  let stream = req.query.stream;
  let join = req.query.join;
  let interested = await DemoInstested.aggregate([
    {
      $match: {
        $and: [{ userID: { $eq: join } }, { streamID: { $eq: stream } }],
      },
    },
    {
      $lookup: {
        from: 'demoposts',
        localField: 'productID',
        foreignField: '_id',
        // pipeline: [
        //   {
        //     $lookup: {
        //       from: 'demobuyers',
        //       localField: 'userID',
        //       foreignField: '_id',
        //       as: 'demobuyers',
        //     },
        //   },
        //   { $unwind: "$demobuyers" }
        // ],
        as: 'demoposts',
      },
    },
    { $unwind: '$demoposts' },
    {
      $addFields: {
        productTitle: { $ifNull: ['$demoposts.productTitle', ''] },
      },
    },
    {
      $lookup: {
        from: 'demostreams',
        localField: 'streamID',
        foreignField: '_id',
        as: 'demostreams',
      },
    },
    { $unwind: '$demostreams' },
    {
      $addFields: {
        streamName: { $ifNull: ['$demostreams.streamName', ''] },
      },
    },
    {
      $lookup: {
        from: 'demostreamtokens',
        localField: 'userID',
        foreignField: '_id',
        pipeline: [
          {
            $lookup: {
              from: 'demobuyers',
              localField: 'userID',
              foreignField: '_id',
              as: 'demobuyers',
            },
          },
          { $unwind: '$demobuyers' },
        ],
        as: 'demostreamtokens',
      },
    },
    { $unwind: '$demostreamtokens' },
    {
      $addFields: {
        userName: { $ifNull: ['$demostreamtokens.demobuyers.name', ''] },
        mobileNumber: { $ifNull: ['$demostreamtokens.demobuyers.phoneNumber', ''] },
      },
    },
  ]);

  return interested;
};

const visitor_saved_get = async (req) => {
  let stream = req.query.stream;
  let join = req.query.join;
  let savedProduct = await Demosavedproduct.aggregate([
    {
      $match: {
        $and: [{ userID: { $eq: join } }, { streamID: { $eq: stream } }],
      },
    },
    {
      $lookup: {
        from: 'demoposts',
        localField: 'productID',
        foreignField: '_id',
        // pipeline: [
        //   {
        //     $lookup: {
        //       from: 'demobuyers',
        //       localField: 'userID',
        //       foreignField: '_id',
        //       as: 'demobuyers',
        //     },
        //   },
        //   { $unwind: "$demobuyers" }
        // ],
        as: 'demoposts',
      },
    },
    { $unwind: '$demoposts' },
    {
      $addFields: {
        productTitle: { $ifNull: ['$demoposts.productTitle', ''] },
      },
    },
    {
      $lookup: {
        from: 'demostreams',
        localField: 'streamID',
        foreignField: '_id',
        as: 'demostreams',
      },
    },
    { $unwind: '$demostreams' },
    {
      $addFields: {
        streamName: { $ifNull: ['$demostreams.streamName', ''] },
      },
    },
  ]);

  return savedProduct;
};

const exhibitor_interested_get = async (req) => {
  let stream = req.query.stream;
  let savedProduct = await DemoInstested.aggregate([
    {
      $match: {
        $and: [{ streamID: { $eq: stream } }],
      },
    },
    {
      $lookup: {
        from: 'demoposts',
        localField: 'productID',
        foreignField: '_id',
        // pipeline: [
        //   {
        //     $lookup: {
        //       from: 'demobuyers',
        //       localField: 'userID',
        //       foreignField: '_id',
        //       as: 'demobuyers',
        //     },
        //   },
        //   { $unwind: "$demobuyers" }
        // ],
        as: 'demoposts',
      },
    },
    { $unwind: '$demoposts' },
    {
      $addFields: {
        productTitle: { $ifNull: ['$demoposts.productTitle', ''] },
      },
    },
    {
      $lookup: {
        from: 'demostreams',
        localField: 'streamID',
        foreignField: '_id',
        as: 'demostreams',
      },
    },
    { $unwind: '$demostreams' },
    {
      $addFields: {
        streamName: { $ifNull: ['$demostreams.streamName', ''] },
      },
    },
    {
      $lookup: {
        from: 'demostreamtokens',
        localField: 'userID',
        foreignField: '_id',
        pipeline: [
          {
            $lookup: {
              from: 'demobuyers',
              localField: 'userID',
              foreignField: '_id',
              as: 'demobuyers',
            },
          },
          { $unwind: '$demobuyers' },
        ],
        as: 'demostreamtokens',
      },
    },
    { $unwind: '$demostreamtokens' },
    {
      $addFields: {
        userName: { $ifNull: ['$demostreamtokens.demobuyers.name', ''] },
        mobileNumber: { $ifNull: ['$demostreamtokens.demobuyers.phoneNumber', ''] },
      },
    },
    {
      $group: {
        _id: {
          streamName: '$streamName',
          userName: '$userName',
          mobileNumber: '$mobileNumber',
          userID: '$userID',
        },
        productCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        streamName: '$_id.streamName',
        userName: '$_id.userName',
        mobileNumber: '$_id.mobileNumber',
        productCount: '$productCount',
        userID: '$_id.userID',
      },
    },
  ]);

  return savedProduct;
};

const exhibitor_myprofile = async (req) => {
  const token = await Demostream.findById(req.query.id);
  if (!token) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream Not Found');
  }
  let myprofile = await Demoseller.findById(token.userID);

  return myprofile;
};
const visitor_myprofile = async (req) => {
  const token = await DemostreamToken.findById(req.query.id);
  if (!token) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream Not Found');
  }
  let myprofile = await Demobuyer.findById(token.userID);
  return myprofile;
};

const send_sms_now = async (req) => {
  return await sms_send_seller(req);
};

const verify_otp = async (req) => {
  let { otp, stream } = req.body;
  const token = await Demostream.findById(stream);
  if (!token) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Link');
  }
  try {
    const payload = jwt.verify(token.streamValitity, 'demoStream');
  } catch (err) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Link has Expired');
  }
  let Datenow = new Date().getTime();
  let verify = await Demootpverify.findOne({
    streamID: stream,
    OTP: otp,
    verify: false,
    expired: false,
    otpExpiedTime: { $gt: Datenow },
  });
  if (!verify) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid OTP');
  } else {
    verify.verify = true;
    verify.expired = true;
    verify.save();
    const stream = await Demostream.findById(verify.streamID);
    stream.otp_verifiyed = verify._id;
    stream.otp_verifiyed_status = 'Verified';
    stream.save();
  }

  return verify;
};
const send_multible_sms_send = async (req) => {
  let { number, stream } = req.body;
  let reva;
  if (number != undefined) {
    if (number.length <= 5) {
      let mobile = number.toString();
      // http://panel.smsmessenger.in/api/mt/SendSMS?user=demo&password=demo123&senderid=WEBSMS&channel=Promo&DCS=0&flashsms=0&number=91989xxxxxxx,91999xxxxxxx&text=test message&route=##&peid=##&DLTTemplateId=231315454xxxxxxx
      let message = `Dear participant.You may test the demo using the link https://ag23.site/b/${stream} - AgriExpoLive2023(An Ookam company event)`;
      reva = await axios.get(
        `http://panel.smsmessenger.in/api/mt/SendSMS?user=ookam&password=ookam&senderid=OOKAMM&channel=Trans&DCS=0&flashsms=0&number=${mobile}&text=${message}&route=6&peid=1701168700339760716&DLTTemplateId=1707168958872798585`
      );
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, 'Only Five Numbers Only');
    }
  }
  return reva.data;
};

const cloude_recording_stream = async (stream, app, endTime) => {
  const stremRequiest = await Demostream.findById(stream);
  let agoraToken = await AgoraAppId.findById(app);
  let record = await Democloudrecord.findOne({ streamId: stream, recoredStart: { $eq: 'acquire' } });
  if (!record) {
    console.log('true record');

    record = await Democloudrecord.findOne({ streamId: stream, recoredStart: { $in: ['query', 'start'] } });
    if (record) {
      console.log('true record query');
      let token = record;
      const resource = token.resourceId;
      const sid = token.sid;
      const mode = 'mix';
      const Authorization = `Basic ${Buffer.from(agoraToken.Authorization.replace(/\s/g, '')).toString('base64')}`;
      // //console.log(`https://api.agora.io/v1/apps/${appID}/cloud_recording/resourceid/${resource}/sid/${sid}/mode/${mode}/query`);
      await axios
        .get(
          `https://api.agora.io/v1/apps/${agoraToken.appID.replace(
            /\s/g,
            ''
          )}/cloud_recording/resourceid/${resource}/sid/${sid}/mode/${mode}/query`,
          { headers: { Authorization } }
        )
        .then((res) => { })
        .catch(async (error) => {
          console.log('error');
          await Democloudrecord.findByIdAndUpdate({ _id: record._id }, { recoredStart: 'stop' }, { new: true });
          const uid = await generateUid();
          const role = Agora.RtcRole.SUBSCRIBER;
          const expirationTimestamp = endTime / 1000;
          console.log(stremRequiest);
          const token = await geenerate_rtc_token(stremRequiest._id, uid, role, expirationTimestamp, stremRequiest.agoraID);
          record = await Democloudrecord.create({
            date: moment().format('YYYY-MM-DD'),
            time: moment().format('HHMMSS'),
            created: moment(),
            Uid: uid,
            chennel: stremRequiest._id,
            created_num: new Date(new Date(moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss'))).getTime(),
            expDate: expirationTimestamp * 1000,
            type: 'CloudRecording',
            token: token,
            store: record._id.replace(/[^a-zA-Z0-9]/g, ''),
            streamId: stream,
          });
          record.save();
          await agora_acquire(record._id, agoraToken);
        });
    } else {
      console.log('no ');
      await Democloudrecord.updateMany({ streamId: stream }, { recoredStart: 'stop' }, { new: true });
      const uid = await generateUid();
      const role = Agora.RtcRole.SUBSCRIBER;
      const expirationTimestamp = endTime / 1000;
      // console.log(agoraToken)
      // console.log(stremRequiest)
      // console.log(stremRequiest._id)
      // console.log(role)
      // console.log(expirationTimestamp)
      // console.log(agoraToken._id)
      const token = await geenerate_rtc_token(stremRequiest._id, uid, role, expirationTimestamp, agoraToken._id);
      record = await Democloudrecord.create({
        date: moment().format('YYYY-MM-DD'),
        time: moment().format('HHMMSS'),
        created: moment(),
        Uid: uid,
        chennel: stremRequiest._id,
        created_num: new Date(new Date(moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss'))).getTime(),
        expDate: expirationTimestamp * 1000,
        type: 'CloudRecording',
        token: token,
        streamId: stream,
      });
      // record.store = record._id.replace(/[^a-zA-Z0-9]/g, ''),
      record.save();
      await agora_acquire(record._id, agoraToken);
      await Democloudrecord.findByIdAndUpdate(
        { _id: record._id },
        { store: record._id.replace(/[^a-zA-Z0-9]/g, '') },
        { new: true }
      );
    }
  } else {
    return { start: 'Already acquired' };
  }
};

const agora_acquire = async (id, agroaID) => {
  let temtoken = id;
  let agoraToken = agroaID;
  console.log(agoraToken, 8888);
  // let temtoken=req.body.id;
  let token = await Democloudrecord.findById(temtoken);
  const Authorization = `Basic ${Buffer.from(agoraToken.Authorization.replace(/\s/g, '')).toString('base64')}`;
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

const recording_start = async (id) => {
  console.log(id, 'bharathi');
  // let temtoken = id;
  let token = await Democloudrecord.findOne({ chennel: id, recoredStart: { $eq: 'acquire' } });

  // let temtoken=req.body.id;
  // let token = await tempTokenModel.findById(temtoken);
  if (token) {
    let str = await Demostream.findById(token.streamId);
    let agoraToken = await AgoraAppId.findById(str.agoraID);
    const Authorization = `Basic ${Buffer.from(agoraToken.Authorization.replace(/\s/g, '')).toString('base64')}`;
    if (token.recoredStart == 'acquire') {
      console.log('start', agoraToken, token);
      const resource = token.resourceId;
      //console.log(resource)
      //console.log(token)
      const mode = 'mix';
      const start = await axios.post(
        `https://api.agora.io/v1/apps/${agoraToken.appID.replace(
          /\s/g,
          ''
        )}/cloud_recording/resourceid/${resource}/mode/${mode}/start`,
        {
          cname: token.chennel,
          uid: token.Uid.toString(),
          clientRequest: {
            token: token.token,
            recordingConfig: {
              maxIdleTime: 30,
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
              fileNamePrefix: [token.store, token.Uid.toString()],
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
        await recording_query(token._id, agoraToken);
      }, 3000);
      return start.data;
    } else {
      return { message: 'Already Started' };
    }
  } else {
    return { message: 'Already Started' };
  }
};
const recording_query = async (id, agoraToken) => {
  const Authorization = `Basic ${Buffer.from(agoraToken.Authorization.replace(/\s/g, '')).toString('base64')}`;
  let temtoken = id;
  // let temtoken=req.body.id;
  // //console.log(req.body);
  let token = await Democloudrecord.findById(temtoken);
  const resource = token.resourceId;
  const sid = token.sid;
  const mode = 'mix';
  // //console.log(`https://api.agora.io/v1/apps/${appID}/cloud_recording/resourceid/${resource}/sid/${sid}/mode/${mode}/query`);
  const query = await axios.get(
    `https://api.agora.io/v1/apps/${agoraToken.appID.replace(
      /\s/g,
      ''
    )}/cloud_recording/resourceid/${resource}/sid/${sid}/mode/${mode}/query`,
    { headers: { Authorization } }
  );
  console.log(query.data);
  console.log(query.data.serverResponse.fileList);
  if (query.data.serverResponse.fileList.length > 0) {
    token.videoLink = query.data.serverResponse.fileList[0].fileName;
    token.videoLvideoLink_objink = query.data.serverResponse.fileList;

    token.recoredStart = 'query';
    token.save();
  }
  return query.data;
};

const verification_sms_send = async (req) => {
  const token = await Demostream.findById(req.query.id);
  if (!token) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Link');
  }
  try {
    const payload = jwt.verify(token.streamValitity, 'demoStream');
  } catch (err) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Link has Expired');
  }
  let res = await send_otp(token);
  return res;
};

const send_otp = async (stream) => {
  let OTPCODE = Math.floor(100000 + Math.random() * 900000);
  let Datenow = new Date().getTime();
  let otpsend = await Demootpverify.findOne({
    streamID: stream._id,
    otpExpiedTime: { $gte: Datenow },
    verify: false,
    expired: false,
  });
  console.log(otpsend);
  if (!otpsend) {
    const token = await Demoseller.findById(stream.userID);
    await Demootpverify.updateMany(
      { streamID: stream._id, verify: false },
      { $set: { verify: true, expired: true } },
      { new: true }
    );
    let exp = moment().add(3, 'minutes');
    let otp = await Demootpverify.create({
      OTP: OTPCODE,
      verify: false,
      mobile: token.phoneNumber,
      streamID: stream._id,
      DateIso: moment(),
      userID: stream.userID,
      expired: false,
      otpExpiedTime: exp,
    });
    let message = `Dear ${token.name},thank you for the registration to the event AgriExpoLive2023 .Your OTP for logging into the account is ${OTPCODE}- AgriExpoLive2023(An Ookam company event)`;
    let reva = await axios.get(
      `http://panel.smsmessenger.in/api/mt/SendSMS?user=ookam&password=ookam&senderid=OOKAMM&channel=Trans&DCS=0&flashsms=0&number=${token.phoneNumber}&text=${message}&route=6&peid=1701168700339760716&DLTTemplateId=1707168958877302526`
    );
    // return reva.data;
    otpsend = { otpExpiedTime: otp.otpExpiedTime };
  } else {
    otpsend = { otpExpiedTime: otpsend.otpExpiedTime };
  }
  return otpsend;
};

/**
 *feedback
 **/

const createFeedback = async (req) => {
  let stream = req.query.id;
  const token = await Demostream.findById(req.query.id);
  if (!token) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Link');
  }
  const feedback = await Feedback.create({ ...req.body, ...{ streamID: stream, userID: token.userID } });
  return feedback;
};

const getFeedback = async (id) => {
  const feedback = await Feedback.findById(id);
  return feedback;
};

const updateFeedback = async (id, body) => {
  const feedback = await Feedback.findByIdAndUpdate({ _id: id }, body, { new: true });
  return feedback;
};

const getFeedbackWithPagination = async (page) => {
  let feedback = await Feedback.aggregate([
    {
      $lookup: {
        from: 'demosellers',
        localField: 'userID',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$user',
      },
    },
    {
      $lookup: {
        from: 'demostreams',
        localField: 'streamID',
        foreignField: '_id',
        pipeline: [
          {
            $lookup: {
              from: 'b2busers',
              localField: 'createdBy',
              foreignField: '_id',
              as: 'b2busers',
            },
          },
          {
            $unwind: {
              preserveNullAndEmptyArrays: true,
              path: '$b2busers',
            },
          },
        ],
        as: 'createdBy',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$createdBy',
      },
    },
    {
      $skip: page * 10,
    },
    {
      $limit: 10,
    },
  ]);
  let total = await Feedback.aggregate([
    {
      $match: {
        _id: { $ne: null },
      },
    },
  ]);
  return { val: feedback, total: total.length };
};

/**
 *Tech Issues
 **/

const createTecIssues = async (body) => {
  let center = '';
  let id = 'ISS';
  const issue = await TechIssue.find().count();
  if (issue < 9) {
    center = '0000';
  }
  if (issue < 99 && issue >= 9) {
    center = '000';
  }
  if (issue < 999 && issue >= 99) {
    center = '00';
  }
  if (issue < 9999 && issue >= 999) {
    center = '0';
  }
  let total = issue + 1;
  let issueId = id + center + total;
  let findstream = await Demostream.findById(body.streamId);
  if (!findstream) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Stream Id');
  }
  const techIssue = await TechIssue.create({
    ...body,
    ...{ streamID: body.streamId, issueId: issueId, userId: findstream.userID },
  });
  return techIssue;
};

const get_TechIssue = async (id) => {
  const techIssue = await TechIssue.findById(id);
  return techIssue;
};

const update_TechIssue = async (id, body) => {
  const techIssue = await TechIssue.findByIdAndUpdate({ _id: id }, body, { new: true });
  return techIssue;
};

const get_TechIssue_Pagination = async (req) => {
  let page = req.params.page == '' || req.params.page == null || req.params.page == null ? 0 : req.params.page;
  const token = await Demostream.findById(req.query.id);
  if (!token) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Link');
  }
  try {
    const payload = jwt.verify(token.streamValitity, 'demoStream');
  } catch (err) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Link has Expired');
  }
  let techIssue = await TechIssue.aggregate([
    { $match: { $and: [{ streamID: { $eq: token._id } }] } },
    {
      $lookup: {
        from: 'demosellers',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$user',
      },
    },
    {
      $project: {
        _id: 1,
        status: { $ifNull: ['$status', 'Pending'] },
        Issue_description: 1,
        issueId: 1,
        createdAt: 1,
        userName: '$user.name',
        userNumber: '$user.phoneNumber',
        Issue_type: 1,
      },
    },
    {
      $skip: page * 10,
    },
    {
      $limit: 10,
    },
  ]);

  let next = await TechIssue.aggregate([
    { $match: { $and: [{ userId: { $eq: token.userID } }] } },
    {
      $lookup: {
        from: 'demosellers',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$user',
      },
    },
    {
      $project: {
        _id: 1,
        status: { $ifNull: ['$status', 'Pending'] },
        Issue_description: 1,
        issueId: 1,
        createdAt: 1,
        userName: '$user.name',
        userNumber: '$user.phoneNumber',
        Issue_type: 1,
      },
    },
    {
      $skip: 10 * (page + 1),
    },
    {
      $limit: 10,
    },
  ]);
  let total = await TechIssue.aggregate([
    { $match: { $and: [{ userId: { $eq: token.userID } }] } },
    {
      $lookup: {
        from: 'demosellers',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$user',
      },
    },
    {
      $project: {
        _id: 1,
        status: { $ifNull: ['$status', 'Pending'] },
        Issue_description: 1,
        issueId: 1,
        createdAt: 1,
        userName: '$user.name',
        userNumber: '$user.phoneNumber',
        Issue_type: 1,
      },
    },
    {
      $skip: 10 * page,
    },
    {
      $limit: 10,
    },
  ]);
  return { value: techIssue, next: next.length != 0, total: total.length };
};

const get_completed_stream = async (req) => {
  const stream = await Demostream.findById(req.query.id);
  if (!stream) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Link');
  }
  try {
    const payload = jwt.verify(stream.streamValitity, 'demoStream');
  } catch (err) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Link has Expired');
  }
  const cloud = await Democloudrecord.find({ streamId: req.query.id, videoLink: { $ne: null } });

  return { stream, cloud };
};

const getIssuesWithPagination = async (page) => {
  let val = await TechIssue.aggregate([
    {
      $lookup: {
        from: 'demosellers',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$user',
      },
    },
    {
      $project: {
        _id: 1,
        Logi_name: 1,
        Mobile_number: 1,
        Issue_type: 1,
        Issue_description: 1,
        Others: 1,
        status: 1,
        issueId: 1,
        userId: 1,
        createdAt: 1,
        userName: '$user.name',
        userPhoneNumber: '$user.phoneNumber',
      },
    },
    {
      $skip: 10 * page,
    },
    {
      $limit: 10,
    },
  ]);

  let total = await TechIssue.aggregate([
    {
      $lookup: {
        from: 'demosellers',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$user',
      },
    },
    {
      $project: {
        _id: 1,
        Logi_name: 1,
        Mobile_number: 1,
        Issue_type: 1,
        Issue_description: 1,
        Others: 1,
        status: 1,
        issueId: 1,
        userId: 1,
        createdAt: 1,
        userName: '$user.name',
        userPhoneNumber: '$user.phoneNumber',
      },
    },
  ]);

  return { val: val, total: total.length };
};

const issueResolve = async (id, body) => {
  let issue = await TechIssue.findById(id);
  if (!issue) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Issue Not Available');
  }
  issue = await TechIssue.findByIdAndUpdate({ _id: id }, body, { new: true });
  return issue;
};

const turn_on_chat = async (req) => {
  let stream = await Demostream.findById(req.query.id);
  stream.chat = !stream.chat;
  stream.save();
  req.io.emit(req.query.id + '_enable_chat', { chat: stream.chat });

  return stream;
};

const getDatas = async () => {
  let stream = await DemostreamToken.aggregate([
    {
      $match: { channel: '30fa154efe' },
    },
    {
      $lookup: {
        from: 'demobuyers',
        localField: 'userID',
        foreignField: '_id',
        pipeline: [
          {
            $addFields: {
              id: {
                $convert: {
                  input: '$phoneNumber',
                  to: 'string',
                  onError: 0,
                },
              },
            },
          },
          {
            $lookup: {
              from: 'climbeventregisters',
              localField: 'id',
              foreignField: 'mobileNumber',
              as: 'asas',
            },
          },
        ],
        as: 'demoBuyers',
      },
    },
    {
      $unwind: {
        path: '$demoBuyers',
      },
    },
  ]);
  return stream;
};

const toggle_raise_hand = async (req) => {
  let stream = await Demostream.findById(req.query.id);
  stream.raise_hands = !stream.raise_hands;
  stream.save();
  req.io.emit(req.query.id + '_enable_raise_hands', { raise_hands: stream.raise_hands });




  return stream;
};


const raise_my_hands = async (req) => {
  let stream = await DemostreamToken.findById(req.query.id);
  if (!stream) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Demo Request Not Found');
  }

  stream.raise_hands = !stream.raise_hands;
  stream.save();

  stream = await DemostreamToken.aggregate([
    { $match: { $and: [{ _id: { $eq: stream._id } }] } },
    {
      $lookup: {
        from: 'demobuyers',
        localField: 'userID',
        foreignField: '_id',
        as: 'demobuyers',
      },
    },
    { $unwind: '$demobuyers' },
    {
      $addFields: {
        name: "$demobuyers.name",
        phoneNumber: "$demobuyers.phoneNumber",
        raise_hands: stream.raise_hands
      },
    },
  ])

  req.io.emit(stream[0].streamID + '_join_raise_hands', stream[0]);

  return stream[0];
};

const accept_raise_hands = async (req) => {
  let stream = await DemostreamToken.findById(req.query.id);

  if (!stream) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Demo Token Not Found');
  }
  let strm = await Demostream.findById(stream.streamID);

  if (!strm) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Demo Stream Not Found');
  }
  strm.raiseUser = stream._id;
  strm.save();
  req.io.emit(stream._id + '_accept_stream', strm);

  return strm;

}

const end_raise_hands = async (req) => {
  let stream = await DemostreamToken.findById(req.query.id);

  if (!stream) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Demo Token Not Found');
  }
  let strm = await Demostream.findById(stream.streamID);

  if (!strm) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Demo Stream Not Found');
  }
  strm.raiseUser = null;
  strm.save();
  req.io.emit(stream._id + '_accept_stream', strm);
  return strm;

}

const leave_raise_hands = async (req) => {
  let stream = await DemostreamToken.findById(req.query.id);

  if (!stream) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Demo Token Not Found');
  }
  let strm = await Demostream.findById(stream.streamID);

  if (!strm) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Demo Stream Not Found');
  }
  strm.raiseUser = null;
  strm.save();
  req.io.emit(strm._id + '_accept_stream', strm);
  stream.raise_hands = false;
  stream.save();

  stream = await DemostreamToken.aggregate([
    { $match: { $and: [{ _id: { $eq: stream._id } }] } },
    {
      $lookup: {
        from: 'demobuyers',
        localField: 'userID',
        foreignField: '_id',
        as: 'demobuyers',
      },
    },
    { $unwind: '$demobuyers' },
    {
      $addFields: {
        name: "$demobuyers.name",
        phoneNumber: "$demobuyers.phoneNumber",
        raise_hands: stream.raise_hands
      },
    },
  ])

  req.io.emit(stream[0].streamID + '_join_raise_hands', stream[0]);

  return strm;

}

const stop_recording = async (req) => {
  let token = await DemostreamToken.findOne({ channel: req.query.id, type: 'CloudRecording', recoredStart: { $eq: "query" } }).sort({ created: -1 });
  if (token) {
    let str = await Demostream.findById(token.streamID);
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
}


module.exports = {
  send_livestream_link,
  send_livestream_link_ryh,
  send_livestream_link_demo,
  send_livestream_link_assessment,
  verifyToken,
  get_stream_details_check,
  get_stream_details_check_golive,
  go_live_stream,
  join_stream_buyer,
  join_stream_candidate,
  get_stream_verify_buyer,
  get_buyer_token,
  stream_register_buyer,
  get_get_add_to_cart,
  addTocart,
  confirmOrder_razerpay,
  confirmOrder_cod,
  emit_cart_qty,
  end_stream,
  go_live,
  buyer_go_live_stream,
  get_DemoStream_By_Admin,
  my_orders_buyer,
  view_order_details,
  get_exhibitor_order,
  visitor_interested,
  visitor_saved,
  visitor_interested_get,
  visitor_saved_get,
  manageDemoStream,
  exhibitor_interested_get,
  exhibitor_myprofile,
  visitor_myprofile,
  send_sms_now,
  verify_otp,
  send_multible_sms_send,
  recording_start,
  verification_sms_send,
  createFeedback,
  getFeedback,
  updateFeedback,
  getFeedbackWithPagination,
  createTecIssues,
  get_TechIssue,
  update_TechIssue,
  get_TechIssue_Pagination,
  get_completed_stream,
  getIssuesWithPagination,
  issueResolve,
  demorequest,
  get_demo_request,
  send_request_link,
  get_demo_requests,
  turn_on_chat,
  getDatas,
  get_interviewer_list,
  join_live,
  end_live,
  leave_admin_call,
  toggle_raise_hand,
  raise_my_hands,
  accept_raise_hands,
  end_raise_hands,
  leave_raise_hands,
  stop_recording
};
