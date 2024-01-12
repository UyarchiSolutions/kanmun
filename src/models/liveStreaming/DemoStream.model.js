const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('../plugins');
const { roles } = require('../../config/roles');
const { StringDecoder } = require('string_decoder');
const { v4 } = require('uuid');

const demosellerschema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  dateISO: {
    type: Number,
  },
  date: {
    type: String,
  },
  phoneNumber: {
    type: Number,
  },
  name: {
    type: String,
  },
  type: {
    type: String,
  },
  recuiteUser: {
    type: String,
  }
});

const Demoseller = mongoose.model('demoseller', demosellerschema);

const demostreamchema = mongoose.Schema({
  _id: {
    type: String,
    // default: v4,
  },
  dateISO: {
    type: Number,
  },
  date: {
    type: Number,
  },
  expired: {
    type: Boolean,
    default: false,
  },
  userID: {
    type: String,
  },
  streamName: {
    type: String,
  },
  name: {
    type: String,
  },
  phoneNumber: {
    type: Number,
  },
  streamValitity: {
    type: String,
  },
  endTime: {
    type: Number,
  },
  livestart: {
    type: Boolean,
    default: false,
  },
  agoraID: {
    type: String,
  },
  joined: {
    type: Boolean,
  },
  current_watching_stream: {
    type: Number,
  },
  userList: {
    type: Array,
    default: [],
  },
  end_Status: {
    type: String,
  },
  streamEnd_Time: {
    type: Number,
  },
  status: {
    type: String,
    default: 'Pending',
  },
  createdBy: {
    type: String,
  },
  transaction: {
    type: String,
  },
  otp_verifiyed: {
    type: String,
  },
  otp_verifiyed_status: {
    type: String,
    default: 'Pending',
  },
  startTime: {
    type: Number,
  },
  tokenExp: {
    type: Number,
  },
  demoType: {
    type: String,
    default: "By Admin"
  },
  type: {
    type: String,
  },
  chat: {
    type: Boolean,
    default: false
  },
  recuiteUser: {
    type: String,
  },
  raise_hands: {
    type: Boolean,
    default: false
  },
  raiseUser: {
    type: String,
  },
  candidate: {
    type: Number,
  },
  condidate_join: {
    type: Boolean,
    default: false
  }
});

const Demostream = mongoose.model('demostream', demostreamchema);

const Demopostschema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  dateISO: {
    type: Number,
  },
  date: {
    type: Number,
  },
  productTitle: {
    type: String,
  },
  streamID: {
    type: String,
  },
  productID: {
    type: String,
  },
  image: {
    type: String,
  },
  userID: {
    type: String,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  orderedQTY: {
    type: Number,
    default: 0,
  },
  pendingQTY: {
    type: Number,
    default: 0,
  },
  marketPlace: {
    type: Number,
  },
  offerPrice: {
    type: Number,
  },
  minLots: {
    type: Number,
  },
  incrementalLots: {
    type: Number,
  },
});

const Demopost = mongoose.model('demopost', Demopostschema);

const Demobuyerschema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  dateISO: {
    type: Number,
  },
  date: {
    type: Number,
  },
  expired: {
    type: Boolean,
    default: false,
  },
  appID: {
    type: String,
  },
  phoneNumber: {
    type: Number,
  },
  name: {
    type: String,
  },
  type: {
    type: String,
  },
  Institution_name: {
    type: String,
  },
  location: {
    type: String,
  }
});

const Demobuyer = mongoose.model('demobuyer', Demobuyerschema);

const Demoorderschema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  DateIso: {
    type: Number,
  },
  date: {
    type: String,
  },
  created: {
    type: Date,
  },
  time: {
    type: Number,
  },
  streamId: {
    type: String,
  },
  cart: {
    type: Array,
  },
  shopId: {
    type: String,
  },
  status: {
    type: String,
    default: 'ordered',
  },
  orderStatus: {
    type: String,
    default: 'Pending',
  },
  approvalStatus: {
    type: String,
    default: 'Pending',
  },
  orderId: {
    type: String,
  },
  name: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  pincode: {
    type: String,
  },
  address: {
    type: String,
  },
  Amount: {
    type: Number,
  },
  bookingtype: {
    type: String,
  },
  totalAmount: {
    type: Number,
  },
  userId: {
    type: String,
  },
});

const Demoorder = mongoose.model('demoorder', Demoorderschema);

const Demoorderproductschema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  DateIso: {
    type: Number,
  },
  date: {
    type: String,
  },
  created: {
    type: Date,
  },
  time: {
    type: Number,
  },
  orderId: {
    type: String,
  },
  postId: {
    type: String,
  },
  productId: {
    type: String,
  },
  purchase_price: {
    type: Number,
  },
  purchase_quantity: {
    type: Number,
  },
  shopId: {
    type: String,
  },
  streamId: {
    type: String,
  },
  status: {
    type: String,
    default: 'Pending',
  },
  streamPostId: {
    type: String,
  },
});

