const mongoose = require('mongoose');
const { v4 } = require('uuid');
const moment = require('moment');

const purchasePlanSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    planId: {
      type: String,
    },
    suppierId: {
      type: String,
    },
    created: {
      type: Date,
    },
    DateIso: {
      type: Number,
    },
    paidAmount: {
      type: Number,
    },
    paymentStatus: {
      type: String,
    },
    order_id: {
      type: String,
    },
    razorpay_order_id: {
      type: String,
    },
    razorpay_payment_id: {
      type: String,
    },
    razorpay_signature: {
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
    numberOfStreamused: {
      type: Number,
      default: 0,
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
    Duration: {
      type: Number,
    },
    planType: {
      type: String,
      default: 'normal',
    },
    streamId: {
      type: String,
    },
    planName: {
      type: String,
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
    stream_expire_hours: {
      type: Number,
    },
    stream_expire_days: {
      type: Number,
    },
    stream_expire_minutes: {
      type: Number,
    },
    regularPrice: {
      type: Number,
    },
    salesPrice: {
      type: Number,
    },

    description: {
      type: String,
    },
    planmode: {
      type: String,
    },
    expireDate: {
      type: Number,
    },
    streamvalidity: {
      type: Number,
      default: 30,
    },
    no_of_host: {
      type: Number,
    },
    Transtraction: {
      type: String,
    },
    Teaser: {
      type: String,
    },
    StreamVideos: {
      type: String,
    },
    completedStream: {
      type: String,
    },
    Pdf: {
      type: String,
    },
    Paidimage: {
      type: String,
    },
    RaiseHands: {
      type: String,
    },
    Advertisement_Display: {
      type: String,
    },
    Special_Notification: {
      type: String,
    },
    Price: {
      type: String,
    },
    slotInfo: {
      type: Array,
    },
    status: {
      type: String,
      default: 'Pending',
    },
    PayementMode: {
      type: String,
    },
    TransactionId: {
      type: String,
    },
    image: {
      type: String,
    },
    FromBank: {
      type: String,
    },
    AccountNo: {
      type: String,
    },
    ChequeDDNo: {
      type: String,
    },
    ChequeDDdate: {
      type: String,
    },
    chat_Option: {
      type: String,
    },
    salesCommission: {
      type: String,
    },
    PostCount: {
      type: Number,
    },
    approvalDate: {
      type: Number,
    },
    Discount: {
      type: Number,
      default: 0,
    },
    RevisedAmount: {
      type: Number,
    },
    Referral: {
      type: String,
    },
    Tele_Caller: {
      type: String,
    },
    TelName: {
      type: String,
    },
    Type: {
      type: String,
    },
    PayementStatus: {
      type: String,
      default: 'Pending',
    },
    PaidAmount: {
      type: Number,
      default: 0,
    },
    referal: {
      type: String,
    },
    ccavenue: {
      type: String,
    },
    ccavenue_payment_id: {
      type: String,
    },
    transaction: {
      type: String,
    },
    paymentLink: {
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
    gst: {
      type: Number,
    },
    totalAmount: {
      type: Number,
    },
    userPaymentRequest: {
      type: Array,
    },
  },
  { timestamps: true }
);

const purchasePlan = mongoose.model('purchasedPlans', purchasePlanSchema);

const PlanPaymentSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    PlanId: {
      type: String,
    },
    userId: {
      type: String,
    },
    Amount: {
      type: Number,
    },
    PaymentMode: {
      type: String,
    },
    BankName: {
      type: String,
    },
    utrNo: {
      type: String,
    },
    TransactionId: {
      type: String,
    },
    platform: {
      type: String,
    },
    chequeDD: {
      type: String,
    },
    chequeDD_Date: {
      type: String,
    },
    branchName: {
      type: String,
    },
    To: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    billId: {
      type: String,
    },
    status: {
      type: String,
      default: 'Pending',
    },
    link_status: {
      type: String,
      default: 'Pending',
    },
    link: {
      type: String,
    },
    orderId: {
      type: String,
    },
    type: {
      type: String,
    },
    ccavanue: {
      type: String,
    },
    paymetvalid: {
      type: Number,
    },
    paymentType: {
      type: String,
      default: 'online',
    },
    ccavenue: {
      type: Object,
    },
    ccavenueID: {
      type: String,
    },
  },
  { timestamps: true }
);
const PlanPayment = mongoose.model('agriplanPayment', PlanPaymentSchema);

const ExpoAdSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    adName: {
      type: String,
    },
    fileType: {
      type: String,
    },
    adImage: {
      type: String,
    },
    adtype: {
      type: String,
    },
    displayType: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const ExpoAd = mongoose.model('ExpoAd', ExpoAdSchema);

const AdPlanSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    PlanName: {
      type: String,
    },
    Ad: {
      type: String,
    },
    Price: {
      type: Number,
    },
    Offer_Price: {
      type: Number,
    },
    Total_Ads: {
      type: Number,
    },
    Display_Per_Day: {
      type: Number,
    },
    Display_Per_Stream: {
      type: Number,
    },
    Stream_Type: {
      type: String,
    },
    Display_Mode: {
      type: String,
    },
    Ad_Duration: {
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
    ccavanue: {
      type: String,
    },
  },
  { timestamps: true }
);

const AdPlan = mongoose.model('ExpoAdPlan', AdPlanSchema);

const Paymentlinkchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    purchasePlan: {
      type: String,
    },
    link_Valid: {
      type: Number,
    },
    amount: {
      type: Number,
    },
    ccavanue: {
      type: String,
    },
    generatedBy: {
      type: String,
    },
    status: {
      type: String,
      default: 'Pending',
    },
  },
  { timestamps: true }
);

const PurchaseLink = mongoose.model('paymentlink', Paymentlinkchema);

module.exports = { purchasePlan, PlanPayment, ExpoAd, AdPlan, PurchaseLink, PurchaseLink };
