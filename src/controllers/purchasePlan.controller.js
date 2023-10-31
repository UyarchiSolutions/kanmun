const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const purchasePlan = require('../services/purchasePlan.service');

const create_purchase_plan = catchAsync(async (req, res) => {
  const value = await purchasePlan.create_purchase_plan(req);
  if (!value) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order Not Created');
  }
  res.status(httpStatus.CREATED).send(value);
});

const create_purchase_plan_private = catchAsync(async (req, res) => {
  const value = await purchasePlan.create_purchase_plan_private(req);
  if (!value) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order Not Created');
  }
  res.status(httpStatus.CREATED).send(value);
});

const create_purchase_plan_addon = catchAsync(async (req, res) => {
  const value = await purchasePlan.create_purchase_plan_addon(req);
  if (!value) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order Not Created');
  }
  res.status(httpStatus.CREATED).send(value);
});

const get_order_details = catchAsync(async (req, res) => {
  const value = await purchasePlan.get_order_details(req);
  if (!value) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order Not Created');
  }
  res.status(httpStatus.CREATED).send(value);
});

const get_all_my_orders = catchAsync(async (req, res) => {
  const value = await purchasePlan.get_all_my_orders(req);
  if (!value) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order Not Created');
  }
  res.status(httpStatus.CREATED).send(value);
});

const get_all_my_orders_normal = catchAsync(async (req, res) => {
  const value = await purchasePlan.get_all_my_orders_normal(req);
  if (!value) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order Not Created');
  }
  res.status(httpStatus.CREATED).send(value);
});

const get_all_purchasePlans = catchAsync(async (req, res) => {
  const value = await purchasePlan.get_all_purchasePlans(req);
  if (!value) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order Not Created');
  }
  res.status(httpStatus.CREATED).send(value);
});

const create_PurchasePlan_EXpo = catchAsync(async (req, res) => {
  let userId = req.userId;
  const value = await purchasePlan.create_PurchasePlan_EXpo(req.body.planId, userId);
  res.send(value);
});

const create_PurchasePlan_EXpo_Admin = catchAsync(async (req, res) => {
  let userId = req.body.userId;
  const value = await purchasePlan.create_PurchasePlan_EXpo_Admin(req.body, userId);
  res.send(value);
});

const getPurchasedPlan = catchAsync(async (req, res) => {
  let userId = req.userId;
  const value = await purchasePlan.getPurchasedPlan(userId);
  res.send(value);
});

const updatePurchasedPlan = catchAsync(async (req, res) => {
  let userId = req.userId;

  const value = await purchasePlan.updatePurchasedPlan(req.params.id, req.body, userId);
  res.send(value);
});

const updatePurchasedPlanById = catchAsync(async (req, res) => {
  const values = await purchasePlan.updatePurchasedPlanById(req.params.id, req.body);
  res.send(values);
});

const updatePurchase_admin = catchAsync(async (req, res) => {
  const values = await purchasePlan.updatePurchase_admin(req.params.id, req.body);
  res.send(values);
});

const get_All_Planes = catchAsync(async (req, res) => {
  const value = await purchasePlan.get_All_Planes(req.params.page);
  res.send(value);
});

const ChangePurchasedPlan = catchAsync(async (req, res) => {
  const values = await purchasePlan.ChangePurchasedPlan(req.params.id, req.body);
  res.send(values);
});

const UploadProof = catchAsync(async (req, res) => {
  const data = await purchasePlan.UploadProof(req.params.id, req);
  res.send(data);
});

const getPlanyById = catchAsync(async (req, res) => {
  const data = await purchasePlan.getPlanyById(req.params.id);
  res.send(data);
});

const Approve_Reject = catchAsync(async (req, res) => {
  const data = await purchasePlan.Approve_Reject(req.params.id, req.body);
  res.send(data);
});

const getPlanDetailsByUser = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await purchasePlan.getPlanDetailsByUser(userId);
  res.send(data);
});