const Demoorderproduct = mongoose.model('demoorderproduct', Demoorderproductschema);

const Demostreamchema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  dateISO: {
    type: Number,
  },
  date: {
    type: Number,
  },
  expired: {
    type: Boolean,
    default: false,
  },
  appID: {
    type: String,
  },
  expirationTimestamp: {
    type: Number,
  },
  streamID: {
    type: String,
  },
  type: {
    type: String,
  },
  uid: {
    type: Number,
  },
  token: {
    type: String,
  },
  channel: {
    type: String,
  },
  userID: {
    type: String,
  },
  status: {
    type: String,
  },
  golive: {
    type: Boolean,
    default: false,
  },
  usertype: {
    type: String,
  },
  live: {
    type: Boolean,
    default: false,
  },
  raise_hands: {
    type: Boolean,
    default: false
  }
});

const DemostreamToken = mongoose.model('demostreamtoken', Demostreamchema);

const Democartchame = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  DateIso: {
    type: Number,
  },
  date: {
    type: String,
  },
  created: {
    type: Date,
  },
  time: {
    type: Number,
  },
  streamId: {
    type: String,
  },
  cart: {
    type: Array,
  },
  shopId: {
    type: String,
  },
  status: {
    type: String,
    default: 'Pending',
  },
  proceed_To_Pay: {
    type: String,
  },
  startTime: {
    type: Number,
  },
  endTime: {
    type: Number,
  },
  userId: {
    type: String,
  },
});

const Democart = mongoose.model('democart', Democartchame);

const Democartproductschema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  DateIso: {
    type: Number,
  },
  categoryId: {
    type: String,
  },
  created: {
    type: String,
  },
  image: {
    type: String,
  },
  incrementalLots: {
    type: Number,
  },
  marketPlace: {
    type: Number,
  },
  offerPrice: {
    type: Number,
  },
  postLiveStreamingPirce: {
    type: Number,
  },
  productTitle: {
    type: String,
  },
  minLots: {
    type: Number,
  },
  suppierId: {
    type: String,
  },
  cartQTY: {
    type: Number,
  },
  productId: {
    type: String,
  },
  bookingAmount: {
    type: String,
  },
  streamPostId: {
    type: String,
  },
  streamrequestpostId: {
    type: String,
  },
  streamingCart: {
    type: String,
  },
  cardStatus: {
    type: Boolean,
    default: true,
  },
  add_to_cart: {
    type: Boolean,
  },
  quantity: {
    type: Number,
  },
  proceed_To_Pay: {
    type: String,
  },
  startTime: {
    type: Number,
  },
  endTime: {
    type: Number,
  },
  userId: {
    type: String,
  },
});

const Democartproduct = mongoose.model('democartproduct', Democartproductschema);

const streamingPaymant = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  DateIso: {
    type: Number,
  },
  date: {
    type: String,
  },
  created: {
    type: Date,
  },
  time: {
    type: Number,
  },
  paidAmt: {
    type: Number,
  },
  type: {
    type: String,
  },
  orderId: {
    type: String,
  },
  uid: {
    type: String,
  },
  payment: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
  archive: {
    type: Boolean,
    default: false,
  },
  pay_type: {
    type: String,
  },
  paymentMethod: {
    type: String,
  },
  paymentstutes: {
    type: String,
  },
  RE_order_Id: {
    type: String,
  },
  reorder_status: {
    type: Boolean,
  },
  creditBillStatus: {
    type: String,
  },
  reasonScheduleOrDate: {
    type: String,
  },
  creditID: {
    type: String,
  },
  Schedulereason: {
    type: String,
  },
  creditApprovalStatus: {
    type: String,
    default: 'Pending',
  },
  onlinepaymentId: {
    type: String,
  },
  onlineorderId: {
    type: String,
  },
  paymentTypes: {
    type: String,
    default: 'offline',
  },
  paymentGatway: {
    type: String,
  },
  shopId: {
    type: String,
  },
  streamId: {
    type: String,
  },
  bookingtype: {
    type: String,
  },
  totalAmount: {
    type: Number,
  },
});
const Demopaymnt = mongoose.model('demopayment', streamingPaymant);

const demointrestedschema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  DateIso: {
    type: Number,
  },
  date: {
    type: String,
  },
  created: {
    type: Date,
  },
  time: {
    type: Number,
  },
  productID: {
    type: String,
  },
  streamID: {
    type: String,
  },
  userID: {
    type: String,
  },
  joinedUSER: {
    type: String,
  },
  intrested: {
    type: Boolean,
  },
});
const DemoInstested = mongoose.model('demointrested', demointrestedschema);

const demosavedproductschema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  DateIso: {
    type: Number,
  },
  date: {
    type: String,
  },
  created: {
    type: Date,
  },
  time: {
    type: Number,
  },
  productID: {
    type: String,
  },
  streamID: {
    type: String,
  },
  userID: {
    type: String,
  },
  joinedUSER: {
    type: String,
  },
  saved: {
    type: Boolean,
  },
});
const Demosavedproduct = mongoose.model('demosavedproduct', demosavedproductschema);

