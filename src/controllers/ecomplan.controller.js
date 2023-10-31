const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const Ecomserive = require('../services/ecomplan.service');
const { EventContext } = require('twilio/lib/rest/monitor/v1/event');
const { Console } = require('winston/lib/winston/transports');

const create_Plans = catchAsync(async (req, res) => {
  const value = await Ecomserive.create_Plans(req);
  res.send(value);
});
const create_Plans_addon = catchAsync(async (req, res) => {
  const value = await Ecomserive.create_Plans_addon(req);
  res.send(value);
});
const get_all_Plans = catchAsync(async (req, res) => {
  const value = await Ecomserive.get_all_Plans(req);
  res.send(value);
});

const get_all_Plans_pagination = catchAsync(async (req, res) => {
  const value = await Ecomserive.get_all_Plans_pagination(req);
  res.send(value);
});

const get_all_Plans_addon = catchAsync(async (req, res) => {
  const value = await Ecomserive.get_all_Plans_addon(req);
  res.send(value);
});
const get_all_Plans_normal = catchAsync(async (req, res) => {
  const value = await Ecomserive.get_all_Plans_normal(req);
  res.send(value);
});
const get_one_Plans = catchAsync(async (req, res) => {
  const value = await Ecomserive.get_one_Plans(req);
  res.send(value);
});
const update_one_Plans = catchAsync(async (req, res) => {
  const value = await Ecomserive.update_one_Plans(req);
  res.send(value);
});
const delete_one_Plans = catchAsync(async (req, res) => {
  const value = await Ecomserive.delete_one_Plans(req);
  res.send(value);
});

const create_post = catchAsync(async (req, res) => {
  // let images = [];
  // if (req.files) {
  //   let path = '';
  //   path = 'images/';
  //   if (req.files.galleryImages != null) {
  //     req.files.galleryImages.forEach((e) => {
  //       images.push(path + e.filename);
  //     });
  //   }
  // }
  const value = await Ecomserive.create_post(req);
  res.send(value);
});
const create_post_teaser = catchAsync(async (req, res) => {
  const value = await Ecomserive.create_teaser_upload(req);
  res.send(value);
});
const get_all_post = catchAsync(async (req, res) => {
  const value = await Ecomserive.get_all_Post(req);
  res.send(value);
});

const get_all_post_transation = catchAsync(async (req, res) => {
  const value = await Ecomserive.get_all_post_transation(req);
  res.send(value);
});

const get_all_Post_with_page = catchAsync(async (req, res) => {
  let status = req.query.status;
  let value;
  if (status == 'Active' || status == 'Cancelled') {
    value = await Ecomserive.get_all_Post_with_page(req, status);
  }
  if (status == 'assigned') {
    value = await Ecomserive.get_all_Post_with_page_assigned(req);
  }
  if (status == 'live') {
    value = await Ecomserive.get_all_Post_with_page_live(req);
  }
  if (status == 'completed') {
    value = await Ecomserive.get_all_Post_with_page_completed(req);
  }
  if (status == 'exhausted') {
    value = await Ecomserive.get_all_Post_with_page_exhausted(req);
  }
  if (status == 'removed') {
    value = await Ecomserive.get_all_Post_with_page_removed(req);
  }
  if (status == 'all') {
    value = await Ecomserive.get_all_Post_with_page_all(req);
  }
  res.send(value);
});
const get_one_post = catchAsync(async (req, res) => {
  const value = await Ecomserive.get_one_Post(req);
  res.send(value);
});
const update_one_post = catchAsync(async (req, res) => {
  //console.log(req.files);
  // let images = [];
  // if (req.files) {
  //   let path = '';
  //   path = 'images/';
  //   if (req.files.galleryImages != null) {
  //     req.files.galleryImages.forEach((e) => {
  //       images.push(path + e.filename);
  //     });
  //   }
  // }
  const value = await Ecomserive.update_one_Post(req);
  res.send(value);
});
const delete_one_post = catchAsync(async (req, res) => {
  const value = await Ecomserive.delete_one_Post(req);
  res.send(value);
});

