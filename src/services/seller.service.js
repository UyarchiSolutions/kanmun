const httpStatus = require('http-status');
const { Seller, VisitorDispatch } = require('../models/seller.models');
const ApiError = require('../utils/ApiError');
const { OTP, sellerOTP } = require('../models/saveOtp.model');
const sentOTP = require('../config/seller.config');
const bcrypt = require('bcryptjs');
const moment = require('moment');

const { Streamplan, StreamPost, Streamrequest, StreamrequestPost, StreamPreRegister } = require('../models/ecomplan.model');

const { purchasePlan } = require('../models/purchasePlan.model');
const createSeller = async (req) => {
  let body = req.body;
  let value = await Seller.findOne({ mobileNumber: body.mobileNumber });

  if (value) {
    if (value.mobileNumber == body.mobileNumber) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Mobile number Already Exist');
    } else if (value.email == body.email) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'EMail Already exist');
    }
  } else {
    value = await Seller.create({ ...body, ...{ mainSeller: 'admin', sellerType: 'MainSeller', sellerRole: 'admin' } });
    value.roleNum = [1];
    value.save();
    const otp = await sentOTP(value.mobileNumber, value, 'reg');
  }
  return value;
};

const verifyOTP = async (req) => {
  let body = req.body;
  const mobileNumber = body.mobileNumber;
  const otp = body.otp;
  let findOTP = await sellerOTP
    .findOne({
      mobileNumber: mobileNumber,
      OTP: otp,
      // create: { $gte: moment(new Date().getTime() - 15 * 60 * 1000) },
      active: true,
    })
    .sort({ create: -1 });

  if (!findOTP) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid OTP');
  }
  const findotp = {
    create: moment(new Date()).subtract(1, 'minutes'),
  };

  const createTimestampString = findOTP.create;
  const createTimestamp = moment(createTimestampString);

  if (createTimestamp.isBefore(findotp.create)) {
    throw new ApiError(httpStatus.NOT_FOUND, 'OTP Expired');
  }
  findOTP.active = false;
  findOTP.save();
  let seller = await Seller.findById(findOTP.userId);
  return seller;
};

const verifyOTP_Delete_Account = async (req) => {
  let body = req.body;
  const mobileNumber = body.mobileNumber;
  const otp = body.otp;
  let findOTP = await sellerOTP
    .findOne({
      mobileNumber: mobileNumber,
      OTP: parseInt(otp),
      // create: { $gte: moment(new Date().getTime() - 15 * 60 * 1000) },
      active: true,
    })
    .sort({ create: -1 });

  if (!findOTP) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid OTP');
  }
  const findotp = {
    create: moment(new Date()).subtract(1, 'minutes'),
  };

  const createTimestampString = findOTP.create;
  const createTimestamp = moment(createTimestampString);

  if (createTimestamp.isBefore(findotp.create)) {
    throw new ApiError(httpStatus.NOT_FOUND, 'OTP Expired');
  }
  findOTP.active = false;
  findOTP.save();
  let seller = await Seller.findByIdAndUpdate({ _id: findOTP.userId }, { active: false }, { new: true });
  return { messages: 'Account has been Deleted' };
};

const setPassword = async (req) => {
  let body = req.body;
  let sellerId = req.userId;
  //console.log(sellerId)
  let seller = await Seller.findById(sellerId);

  if (!seller) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid User');
  }
  seller.password = body.password;
  seller.registered = true;
  seller.save();
  return delete seller.password;
};

const forgotPass = async (req) => {
  let body = req.body;
  let value = await Seller.findOne({ mobileNumber: body.mobileNumber });
  if (!value) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Not Registered');
  }
  if (body.reg == true) {
  } else {
    if (value.registered == false) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Registered');
    }
  }
  await sellerOTP.updateMany({ mobileNumber: body.mobileNumber }, { $set: { active: false } });
  const otp = await sentOTP(value.mobileNumber, value, 'forgot');
  return value;
};

const sendOTP_continue = async (req) => {
  let body = req.body;
  let value = await Seller.findOne({ mobileNumber: body.mobileNumber, registered: false });
  let Registered = await Seller.findOne({ mobileNumber: body.mobileNumber, registered: true });
  if (Registered) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Your are already registered');
  }
  if (!value) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mobile Number Not Exist');
  }
  await sellerOTP.updateMany({ mobileNumber: body.mobileNumber }, { $set: { active: false } });
  const otp = await sentOTP(value.mobileNumber, value, 'cont');
  return value;
};

