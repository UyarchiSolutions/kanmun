const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const moment = require('moment');

let server;
const express = require('express');
const init = express();
// var timestamp = new Date((dt = new Date()).getTime() - dt.getTimezoneOffset() * 60000)
//   .toISOString()
//   .replace(/(.*)T(.*)\..*/, '$1 $2');
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  console.log(new Date().setTime(new Date(1695817800000).getTime() + 5 * 60 * 1000))
  // console.log("10"+10)
  // 1695817800000
  logger.info('Connected to MongoDB');
  // server = app.listen(config.port, () => {
  //   logger.info(`Listening to port ${config.port}`);
  // });
});



const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