const remove_one_post = catchAsync(async (req, res) => {
  const value = await Ecomserive.remove_one_post(req);
  res.send(value);
});

const create_stream_one = catchAsync(async (req, res) => {
  const value = await Ecomserive.create_stream_one(req);
  res.send(value);
});

const find_and_update_one = catchAsync(async (req, res) => {
  const value = await Ecomserive.find_and_update_one(req);
  res.send(value);
});

const create_stream_one_image = catchAsync(async (req, res) => {
  //console.log('asdasasas');
  //console.log(req.file);
  const value = await Ecomserive.create_stream_one_image(req, 'image');
  res.send(value);
});

const create_stream_one_broucher = catchAsync(async (req, res) => {
  //console.log('asdasasas');
  //console.log(req.file);
  const value = await Ecomserive.create_stream_one_image(req, 'broucher');
  res.send(value);
});


const create_stream_one_video = catchAsync(async (req, res) => {
  //console.log('asdasasas');
  //console.log(req.file);
  const value = await Ecomserive.create_stream_one_video(req);
  res.send(value);
});

const create_stream_one_Broucher = catchAsync(async (req, res) => {
  const value = await Ecomserive.create_stream_one_Broucher(req);
  res.send(value);
});

const create_stream_two = catchAsync(async (req, res) => {
  const value = await Ecomserive.create_stream_two(req);
  res.send(value);
});
const get_all_stream = catchAsync(async (req, res) => {
  const value = await Ecomserive.get_all_stream(req);
  res.send(value);
});


const remove_post_stream= catchAsync(async (req, res) => {
  const value = await Ecomserive.remove_post_stream(req);
  res.send(value);
});

const get_one_stream = catchAsync(async (req, res) => {
  //console.log('asdaszas');
  const value = await Ecomserive.get_one_stream(req);
  res.send(value);
});

const get_one_stream_assign_host = catchAsync(async (req, res) => {
  //console.log('asdaszas');
  const value = await Ecomserive.get_one_stream_assign_host(req);
  res.send(value);
});

const get_one_stream_step_two = catchAsync(async (req, res) => {
  //console.log('zas');
  const value = await Ecomserive.get_one_stream_step_two(req);
  res.send(value);
});
const update_one_stream = catchAsync(async (req, res) => {
  const value = await Ecomserive.update_one_stream(req);
  res.send(value);
});
const update_one_stream_one = catchAsync(async (req, res) => {
  const value = await Ecomserive.update_one_stream_one(req);
  res.send(value);
});
const update_one_stream_two = catchAsync(async (req, res) => {
  const value = await Ecomserive.update_one_stream_two(req);
  res.send(value);
});
const delete_one_stream = catchAsync(async (req, res) => {
  const value = await Ecomserive.delete_one_stream(req);
  res.send(value);
});

const get_all_admin = catchAsync(async (req, res) => {
  const value = await Ecomserive.get_all_admin(req);
  res.send(value);
});
const update_approved = catchAsync(async (req, res) => {
  const value = await Ecomserive.update_approved(req);
  res.send(value);
});
const update_reject = catchAsync(async (req, res) => {
  const value = await Ecomserive.update_reject(req);
  res.send(value);
});

const get_all_streams = catchAsync(async (req, res) => {
  //console.log('sdas');
  const value = await Ecomserive.get_all_streams(req);
  res.send(value);
});
const only_chat_join = catchAsync(async (req, res) => {
  //console.log('sdas');
  const value = await Ecomserive.only_chat_join(req);
  res.send(value);
});

const only_chat_get = catchAsync(async (req, res) => {
  //console.log('sdas');
  const value = await Ecomserive.only_chat_get(req);
  res.send(value);
});
const get_subhost_streams = catchAsync(async (req, res) => {
  //console.log('sdas');
  const value = await Ecomserive.get_subhost_streams(req);
  res.send(value);
});
const allot_stream_subhost = catchAsync(async (req, res) => {
  //console.log('sdas');
  const value = await Ecomserive.allot_stream_subhost(req);
  res.send(value);
});