const loginseller = async (req) => {
  let body = req.body;
  const { mobile, password } = body;
  let userName = await Seller.findOne({ mobileNumber: mobile });
  if (!userName) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid User');
  }
  if (!userName.active) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Disabled');
  }
  if (!userName.registered) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Exhibitor Not Registered');
  }
  if (!(await userName.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Password');
  }
  console.log(req.deviceInfo)
  console.log(req.ipAddress)


  return userName;
};

const alreadyUser = async (req) => {
  let body = req.body;
  let value = await Seller.findOne({ mobileNumber: body.mobileNumber });
  if (!value) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found ');
  }
  if (value.registered) {
    throw new ApiError(httpStatus.NOT_FOUND, 'already Registered');
  }
  await sellerOTP.updateMany({ mobileNumber: body.mobileNumber, active: true }, { $set: { active: false } });
  const otp = await sentOTP(value.mobileNumber, value);
  return value;
};

const createSubhost = async (req) => {
  let body = req.body;
  let sellerID = req.userId;
  let value = await Seller.findOne({ $or: [{ email: body.email }, { mobileNumber: body.mobileNumber }] });

  if (value) {
    if (value.email == body.email) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Email Already Exit');
    }
    if (value.mobileNumber == body.mobileNumber) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Phone Number Exit');
    }
  }
  let returnval = await Seller.create({
    ...body,
    ...{ mainSeller: sellerID, sellerType: 'sub-host', sellerRole: body.sellerRole },
  });
  return returnval;
};

const createSubUser = async (req) => {
  let body = req.body;
  let sellerID = req.userId;
  let value = await Seller.findOne({ $or: [{ email: body.email }, { mobileNumber: body.mobileNumber }] });

  if (value) {
    if (value.email == body.email) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Email Already Exit');
    }
    if (value.mobileNumber == body.mobileNumber) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Phone Number Exit');
    }
  }
  let returnval = await Seller.create({
    ...body,
    ...{ mainSeller: sellerID, sellerType: 'sub-user', sellerRole: body.sellerRole },
  });
  let rolesNumeric = [];
  let roles = { admin: 1, 'Stock-Manager': 2, 'Account-Manager': 3, 'Delivery-Excutive': 4, 'Loading-Manager': 5 };
  body.sellerRole.forEach((element) => {
    rolesNumeric.push(roles[element]);
  });
  returnval.roleNum = rolesNumeric;
  returnval.save();
  return returnval;
};

const mydetails = async (req) => {
  let sellerID = req.userId;
  let value = await Seller.findById(sellerID).select({
    active: 0,
    archive: 0,
    createdDate: 0,
    notifyCount: 0,
    password: 0,
    updatedDate: 0,
  });;

  if (!value) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found');
  }
  // let mutableQueryResult = value; // _doc property holds the mutable object
  // delete mutableQueryResult.password;

  let purchase = await purchasePlan.find({ suppierId: value._id }).limit(1);
  let purchaseplan = purchase != null ? purchase.length == 0 ? false : true : false;
  value.purchaseplan = purchaseplan;
  return value;
};

const GetAllSeller = async () => {
  let values = await Seller.find();
  return values;
};

const GetSellerById = async (id) => {
  let values = await Seller.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Seller Not Found');
  }
  return values;
};

const UpdateSellerById = async (id, body) => {
  let values = await Seller.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Seller Not Found');
  }
  values = await Seller.findByIdAndUpdate({ _id: id }, body, { new: true });
  return values;
};

const getsubhostAll = async (req) => {
  let page = req.query.page == '' || req.query.page == null || req.query.page == null ? 0 : req.query.page;
  let sellerID = req.userId;
  let values = await Seller.aggregate([
    { $match: { $and: [{ mainSeller: { $eq: sellerID } }, { sellerType: { $eq: 'sub-host' } }] } },
    {
      $skip: 10 * page,
    },
    {
      $limit: 10,
    },
  ]);
  let next = await Seller.aggregate([
    { $match: { $and: [{ mainSeller: { $eq: sellerID } }, { sellerType: { $eq: 'sub-host' } }] } },
    {
      $skip: 10 * (page + 1),
    },
    {
      $limit: 10,
    },
  ]);
  return { values, next: next.length != 0 };
};

