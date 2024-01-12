const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const { purchasePlan, PlanPayment, ExpoAd, AdPlan, PurchaseLink } = require('../models/purchasePlan.model');
const paymentgatway = require('./paymentgatway.service');
const Dates = require('./Date.serive');
const AWS = require('aws-sdk');
const { Slotseperation } = require('../models/slot.model');
const axios = require('axios');
const {
  Streamplan,
  StreamPost,
  Streamrequest,
  StreamrequestPost,
  StreamPreRegister,
  streamPlanlink,
} = require('../models/ecomplan.model');
const { Seller } = require('../models/seller.models');
const ccavenue = require('./ccavenue.service');

const create_purchase_plan = async (req) => {
  let orders;
  if (req.body.PaymentDatails != null) {
    let payment = await paymentgatway.verifyRazorpay_Amount(req.body.PaymentDatails);
    //console.log(payment)
    let collectedAmount = payment.amount / 100;
    let collectedstatus = payment.status;
    let plan = await Streamplan.findById(req.body.plan);
    if (collectedstatus == 'captured' && collectedAmount == plan.salesPrice) {
      var yourDate = new Date();
      var numberOfDaysToAdd = plan.validityofplan;
      var date_now = yourDate.setDate(yourDate.getDate() + numberOfDaysToAdd);
      let datas = {
        planType: 'normal',
        planId: req.body.plan,
        suppierId: req.userId,
        paidAmount: collectedAmount,
        paymentStatus: collectedstatus,
        order_id: payment.order_id,
        noOfParticipants: plan.numberOfParticipants,
        chat: plan.chatNeed,
        max_post_per_stream: plan.max_post_per_stream,
        Duration: plan.Duration,
        planName: plan.planName,
        DurationType: plan.DurationType,
        numberOfParticipants: plan.numberOfParticipants,
        numberofStream: plan.numberofStream,
        validityofplan: plan.validityofplan,
        noOfParticipantsCost: plan.noOfParticipantsCost,
        chatNeed: plan.chatNeed,
        commision: plan.commision,
        commition_value: plan.commition_value,
        stream_expire_hours: plan.stream_expire_hours,
        stream_expire_days: plan.stream_expire_days,
        stream_expire_minutes: plan.stream_expire_minutes,
        regularPrice: plan.regularPrice,
        salesPrice: plan.salesPrice,
        description: plan.description,
        planmode: plan.planmode,
        expireDate: date_now,
        streamvalidity: plan.streamvalidity,
        no_of_host: plan.no_of_host,
        RaiseHands: plan.RaiseHands,
        offer_price: plan.offer_price,
        stream_validity: plan.stream_validity,
        Interest_View_Count: plan.Interest_View_Count,
        No_of_Limitations: plan.No_of_Limitations,
        Service_Charges: plan.Service_Charges,
        TimeType: plan.TimeType,
        raisehandcontrol: plan.raisehandcontrol,
      };
      let con = await purchasePlan.create({ ...datas, ...req.body.PaymentDatails });
      await Dates.create_date(con);
      return con;
    } else {
      return { error: 'Amount Not Match' };
    }
  } else {
    return { error: 'order not found' };
  }
};
const create_purchase_plan_private = async (req) => {
  let orders;
  if (req.body.PaymentDatails != null) {
    let payment = await paymentgatway.verifyRazorpay_Amount(req.body.PaymentDatails);
    let collectedAmount = payment.amount / 100;
    let collectedstatus = payment.status;
    let links = await streamPlanlink.findById(req.body.link);
    let plan = await Streamplan.findById(links.plan);
    if (collectedstatus == 'captured' && collectedAmount == plan.salesPrice) {
      var yourDate = new Date();
      var numberOfDaysToAdd = plan.validityofplan;
      var date_now = yourDate.setDate(yourDate.getDate() + numberOfDaysToAdd);
      let datas = {
        planType: 'normal',
        planId: links.plan,
        suppierId: links.supplier,
        paidAmount: collectedAmount,
        paymentStatus: collectedstatus,
        order_id: payment.order_id,
        noOfParticipants: plan.numberOfParticipants,
        chat: plan.chatNeed,
        max_post_per_stream: plan.max_post_per_stream,
        Duration: plan.Duration,
        planName: plan.planName,
        DurationType: plan.DurationType,
        numberOfParticipants: plan.numberOfParticipants,
        numberofStream: plan.numberofStream,
        validityofplan: plan.validityofplan,
        noOfParticipantsCost: plan.noOfParticipantsCost,
        chatNeed: plan.chatNeed,
        commision: plan.commision,
        commition_value: plan.commition_value,
        stream_expire_hours: plan.stream_expire_hours,
        stream_expire_days: plan.stream_expire_days,
        stream_expire_minutes: plan.stream_expire_minutes,
        regularPrice: plan.regularPrice,
        salesPrice: plan.salesPrice,
        description: plan.description,
        planmode: plan.planmode,
        expireDate: date_now,
        streamvalidity: plan.streamvalidity,
        no_of_host: plan.no_of_host,
        RaiseHands: plan.RaiseHands,
        offer_price: plan.offer_price,
        stream_validity: plan.stream_validity,
        Interest_View_Count: plan.Interest_View_Count,
        No_of_Limitations: plan.No_of_Limitations,
        Service_Charges: plan.Service_Charges,
        TimeType: plan.TimeType,
        raisehandcontrol: plan.raisehandcontrol,
      };
      let con = await purchasePlan.create({ ...datas, ...req.body.PaymentDatails });
      await Dates.create_date(con);
      links.purchaseId = con._id;
      links.status = 'Purchased';
      links.save();
      return con;
    } else {
      return { error: 'Amount Not Match' };
    }
  } else {
    return { error: 'order not found' };
  }
};

const create_purchase_plan_addon = async (req) => {
  let orders;
  if (req.body.PaymentDatails != null) {
    let payment = await paymentgatway.verifyRazorpay_Amount(req.body.PaymentDatails);
    //console.log(payment)
    let collectedAmount = payment.amount / 100;
    let collectedstatus = payment.status;
    let plan = await Streamplan.findById(req.body.plan);
    if (collectedstatus == 'captured' && collectedAmount == plan.salesPrice) {
      var yourDate = new Date();
      var numberOfDaysToAdd = plan.validityofplan;
      let date_now = yourDate.setDate(yourDate.getDate() + numberOfDaysToAdd);
      if (plan.planType == 'addon') {
        date_now = new Date().getTime();
      }
      //console.log(date_now)
      let con = await purchasePlan.create({
        ...{
          no_of_host: plan.no_of_host,
          planType: 'addon',
          streamId: req.body.streamId,
          planId: req.body.plan,
          suppierId: req.userId,
          paidAmount: collectedAmount,
          paymentStatus: collectedstatus,
          order_id: payment.order_id,
          noOfParticipants: plan.numberOfParticipants,
        },
        ...req.body.PaymentDatails,
      });
      await Dates.create_date(con);
      await addstream_user_limits(req, plan, con);
      return con;
    } else {
      return { error: 'Amount Not Match' };
    }
  } else {
    return { error: 'order not found' };
  }
};