const cancel_stream = catchAsync(async (req, res) => {
  //console.log('sdas');
  const value = await Ecomserive.cancel_stream(req);
  res.send(value);
});

const remove_stream = catchAsync(async (req, res) => {
  //console.log('sdas');
  const value = await Ecomserive.remove_stream(req);
  res.send(value);
});

const remove_stream_admin = catchAsync(async (req, res) => {
  //console.log('sdas');
  const value = await Ecomserive.remove_stream_admin(req);
  res.send(value);
});

const end_stream = catchAsync(async (req, res) => {
  //console.log('sdas');
  const value = await Ecomserive.end_stream(req);
  res.send(value);
});

const go_live_stream_host = catchAsync(async (req, res) => {
  //console.log('sdas');
  const value = await Ecomserive.go_live_stream_host(req, req.userId);
  res.send(value);
});

const get_subhost_token = catchAsync(async (req, res) => {
  //console.log('sdas');
  const value = await Ecomserive.get_subhost_token(req, req.userId);
  res.send(value);
});

const go_live_stream_host_subhost = catchAsync(async (req, res) => {
  //console.log('sdas');
  const value = await Ecomserive.go_live_stream_host_SUBHOST(req, req.createdBy);
  res.send(value);
});

const get_watch_live_steams = catchAsync(async (req, res) => {
  //console.log('sdas');
  const value = await Ecomserive.get_watch_live_steams(req);
  res.send(value);
});

const get_watch_live_steams_upcoming = catchAsync(async (req, res) => {
  //console.log('sdas');
  const value = await Ecomserive.get_watch_live_steams_upcoming(req);
  res.send(value);
});

const get_watch_live_steams_current = catchAsync(async (req, res) => {
  //console.log('sdas');
  const value = await Ecomserive.get_watch_live_steams_current(req);
  res.send(value);
});

const get_watch_live_steams_upcoming_byid = catchAsync(async (req, res) => {
  //console.log('sdas');
  const value = await Ecomserive.get_watch_live_steams_upcoming_byid(req);
  res.send(value);
});

const get_watch_live_steams_interested = catchAsync(async (req, res) => {
  //console.log('sdas');
  const value = await Ecomserive.get_watch_live_steams_interested(req);
  res.send(value);
});
const get_watch_live_steams_completed = catchAsync(async (req, res) => {
  //console.log('sdas');
  const value = await Ecomserive.get_watch_live_steams_completed(req);
  res.send(value);
});

const get_watch_live_steams_admin_watch = catchAsync(async (req, res) => {
  //console.log('sdas');
  const value = await Ecomserive.get_watch_live_steams_admin_watch(req);
  res.send(value);
});

const get_watch_live_token = catchAsync(async (req, res) => {
  //console.log('sdas');
  const value = await Ecomserive.get_watch_live_token(req);
  res.send(value);
});

const getall_homeage_streams = catchAsync(async (req, res) => {
  //console.log('sdas');
  const value = await Ecomserive.getall_homeage_streams(req);
  res.send(value);
});
const on_going_stream = catchAsync(async (req, res) => {
  //console.log('sdas');
  const value = await Ecomserive.on_going_stream(req);
  res.send(value);
});
const regisetr_strean_instrest = catchAsync(async (req, res) => {
  //console.log('sdas');
  const value = await Ecomserive.regisetr_strean_instrest(req);
  res.send(value);
});

const unregisetr_strean_instrest = catchAsync(async (req, res) => {
  //console.log('sdas');
  const value = await Ecomserive.unregisetr_strean_instrest(req);
  res.send(value);
});

const purchase_details = catchAsync(async (req, res) => {
  //console.log('sdas');
  const value = await Ecomserive.purchase_details(req);
  res.send(value);
});

const purchase_details_supplier = catchAsync(async (req, res) => {
  const value = await Ecomserive.purchase_details_supplier(req);
  res.send(value);
});

const purchase_link_plan = catchAsync(async (req, res) => {
  const value = await Ecomserive.purchase_link_plan(req);
  res.send(value);
});

const purchase_link_plan_get = catchAsync(async (req, res) => {
  const value = await Ecomserive.purchase_link_plan_get(req);
  res.send(value);
});

