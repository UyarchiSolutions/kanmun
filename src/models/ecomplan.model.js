const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');
const streamplanschema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  active: {
    type: Boolean,
    default: true,
  },
  archive: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
  },
  DateIso: {
    type: Number,
  },
  planName: {
    type: String,
  },
  Duration: {
    type: Number,
  },
  DurationType: {
    type: String,
  },
  numberOfParticipants: {
    type: Number,
  },
  numberofStream: {
    type: Number,
  },
  validityofplan: {
    type: Number,
  },
  additionalDuration: {
    type: String,
  },
  additionalParticipants: {
    type: String,
  },
  DurationIncrementCost: {
    type: Number,
  },
  noOfParticipantsCost: {
    type: Number,
  },
  chatNeed: {
    type: String,
  },
  commision: {
    type: String,
  },
  commition_value: {
    type: Number,
  },
  regularPrice: {
    type: Number,
  },
  salesPrice: {
    type: Number,
  },
  max_post_per_stream: {
    type: Number,
  },
  planType: {
    type: String,
  },
  description: {
    type: String,
  },
  planmode: {
    type: String,
  },
  streamvalidity: {
    type: Number,
    default: 30,
  },
  no_of_host: {
    type: Number,
  },
  slotInfo: {
    type: Array,
  },
  date: {
    type: String,
  },
  Teaser: {
    type: String,
  },
  Pdf: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  PostCount: {
    type: Number,
  },
  chat_Option: {
    type: String,
  },
  RaiseHands: {
    type: String,
  },
  No_of_host: {
    type: Number,
  },
  salesCommission: {
    type: String,
  },
  Special_Notification: {
    type: String,
  },
  StreamVideos: {
    type: String,
  },
  completedStream: {
    type: String,
  },
  Advertisement_Display: {
    type: String,
  },
  Price: {
    type: Number,
  },
  Transtraction: {
    type: String,
  },
  BankName: {
    type: String,
  },
  PaymentMethod: {
    type: String,
  },
  AccNo: {
    type: String,
  },
  TransactionId: {
    type: String,
  },
  ChequeDDNo: {
    type: String,
  },
  ChequeDDdate: {
    type: String,
  },
  transaction: {
    type: String,
  },
  offer_price: {
    type: Number,
  },
  stream_validity: {
    type: Number,
  },
  Interest_View_Count: {
    type: String,
  },
  No_of_Limitations: {
    type: Number,
  },
  Service_Charges: {
    type: Number,
  },
  TimeType: {
    type: String,
  },
  raisehandcontrol: {
    type: String,
  },
  timeline: {
    type: Array,
    default: [],
  }
});

const Streamplan = mongoose.model('streamplan', streamplanschema);