const addstream_user_limits = async (req, plan, con) => {
  let stream = await Streamrequest.findById(req.body.streamId);
  let users_limit = await StreamPreRegister.find({ streamId: req.body.streamId, status: 'Registered' })
    .skip(stream.noOfParticipants)
    .limit(plan.numberOfParticipants);
  //console.log(users_limit)
  let count = stream.noOfParticipants;
  users_limit.forEach(async (e) => {
    count++;
    await StreamPreRegister.findByIdAndUpdate(
      { _id: e._id },
      { eligible: true, streamCount: count, viewstatus: 'Confirmed' },
      { new: true }
    );
  });
  stream.noOfParticipants = plan.numberOfParticipants + stream.noOfParticipants;
  stream.save();
};
const get_order_details = async (req) => {
  let order = await purchasePlan.findById(req.query.id);
  if (!order || order.suppierId != req.userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found');
  }
  let plan = await Streamplan.findById(order.planId);
  let payment = await paymentgatway.verifyRazorpay_Amount({
    razorpay_order_id: order.razorpay_order_id,
    razorpay_payment_id: order.razorpay_payment_id,
    razorpay_signature: order.razorpay_signature,
  });

  return { payment, plan, order };
};

const get_all_my_orders = async (req) => {
  let plan = await purchasePlan.aggregate([
    { $sort: { DateIso: -1 } },
    { $match: { suppierId: req.userId } },
    {
      $lookup: {
        from: 'streamplans',
        localField: 'planId',
        foreignField: '_id',
        as: 'streamplans',
      },
    },
    {
      $unwind: {
        path: '$streamplans',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        DateIso: 1,
        active: 1,
        archived: 1,
        created: 1,
        order_id: 1,
        paidAmount: 1,
        paymentStatus: 1,
        planId: 1,
        razorpay_order_id: 1,
        razorpay_payment_id: 1,
        razorpay_signature: 1,
        Duration: '$streamplans.Duration',
        commision: '$streamplans.commision',
        planName: '$streamplans.planName',
        commition_value: '$streamplans.commition_value',
        chatNeed: '$streamplans.chatNeed',
        numberOfParticipants: '$streamplans.numberOfParticipants',
        numberofStream: '$streamplans.numberofStream',
        post_expire_days: '$streamplans.post_expire_days',
        post_expire_hours: '$streamplans.post_expire_hours',
        post_expire_minutes: '$streamplans.post_expire_minutes',
        regularPrice: '$streamplans.regularPrice',
        validityofStream: '$streamplans.validityofStream',
      },
    },
  ]);
  return plan;
};

