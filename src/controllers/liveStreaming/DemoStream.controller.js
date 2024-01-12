const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const demostream = require('../../services/liveStreaming/DemoStream.service');

const send_livestream_link = catchAsync(async (req, res) => {
  let data;
  if (req.body.type == 'meet-RYH') {
    data = await demostream.send_livestream_link_ryh(req);
  }
  else if (req.body.type != 'assessment') {
    data = await demostream.send_livestream_link(req);
  }
  else {
    data = await demostream.send_livestream_link_assessment(req);
  }
  res.status(httpStatus.CREATED).send(data);
});

const send_livestream_link_demo = catchAsync(async (req, res) => {
  const data = await demostream.send_livestream_link_demo(req);
  res.status(httpStatus.CREATED).send(data);
});
const turn_on_chat = catchAsync(async (req, res) => {
  const data = await demostream.turn_on_chat(req);
  res.status(httpStatus.CREATED).send(data);
});
const get_demo_requests = catchAsync(async (req, res) => {
  const data = await demostream.get_demo_requests(req);
  res.status(httpStatus.CREATED).send(data);
});

const demorequest = catchAsync(async (req, res) => {
  const data = await demostream.demorequest(req);
  res.status(httpStatus.CREATED).send(data);
});

const get_demo_request = catchAsync(async (req, res) => {
  const data = await demostream.get_demo_request(req);
  res.status(httpStatus.CREATED).send(data);
});

const send_request_link = catchAsync(async (req, res) => {
  const data = await demostream.send_request_link(req);
  res.status(httpStatus.CREATED).send(data);
});

const get_stream_details = catchAsync(async (req, res) => {
  const data = await demostream.send_livestream_link(req);
  res.status(httpStatus.CREATED).send(data);
});

const get_stream_verify = catchAsync(async (req, res) => {
  const data = await demostream.verifyToken(req);
  res.status(httpStatus.CREATED).send(data);
});

const get_stream_verify_buyer = catchAsync(async (req, res) => {
  const data = await demostream.get_stream_verify_buyer(req);
  res.status(httpStatus.CREATED).send(data);
});

const get_stream_details_check = catchAsync(async (req, res) => {
  const data = await demostream.get_stream_details_check(req);
  res.status(httpStatus.CREATED).send(data);
});

const get_stream_details_check_golive = catchAsync(async (req, res) => {
  const data = await demostream.get_stream_details_check_golive(req);
  res.status(httpStatus.CREATED).send(data);
});

const go_live_stream = catchAsync(async (req, res) => {
  const data = await demostream.go_live_stream(req);
  res.status(httpStatus.CREATED).send(data);
});
const join_stream_buyer = catchAsync(async (req, res) => {
  const data = await demostream.join_stream_buyer(req);
  res.status(httpStatus.CREATED).send(data);
});
const join_stream_candidate = catchAsync(async (req, res) => {
  const data = await demostream.join_stream_candidate(req);
  res.status(httpStatus.CREATED).send(data);
});
const buyer_go_live_stream = catchAsync(async (req, res) => {
  const data = await demostream.buyer_go_live_stream(req);
  res.status(httpStatus.CREATED).send(data);
});

const get_interviewer_list = catchAsync(async (req, res) => {
  const data = await demostream.get_interviewer_list(req);
  res.status(httpStatus.CREATED).send(data);
});

const join_live = catchAsync(async (req, res) => {
  const data = await demostream.join_live(req);
  res.status(httpStatus.CREATED).send(data);
});


const end_live = catchAsync(async (req, res) => {
  const data = await demostream.end_live(req);
  res.status(httpStatus.CREATED).send(data);
});


const leave_admin_call = catchAsync(async (req, res) => {
  const data = await demostream.leave_admin_call(req);
  res.status(httpStatus.CREATED).send(data);
});

const get_buyer_token = catchAsync(async (req, res) => {
  const data = await demostream.get_buyer_token(req);
  res.status(httpStatus.CREATED).send(data);
});
const stream_register_buyer = catchAsync(async (req, res) => {
  const data = await demostream.stream_register_buyer(req);
  res.status(httpStatus.CREATED).send(data);
});