const getuserAvailablePlanes = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await purchasePlan.getuserAvailablePlanes(req.params.id, userId);
  res.send(data);
});

const getPlanes_Request_Streams = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await purchasePlan.getPlanes_Request_Streams(userId);
  res.send(data);
});

const get_All_Purchased_Plan = catchAsync(async (req, res) => {
  const data = await purchasePlan.get_All_Purchased_Plan(req.params.page);
  res.send(data);
});

const streamPlanById = catchAsync(async (req, res) => {
  const data = await purchasePlan.streamPlanById(req.params.id);
  res.send(data);
});

const getPurchased_ByPlanId = catchAsync(async (req, res) => {
  const data = await purchasePlan.getPurchased_ByPlanId(req.params.id, req.params.page);
  res.send(data);
});

const getStreamByUserAndPlan = catchAsync(async (req, res) => {
  const data = await purchasePlan.getStreamByUserAndPlan(req.params.user, req.params.plan);
  res.send(data);
});

const getPlanesByUser = catchAsync(async (req, res) => {
  const data = await purchasePlan.getPlanesByUser(req.userId);
  res.send(data);
});

const getPurchasedPlanById = catchAsync(async (req, res) => {
  const data = await purchasePlan.getPurchasedPlanById(req.params.id);
  res.send(data);
});

const getPurchasedPlanPayment = catchAsync(async (req, res) => {
  const data = await purchasePlan.getPurchasedPlanPayment(req.query);
  res.send(data);
});

const create_PlanPayment = catchAsync(async (req, res) => {
  const data = await purchasePlan.create_PlanPayment(req.body);
  res.send(data);
});

const get_Payment_ById = catchAsync(async (req, res) => {
  const data = await purchasePlan.get_Payment_ById(req.params.id);
  res.send(data);
});

const createExpoAd = catchAsync(async (req, res) => {
  const data = await purchasePlan.createExpoAd(req.body);
  res.send(data);
});

const uploadAdById = catchAsync(async (req, res) => {
  const data = await purchasePlan.uploadAdById(req.params.id, req);
  res.send(data);
});

const getAllAds = catchAsync(async (req, res) => {
  const data = await purchasePlan.getAllAds();
  res.send(data);
});

const createAdPlan = catchAsync(async (req, res) => {
  const data = await purchasePlan.createAdPlan(req.body);
  res.send(data);
});

const getAll_Ad_Planes = catchAsync(async (req, res) => {
  const data = await purchasePlan.getAll_Ad_Planes();
  res.send(data);
});

const updateAdPlanBtId = catchAsync(async (req, res) => {
  const data = await purchasePlan.updateAdPlanBtId(req.params.id, req.body);
  res.send(data);
});

const getPayment_Details_ByPlan = catchAsync(async (req, res) => {
  const data = await purchasePlan.getPayment_Details_ByPlan(req.params.id);
  res.send(data);
});

const getMyPurchasedPlan = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await purchasePlan.getMyPurchasedPlan(userId);
  res.send(data);
});

const plan_payment_link_generate = catchAsync(async (req, res) => {
  const data = await purchasePlan.plan_payment_link_generate(req);
  res.send(data);
});
const get_payment_link = catchAsync(async (req, res) => {
  const data = await purchasePlan.get_payment_link(req);
  res.send(data);
});

const paynow_payment = catchAsync(async (req, res) => {
  const data = await purchasePlan.paynow_payment(req);
  res.send(data);
});

const get_purchase_links = catchAsync(async (req, res) => {
  const data = await purchasePlan.get_purchase_links(req);
  res.send(data);
});

const userPayment = catchAsync(async (req, res) => {
  const data = await purchasePlan.userPayment(req.body);
  res.send(data);
});

const getPaymentDetails = catchAsync(async (req, res) => {
  const data = await purchasePlan.getPaymentDetails(req.params.id);
  res.send(data);
});

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
  userPayment,
  getPaymentDetails,
};