const get_all_my_orders_normal = async (req) => {
  let page = req.query.page == '' || req.query.page == null || req.query.page == null ? 0 : req.query.page;
  let plan = await purchasePlan.aggregate([
    { $sort: { DateIso: -1 } },
    { $match: { $and: [{ suppierId: req.userId }, { planType: { $eq: 'normal' } }] } },
    {
      $lookup: {
        from: 'slotseperations',
        localField: '_id',
        foreignField: 'PlanId',
        pipeline: [
          {
            $match: {
              SlotType: 'Normal',
            },
          },
          {
            $addFields: {
              sumval: { $add: ['$usedSlots', '$Slots'] },
            },
          },
          {
            $group: { _id: null, total: { $sum: '$sumval' } },
          },
        ],
        as: 'NormalSlot',
      },
    },
    { $unwind: { preserveNullAndEmptyArrays: true, path: '$NormalSlot' } },
    {
      $lookup: {
        from: 'slotseperations',
        localField: '_id',
        foreignField: 'PlanId',
        pipeline: [
          {
            $match: {
              SlotType: 'Peak',
            },
          },
          {
            $addFields: {
              sumval: { $add: ['$usedSlots', '$Slots'] },
            },
          },
          {
            $group: { _id: null, total: { $sum: '$sumval' } },
          },
        ],
        as: 'PeakSlot',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$PeakSlot',
      },
    },
    {
      $lookup: {
        from: 'slotseperations',
        localField: '_id',
        foreignField: 'PlanId',
        pipeline: [
          {
            $match: {
              SlotType: 'Exclusive',
            },
          },
          {
            $addFields: {
              sumval: { $add: ['$usedSlots', '$Slots'] },
            },
          },
          {
            $group: { _id: null, total: { $sum: '$sumval' } },
          },
        ],

        as: 'ExclusiveSlot',
      },
    },
    { $unwind: { preserveNullAndEmptyArrays: true, path: '$ExclusiveSlot' } },
    {
      $lookup: {
        from: 'slotbookings',
        localField: '_id',
        foreignField: 'PlanId',
        pipeline: [{ $match: { slotType: 'Normal' } }],
        as: 'BookedSlotsNormal',
      },
    },
    {
      $lookup: {
        from: 'slotbookings',
        localField: '_id',
        foreignField: 'PlanId',
        pipeline: [{ $match: { slotType: 'Peak' } }],
        as: 'BookedSlotsPeak',
      },
    },
    {
      $lookup: {
        from: 'slotbookings',
        localField: '_id',
        foreignField: 'PlanId',
        pipeline: [{ $match: { slotType: 'Exclusive' } }],
        as: 'BookedSlotsExclusive',
      },
    },
    {
      $project: {
        _id: 1,
        active: 1,
        status: 1,
        planName: 1,
        planType: 1,
        streamvalidity: 1,
        slotInfo: 1,
        numberOfStreamused: 1,
        numberOfParticipants: 1,
        Teaser: 1,
        StreamVideos: 1,
        completedStream: 1,
        Pdf: 1,
        image: 1,
        description: 1,
        RaiseHands: 1,
        Advertisement_Display: 1,
        Special_Notification: 1,
        chat_Option: 1,
        salesCommission: 1,
        Price: 1,
        PostCount: 1,
        no_of_host: 1,
        planId: 1,
        DateIso: 1,
        suppierId: 1,
        createdAt: 1,
        updatedAt: 1,
        FromBank: 1,
        PayementMode: 1,
        TransactionId: 1,
        stream_validity: 1,
        raisehandcontrol: 1,
        Service_Charges: 1,
        transaction: 1,
        approvalDate: 1,
        Normal: { $ifNull: ['$NormalSlot.total', 0] },
        Peak: { $ifNull: ['$PeakSlot.total', 0] },
        Exclusive: { $ifNull: ['$ExclusiveSlot.total', 0] },
        NormalSlots: { $ifNull: [{ $size: '$BookedSlotsNormal' }, 0] },
        PeakSlots: { $ifNull: [{ $size: '$BookedSlotsPeak' }, 0] },
        ExclusiveSlots: { $ifNull: [{ $size: '$BookedSlotsExclusive' }, 0] },
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let total = await purchasePlan.aggregate([
    { $sort: { DateIso: -1 } },
    { $match: { $and: [{ suppierId: req.userId }, { planType: { $eq: 'normal' } }] } },
    { $skip: 10 * (page + 1) },
    { $limit: 10 },
  ]);
  return { plan, next: total.length != 0 };
};

const get_all_purchasePlans = async (req) => {
  var date_now = new Date().getTime();
  const myorders = await purchasePlan.aggregate([
    {
      $match: {
        $and: [{ suppierId: { $eq: req.userId } }, { active: { $eq: true } }],
      },
    },
    {
      $lookup: {
        from: 'streamplans',
        localField: 'planId',
        foreignField: '_id',
        pipeline: [{ $match: { planType: { $ne: 'addon' } } }],
        as: 'streamplans',
      },
    },
    {
      $unwind: '$streamplans',
    },

    {
      $project: {
        _id: 1,
        planName: '$streamplans.planName',
        max_post_per_stream: '$streamplans.max_post_per_stream',
        numberOfParticipants: '$streamplans.numberOfParticipants',
        numberofStream: '$streamplans.numberofStream',
        chatNeed: '$streamplans.chatNeed',
        commision: '$streamplans.commision',
        Duration: '$streamplans.Duration',
        commition_value: '$streamplans.commition_value',
        numberOfStreamused: 1,
        expireDate: 1,
        no_of_host: 1,
        planId: 1,
        transaction: 1,
      },
    },
  ]);

  return myorders;
};

// AGRI EXPO

const Purchased_Message = async (Name, plan, mobile) => {
  mobile = 91 + '' + mobile;
  console.log(mobile);
  // let message = `Dear Client, Thanks for your interest in our services. You can test our service by using this link https://ag23.site/s/${link} - AgriExpoLive2023(An Ookam company event)`;
  let message = `Dear ${Name}, Thank you for subscribing to the ${plan} plan for the event AgriExpoLive2023.Once the payment is approved,you may start using the app for streaming your products/services - AgriExpoLive2023(An Ookam company event)`;
  let reva = await axios.get(
    `http://panel.smsmessenger.in/api/mt/SendSMS?user=ookam&password=ookam&senderid=OOKAMM&channel=Trans&DCS=0&flashsms=0&number=${mobile}&text=${message}&route=6&peid=1701168700339760716&DLTTemplateId=1707169038127561646`
  );
  console.log(reva.data);
  return reva.data;
};

const create_PurchasePlan_EXpo = async (planId, userId, ccavenue, gst) => {
  console.log(ccavenue, 98765789);
  let findUser = await Seller.findById(userId);
  if (!findUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  let findPlan = await Streamplan.findById(planId).select(['-_id', '-active', '-__v']);
  if (!findPlan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');
  }
  let data = {
    streamvalidity: findPlan.streamvalidity,
    slotInfo: findPlan.slotInfo,
    planName: findPlan.planName,
    numberOfParticipants: findPlan.numberOfParticipants,
    Teaser: findPlan.Teaser,
    StreamVideos: findPlan.StreamVideos,
    completedStream: findPlan.completedStream,
    Pdf: findPlan.Pdf,
    image: findPlan.image,
    description: findPlan.description,
    RaiseHands: findPlan.RaiseHands,
    Advertisement_Display: findPlan.Advertisement_Display,
    Special_Notification: findPlan.Special_Notification,
    chat_Option: findPlan.chat_Option,
    salesCommission: findPlan.salesCommission,
    Price: findPlan.Price,
    PostCount: findPlan.PostCount,
    no_of_host: findPlan.no_of_host,
    planType: findPlan.planType,
    DateIso: moment(),
    planId: planId,
    suppierId: userId,
    ccavenue: ccavenue,
    transaction: findPlan.transaction,
    offer_price: findPlan.offer_price,
    stream_validity: findPlan.stream_validity,
    Interest_View_Count: findPlan.Interest_View_Count,
    No_of_Limitations: findPlan.No_of_Limitations,
    Service_Charges: findPlan.Service_Charges,
    TimeType: findPlan.TimeType,
    raisehandcontrol: findPlan.raisehandcontrol,
    totalAmount: findPlan.offer_price + gst,
    gst: gst,
  };
  console.log(data);
  const creations = await purchasePlan.create(data);
  // await Purchased_Message(findUser.tradeName, findPlan.planName, findUser.mobileNumber);
  return creations;
};

const create_PurchasePlan_EXpo_Admin = async (body, userId) => {
  let findUser = await Seller.findById(userId);
  if (!findUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  let findPlan = await Streamplan.findById(body.planId).select(['-_id', '-active', '-__v']);
  if (!findPlan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');
  }
  let data = {
    streamvalidity: findPlan.streamvalidity,
    slotInfo: findPlan.slotInfo,
    planName: findPlan.planName,
    numberOfParticipants: findPlan.numberOfParticipants,
    Teaser: findPlan.Teaser,
    StreamVideos: findPlan.StreamVideos,
    completedStream: findPlan.completedStream,
    Pdf: findPlan.Pdf,
    image: findPlan.image,
    description: findPlan.description,
    RaiseHands: findPlan.RaiseHands,
    Advertisement_Display: findPlan.Advertisement_Display,
    Special_Notification: findPlan.Special_Notification,
    chat_Option: findPlan.chat_Option,
    salesCommission: findPlan.salesCommission,
    Price: findPlan.Price,
    PostCount: findPlan.PostCount,
    no_of_host: findPlan.no_of_host,
    planType: findPlan.planType,
    DateIso: moment(),
    planId: body.planId,
    suppierId: userId,
    transaction: findPlan.transaction,
    offer_price: findPlan.offer_price,
    stream_validity: findPlan.stream_validity,
    Interest_View_Count: findPlan.Interest_View_Count,
    No_of_Limitations: findPlan.No_of_Limitations,
    Service_Charges: findPlan.Service_Charges,
    TimeType: findPlan.TimeType,
    raisehandcontrol: findPlan.raisehandcontrol,
    Type: body.Type,
  };
  const creations = await purchasePlan.create(data);
  // await Purchased_Message(findUser.tradeName, findPlan.planName, findUser.mobileNumber);
  return creations;
};

const getPurchasedPlan = async (userId) => {
  let values = await purchasePlan.aggregate([{ $match: { suppierId: userId } }]);
  return values;
};

const updatePurchasedPlan = async (id, body, userId) => {
  let values = await purchasePlan.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'plan Not Found');
  }
  values = await purchasePlan.findByIdAndDelete({ _id: id });
  const data = { ...body, DateIso: moment(), suppierId: userId, _id: body._id };
  values = await purchasePlan.create(data);
  return values;
};

const updatePurchasedPlanById = async (id, body) => {
  let values = await purchasePlan.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'plan Not Found');
  }
  values = await purchasePlan.findByIdAndUpdate({ _id: id }, body, { new: true });
  return values;
};

const updatePurchase_admin = async (id, body) => {
  let values = await purchasePlan.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'plan Not Found');
  }

  values = await purchasePlan.findByIdAndUpdate({ _id: id }, body, { new: true });

  let payamount = values.offer_price - values.Discount;
  let gst = (payamount * 18) / 100;
  values.totalAmount = payamount + gst;
  values.gst = gst;
  values.save();
  return values;
};