const streamPostschema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  active: {
    type: Boolean,
    default: true,
  },
  archive: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
  },
  unit: {
    type: String,
  },
  DateIso: {
    type: Number,
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
  postLiveStreamingPirce: {
    type: Number,
  },
  validity: {
    type: Number,
  },
  DateIso: {
    type: Number,
  },
  minLots: {
    type: Number,
  },
  incrementalLots: {
    type: Number,
  },
  productId: {
    type: String,
  },
  categoryId: {
    type: String,
  },
  suppierId: {
    type: String,
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  validityType: {
    type: String,
  },
  location: {
    type: String,
  },
  discription: {
    type: String,
  },
  images: {
    type: Array,
  },
  video: {
    type: String,
  },
  afterStreaming: {
    type: String,
  },
  streamStart: {
    type: Number,
  },
  hours: {
    type: Number,
  },
  minutes: {
    type: Number,
  },
  second: {
    type: Number,
  },
  bookingAmount: {
    type: String,
  },
  status: {
    type: String,
    default: 'Active',
  },
  uploadStreamVideo: {
    type: String,
  },
  newVideoUpload: {
    type: String,
    default: 'Pending',
  },
  videoTime: {
    type: Boolean,
    default: false,
  },
  define_QTY: {
    type: Number,
  },
  define_UNIT: {
    type: String,
  },
  booking_charge: {
    type: String,
  },
  booking_percentage: {
    type: Number,
  },
  pack_discription: {
    type: String,
  },
  dispatchPincode: {
    type: Number,
  },
  transaction: {
    type: String,
  },
  dispatchLocation: {
    type: String,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  purchase_limit: {
    type: String,
  },
  max_purchase_value: {
    type: String,
  },
  pruductreturnble: {
    type: String,
  },
  return_policy: {
    type: String,
  },
  showImage: {
    type: String,
  },
  timeline: {
    type: Array,
    default: [],
  },
  showPost: {
    type: Boolean,
    default: true
  }
});

const StreamPost = mongoose.model('Streampost', streamPostschema);

const streamRequestschema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  active: {
    type: Boolean,
    default: true,
  },
  archive: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
  },
  DateIso: {
    type: Number,
  },
  quantity: {
    type: Number,
  },
  suppierId: {
    type: String,
  },
  post: {
    type: Array,
  },
  communicationMode: {
    type: Array,
  },
  primarycommunication: {
    type: String,
  },
  secondarycommunication: {
    type: String,
  },
  streamingDate: {
    type: String,
  },
  streamingTime: {
    type: String,
  },
  streamingDate_time: {
    type: String,
  },
  image: {
    type: String,
  },
  teaser: {
    type: String,
  },
  postCount: {
    type: Number,
  },
  sepTwo: {
    type: String,
    default: 'Pending',
  },
  planId: {
    type: String,
  },
  streamName: {
    type: String,
  },
  discription: {
    type: String,
  },
  adminApprove: {
    type: String,
    default: 'Pending',
  },
  tokenDetails: {
    type: String,
  },
  activelive: {
    type: String,
    default: 'Pending',
  },
  tokenGeneration: {
    type: Boolean,
    default: false,
  },
  Duration: {
    type: Number,
  },
  startTime: {
    type: Number,
  },
  endTime: {
    type: Number,
  },
  noOfParticipants: {
    type: Number,
  },
  chat: {
    type: String,
  },
  max_post_per_stream: {
    type: Number,
  },
  goLive: {
    type: Boolean,
    default: false,
  },
  brouchers: {
    type: String,
  },
  // afterStreaming: {
  //   type: String,
  //   default: false,
  // }
  audio: {
    type: Boolean,
    default: false,
  },
  video: {
    type: Boolean,
    default: false,
  },
  chat_need: {
    type: String,
  },
  allot_chat: {
    type: String,
  },
  allot_host_1: {
    type: String,
  },
  allot_host_2: {
    type: String,
  },
  allot_host_3: {
    type: String,
  },
  allot: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
  },
  streamEnd_Time: {
    type: Number,
  },
  end_Status: {
    type: String,
  },
  videoconvertStatus: {
    type: String,
    default: 'Pending',
  },
  agoraID: {
    type: String,
  },
  totalMinues: {
    type: Number,
  },
  slotId: {
    type: String,
  },
  bookingslotId: {
    type: String,
  },
  Location: {
    type: String,
  },
  PumpupView: {
    type: Number,
  },
  uploadDate: {
    type: Number,
  },
  uploadLink: {
    type: String,
  },
  uploadStatus: {
    type: String,
    default: 'Pending',
  },
  shortsuploadStatus: {
    type: String,
    default: 'Pending',
  },
  transaction: {
    type: String,
  },
  selectvideo: {
    type: String,
  },
  showLink: {
    type: String,
  },
  show_completd: {
    type: Boolean,
    default: false,
  },
  raise_hands: {
    type: Boolean,
    default: false,
  },
  current_raise: {
    type: String,
  },
  streamPlanId: {
    type: String,
  },
  uploatedBy: {
    type: String,
  },
  updatedBy_id: {
    type: String,
  },
  completed_stream: {
    type: String,
  },
  completed_stream_by: {
    type: String,
  },
  broucher: {
    type: String,
  },
  completedStream: {
    type: String,
  },
  streamExpire: {
    type: Number,
  },
  Service_Charges: {
    type: Number,
  },
  Interest_View_Count: {
    type: String,
  },
  No_of_Limitations: {
    type: Number,
  },
  removedBy: {
    type: String,
  },
  removedBy_id: {
    type: String,
  },
  broucherName: {
    type: String,
  },
  timeline: {
    type: Array,
    default: [],
  },
  streamCurrent_Watching: {
    type: Number,
    default: 0
  },
  showStream: {
    type: Boolean,
    default: true
  },
  shortsLink: {
    type: String,
  },
  shortsUploadTime: {
    type: Number,
  },
  join_users: {
    type: Array,
    default: []
  },
  Current_join: {
    type: Array,
    default: []
  }
});

const Streamrequest = mongoose.model('StreamRequest', streamRequestschema);