const demootp = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  DateIso: {
    type: Number,
  },
  date: {
    type: String,
  },
  created: {
    type: Date,
  },
  mobile: {
    type: Number,
  },
  streamID: {
    type: String,
  },
  userID: {
    type: String,
  },
  OTP: {
    type: Number,
  },
  verify: {
    type: Boolean,
    default: true,
  },
  expired: {
    type: Boolean,
    default: true,
  },
  otpExpiedTime: {
    type: Number,
  },
});
const Demootpverify = mongoose.model('demootp', demootp);

const democloud_record = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  token: {
    type: String,
  },
  date: {
    type: String,
  },
  created: {
    type: Date,
  },
  time: {
    type: Number,
  },
  expDate: {
    type: Number,
  },
  created_num: {
    type: Number,
  },
  participents: {
    type: Number,
  },
  chennel: {
    type: String,
  },
  Uid: {
    type: Number,
  },
  type: {
    type: String,
  },
  hostId: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
  archived: {
    type: Boolean,
    default: false,
  },
  cloud_recording: {
    type: String,
  },
  uid_cloud: {
    type: Number,
  },
  cloud_id: {
    type: String,
  },
  store: {
    type: String,
  },
  supplierId: {
    type: String,
  },
  streamId: {
    type: String,
  },
  shopId: {
    type: String,
  },
  Duration: {
    type: Number,
  },
  joinedUser: {
    type: String,
  },
  resourceId: {
    type: String,
  },
  sid: {
    type: String,
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  videoLink: {
    type: String,
  },
  videoLink_obj: {
    type: Array,
  },
  recoredStart: {
    type: String,
    default: 'Pending',
  },
  video: {
    type: Boolean,
    default: true,
  },
  audio: {
    type: Boolean,
    default: true,
  },
  video: {
    type: Boolean,
    default: true,
  },
  allMedia: {
    type: Boolean,
    default: true,
  },
  mainhostLeave: {
    type: Boolean,
    default: false,
  },
  bigSize: {
    type: Boolean,
    default: false,
  },
  convertedVideo: {
    type: String,
    default: 'Pending',
  },
  convertStatus: {
    type: String,
    default: 'Pending',
  },
});

const FeedBackSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    How_did_You_find_the_demo: {
      type: String,
      default: 'Not_Answer',
    },
    Will_you_Decide_to_Buy_Participate: {
      type: String,
      default: 'Not_Answer',
    },
    Did_you_find_difficulty_in_the_demo_Flow: {
      type: String,
      default: 'Not_Answer',
    },
    If_yes: {
      type: String,
      default: 'Not_Answer',
    },
    Do_you_find_the_product_innovative: {
      type: String,
      default: 'Not_Answer',
    },
    Do_you_assume_that_the_Service_would_solve_some_of_your_existing_marketing_Branding_Problems: {
      type: String,
      default: 'Not_Answer',
    },
    Did_your_Request_for_DEMO_Attended_by_our_executive_smoothly: {
      type: String,
      default: 'Not_Answer',
    },
    Rate_the_Remo: {
      type: String,
      default: 'Not_Answer',
    },
    Feedback: {
      type: String,
      default: 'Not_Answer',
    },
    streamID: {
      type: String,
    },
    userID: {
      type: String,
    },
  },
  { timestamps: true }
);

const Feedback = mongoose.model('demofeedback', FeedBackSchema);

const TechIssueSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    Logi_name: {
      type: String,
      default: 'Not_Answer',
    },
    Mobile_number: {
      type: String,
      default: 'Not_Answer',
    },
    Issue_type: {
      type: String,
      default: 'Not_Answer',
    },
    Issue_description: {
      type: String,
      default: 'Not_Answer',
    },
    Others: {
      type: String,
      default: 'Not_Answer',
    },
    issueId: {
      type: String,
    },
    userId: {
      type: String,
    },
    streamID: {
      type: String,
    },
    status: {
      type: String,
      default: 'Pending',
    },
  },
  { timestamps: true }
);

const TechIssue = mongoose.model('demotechissue', TechIssueSchema);

const Democloudrecord = mongoose.model('democloundrecord', democloud_record);



const Demorequstshema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    streamID: {
      type: String,
    },
    userID: {
      type: String,
    },
    name: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    location: {
      type: String,
    },
    userID: {
      type: String,
    },
    dateISO: {
      type: Number,
    },
    streamID: {
      type: String,
    }
  },
  { timestamps: true }
);

const Demorequest = mongoose.model('demorequest', Demorequstshema);






const demoraisehandsshema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    streamID: {
      type: String,
    },
    userID: {
      type: String,
    },
    dateISO: {
      type: Number,
    },
    joineID: {
      type: String,
    },
    joinLive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Demoraisehands = mongoose.model('demoraisehands', demoraisehandsshema);


module.exports = {
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
};