const get_All_Planes = async (page) => {
  let values = await purchasePlan.aggregate([
    { $sort: { createdAt: -1 } },
    { $match: { active: true } },
    { $lookup: { from: 'sellers', localField: 'suppierId', foreignField: '_id', as: 'suppliers' } },
    { $unwind: '$suppliers' },
    {
      $project: {
        _id: 1,
        active: 1,
        archived: 1,
        planType: 1,
        numberOfStreamused: 1,
        streamvalidity: 1,
        planId: 1,
        suppierId: 1,
        paidAmount: 1,
        paymentStatus: 1,
        order_id: 1,
        noOfParticipants: 1,
        chat: 1,
        max_post_per_stream: 1,
        Duration: 1,
        planName: 1,
        DurationType: 1,
        numberOfParticipants: 1,
        numberofStream: 1,
        validityofplan: 1,
        noOfParticipantsCost: 1,
        chatNeed: 1,
        commision: 1,
        commition_value: 1,
        regularPrice: 1,
        salesPrice: 1,
        description: 1,
        planmode: 1,
        expireDate: 1,
        no_of_host: 1,
        razorpay_payment_id: 1,
        razorpay_order_id: 1,
        razorpay_signature: 1,
        DateIso: 1,
        created: 1,
        suppliers: 1,
        status: { $ifNull: ['$status', 'Pending'] },
        Teaser: 1,
        StreamVideos: 1,
        completedStream: 1,
        Pdf: 1,
        Paidimage: 1,
        RaiseHands: 1,
        Advertisement_Display: 1,
        Special_Notification: 1,
        Price: 1,
        slotInfo: 1,
        PayementMode: 1,
        ChequeDDdate: 1,
        ChequeDDNo: 1,
        AccountNo: 1,
        FromBank: 1,
        image: 1,
        TransactionId: 1,
        chat_Option: 1,
        salesCommission: 1,
        PostCount: 1,
        Discount: 1,
        Referral: 1,
        RevisedAmount: 1,
        TelName: 1,
        Tele_Caller: 1,
        Type: 1,
        paymentLink: 1,
        gst: 1,
        offer_price: 1,
        totalAmount: 1,
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let total = await purchasePlan.aggregate([
    { $match: { active: true } },
    { $lookup: { from: 'sellers', localField: 'suppierId', foreignField: '_id', as: 'suppliers' } },
    { $unwind: '$suppliers' },
  ]);
  return { values, total: total.length };
};

const ChangePurchasedPlan = async (id, body) => {
  let values = await purchasePlan.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'plan Not Found');
  }
  values = await purchasePlan.findByIdAndDelete({ _id: id });
  const data = { ...body, DateIso: moment(), _id: body._id };
  values = await purchasePlan.create(data);
  return values;
};

const UploadProof = async (id, body) => {
  const s3 = new AWS.S3({
    accessKeyId: 'AKIAZEVZUULIPMENZZH7',
    secretAccessKey: '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',
    region: 'ap-south-1',
  });

  let params = {
    Bucket: 'agriexpoupload',
    Key: body.file.originalname,
    Body: body.file.buffer,
  };
  let stream;
  return new Promise((resolve) => {
    s3.upload(params, async (err, data) => {
      if (err) {
      }
      stream = await purchasePlan.findByIdAndUpdate({ _id: id }, { Paidimage: data.Location }, { new: true });
      resolve({ video: 'success', stream: stream });
    });
  });
};

const getPlanyById = async (id) => {
  console.log('ASDJKHG');
  const plan = await purchasePlan.aggregate([
    {
      $match: {
        _id: id,
      },
    },
    {
      $lookup: {
        from: 'sellers',
        localField: 'suppierId',
        foreignField: '_id',
        as: 'exhibitor',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$exhibitor',
      },
    },
  ]);
  return plan;
};

const Approve_Reject = async (id, body) => {
  let values = await purchasePlan.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Plan Not Available');
  }
  if (body.status == 'Approved') {
    values = await purchasePlan.findByIdAndUpdate({ _id: id }, { status: body.status }, { new: true });
    await purchasePlan.findByIdAndUpdate({ _id: id }, { approvalDate: moment() }, { new: true });
    values.slotInfo.forEach(async (e) => {
      // suppierId
      await Slotseperation.create({
        SlotType: e.slotType,
        Duration: e.Duration,
        userId: values.suppierId,
        Slots: e.No_Of_Slot,
        PlanId: values._id,
        streamPlanId: values.planId,
      });
    });
  } else if (body.status == 'Rejected') {
    values = await purchasePlan.findByIdAndUpdate({ _id: id }, { status: body.status }, { new: true });
    await purchasePlan.findByIdAndUpdate({ _id: id }, { approvalDate: moment() }, { new: true });
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Error Occured');
  }
  return values;
};

const getPlanDetailsByUser = async (userId) => {
  let val = await purchasePlan.aggregate([
    {
      $match: { status: { $in: ['Activated', 'Deactivated'] }, suppierId: userId },
    },
    {
      $lookup: {
        from: 'slotseperations',
        localField: '_id',
        foreignField: 'PlanId',
        pipeline: [
          {
            $match: {
              SlotType: 'Normal',
            },
          },
          {
            $addFields: {
              sumval: { $add: ['$usedSlots', '$Slots'] },
            },
          },
          {
            $group: { _id: null, total: { $sum: '$sumval' } },
          },
        ],
        as: 'NormalSlot',
      },
    },
    { $unwind: { preserveNullAndEmptyArrays: true, path: '$NormalSlot' } },
    {
      $lookup: {
        from: 'slotseperations',
        localField: '_id',
        foreignField: 'PlanId',
        pipeline: [
          {
            $match: {
              SlotType: 'Peak',
            },
          },
          {
            $addFields: {
              sumval: { $add: ['$usedSlots', '$Slots'] },
            },
          },
          {
            $group: { _id: null, total: { $sum: '$sumval' } },
          },
        ],
        as: 'PeakSlot',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$PeakSlot',
      },
    },
    {
      $lookup: {
        from: 'slotseperations',
        localField: '_id',
        foreignField: 'PlanId',
        pipeline: [
          {
            $match: {
              SlotType: 'Exclusive',
            },
          },
          {
            $addFields: {
              sumval: { $add: ['$usedSlots', '$Slots'] },
            },
          },
          {
            $group: { _id: null, total: { $sum: '$sumval' } },
          },
        ],

        as: 'ExclusiveSlot',
      },
    },
    { $unwind: { preserveNullAndEmptyArrays: true, path: '$ExclusiveSlot' } },
    {
      $lookup: {
        from: 'slotbookings',
        localField: '_id',
        foreignField: 'PlanId',
        pipeline: [{ $match: { slotType: 'Normal' } }],
        as: 'BookedSlotsNormal',
      },
    },
    {
      $lookup: {
        from: 'slotbookings',
        localField: '_id',
        foreignField: 'PlanId',
        pipeline: [{ $match: { slotType: 'Peak' } }],
        as: 'BookedSlotsPeak',
      },
    },
    {
      $lookup: {
        from: 'slotbookings',
        localField: '_id',
        foreignField: 'PlanId',
        pipeline: [{ $match: { slotType: 'Exclusive' } }],
        as: 'BookedSlotsExclusive',
      },
    },
    {
      $project: {
        _id: 1,
        active: 1,
        status: 1,
        planName: 1,
        Normal: { $ifNull: ['$NormalSlot.total', 0] },
        Peak: { $ifNull: ['$PeakSlot.total', 0] },
        Exclusive: { $ifNull: ['$ExclusiveSlot.total', 0] },
        NormalSlots: { $ifNull: [{ $size: '$BookedSlotsNormal' }, 0] },
        PeakSlots: { $ifNull: [{ $size: '$BookedSlotsPeak' }, 0] },
        ExclusiveSlots: { $ifNull: [{ $size: '$BookedSlotsExclusive' }, 0] },
      },
    },
  ]);
  return val;
};

const getPlanes_Request_Streams = async (userId) => {
  let date_now = new Date().getTime();
  let val = await purchasePlan.aggregate([
    {
      $match: { status: { $in: ['Activated'] }, suppierId: userId },
    },
    {
      $lookup: {
        from: 'slotseperations',
        localField: '_id',
        foreignField: 'PlanId',
        pipeline: [
          {
            $match: {
              SlotType: 'Normal',
            },
          },
          {
            $addFields: {
              sumval: { $add: ['$usedSlots', '$Slots'] },
            },
          },
          {
            $group: { _id: null, total: { $sum: '$sumval' } },
          },
        ],
        as: 'NormalSlot',
      },
    },
    { $unwind: { preserveNullAndEmptyArrays: true, path: '$NormalSlot' } },
    {
      $lookup: {
        from: 'slotseperations',
        localField: '_id',
        foreignField: 'PlanId',
        pipeline: [
          {
            $match: {
              SlotType: 'Peak',
            },
          },
          {
            $addFields: {
              sumval: { $add: ['$usedSlots', '$Slots'] },
            },
          },
          {
            $group: { _id: null, total: { $sum: '$sumval' } },
          },
        ],
        as: 'PeakSlot',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$PeakSlot',
      },
    },
    {
      $lookup: {
        from: 'slotseperations',
        localField: '_id',
        foreignField: 'PlanId',
        pipeline: [
          {
            $match: {
              SlotType: 'Exclusive',
            },
          },
          {
            $addFields: {
              sumval: { $add: ['$usedSlots', '$Slots'] },
            },
          },
          {
            $group: { _id: null, total: { $sum: '$sumval' } },
          },
        ],

        as: 'ExclusiveSlot',
      },
    },
    { $unwind: { preserveNullAndEmptyArrays: true, path: '$ExclusiveSlot' } },
    {
      $lookup: {
        from: 'slotbookings',
        localField: '_id',
        foreignField: 'PlanId',
        pipeline: [{ $match: { slotType: 'Normal' } }],
        as: 'BookedSlotsNormal',
      },
    },
    {
      $lookup: {
        from: 'slotbookings',
        localField: '_id',
        foreignField: 'PlanId',
        pipeline: [{ $match: { slotType: 'Peak' } }],
        as: 'BookedSlotsPeak',
      },
    },
    {
      $lookup: {
        from: 'slotbookings',
        localField: '_id',
        foreignField: 'PlanId',
        pipeline: [{ $match: { slotType: 'Exclusive' } }],
        as: 'BookedSlotsExclusive',
      },
    },
    {
      $lookup: {
        from: 'slotbookings',
        localField: '_id',
        foreignField: 'PlanId',
        pipeline: [
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
          { $match: { $and: [{ slotExpire: { $eq: false } }] } },
          {
            $group: {
              _id: null,
              count: { $sum: 1 }
            }
          }
        ],
        as: 'slotbookings',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$slotbookings',
      },
    },
    {
      $addFields: {
        slotCount: { $ifNull: ["$slotbookings.count", 0] },
      },
    },
    { $match: { $and: [{ slotCount: { $ne: 0 } }] } },
    {
      $project: {
        _id: 1,
        active: 1,
        status: 1,
        planName: 1,
        Normal: { $ifNull: ['$NormalSlot.total', 0] },
        Peak: { $ifNull: ['$PeakSlot.total', 0] },
        Exclusive: { $ifNull: ['$ExclusiveSlot.total', 0] },
        NormalSlots: { $ifNull: [{ $size: '$BookedSlotsNormal' }, 0] },
        PeakSlots: { $ifNull: [{ $size: '$BookedSlotsPeak' }, 0] },
        ExclusiveSlots: { $ifNull: [{ $size: '$BookedSlotsExclusive' }, 0] },
        transaction: 1,
        PostCount: 1,
        slotbookings: "$slotbookings"
      },
    },
    {
      $project: {
        _id: 1,
        active: 1,
        status: 1,
        planName: 1,
        Normal: 1,
        Peak: 1,
        Exclusive: 1,
        NormalSlots: 1,
        PeakSlots: 1,
        ExclusiveSlots: 1,
        isMatching: {
          $and: [
            { $eq: ['$Normal', '$NormalSlots'] },
            { $eq: ['$Peak', '$PeakSlots'] },
            { $eq: ['$Exclusive', '$ExclusiveSlots'] },
          ],
        },
        transaction: 1,
        PostCount: 1,
        slotbookings: 1

      },
    },
    {
      $match: {
        isMatching: true,
      },
    },
  ]);
  return val;
};

const getuserAvailablePlanes = async (id, userId) => {
  let val = await purchasePlan.aggregate([
    {
      $match: {
        _id: id,
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
  let data = {};
  if (val.length > 0) {
    data = val[0];
  }
  return data;
};

const get_All_Purchased_Plan = async (page) => {
  let purchase = await purchasePlan.aggregate([
    { $match: { status: 'Approved' } },
    {
      $lookup: {
        from: 'streamplans',
        localField: 'planId',
        foreignField: '_id',
        pipeline: [
          { $unwind: '$slotInfo' },
          {
            $project: {
              _id: 1,
              slotType: '$slotInfo.slotType',
            },
          },
          {
            $group: {
              _id: { slotType: '$slotType' },
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: '',
              slotType: '$_id.slotType',
              count: 1,
            },
          },
          { $sort: { slotType: 1 } },
        ],
        as: 'streamplans',
      },
    },
    // {streamplans: '$streamplans'},
    {
      $lookup: {
        from: 'streamplans',
        localField: 'planId',
        foreignField: '_id',
        as: 'streamplans_name',
      },
    },
    { $unwind: '$streamplans_name' },
    {
      $project: {
        streamplans: '$streamplans',
        _id: '$streamplans_name._id',
        planName: '$streamplans_name.planName',
        planId: 1,
        slotInfo: 1,
      },
    },
    {
      $group: {
        _id: {
          planName: '$planName',
          streamplans: '$streamplans',
          slotInfo: '$slotInfo',
          _id: '$_id',
        },
        purchasedCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: '$_id._id',
        planName: '$_id.planName',
        streamplans: '$_id.streamplans',
        purchasedCount: '$purchasedCount',
        slotInfo: '$_id.slotInfo',
      },
    },
    {
      $skip: page * 10,
    },
    {
      $limit: 10,
    },
    // { $unwind: '$streamplans' },
  ]);
  let values = await Streamplan.aggregate([
    {
      $lookup: {
        from: 'purchasedplans',
        localField: '_id',
        foreignField: 'planId',
        pipeline: [{ $match: { status: 'Approved' } }],
        as: 'planes',
      },
    },

    { $unwind: '$slotInfo' },
    {
      $project: {
        _id: 1,
        planName: 1,
        purchasedCount: { $size: '$planes' },
        slottype: '$slotInfo.slotType',
      },
    },
    {
      $group: {
        _id: {
          planName: '$planName',
          count: { $sum: 1 },
        },
      },
    },
    {
      $sort: { purchasedCount: 1 },
    },
    {
      $skip: page * 10,
    },
    {
      $limit: 10,
    },
  ]);

  let Total = await Streamplan.aggregate([
    {
      $lookup: {
        from: 'purchasedplans',
        localField: '_id',
        foreignField: 'planId',
        pipeline: [{ $match: { status: 'Approved' } }],
        as: 'planes',
      },
    },
    {
      $project: {
        _id: 1,
        planName: 1,
        purchasedCount: { $size: '$planes' },
        slotInfo: 1,
      },
    },
    {
      $match: { purchasedCount: { $gt: 0 } },
    },
  ]);

  return { values: purchase, total: Total.length };
};

const streamPlanById = async (id) => {
  let val = await Streamplan.findById(id);
  if (!val) {
    throw new ApiError(httpStatus.NOT_FOUND, 'StreamPlan Not Found');
  }
  return val;
};

const getPurchased_ByPlanId = async (id, page) => {
  let values = await purchasePlan.aggregate([
    {
      $sort: { createdAt: -1 },
    },
    {
      $match: {
        planId: id,
      },
    },
    {
      $lookup: {
        from: 'sellers',
        localField: 'suppierId',
        foreignField: '_id',
        as: 'supplier',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$supplier',
      },
    },
    {
      $project: {
        _id: 1,
        approvalDate: 1,
        createdAt: 1,
        planName: 1,
        planId: 1,
        userId: '$supplier._id',
        SellerName: '$supplier.tradeName',
      },
    },
    {
      $match: { approvalDate: { $ne: null } },
    },
    {
      $skip: page * 10,
    },
    {
      $limit: 10,
    },
  ]);

  let total = await purchasePlan.aggregate([
    {
      $match: {
        planId: id,
      },
    },
    {
      $lookup: {
        from: 'sellers',
        localField: 'suppierId',
        foreignField: '_id',
        as: 'supplier',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$supplier',
      },
    },
    {
      $project: {
        _id: 1,
        approvalDate: 1,
        createdAt: 1,
        planName: 1,
        planId: 1,
        SellerName: '$supplier.tradeName',
      },
    },
  ]);

  return { values: values, total: total.length };
};

const getStreamByUserAndPlan = async (userId, planId) => {
  const currentUnixTimestamp = moment().valueOf();

  let values = await Streamrequest.aggregate([
    {
      $match: {
        planId: planId,
        suppierId: userId,
      },
    },
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

const getPlanesByUser = async (uuserId) => {
  console.log(uuserId);
  let values = await purchasePlan.aggregate([
    {
      $match: {
        suppierId: uuserId,
      },
    },
    // { $addFields: { slots: '$slotInfo' } },
    // {
    //   $unwind: '$slotInfo',
    // },
    // {
    //   $group: {
    //     _id: {
    //       id: '$_id',
    //       planName: '$planName',
    //       slotType: '$slotInfo.slotType',
    //       status: '$status',
    //       DateIso: '$DateIso',
    //     },
    //     typeCount: { $sum: 1 },
    //     slotInfo: { $push: '$slotInfo' },
    //   },
    // },
    // {
    //   $group: {
    //     _id: '$_id.planName',
    //     id: { $first: '$_id.id' },
    //     status: { $first: '$_id.status' },
    //     planName: { $first: '$_id.planName' },
    //     DateIso: { $first: '$_id.DateIso' },
    //     types: {
    //       $push: {
    //         type: '$_id.slotType',
    //         count: '$typeCount',
    //         slotInfo: '$slotInfo',
    //       },
    //     },
    //   },
    // },
    {
      $unwind: '$slotInfo',
    },
    {
      $group: {
        _id: {
          planName: '$planName',
          slotType: '$slotInfo.slotType',
          id: '$_id',
          DateIso: '$DateIso',
          status: '$status',
        },
        count: { $sum: 1 },
        slotInfo: { $addToSet: '$slotInfo' },
      },
    },
    {
      $group: {
        _id: '$_id.id',
        planName: { $first: '$_id.planName' },
        DateIso: { $first: '$_id.DateIso' },
        status: { $first: '$_id.status' },
        types: {
          $push: {
            type: '$_id.slotType',
            count: '$count',
            slotInfo: '$slotInfo',
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        planName: 1,
        DateIso: 1,
        status: 1,
        Type: '$types',
      },
    },
    {
      $sort: {
        _id: -1,
      },
    },
  ]);
  return values;
};

const getPurchasedPlanById = async (id) => {
  let values = await purchasePlan.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'plan not found');
  }
  return values;
};

const getPurchasedPlanPayment = async (query) => {
  // console.log(query);
  let statusMatch = { status: { $in: ['Approved', 'Activated', 'Deactivated'] } };
  let PaymentStatusMatch = { active: true };
  let discountMatch = { active: true };
  let exhibitorMatch = { active: true };
  let TypeMatch = { active: true };

  if (query.status != '' && query.status != null && query.status != 'null') {
    statusMatch = { status: query.status };
  }

  if (query.payment != '' && query.payment != null && query.payment != 'null') {
    PaymentStatusMatch = { PayementStatus: query.payment };
  }

  if (query.discount != '' && query.discount != null && query.discount != 'null') {
    if (query.discount == 'yes') {
      discountMatch = { Discount: { $gt: 0 } };
    } else {
      discountMatch = { Discount: { $eq: 0 } };
    }
  }

  if (query.key != '' && query.key != null && query.key != 'null') {
    exhibitorMatch = {
      $or: [
        { exhibitorName: { $regex: query.key, $options: 'i' } },
        { exhibitorNumber: { $regex: query.key, $options: 'i' } },
      ],
    };
  }

  if (query.type != '' && query.type != null && query.type != 'null') {
    TypeMatch = { Type: query.type };
  }

  let values = await purchasePlan.aggregate([
    {
      $lookup: {
        from: 'sellers',
        localField: 'suppierId',
        foreignField: '_id',
        as: 'Sellers',
      },
    },
    {
      $unwind: {
        path: '$Sellers',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'agriplanpayments',
        localField: '_id',
        foreignField: 'PlanId',
        pipeline: [{ $group: { _id: null, Amount: { $sum: '$Amount' } } }],
        as: 'Payment',
      },
    },
    {
      $unwind: {
        path: '$Payment',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'ccavanuepayments',
        localField: 'ccavenue',
        foreignField: '_id',
        as: 'ccavanue',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$ccavanue',
      },
    },
    { $addFields: { paidAmount: { $ifNull: ['$Payment.Amount', 0] } } },
    {
      $project: {
        _id: 1,
        planName: 1,
        Payment: '$Payment',
        active: 1,
        Price: '$offer_price',
        exhibitorName: '$Sellers.tradeName',
        exhibitorNumber: { $convert: { input: '$Sellers.mobileNumber', to: 'string' } },
        number: '$Sellers.mobileNumber',
        exhibitorId: '$Sellers._id',
        paidAmount: 1,
        PendingAmount: { $subtract: ['$totalAmount', '$paidAmount'] },
        Type: { $ifNull: ['$Type', 'Online'] },
        status: 1,
        PayementStatus: {
          $cond: {
            if: {
              $eq: ['$ccavanue.response.order_status', 'Success'],
            },
            then: 'FullyPaid',
            else: '$PayementStatus',
          },
        },
        ccavanue: '$ccavanue',
        offer_price: 1,
        Discount: 1,
        totalAmount: 1,
        gst: 1,
      },
    },
    {
      $match: {
        $and: [PaymentStatusMatch, discountMatch, exhibitorMatch, statusMatch, TypeMatch],
      },
    },
  ]);
  return values;
};

const create_PlanPayment = async (body) => {
  const { PlanId } = body;
  let Plan = await purchasePlan.findById(PlanId);
  if (!Plan) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Plan not found');
  }
  let finding = await PlanPayment.find().count();
  let center = '';
  if (finding < 9) {
    center = '0000';
  }
  if (finding < 99 && finding >= 9) {
    center = '000';
  }
  if (finding < 999 && finding >= 99) {
    center = '00';
  }
  if (finding < 9999 && finding >= 999) {
    center = '0';
  }
  let billId = 'BID' + center + finding + 1;
  let data = { ...body, billId: billId };

  const paidPaymentDetails = await PlanPayment.aggregate([
    {
      $match: {
        PlanId: PlanId,
      },
    },
    {
      $group: {
        _id: null,
        Amount: { $sum: '$Amount' },
      },
    },
  ]);
  let val = paidPaymentDetails.length > 0 ? paidPaymentDetails[0].Amount : 0;
  console.log(val, body.Amount, Plan.totalAmount);
  console.log(val + parseFloat(body.Amount));
  let paid = await purchasePlan.findByIdAndUpdate(
    { _id: PlanId },
    { PaidAmount: val + parseInt(body.Amount) },
    { new: true }
  );
  if (Plan.totalAmount == val + parseFloat(body.Amount)) {
    paid.PayementStatus = 'FullyPaid';
  } else {
    paid.PayementStatus = 'PartiallyPaid';
  }
  await paid.save();
  const datas = await PlanPayment.create(data);
  return { message: 'Asdffads' };
};

const get_Payment_ById = async (id) => {
  let values = await PlanPayment.aggregate([
    {
      $match: {
        PlanId: id,
      },
    },
    {
      $lookup: {
        from: 'purchasedplans',
        localField: 'PlanId',
        foreignField: '_id',
        as: 'plan',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$plan',
      },
    },
    {
      $addFields: {
        PaidAmount: { $sum: '$Amount' },
      },
    },
  ]);

  let findPlan = await purchasePlan.findById(id);
  if (!findPlan) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'plan not found');
  }

  let sellers = await Seller.findById(findPlan.suppierId);

  return { values, sellers };
};

const createExpoAd = async (Body) => {
  let createAd = await ExpoAd.create(Body);
  return createAd;
};

const uploadAdById = async (id, body) => {
  let findAd = await ExpoAd.findById(id);
  if (!findAd) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Not Found');
  }
  const s3 = new AWS.S3({
    accessKeyId: 'AKIAZEVZUULIPMENZZH7',
    secretAccessKey: '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',
    region: 'ap-south-1',
  });

  let params = {
    Bucket: 'agriexpoupload',
    Key: body.file.originalname,
    Body: body.file.buffer,
  };
  let stream;
  return new Promise((resolve) => {
    s3.upload(params, async (err, data) => {
      if (err) {
      }
      stream = await ExpoAd.findByIdAndUpdate({ _id: id }, { adImage: data.Location }, { new: true });
      resolve({ ad: 'success', stream: stream });
    });
  });
};

const getAllAds = async () => {
  let values = await ExpoAd.find();
  return values;
};

const createAdPlan = async (body) => {
  let ad = await AdPlan.create(body);
  return ad;
};

const getAll_Ad_Planes = async () => {
  let values = await AdPlan.aggregate([
    {
      $match: {
        archive: false,
      },
    },
    {
      $lookup: {
        from: 'expoads',
        localField: 'Ad',
        foreignField: '_id',
        as: 'Ads',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$Ads',
      },
    },
  ]);
  return values;
};

const updateAdPlanBtId = async (id, body) => {
  let value = await AdPlan.findById(id);
  if (!value) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Not Found');
  }
  value = await AdPlan.findByIdAndUpdate({ _id: id }, body, { new: true });
  return value;
};

const getPayment_Details_ByPlan = async (planId) => {
  let values = await purchasePlan.aggregate([
    {
      $match: {
        _id: planId,
      },
    },
    {
      $lookup: {
        from: 'ccavanuepayments',
        localField: 'ccavenue',
        foreignField: '_id',
        as: 'payment',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$payment',
      },
    },
  ]);
  return values;
};

const getMyPurchasedPlan = async (userId) => {
  let values = await purchasePlan.aggregate([
    {
      $match: {
        suppierId: userId,
        status: { $ne: 'Pending' },
      },
    },
    {
      $lookup: {
        from: 'sellers',
        localField: 'suppierId',
        foreignField: '_id',
        as: 'Sellers',
      },
    },
    {
      $unwind: {
        path: '$Sellers',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'agriplanpayments',
        localField: '_id',
        foreignField: 'PlanId',
        pipeline: [{ $group: { _id: null, Amount: { $sum: '$Amount' } } }],
        as: 'Payment',
      },
    },
    {
      $unwind: {
        path: '$Payment',
        preserveNullAndEmptyArrays: true,
      },
    },
    { $addFields: { Price: { $toInt: '$Price' } } },
    {
      $lookup: {
        from: 'ccavanuepayments',
        localField: 'ccavenue',
        foreignField: '_id',
        as: 'ccavanue',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$ccavanue',
      },
    },
    { $addFields: { onlinePrice: { $ifNull: [{ $floor: { $toDouble: '$ccavanue.response.amount' } }, 0] } } },
    {
      $project: {
        _id: 1,
        planName: 1,
        Payment: { $ifNull: ['$Payment.Amount', 0] },
        active: 1,
        Price: '$offer_price',
        exhibitorName: '$Sellers.tradeName',
        exhibitorNumber: { $convert: { input: '$Sellers.mobileNumber', to: 'string' } },
        number: '$Sellers.mobileNumber',
        exhibitorId: '$Sellers._id',
        paidAmount: { $ifNull: ['$paidAmount', 0] },
        PendingAmount: { $subtract: ['$totalAmount', { $ifNull: ['$paidAmount', 0] }] },
        Type: { $ifNull: ['$Type', 'Online'] },
        status: 1,
        PayementStatus: {
          $cond: {
            if: {
              $eq: ['$ccavanue.response.order_status', 'Success'],
            },
            then: 'FullyPaid',
            else: '$PayementStatus',
          },
        },
        ccavanue: '$ccavanue',
        offer_price: 1,
        Discount: 1,
        totalAmount: 1,
        gst: 1,
      },
    },
  ]);
  return values;
};

const plan_payment_link_generate = async (req) => {
  let userId = req.userId;
  let purchase = req.body.plan;
  let purchasePlandetails = await purchasePlan.aggregate([
    { $match: { $and: [{ _id: { $eq: purchase } }] } },
    {
      $lookup: {
        from: 'agriplanpayments',
        localField: '_id',
        foreignField: 'PlanId',
        pipeline: [{ $group: { _id: null, Amount: { $sum: '$Amount' } } }],
        as: 'Payment',
      },
    },
    {
      $unwind: {
        path: '$Payment',
        preserveNullAndEmptyArrays: true,
      },
    },
    { $addFields: { Price: { $toInt: '$totalAmount' } } },
    {
      $project: {
        _id: 1,
        planName: 1,
        active: 1,
        paidAmount1: { $ifNull: ['$Payment.Amount', 0] },
        paidAmount: { $ifNull: ['$Payment.Amount', 0] },
        PendingAmount: {
          $ifNull: [
            {
              $subtract: ['$totalAmount', { $ifNull: ['$Payment.Amount', 0] }],
            },
            '$totalAmount',
          ],
        },
        Type: { $ifNull: ['$Type', 'Online'] },
        status: 1,
        Discount: { $ifNull: ['$Discount', 0] },
        PayementStatus: {
          $cond: {
            if: {
              $eq: ['$ccavanue.response.order_status', 'Success'],
            },
            then: 'FullyPaid',
            else: '$PayementStatus',
          },
        },
        ccavanue: '$ccavanue',
      },
    },
  ]);
  if (purchasePlandetails.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'purchase not found');
  }

  let purchaseDetails = purchasePlandetails[0];
  let link_Valid = moment().add(300, 'minutes');
  let data = {
    amount: purchaseDetails.PendingAmount,
    link_Valid: link_Valid,
    purchasePlan: purchaseDetails._id,
    generatedBy: userId,
    status: 'Generated',
  };
  let link = await PurchaseLink_genete(data);

  return { purchaseDetails, link };
};

const PurchaseLink_genete = async (data) => {
  let link = await PurchaseLink.create(data);
  return link;
};

const get_payment_link = async (req) => {
  let link = await PurchaseLink.findById(req.params.id);
  if (!link) {
    throw new ApiError(httpStatus.NOT_FOUND, 'purchase not found');
  }
  let time = new Date().getTime();

  if (link.link_Valid < time) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Purchase link Expired');
  }
  if (link.status != 'Generated') {
    throw new ApiError(httpStatus.NOT_FOUND, 'Purchase link Expired');
  }

  let purchasePlandetails = await purchasePlan.aggregate([
    { $match: { $and: [{ _id: { $eq: link.purchasePlan } }] } },
    {
      $lookup: {
        from: 'agriplanpayments',
        localField: '_id',
        foreignField: 'PlanId',
        pipeline: [{ $group: { _id: null, Amount: { $sum: '$Amount' } } }],
        as: 'Payment',
      },
    },
    {
      $unwind: {
        path: '$Payment',
        preserveNullAndEmptyArrays: true,
      },
    },
    { $addFields: { paidAmount: { $ifNull: ['$Payment.Amount', 0] } } },
    {
      $project: {
        _id: 1,
        planName: 1,
        Payment: '$Payment',
        active: 1,
        Price: '$offer_price',
        paidAmount: 1,
        PendingAmount: { $subtract: ['$totalAmount', '$paidAmount'] },
        Type: { $ifNull: ['$Type', 'Online'] },
        status: 1,
        PayementStatus: {
          $cond: {
            if: {
              $eq: ['$ccavanue.response.order_status', 'Success'],
            },
            then: 'FullyPaid',
            else: '$PayementStatus',
          },
        },
        ccavanue: '$ccavanue',
        offer_price: 1,
        Discount: 1,
        totalAmount: 1,
        gst: 1,
      },
    },
  ]);
  if (purchasePlandetails.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'purchase not found');
  }
  let purchaseDetails = purchasePlandetails[0];
  link = await PurchaseLink.aggregate([
    { $match: { $and: [{ _id: { $eq: req.params.id } }] } },
    {
      $lookup: {
        from: 'purchasedplans',
        localField: 'purchasePlan',
        foreignField: '_id',
        pipeline: [
          {
            $lookup: {
              from: 'sellers',
              localField: 'suppierId',
              foreignField: '_id',
              as: 'sellers',
            },
          },
          {
            $unwind: {
              path: '$sellers',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $addFields: {
              mobileNumber: '$sellers.mobileNumber',
            },
          },
          {
            $addFields: {
              tradeName: '$sellers.tradeName',
            },
          },
          {
            $addFields: {
              email: '$sellers.email',
            },
          },
        ],
        as: 'purchasedplans',
      },
    },
    {
      $unwind: {
        path: '$purchasedplans',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        paymentInfo: null,
      },
    },
  ]);

  console.log(purchaseDetails, link.purchasePlan);

  if (link.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'purchase not found');
  }
  link[0].paymentInfo = purchaseDetails;
  return link[0];
};