const get_stream_post = catchAsync(async (req, res) => {
  const value = await Ecomserive.get_stream_post(req);
  res.send(value);
});
const get_stream_alert = catchAsync(async (req, res) => {
  const value = await Ecomserive.get_stream_alert(req);
  res.send(value);
});
const get_cancel_stream = catchAsync(async (req, res) => {
  const value = await Ecomserive.get_cancel_stream(req);
  res.send(value);
});

const get_completed_stream = catchAsync(async (req, res) => {
  let value;
  let status = req.query.status;
  if (status == 'upcomming') {
    value = await Ecomserive.get_completed_stream_upcommming(req);
  }
  if (status == 'live') {
    value = await Ecomserive.get_completed_stream_live(req);
  }
  if (status == 'completed') {
    value = await Ecomserive.get_completed_stream_completed(req);
  }
  if (status == 'expired') {
    value = await Ecomserive.get_completed_stream_expired(req);
  }
  if (status == 'removed') {
    value = await Ecomserive.get_completed_stream_removed(req);
  }
  if (status == 'cancelled') {
    value = await Ecomserive.get_completed_stream_cancelled(req);
  }
  res.send(value);
});

const get_completed_stream_byid = catchAsync(async (req, res) => {
  const value = await Ecomserive.get_completed_stream_byid(req);
  res.send(value);
});
const get_completed_stream_buyer = catchAsync(async (req, res) => {
  const value = await Ecomserive.get_completed_stream_buyer(req);
  res.send(value);
});
const create_slab = catchAsync(async (req, res) => {
  const value = await Ecomserive.create_slab(req);
  res.send(value);
});

const get_by_slab = catchAsync(async (req, res) => {
  const value = await Ecomserive.get_by_slab(req);
  res.send(value);
});

const getallslab = catchAsync(async (req, res) => {
  const value = await Ecomserive.getallslab(req);
  res.send(value);
});


const getallslab_all = catchAsync(async (req, res) => {
  const value = await Ecomserive.getallslab_all(req);
  res.send(value);
});


const update_slab = catchAsync(async (req, res) => {
  const value = await Ecomserive.update_slab(req);
  res.send(value);
});

const getStock_Manager = catchAsync(async (req, res) => {
  const data = await Ecomserive.getStock_Manager(req);
  res.send(data);
});

const getPosted_Details_By_Stream = catchAsync(async (req, res) => {
  const data = await Ecomserive.getPosted_Details_By_Stream(req.params.id);
  res.send(data);
});

const fetchStream_Details_ById = catchAsync(async (req, res) => {
  const data = await Ecomserive.fetchStream_Details_ById(req.params.id);
  res.send(data);
});

const fetch_Stream_Ordered_Details = catchAsync(async (req, res) => {
  const data = await Ecomserive.fetch_Stream_Ordered_Details(req.params.id, req.query);
  res.send(data);
});

const update_Status_For_StreamingOrders = catchAsync(async (req, res) => {
  const data = await Ecomserive.update_Status_For_StreamingOrders(req.params.id, req.body);
  res.send(data);
});

const fetch_streaming_Details_Approval = catchAsync(async (req, res) => {
  const data = await Ecomserive.fetch_streaming_Details_Approval(req.query.post, req.query, req);
  res.send(data);
});

const update_approval_Status = catchAsync(async (req, res) => {
  const data = await Ecomserive.update_approval_Status(req.params.id, req.body);
  res.send(data);
});

const fetch_Stream_Details_For_Buyer = catchAsync(async (req, res) => {
  const data = await Ecomserive.fetch_Stream_Details_For_Buyer(req.shopId);
  res.send(data);
});

const update_Joined_User_Status_For_Buyer = catchAsync(async (req, res) => {
  const data = await Ecomserive.update_Joined_User_Status_For_Buyer(req.params.id, req.body);
  res.send(data);
});

const fetch_Stream_Product_Details = catchAsync(async (req, res) => {
  const data = await Ecomserive.fetch_Stream_Product_Details(req.params.id);
  res.send(data);
});