const disabled_hosts = async (req) => {
  let host = await Seller.findById(req.query.id);
  if (!host) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sellar Not Found');
  }
  if (host.mainSeller != req.userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sellar Not Found');
  }
  host.active = !host.active;
  host.save();
  return host;
};

const delete_hosts = async (req) => {
  let host = await Seller.findById(req.query.id);
  if (!host) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sellar Not Found');
  }
  if (host.mainSeller != req.userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sellar Not Found');
  }
  await Seller.findByIdAndDelete(host._id);
  return { message: 'delete Success' };
};

const get_single_host = async (req) => {
  let host = await Seller.findById(req.query.id);
  if (!host) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sellar Not Found');
  }
  if (host.mainSeller != req.userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sellar Not Found');
  }
  return host;
};

const update_single_host = async (req) => {
  let host = await Seller.findById(req.query.id);
  if (!host) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sellar Not Found');
  }
  if (host.mainSeller != req.userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sellar Not Found');
  }
  host = await Seller.findByIdAndUpdate({ _id: host._id }, req.body, { new: true });
  return host;
};

const subhost_free_users = async (req) => {
  let streamId = req.query.id;

  let hostTime = await Streamrequest.findById(req.query.id);

  let host = await Seller.aggregate([
    {
      $match: {
        $and: [
          { sellerType: { $eq: 'sub-host' } },
          { mainSeller: { $eq: req.userId } },
          { $or: [{ sellerRole: { $eq: ['chat/stream'] } }, { sellerRole: { $eq: ['stream'] } }] },
        ],
      },
    },
    {
      $lookup: {
        from: 'streamrequests',
        let: { hostId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  { $eq: ['$allot_host_1', '$$hostId'] },
                  { $eq: ['$allot_host_2', '$$hostId'] },
                  { $eq: ['$allot_host_3', '$$hostId'] },
                ],
              },
              $and: [
                { status: { $ne: 'Completed' } },
                { _id: { $ne: streamId } },
                {
                  $or: [
                    { $and: [{ startTime: { $lte: hostTime.startTime } }, { endTime: { $gte: hostTime.startTime } }] },
                    { $and: [{ startTime: { $lte: hostTime.endTime } }, { endTime: { $gte: hostTime.endTime } }] },
                  ],
                },
              ],
            },
          },
          { $group: { _id: null, count: { $sum: 1 } } },
        ],
        as: 'streamrequests',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$streamrequests',
      },
    },
    {
      $addFields: {
        busy: { $ifNull: ['$streamrequests.count', 0] },
      },
    },
    { $match: { busy: { $eq: 0 } } },
  ]);

  let chat = await Seller.aggregate([
    {
      $match: {
        $and: [
          { sellerType: { $eq: 'sub-host' } },
          { mainSeller: { $eq: req.userId } },
          { $or: [{ sellerRole: { $eq: ['chat/stream'] } }, { sellerRole: { $eq: ['chat'] } }] },
        ],
      },
    },
    {
      $lookup: {
        from: 'streamrequests',
        let: { hostId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  { $eq: ['$allot_host_1', '$$hostId'] },
                  { $eq: ['$allot_host_2', '$$hostId'] },
                  { $eq: ['$allot_host_3', '$$hostId'] },
                ],
              },
              $and: [
                { status: { $ne: 'Completed' } },
                { _id: { $ne: streamId } },
                {
                  $or: [
                    { $and: [{ startTime: { $lte: hostTime.startTime } }, { endTime: { $gte: hostTime.startTime } }] },
                    { $and: [{ startTime: { $lte: hostTime.endTime } }, { endTime: { $gte: hostTime.endTime } }] },
                  ],
                },
              ],
            },
          },
          { $group: { _id: null, count: { $sum: 1 } } },
        ],
        as: 'streamrequests',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$streamrequests',
      },
    },
    {
      $addFields: {
        busy: { $ifNull: ['$streamrequests.count', 0] },
      },
    },
    { $match: { busy: { $eq: 0 } } },
  ]);
  return { host, chat };
};
const getsubuserAll = async (req) => {
  let page = req.query.page == '' || req.query.page == null || req.query.page == null ? 0 : req.query.page;
  let sellerID = req.userId;
  let values = await Seller.aggregate([
    { $match: { $and: [{ mainSeller: { $eq: sellerID } }, { sellerType: { $eq: 'sub-user' } }] } },
    {
      $skip: 10 * page,
    },
    {
      $limit: 10,
    },
  ]);
  let next = await Seller.aggregate([
    { $match: { $and: [{ mainSeller: { $eq: sellerID } }, { sellerType: { $eq: 'sub-user' } }] } },
    {
      $skip: 10 * (page + 1),
    },
    {
      $limit: 10,
    },
  ]);
  return { values, next: next.length != 0 };
};
const disabled_subuser = async (req) => {
  let host = await Seller.findById(req.query.id);
  if (!host) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sellar Not Found');
  }
  if (host.mainSeller != req.userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sellar Not Found');
  }
  host.active = !host.active;
  host.save();
  return host;
};