const paynow_payment = async (req) => {
  let link = await PurchaseLink.findById(req.body.id);
  if (!link) {
    throw new ApiError(httpStatus.NOT_FOUND, 'purchase not found');
  }
  let time = new Date().getTime();

  if (link.link_Valid < time) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Purchase link Expired');
  }
  if (link.status != 'Generated') {
    throw new ApiError(httpStatus.NOT_FOUND, 'Purchase link Expired');
  }
  let plan = await purchasePlan.findById(link.purchasePlan);
  let paynow = await ccavenue.exhibitor_purchese_plan(link.amount, 'https://agriexpo.click/payment/success', link._id);
  link.ccavanue = paynow.payment._id;
  link.save();
  plan.ccavenue = paynow.payment._id;
  plan.save();

  return paynow;
};

const get_purchase_links = async (req) => {
  var nowDate = new Date().getTime();
  let purchasePlandetails = await purchasePlan.aggregate([
    { $match: { $and: [{ _id: { $eq: req.query.id } }] } },
    {
      $lookup: {
        from: 'paymentlinks',
        localField: '_id',
        foreignField: 'purchasePlan',
        pipeline: [
          {
            $addFields: {
              status: {
                $cond: {
                  if: { $lt: ['$link_Valid', nowDate] },
                  then: 'Expired',
                  else: '$status',
                },
              },
            },
          },
        ],
        as: 'paymentlinks',
      },
    },
  ]);
  if (purchasePlandetails.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'purchase not found');
  }
  return purchasePlandetails[0];
};