const get_get_add_to_cart = catchAsync(async (req, res) => {
  const data = await demostream.get_get_add_to_cart(req);
  res.status(httpStatus.CREATED).send(data);
});

const add_to_cart = catchAsync(async (req, res) => {
  const tokens = await demostream.addTocart(req);
  res.status(httpStatus.CREATED).send(tokens);
});

const confirmOrder_razerpay = catchAsync(async (req, res) => {
  const category = await demostream.confirmOrder_razerpay(req.shopId, req.body, req);
  console.log(category);
  setTimeout(async () => {
    await demostream.emit_cart_qty(req, req.body.OdrerDetails.streamId);
  }, 3000);
  res.send(category);
});

const confirmOrder_cod = catchAsync(async (req, res) => {
  const category = await demostream.confirmOrder_cod(req.shopId, req.body, req);
  setTimeout(async () => {
    await demostream.emit_cart_qty(req, req.body.OdrerDetails.streamId);
  }, 3000);
  res.send(category);
});

const end_stream = catchAsync(async (req, res) => {
  const category = await demostream.end_stream(req);
  res.send(category);
});

const go_live = catchAsync(async (req, res) => {
  const category = await demostream.go_live(req);
  res.send(category);
});

const get_DemoStream_By_Admin = catchAsync(async (req, res) => {
  const data = await demostream.get_DemoStream_By_Admin(req.params.page, req.userId);
  res.send(data);
});

const manageDemoStream = catchAsync(async (req, res) => {
  const data = await demostream.manageDemoStream(req.params.page);

  res.send(data);
});

const my_orders_buyer = catchAsync(async (req, res) => {
  const data = await demostream.my_orders_buyer(req);
  res.send(data);
});
const view_order_details = catchAsync(async (req, res) => {
  const data = await demostream.view_order_details(req);
  res.send(data);
});

const get_exhibitor_order = catchAsync(async (req, res) => {
  const data = await demostream.get_exhibitor_order(req);
  res.send(data);
});
const visitor_interested = catchAsync(async (req, res) => {
  const data = await demostream.visitor_interested(req);
  res.send(data);
});
const visitor_saved = catchAsync(async (req, res) => {
  const data = await demostream.visitor_saved(req);
  res.send(data);
});

const visitor_interested_get = catchAsync(async (req, res) => {
  const data = await demostream.visitor_interested_get(req);
  res.send(data);
});
const visitor_saved_get = catchAsync(async (req, res) => {
  const data = await demostream.visitor_saved_get(req);
  res.send(data);
});

const exhibitor_interested_get = catchAsync(async (req, res) => {
  const data = await demostream.exhibitor_interested_get(req);
  res.send(data);
});
const exhibitor_myprofile = catchAsync(async (req, res) => {
  const data = await demostream.exhibitor_myprofile(req);
  res.send(data);
});
const visitor_myprofile = catchAsync(async (req, res) => {
  const data = await demostream.visitor_myprofile(req);
  res.send(data);
});
const send_sms_now = catchAsync(async (req, res) => {
  const data = await demostream.send_sms_now(req);
  res.send(data);
});

const verify_otp = catchAsync(async (req, res) => {
  const data = await demostream.verify_otp(req);
  res.send(data);
});

const send_multible_sms_send = catchAsync(async (req, res) => {
  const data = await demostream.send_multible_sms_send(req);
  res.send(data);
});

const start_cloud_record = catchAsync(async (req, res) => {
  const data = await demostream.recording_start(req.query.id);
  res.send(data);
});
const verification_sms_send = catchAsync(async (req, res) => {
  const data = await demostream.verification_sms_send(req);
  res.send(data);
});

// feed Back
const createFeedBack = catchAsync(async (req, res) => {
  const demoIssue = await demostream.createFeedback(req);
  res.status(httpStatus.CREATED).send(demoIssue);
});

const getFeedbackById = catchAsync(async (req, res) => {
  const demoIssue = await demostream.getFeedback(req.params.id);
  res.status(httpStatus.OK).send(demoIssue);
});

