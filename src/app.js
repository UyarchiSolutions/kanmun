const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const cookieparser = require('cookie-parser');
const app = express();
const bodyParser = require('body-parser');
const routes_v2 = require('./routes/v1/liveStreaming');
const logger = require('./config/logger');
const chetModule = require('./services/liveStreaming/chat.service');
const privatechat = require('./services/PrivateChat.service');
const socketService = require('./services/liveStreaming/socket.service');
const moment = require('moment');
const UAParser = require('ua-parser-js');
const useragent = require('express-useragent');
const validator = require('validator');

const channels = {};
app.use(cookieparser());
let http = require('http');
let server = http.Server(app);
let socketIO = require('socket.io');
let io = socketIO(server);
var path = require('path');

app.use(express.static('public'));
// app.use(express.static(path.join(__dirname, '../public')));
app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);
let activeUserCount = 0;
server.listen(config.port, () => {
  logger.info(`Listening to port ${config.port}`);
});

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  socket.on('connect_buyer', async (data) => {
    console.log(data)
    console.log("user Connected connect-emit")
  });
  if (token != null) {
    await socketService.auth_details(socket, token, next)
  }
  else {
    next();
  }

})
io.sockets.on('connection', async (socket) => {

  await socketService.cost_connect_live_now(socket)
  socket.on('connect_buyer', async (data) => {
    console.log(data)
    logger.info("user Connected connect-emit")
  });
  socket.on('livestream_joined', async (data) => {
    await socketService.livestream_joined(data, socket, io)
  });
  socket.on('livestream_leave', async (data) => {
    await socketService.livestream_leave(data, socket, io)
  });
  activeUserCount++;
  io.sockets.emit('userCount', activeUserCount);
  socket.on('groupchat', async (data) => {
    await chetModule.chat_room_create(data, io);
  });

  socket.on('groupchatsubhost', async (data) => {
    //console.log("hello", data)
    await chetModule.chat_room_create_subhost(data, io);
  });
  socket.on('groupchathost', async (data) => {
    await chetModule.chat_room_create_host(data, io);
  });
  socket.on('livetraking', async (data) => {
    //console.log(data)
    io.sockets.emit('livetraking', data);
  });
  socket.on('toggle_controls', async (data) => {
    await chetModule.change_controls(data, io);
  });

  socket.on('post_start_end', async (data) => {
    await socketService.startStop_post(data, io);
  });
  socket.on('leave_subhost', async (data) => {
    await socketService.leave_subhost(data, io);
  });
  socket.on('allow_subhost', async (data) => {
    await socketService.admin_allow_controls(data, io);
  });

  socket.on('disconnect', async () => {
    await socketService.user_Disconect(socket, io)
  });

  socket.on('', (msg) => {
    //console.log('message: ' + msg);
  });
  socket.on('host_controll_audio', async (data) => {
    await socketService.host_controll_audio(data, io);
  });

  socket.on('host_controll_video', async (data) => {
    await socketService.host_controll_video(data, io);
  });
  socket.on('host_controll_all', async (data) => {
    await socketService.host_controll_all(data, io);
  });
  socket.on('stream_view_change', async (data) => {
    await socketService.stream_view_change(data, io);
  });
  socket.on('romove_message', async (data) => {
    await socketService.romove_message(data, io);
  });
  socket.on('ban_user_chat', async (data) => {
    await socketService.ban_user_chat(data, io);
  });
  socket.on('groupchathost_demo', async (data) => {
    await chetModule.chat_room_create_host_demo(data, io);
  });
  socket.on('groupchathost_demo_buyer', async (data) => {
    await chetModule.chat_room_create_host_demo_sub(data, io);
  });
  socket.on('liveleave', async (data) => {
    await chetModule.livejoined_now(data, io, 'leave');
  });
  socket.on('livejoined', async (data) => {
    await chetModule.livejoined_now(data, io, 'join');
  });
  socket.on('privateChat', async (data) => {
    await privatechat.recived_message(data, io, socket.handshake.auth);
  });

  socket.on('privateChatexp', async (data) => {
    await privatechat.recived_message_exp(data, io, socket.handshake.auth)
  });

  socket.on('same_user_jion_exhibitor', async (data) => {
    await privatechat.same_user_jion_exhibitor(data, io, socket.handshake.auth);
  });
  socket.on('joinRoom', (room) => {
    //console.log(room)
    socket.join(room);
    // Emit an event to notify other clients in the room about the new user joining
    //console.log(socket.id,2136712)
    socket.to(room).emit('userJoined', socket.id);
    //console.log(socket.rooms)
  });

  socket.on('disconnecting', () => {
    //console.log(socket.rooms)
    // Get the rooms the user is currently in
    const rooms = Object.keys(socket.rooms);
    //console.log(rooms)
    rooms.forEach((room) => {
      //console.log(room)
      // Emit an event to notify other clients in the room about the user disconnecting
      socket.to(room).emit('userDisconnected', socket.id);
    });
  });
  socket.on('disconnect', () => {
    activeUserCount--;
    io.sockets.emit('userCount', activeUserCount);
  });
});

app.use(function (req, res, next) {
  req.io = io;
  next();
});

require('aws-sdk/lib/maintenance_mode_message').suppress = true;

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}
const ccavReqHandler = require('./ccavRequestHandler.js');