const userPayment = async (body) => {
  let { PlanId, datas } = body;
  let Plan = await purchasePlan.findById(PlanId);
  if (!Plan) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Plan Not Found');
  }
  let datenow = moment().format('YYYY-MM-DD');
  let time = moment().format('HH:mm:ss');
  datas = { ...datas, time: time, date: datenow };
  Plan = await purchasePlan.findByIdAndUpdate({ _id: PlanId }, { $push: { userPaymentRequest: datas } }, { new: true });
  return Plan;
};

const getPaymentDetails = async (id) => {
  let values = await purchasePlan.aggregate([
    {
      $match: {
        _id: id,
      },
    },
    {
      $lookup: {
        from: 'sellers',
        localField: 'suppierId',
        foreignField: '_id',
        as: 'Sellers',
      },
    },
    {
      $unwind: {
        path: '$Sellers',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'agriplanpayments',
        localField: '_id',
        foreignField: 'PlanId',
        pipeline: [{ $group: { _id: null, Amount: { $sum: '$Amount' } } }],
        as: 'Payment',
      },
    },
    {
      $unwind: {
        path: '$Payment',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'ccavanuepayments',
        localField: 'ccavenue',
        foreignField: '_id',
        as: 'ccavanue',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$ccavanue',
      },
    },
    { $addFields: { paidAmount: { $ifNull: ['$Payment.Amount', 0] } } },
    {
      $project: {
        _id: 1,
        planName: 1,
        Payment: '$Payment.Amount',
        active: 1,
        Price: '$offer_price',
        exhibitorName: '$Sellers.tradeName',
        exhibitorNumber: { $convert: { input: '$Sellers.mobileNumber', to: 'string' } },
        number: '$Sellers.mobileNumber',
        exhibitorId: '$Sellers._id',
        // paidAmount: "$paidAmount.Amount",
        PendingAmount: { $subtract: ['$totalAmount', '$paidAmount'] },
        Type: { $ifNull: ['$Type', 'Online'] },
        status: 1,
        PayementStatus: {
          $cond: {
            if: {
              $eq: ['$ccavanue.response.order_status', 'Success'],
            },
            then: 'FullyPaid',
            else: '$PayementStatus',
          },
        },
        ccavanue: '$ccavanue',
        offer_price: 1,
        Discount: 1,
        totalAmount: 1,
        gst: 1,
        userPaymentRequest: 1,
      },
    },
  ]);
  return values;
};