const streamRequestschema_post = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  active: {
    type: Boolean,
    default: true,
  },
  archive: {
    type: Boolean,
    default: false,
  },
  postId: {
    type: String,
  },
  streamRequest: {
    type: String,
  },
  created: {
    type: Date,
  },
  DateIso: {
    type: Number,
  },
  suppierId: {
    type: String,
  },
  tokenDetails: {
    type: String,
  },
  status: {
    type: String,
    default: 'Pending',
  },
  timeline: {
    type: Array,
    default: [],
  }
});

const StreamrequestPost = mongoose.model('StreamRequestpost', streamRequestschema_post);

const streamPreRegister = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  active: {
    type: Boolean,
    default: true,
  },
  archive: {
    type: Boolean,
    default: false,
  },
  streamId: {
    type: String,
  },
  shopId: {
    type: String,
  },
  created: {
    type: Date,
  },
  DateIso: {
    type: Number,
  },
  status: {
    type: String,
    default: 'Registered',
  },
  streamCount: {
    type: Number,
  },
  eligible: {
    type: Boolean,
    default: false,
  },
  viewstatus: {
    type: String,
  },
  timeline: {
    type: Array,
    default: [],
  }
});

const StreamPreRegister = mongoose.model('streampreregister', streamPreRegister);

const streamPlanlinkschema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  active: {
    type: Boolean,
    default: true,
  },
  archive: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
  },
  DateIso: {
    type: Number,
  },
  status: {
    type: String,
    default: 'created',
  },
  supplier: {
    type: String,
  },
  plan: {
    type: String,
  },
  expireMinutes: {
    type: Number,
  },
  token: {
    type: String,
  },
  expireTime: {
    type: Number,
  },
  purchaseId: {
    type: String,
  },
  timeline: {
    type: Array,
    default: [],
  }
});

const streamPlanlink = mongoose.model('streamplanlink', streamPlanlinkschema);

const Slabschema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  active: {
    type: Boolean,
    default: true,
  },
  archive: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
  },
  DateIso: {
    type: Number,
  },
  status: {
    type: String,
    default: 'created',
  },
  formAmount: {
    type: Number,
  },
  endAmount: {
    type: Number,
  },
  slabPercentage: {
    type: Number,
  },
  timeline: {
    type: Array,
    default: [],
  }
});

const Slab = mongoose.model('slabdetails', Slabschema);

const shopNotificationschema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  active: {
    type: Boolean,
    default: true,
  },
  archive: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
  },
  DateIso: {
    type: Number,
  },
  status: {
    type: String,
    default: 'created',
  },
  type: {
    type: String,
  },
  shopId: {
    type: String,
  },
  streamId: {
    type: String,
  },
  streamName: {
    type: String,
  },
  streamRegister: {
    type: String,
  },
  streamObject: {
    type: Object,
  },
  streamRegisterobject: {
    type: Object,
  },
  title: {
    type: String,
  },
  timeline: {
    type: Array,
    default: [],
  }
});

const shopNotification = mongoose.model('shopNotification', shopNotificationschema);

const PlanSlotSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    slotType: {
      type: String,
    },
    Duration: {
      type: Number,
    },
    No_Of_Slot: {
      type: String,
    },
    streamPlanId: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    slotId: {
      type: String,
    },
    timeline: {
      type: Array,
      default: [],
    }
  },
  { timestamps: true }
);

const PlanSlot = mongoose.model('planslot', PlanSlotSchema);

const intrestedschema = mongoose.Schema({
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
  intrested: {
    type: Boolean,
  },
  timeline: {
    type: Array,
    default: [],
  }
});
const Instestedproduct = mongoose.model('intrestedproduct', intrestedschema);

const savedproductschema = mongoose.Schema({
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
  saved: {
    type: Boolean,
  },
  timeline: {
    type: Array,
    default: [],
  }
});
const Savedproduct = mongoose.model('savedproduct', savedproductschema);

const NotifySchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    ExhibitorId: {
      type: String,
    },
    VisitorId: {
      type: String,
    },
    notify: {
      type: Boolean,
    },
    timeline: {
      type: Array,
      default: [],
    }
  },
  { timestamps: true }
);

const Notify = mongoose.model('Notify', NotifySchema);

const streampostpriceschema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
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
    streampostId: {
      type: String,
    },
    streamId: {
      type: String,
    },
    incrementalLots: {
      type: Number,
    },
    minLots: {
      type: Number,
    },
    createdBy: {
      type: String,
    },
    edited_qty: {
      type: String,
    },
    purchased_qty: {
      type: String,
    },
    timeline: {
      type: Array,
      default: [],
    }
  },
  { timestamps: true }
);

const Streampostprice = mongoose.model('streampostprice', streampostpriceschema);
module.exports = {
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
};