app.get('/about', function (req, res) {
  res.render('dataFrom.html', { name: 'bharathi' });
});
app.post('/success', function (req, res) {
  ccavReqHandler.success_recive(req, res);
});
app.post('/m/success', function (req, res) {
  ccavReqHandler.m_success_recive(req, res);
});

app.post('/payment/success', function (req, res) {
  ccavReqHandler.payment_success(req, res);
});

app.get('/ifame', function (req, res) {
  res.write("<iframe  style='width:100%;height:1000px' src='https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction&merchant_id=2742878&encRequest=1c6a110c9e0a310ec4a98b82e93aa2511a3ae6faf3a70c9c6fa87936cf200dc9b7d29089f3ca7a8d2a0d3a2fea822bd742d38950362eb92e64822d96bd9eae0ce9b9490a7a50d59d587c1c88aac39d5f38a3d34617f8f30d0338ff8134838a9ce46123153a33990dc8fbb5377facfc87fa80ae6b84c69b7ad19c3cf1f333027aec8afbfc9dfbcb246939b9e8c56305712ce68081eacc83fec7f2599364c6d237485efbcfaf36e5e539bbd20e711f2c1b56254ca8ef817c0314a9ef1985d3abdb013ef432a56488f342303f8c33d8bb095ec2545470a508435cec3be3486d16a989005cb8b47928332173e2e942da86cfe669452ed41ff40e47a5f45ea4838988e4d898d4c4d5f5110f74ccc92c83f470b2396b0723651281586944246a1ec89654c28ab7332200b02ba03ac9f405c1aa2594861ef6b3f1f1246a3165c2a97bcc00a34a8f19db77ad5cdee3afc9365a02307c3068e6909d509f5b51f7b62d21d4110f1208ec7e1de378d299074d11310ba5f3efc88a1f9c6c53310e174f54c563dea5a59735996f35756ea8fa9b1451565075c82d61d8338c7736c76313a9042b167875968ed6e64eada345548c481883da9472e6f90532c28405ed51fc7d90d94d5df8cd11c733f182b9f5c880b92c3f5b43cefd0b58b284ccbb5573f748dc9bd5e587bfa4a91b5bb4bcef6176036713dc282dbedd9f753fdd3edadb11a7405f035b482eedc31db21bb4c2b4872dcb684744344305d157f0e191c7a425cfb7bd0a7caad329ad8d592038832573c4232d3f7222b46d236c30b483ba2553717603c64bebec31652fbf12ab4ad9ffbd7f4277d6716b12c689f02aa7db26db668d981836cb788fed2b55458923c23990e0b66114d34ecd9181b202f820311e6a0091d74a8791efc47346441765cc25a6eb95be724042003427e12f51fc19a00f6773ca3e410621aacee517276102c55d9c00ccdb2908180ee10c43584649573e5da7f8b9bb5a468fa2d0e7b76cb569a1733af41519a0e72c3d7dea8f9d9790cc849ae31351474365f7d2adbef53e37d4eaa37d8968617fc36eca87f6173a7a8f58bea8addd6d6f6316967cfacf8da7e05d99d5e86bf38da30119bc7ec1854786a200cdea3fa02dc65bd890eadcd4e1ef336060251cd64d0fc5c18e3fc5b118351e389132f69064ae6adb959f3db9b86343576e5c9a0d50f0f7b101722b7706c78c17f4b70a3a5ddfe6abd30f12150a02ff26a9cb45d21f66487b1ce623b5e91c5a2e652ed4920fa7b35efcfd3aa1a748876857ed4f3d8158fa1f081d4767ca7e66b2314f6f2c4d5e2ab7e74a3713faeee7bf9a7d21a0c1a55c9faf8823726a0322f2&access_code=AVUK05KI18AW28KUWA'>")
  res.end()
});


app.post('/ccavRequestHandler', function (request, response) {
  console.log('sadas');
  ccavReqHandler.postReq(request, response);
});
// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
const corsconfig = {
  credentials: true,
  origin: '*',
};
// git develper
app.use(cors());
app.options('*', cors());
//summa
// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());
app.use(useragent.express());

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}
// v1 api routes

function parseUserAgent(userAgent) {
  // Implement your own logic to parse the User-Agent header and extract device information.
  // There are various libraries available that can help with this task, such as 'ua-parser-js'.

  // Example implementation using 'ua-parser-js' library
  const parser = new UAParser();
  const result = parser.setUA(userAgent).getResult();

  // Extract relevant device information
  const deviceInfo = {
    browser: result.browser.name,
    browserVersion: result.browser.version,
    os: result.os.name,
    osVersion: result.os.version,
    device: result.device.model || 'Unknown',
  };

  return deviceInfo;
}

const deviceDetais = async (req, res, next) => {
  const userAgent = req.headers['user-agent'];
  const deviceInfo = parseUserAgent(userAgent);
  // //console.log(deviceInfo)
  req.deviceInfo = deviceInfo;
  return next();
};



app.use('/v1', deviceDetais, routes);
app.use('/v2', deviceDetais, routes_v2);

//default routes

app.get('/', (req, res) => {
  res.sendStatus(200);
});
// default v1 route

app.get('/v1', (req, res) => {
  res.sendStatus(200);
});

// health status code
app.get('/health', (req, res) => {
  res.sendStatus(200);
});

// GET /ws 404

app.get('/ws', (req, res) => {
  res.sendStatus(200);
});

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);
module.exports = app;