module.exports = {
  create_purchase_plan,
  get_order_details,
  get_all_my_orders,
  create_purchase_plan_addon,
  get_all_my_orders_normal,
  get_all_purchasePlans,
  create_purchase_plan_private,
  create_PurchasePlan_EXpo,
  getPurchasedPlan,
  updatePurchasedPlan,
  updatePurchasedPlanById,
  updatePurchase_admin,
  get_All_Planes,
  ChangePurchasedPlan,
  UploadProof,
  getPlanyById,
  Approve_Reject,
  getPlanDetailsByUser,
  getuserAvailablePlanes,
  getPlanes_Request_Streams,
  get_All_Purchased_Plan,
  streamPlanById,
  getPurchased_ByPlanId,
  getStreamByUserAndPlan,
  create_PurchasePlan_EXpo_Admin,
  getPlanesByUser,
  getPurchasedPlanById,
  getPurchasedPlanPayment,
  create_PlanPayment,
  get_Payment_ById,
  createExpoAd,
  uploadAdById,
  getAllAds,
  createAdPlan,
  getAll_Ad_Planes,
  updateAdPlanBtId,
  getPayment_Details_ByPlan,
  getMyPurchasedPlan,
  plan_payment_link_generate,
  get_payment_link,
  paynow_payment,
  get_purchase_links,
  Purchased_Message,
  userPayment,
  getPaymentDetails,
};