const fetch_stream_Payment_Details = catchAsync(async (req, res) => {
  const data = await Ecomserive.fetch_stream_Payment_Details(req.params.id);
  res.send(data);
});

const update_Multiple_approval_Status = catchAsync(async (req, res) => {
  //console.log(req.body);
  const data = await Ecomserive.update_Multiple_approval_Status(req.body);
  res.send(data);
});

const update_productOrders = catchAsync(async (req, res) => {
  const data = await Ecomserive.update_productOrders(req.params.id, req.body);
  res.send(data);
});

const update_Multiple_productOrders = catchAsync(async (req, res) => {
  const data = await Ecomserive.update_Multiple_productOrders(req.body);
  res.send(data);
});

const Fetch_Streaming_Details_By_buyer = catchAsync(async (req, res) => {
  let userId = req.shopId;
  const data = await Ecomserive.Fetch_Streaming_Details_By_buyer(userId);
  res.send(data);
});

const getStreaming_orders_By_orders = catchAsync(async (req, res) => {
  const data = await Ecomserive.getStreaming_orders_By_orders(req.params.id);
  res.send(data);
});

const getStreaming_orders_By_orders_for_pay = catchAsync(async (req, res) => {
  const data = await Ecomserive.getStreaming_orders_By_orders_for_pay(req.params.id);
  res.send(data);
});

const multipleCancel = catchAsync(async (req, res) => {
  const data = await Ecomserive.multipleCancel(req.body);
  res.send(data);
});

const getOrder_For_Account_Manager = catchAsync(async (req, res) => {
  const data = await Ecomserive.getOrder_For_Account_Manager(req.params.id);
  res.send(data);
});

const getDetails = catchAsync(async (req, res) => {
  const data = await Ecomserive.getDetails(req.params.id);
  res.send(data);
});

const get_notification_count = catchAsync(async (req, res) => {
  const data = await Ecomserive.get_notification_count(req);
  res.send(data);
});

const get_notification_viewed = catchAsync(async (req, res) => {
  const data = await Ecomserive.get_notification_viewed(req);
  res.send(data);
});

const get_notification_getall = catchAsync(async (req, res) => {
  const data = await Ecomserive.get_notification_getall(req);
  res.send(data);
});
const get_stream_post_after_live_stream = catchAsync(async (req, res) => {
  const data = await Ecomserive.get_stream_post_after_live_stream(req);
  res.send(data);
});

const update_start_end_time = catchAsync(async (req, res) => {
  const data = await Ecomserive.update_start_end_time(req);
  res.send(data);
});

const video_upload_post = catchAsync(async (req, res) => {
  const data = await Ecomserive.video_upload_post(req);
  res.send(data);
});

const get_video_link = catchAsync(async (req, res) => {
  const data = await Ecomserive.get_video_link(req);
  res.send(data);
});

const get_order_details_by_stream = catchAsync(async (req, res) => {
  const data = await Ecomserive.get_order_details_by_stream(req.params.id, req.query);
  res.send(data);
});

const get_post_view = catchAsync(async (req, res) => {
  const data = await Ecomserive.get_post_view(req);
  res.send(data);
});

const update_post_price = catchAsync(async (req, res) => {
  const data = await Ecomserive.update_post_price(req);
  res.send(data);
});
const update_post_price_admin = catchAsync(async (req, res) => {
  const data = await Ecomserive.update_post_price_admin(req);
  res.send(data);
});

const post_payment_details = catchAsync(async (req, res) => {
  const data = await Ecomserive.post_payment_details(req);
  res.send(data);
});

const updatePlanById = catchAsync(async (req, res) => {
  const data = await Ecomserive.updatePlanById(req.params.id, req.body);
  res.send(data);
});

const getPlanById = catchAsync(async (req, res) => {
  const data = await Ecomserive.getPlanById(req.params.id);
  res.send(data);
});

const deletePlanById = catchAsync(async (req, res) => {
  const data = await Ecomserive.deletePlanById(req.params.id);
  res.send(data);
});