const getFeedbackWithPagination = catchAsync(async (req, res) => {
  const feedback = await demostream.getFeedbackWithPagination(req.params.page);
  res.status(httpStatus.OK).send(feedback);
});

const updateFeedback = catchAsync(async (req, res) => {
  const feedback = await demostream.updateFeedback(req.params.id, req.body);
  res.status(httpStatus.OK).send(feedback);
});

const createTecIssues = catchAsync(async (req, res) => {
  const TechIssue = await demostream.createTecIssues(req.body);
  res.status(httpStatus.CREATED).send(TechIssue);
});

const get_TechIssue = catchAsync(async (req, res) => {
  const TechIssue = await demostream.get_TechIssue_Pagination(req);
  res.status(httpStatus.OK).send(TechIssue);
});

const update_TechIssue = catchAsync(async (req, res) => {
  const TechIssue = await demostream.update_TechIssue(req, params.id, req.body);
  res.status(httpStatus.OK).send(TechIssue);
});

const get_completed_stream = catchAsync(async (req, res) => {
  const TechIssue = await demostream.get_completed_stream(req);
  res.status(httpStatus.OK).send(TechIssue);
});

const getIssuesWithPagination = catchAsync(async (req, res) => {
  const TechIssue = await demostream.getIssuesWithPagination(req.params.page);
  res.status(httpStatus.OK).send(TechIssue);
});

const issueResolve = catchAsync(async (req, res) => {
  const TechIssue = await demostream.issueResolve(req.params.id, req.body);
  res.status(httpStatus.OK).send(TechIssue);
});

const getDatas = catchAsync(async (req, res) => {
  const TechIssue = await demostream.getDatas();
  res.status(httpStatus.OK).send(TechIssue);
});

const toggle_raise_hand = catchAsync(async (req, res) => {
  const TechIssue = await demostream.toggle_raise_hand(req);
  res.status(httpStatus.OK).send(TechIssue);
});

const raise_my_hands = catchAsync(async (req, res) => {
  const TechIssue = await demostream.raise_my_hands(req);
  res.status(httpStatus.OK).send(TechIssue);
});

const accept_raise_hands = catchAsync(async (req, res) => {
  const TechIssue = await demostream.accept_raise_hands(req);
  res.status(httpStatus.OK).send(TechIssue);
});

const end_raise_hands = catchAsync(async (req, res) => {
  const TechIssue = await demostream.end_raise_hands(req);
  res.status(httpStatus.OK).send(TechIssue);
});

const leave_raise_hands = catchAsync(async (req, res) => {
  const TechIssue = await demostream.leave_raise_hands(req);
  res.status(httpStatus.OK).send(TechIssue);
});


const stop_recording = catchAsync(async (req, res) => {
  const TechIssue = await demostream.stop_recording(req);
  res.status(httpStatus.OK).send(TechIssue);
});



module.exports = {
  send_livestream_link,
  get_stream_details,
  get_stream_verify,
  get_stream_details_check,
  go_live_stream,
  join_stream_buyer,
  join_stream_candidate,
  get_stream_verify_buyer,
  get_buyer_token,
  stream_register_buyer,
  get_get_add_to_cart,
  add_to_cart,
  confirmOrder_razerpay,
  confirmOrder_cod,
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
  start_cloud_record,
  get_stream_details_check_golive,
  verification_sms_send,
  createFeedBack,
  getFeedbackById,
  updateFeedback,
  getFeedbackWithPagination,
  createTecIssues,
  get_TechIssue,
  update_TechIssue,
  get_completed_stream,
  getIssuesWithPagination,
  issueResolve,
  demorequest,
  get_demo_request,
  send_request_link,
  send_livestream_link_demo,
  get_demo_requests,
  turn_on_chat,
  get_interviewer_list,
  join_live,
  end_live,
  leave_admin_call,
  getDatas,
  toggle_raise_hand,
  raise_my_hands,
  accept_raise_hands,
  end_raise_hands,
  leave_raise_hands,
  stop_recording
};
