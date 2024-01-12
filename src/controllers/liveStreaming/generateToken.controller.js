const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const generateTokenService = require('../../services/liveStreaming/generateToken.service');

const generateToken = catchAsync(async (req, res) => {
  let tokens;
  if (req.body.type == 'host') {
    tokens = await generateTokenService.generateToken(req);
  } else {
    tokens = await generateTokenService.generateToken_sub(req);
  }
  req.io.emit('subscriberjoined', { user: 'sd' });
  res.status(httpStatus.CREATED).send(tokens);
});
const getHostTokens = catchAsync(async (req, res) => {
  const tokens = await generateTokenService.getHostTokens(req);
  res.status(httpStatus.CREATED).send(tokens);
});

const gettokenById = catchAsync(async (req, res) => {
  const tokens = await generateTokenService.gettokenById(req.query);
  res.status(httpStatus.CREATED).send(tokens);
});
const gettokenById_host = catchAsync(async (req, res) => {
  const tokens = await generateTokenService.gettokenById_host(req.query);
  res.status(httpStatus.CREATED).send(tokens);
});
const participents_limit = catchAsync(async (req, res) => {
  const tokens = await generateTokenService.participents_limit(req.query);
  req.io.emit('subscriberjoined', { user: 'sd' });
  res.status(httpStatus.CREATED).send(tokens);
});

const leave_participents = catchAsync(async (req, res) => {
  const tokens = await generateTokenService.leave_participents(req);
  req.io.emit('subscriberjoined', { user: 'sd' });
  res.status(httpStatus.CREATED).send(tokens);
});

const leave_host = catchAsync(async (req, res) => {
  const tokens = await generateTokenService.leave_host(req.query);
  req.io.emit('subscriberjoined', { user: 'sd' });
  res.status(httpStatus.CREATED).send(tokens);
});

const join_host = catchAsync(async (req, res) => {
  const tokens = await generateTokenService.join_host(req.query);
  req.io.emit('subscriberjoined', { user: 'sd' });
  res.status(httpStatus.CREATED).send(tokens);
});
const agora_acquire = catchAsync(async (req, res) => {
  const tokens = await generateTokenService.agora_acquire(req);
  res.status(httpStatus.CREATED).send(tokens);
});
const recording_start = catchAsync(async (req, res) => {
  const tokens = await generateTokenService.recording_start(req, req.query.id);
  res.status(httpStatus.CREATED).send(tokens);
});
const recording_query = catchAsync(async (req, res) => {
  const tokens = await generateTokenService.recording_query(req);
  res.status(httpStatus.CREATED).send(tokens);
});
const recording_stop = catchAsync(async (req, res) => {
  const tokens = await generateTokenService.recording_stop(req);
  res.status(httpStatus.CREATED).send(tokens);
});
const recording_updateLayout = catchAsync(async (req, res) => {
  const tokens = await generateTokenService.recording_updateLayout(req.query);
  res.status(httpStatus.CREATED).send(tokens);
});
const chat_rooms = catchAsync(async (req, res) => {
  const tokens = await generateTokenService.chat_rooms(req.query);
  res.status(httpStatus.CREATED).send(tokens);
});

const get_sub_token = catchAsync(async (req, res) => {
  const tokens = await generateTokenService.get_sub_token(req.query);
  res.status(httpStatus.CREATED).send(tokens);
});

const get_sub_golive = catchAsync(async (req, res) => {
  const tokens = await generateTokenService.get_sub_golive(req, req.io);
  res.status(httpStatus.CREATED).send(tokens);
});

const get_sub_golive_details = catchAsync(async (req, res) => {
  const tokens = await generateTokenService.get_sub_golive_details(req, req.io);
  res.status(httpStatus.CREATED).send(tokens);
});


const get_sub_token_single = catchAsync(async (req, res) => {
  let tokens = await generateTokenService.generateToken_sub(req);
  // req.io.emit('subscriberjoined', { user: 'sd' });
  res.status(httpStatus.CREATED).send(tokens);
});

const get_participents_limit = catchAsync(async (req, res) => {
  let tokens = await generateTokenService.get_participents_limit(req);
  req.io.emit('subscriberjoined', { user: 'sd' });
  res.status(httpStatus.CREATED).send(tokens);
});

const get_current_live_stream = catchAsync(async (req, res) => {
  let tokens = await generateTokenService.get_current_live_stream(req);
  res.status(httpStatus.CREATED).send(tokens);
});