const disable_Enable_Plan = catchAsync(async (req, res) => {
  const data = await Ecomserive.disable_Enable_Plan(req.params.id, req.body);
  res.send(data);
});

const getStreamRequestById = catchAsync(async (req, res) => {
  const data = await Ecomserive.getStreamRequestById(req.params.id);
  res.send(data);
});

const UploadProof = catchAsync(async (req, res) => {
  const data = await Ecomserive.UploadProof(req.params.id, req.body);
  if (req.file) {
    console.log(req.file);
    data.image = 'images/plane/' + req.file.filename;
  }
  data.save();
  res.send(data);
});

const get_Live_Streams = catchAsync(async (req, res) => {
  const data = await Ecomserive.get_Live_Streams();
  res.send(data);
});

const update_pump_views = catchAsync(async (req, res) => {
  const data = await Ecomserive.update_pump_views(req.body);
  res.send(data);
});
const upload_s3_stream_video = catchAsync(async (req, res) => {
  const data = await Ecomserive.upload_s3_stream_video(req);
  res.send(data);
});
const upload_s3_stream_video_admin = catchAsync(async (req, res) => {
  const data = await Ecomserive.upload_s3_stream_video_admin(req);
  res.send(data);
});
const get_stream_by_user = catchAsync(async (req, res) => {
  const data = await Ecomserive.get_stream_by_user(req);
  res.send(data);
});

const getStreambyId = catchAsync(async (req, res) => {
  const data = await Ecomserive.getStreambyId(req.params.id);
  res.send(data);
});

const completed_show_vidio = catchAsync(async (req, res) => {
  const data = await Ecomserive.completed_show_vidio(req);
  res.send(data);
});

const completed_show_vidio_admin = catchAsync(async (req, res) => {
  const data = await Ecomserive.completed_show_vidio_admin(req);
  res.send(data);
});

const visitor_save_product = catchAsync(async (req, res) => {
  const data = await Ecomserive.visitor_save_product(req);
  res.send(data);
});
const visitor_interested_product = catchAsync(async (req, res) => {
  const data = await Ecomserive.visitor_interested_product(req);
  res.send(data);
});

const getIntrested_product = catchAsync(async (req, res) => {
  const data = await Ecomserive.getIntrested_product(req.params.id);
  res.send(data);
});

const getStreamDetails = catchAsync(async (req, res) => {
  const data = await Ecomserive.getStreamDetails(req.userId);
  res.send(data);
});

const getStreamProductDetailsBy_Customer = catchAsync(async (req, res) => {
  const data = await Ecomserive.getStreamProductDetailsBy_Customer(req.params.id, req.params.StreamId);
  res.send(data);
});

const get_savedProduct_By_Visitor = catchAsync(async (req, res) => {
  const data = await Ecomserive.get_savedProduct_By_Visitor(req.userId);
  res.send(data);
});

const exhibitor_get_video_all = catchAsync(async (req, res) => {
  const data = await Ecomserive.exhibitor_get_video_all(req);
  res.send(data);
});

const get_exhibitor_details = catchAsync(async (req, res) => {
  const data = await Ecomserive.get_exhibitor_details(req);
  res.send(data);
});

const notify_me_toggle = catchAsync(async (req, res) => {
  const data = await Ecomserive.notify_me_toggle(req);
  res.send(data);
});

const getAllPlanes_view = catchAsync(async (req, res) => {
  const data = await Ecomserive.getAllPlanes_view();
  res.send(data);
});

const get_previes_post = catchAsync(async (req, res) => {
  const data = await Ecomserive.get_previes_post(req);
  res.send(data);
});
const get_address_log = catchAsync(async (req, res) => {
  const data = await Ecomserive.get_address_log(req);
  res.send(data);
});

const purchesPlane_exhibitor = catchAsync(async (req, res) => {
  const data = await Ecomserive.purchesPlane_exhibitor(req, res);
  res.send(data);
});

const get_Saved_Product = catchAsync(async (req, res) => {
  let userId = req.shopId;
  const data = await Ecomserive.get_Saved_Product(userId);
  res.send(data);
});