const get_single_user = async (req) => {
  let host = await Seller.findById(req.query.id);
  if (!host) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sellar Not Found');
  }
  if (host.mainSeller != req.userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sellar Not Found');
  }
  return host;
};

const update_single_user = async (req) => {
  let host = await Seller.findById(req.query.id);
  if (!host) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sellar Not Found');
  }
  if (host.mainSeller != req.userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sellar Not Found');
  }
  host = await Seller.findByIdAndUpdate({ _id: host._id }, req.body, { new: true });
  return host;
};

const change_password = async (req) => {
  let value = await Seller.findById(req.userId);

  if (!value) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shop Not Fount');
  }

  if (!(await value.isPasswordMatch(req.body.oldpassword))) {
    throw new ApiError(403, "Password Doesn't Match");
  }
  const salt = await bcrypt.genSalt(10);

  let password = await bcrypt.hash(req.body.password, salt);
  value = await Seller.findByIdAndUpdate({ _id: req.userId }, { password: password }, { new: true });

  return value;
};
const update_my_profile = async (req) => {
  let value = await Seller.findById(req.userId);

  if (!value) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shop Not Fount');
  }
  value = await Seller.findByIdAndUpdate({ _id: req.userId }, req.body, { new: true });

  return value;
};

const getSellers_With_Paginations = async (page) => {
  const values = await Seller.aggregate([
    {
      $skip: 10 * page,
    },
    {
      $limit: 10,
    },
  ]);
  let next = await Seller.aggregate([
    {
      $skip: 10 * (parseInt(page) + 1),
    },
    {
      $limit: 10,
    },
  ]);
  return { values: values, next: next.length != 0 };
};

const DisableSeller = async (id, type) => {
  let values = await Seller.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Seller Not Available');
  }
  if (type == 'disable') {
    values = await Seller.findByIdAndUpdate({ _id: id }, { active: false }, { new: true });
  } else {
    values = await Seller.findByIdAndUpdate({ _id: id }, { active: true }, { new: true });
  }
  return values;
};

const getAllSeller = async () => {
  let values = await Seller.find();
  return values;
};

const createDispatchLocation = async (body, userId) => {
  let data = { ...body, ...{ userId: userId } };
  let values = await VisitorDispatch.create(data);
  return values;
};

const updateDispatchLocation = async (id, body) => {
  let dispatch = await VisitorDispatch.findById(id);
  if (!dispatch) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Not Found');
  }
  dispatch = await VisitorDispatch.findByIdAndUpdate({ _id: id }, body, { new: true });
  return dispatch;
};

const getDispatchLocations = async (userId) => {
  let values = await VisitorDispatch.aggregate([
    {
      $match: {
        userId: userId,
      },
    },
  ]);
  return values;
};

const DeleteLocation = async (id) => {
  let dispatch = await VisitorDispatch.findById(id);
  if (!dispatch) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Not Found');
  }
  await dispatch.remove();
  return { Message: 'Deleted' };
};

module.exports = {
  createSeller,
  verifyOTP,
  GetAllSeller,
  loginseller,
  GetSellerById,
  UpdateSellerById,
  setPassword,
  forgotPass,
  alreadyUser,
  createSubhost,
  createSubUser,
  mydetails,
  getsubhostAll,
  getsubuserAll,
  subhost_free_users,
  disabled_hosts,
  delete_hosts,
  disabled_subuser,
  get_single_host,
  update_single_host,
  get_single_user,
  update_single_user,
  change_password,
  update_my_profile,
  getSellers_With_Paginations,
  DisableSeller,
  sendOTP_continue,
  getAllSeller,
  createDispatchLocation,
  updateDispatchLocation,
  getDispatchLocations,
  DeleteLocation,
  verifyOTP_Delete_Account,
};