const remove_host_live = catchAsync(async (req, res) => {
  let tokens = await generateTokenService.remove_host_live(req);
  // req.io.emit('subscriberjoined', { user: 'sd' });
  res.status(httpStatus.CREATED).send(tokens);
});
const create_subhost_token = catchAsync(async (req, res) => {
  let tokens = await generateTokenService.create_subhost_token(req);
  // req.io.emit('subscriberjoined', { user: 'sd' });
  res.status(httpStatus.CREATED).send(tokens);
});

const create_raice_token = catchAsync(async (req, res) => {
  let tokens = await generateTokenService.create_raice_token(req);
  // req.io.emit('subscriberjoined', { user: 'sd' });
  res.status(httpStatus.CREATED).send(tokens);
});



// production
const production_supplier_token = catchAsync(async (req, res) => {
  let tokens = await generateTokenService.production_supplier_token(req);
  // req.io.emit('subscriberjoined', { user: 'sd' });
  res.status(httpStatus.CREATED).send(tokens);
});

const production_supplier_token_cloudrecording = catchAsync(async (req, res) => {
  let tokens = await generateTokenService.production_supplier_token_cloudrecording(req);
  res.status(httpStatus.CREATED).send(tokens);
});

const production_supplier_token_watchamin = catchAsync(async (req, res) => {
  let tokens = await generateTokenService.production_supplier_token_watchamin(req);
  res.status(httpStatus.CREATED).send(tokens);
});

const get_stream_complete_videos = catchAsync(async (req, res) => {
  let tokens = await generateTokenService.get_stream_complete_videos(req);
  res.status(httpStatus.CREATED).send(tokens);
});

const videoConverter = catchAsync(async (req, res) => {
  let tokens = await generateTokenService.videoConverter(req);
  res.status(httpStatus.CREATED).send(tokens);
});

const cloud_recording_start = catchAsync(async (req, res) => {
  let tokens = await generateTokenService.cloud_recording_start(req);
  res.status(httpStatus.CREATED).send(tokens);
});


const get_cloude_recording = catchAsync(async (req, res) => {
  let tokens = await generateTokenService.get_cloude_recording(req);
  res.status(httpStatus.CREATED).send(tokens);
});

const start_rice_user_hands = catchAsync(async (req, res) => {
  let tokens = await generateTokenService.start_rice_user_hands(req);
  res.status(httpStatus.CREATED).send(tokens);
});
const start_rice_user_hands_admin = catchAsync(async (req, res) => {
  let tokens = await generateTokenService.start_rice_user_hands_admin(req);
  res.status(httpStatus.CREATED).send(tokens);
});

const get_raise_hands = catchAsync(async (req, res) => {
  let tokens = await generateTokenService.get_raise_hands(req);
  res.status(httpStatus.CREATED).send(tokens);
});

const get_raise_hands_admin = catchAsync(async (req, res) => {
  let tokens = await generateTokenService.get_raise_hands_admin(req);
  res.status(httpStatus.CREATED).send(tokens);
});


const raise_request = catchAsync(async (req, res) => {
  let tokens = await generateTokenService.raise_request(req);
  res.status(httpStatus.CREATED).send(tokens);
});
const approve_request = catchAsync(async (req, res) => {
  let tokens = await generateTokenService.approve_request(req);
  res.status(httpStatus.CREATED).send(tokens);
});
const pending_request = catchAsync(async (req, res) => {
  let tokens = await generateTokenService.pending_request(req);
  res.status(httpStatus.CREATED).send(tokens);
});
const reject_request = catchAsync(async (req, res) => {
  let tokens = await generateTokenService.reject_request(req);
  res.status(httpStatus.CREATED).send(tokens);
});

const jion_now_live = catchAsync(async (req, res) => {
  let tokens = await generateTokenService.jion_now_live(req);
  res.status(httpStatus.CREATED).send(tokens);
});
const get_raise_hand_user = catchAsync(async (req, res) => {
  let tokens = await generateTokenService.get_raise_hand_user(req);
  res.status(httpStatus.CREATED).send(tokens);
});



const push_notification = catchAsync(async (req, res) => {
  let tokens = await generateTokenService.push_notification(req);
  res.status(httpStatus.CREATED).send(tokens);
});


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
  gettokenById_host,
  chat_rooms,
  get_sub_token,
  get_sub_token_single,
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


  // raise Hands admin
  start_rice_user_hands_admin,
  get_raise_hands_admin,
  get_sub_golive_details,
  push_notification
};