const search_product_list = catchAsync(async (req, res) => {
  const data = await Ecomserive.search_product_list(req);
  res.send(data);
});

module.exports = {
  create_Plans,
  UploadProof,
  create_Plans_addon,
  get_all_Plans,
  get_all_Plans_addon,
  get_all_Plans_normal,
  get_one_Plans,
  update_one_Plans,
  delete_one_Plans,
  create_post,
  get_all_post,
  get_one_post,
  update_one_post,
  delete_one_post,
  remove_one_post,
  get_all_Post_with_page,
  create_post_teaser,
  getStreaming_orders_By_orders,
  create_stream_one,
  find_and_update_one,
  create_stream_two,
  get_all_stream,
  get_one_stream,
  get_one_stream_assign_host,
  update_one_stream,
  delete_one_stream,
  create_stream_one_image,
  create_stream_one_video,
  create_stream_one_broucher,
  get_one_stream_step_two,
  update_one_stream_two,
  update_one_stream_one,
  get_all_admin,
  update_approved,
  update_reject,
  get_all_streams,
  get_subhost_token,
  get_subhost_streams,
  get_all_Plans_pagination,
  allot_stream_subhost,
  cancel_stream,
  remove_stream,
  get_completed_stream,
  get_completed_stream_byid,
  get_completed_stream_buyer,
  end_stream,
  get_post_view,
  update_post_price,
  post_payment_details,

  go_live_stream_host,
  get_watch_live_steams,
  get_watch_live_steams_admin_watch,
  get_watch_live_token,

  //
  regisetr_strean_instrest,
  unregisetr_strean_instrest,
  go_live_stream_host_subhost,

  purchase_details,
  purchase_details_supplier,

  purchase_link_plan,
  purchase_link_plan_get,

  get_stream_post,
  get_stream_alert,
  get_cancel_stream,

  create_slab,
  get_by_slab,
  update_slab,
  getallslab,
  getallslab_all,
  getStock_Manager,
  getPosted_Details_By_Stream,
  fetchStream_Details_ById,
  fetch_Stream_Ordered_Details,
  update_Status_For_StreamingOrders,
  fetch_streaming_Details_Approval,
  update_approval_Status,
  fetch_Stream_Details_For_Buyer,
  update_Joined_User_Status_For_Buyer,
  fetch_Stream_Product_Details,
  fetch_stream_Payment_Details,
  update_Multiple_approval_Status,
  update_productOrders,
  update_Multiple_productOrders,
  Fetch_Streaming_Details_By_buyer,
  getStreaming_orders_By_orders_for_pay,
  multipleCancel,
  getOrder_For_Account_Manager,
  getDetails,

  get_notification_count,
  get_notification_viewed,
  get_notification_getall,

  get_stream_post_after_live_stream,
  update_start_end_time,
  video_upload_post,
  get_video_link,
  get_order_details_by_stream,

  get_watch_live_steams_upcoming,
  get_watch_live_steams_interested,
  get_watch_live_steams_completed,
  get_watch_live_steams_upcoming_byid,
  getall_homeage_streams,
  get_watch_live_steams_current,
  on_going_stream,
  updatePlanById,
  getPlanById,
  deletePlanById,
  disable_Enable_Plan,
  getStreamRequestById,
  create_stream_one_Broucher,
  get_Live_Streams,
  update_pump_views,
  upload_s3_stream_video,
  upload_s3_stream_video_admin,
  only_chat_join,
  only_chat_get,
  get_stream_by_user,
  getStreambyId,
  completed_show_vidio,
  completed_show_vidio_admin,
  visitor_save_product,
  visitor_interested_product,
  getIntrested_product,
  getStreamDetails,
  getStreamProductDetailsBy_Customer,
  get_savedProduct_By_Visitor,
  exhibitor_get_video_all,
  get_exhibitor_details,
  notify_me_toggle,
  getAllPlanes_view,
  get_previes_post,
  get_address_log,
  get_all_post_transation,
  update_post_price_admin,

  // pruchese plan
  purchesPlane_exhibitor,
  get_Saved_Product,
  remove_stream_admin,
  search_product_list,
  remove_post_stream
};
