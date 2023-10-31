const express = require('express');
const generateAuthTokens = require('./generateToken.route');
const chatModel = require('./chat.route');
const checkout = require('./checkout.route');
const docsRoute = require('../docs.route');
const config = require('../../../config/config');
const agora = require('./AgoraAppId.route');
const demostream = require('./DemoStream.route');
const sponsor = require('./sponsor.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/generateRTC',
    route: generateAuthTokens,
  },
  {
    path: '/chat',
    route: chatModel,
  },
  {
    path: '/checkout',
    route: checkout,
  },
  {
    path: '/agora',
    route: agora,
  },
  {
    path: '/demostream',
    route: demostream,
  },
  {
    path: '/sponsor',
    route: sponsor,
  },
];

const devRoutes = [
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
