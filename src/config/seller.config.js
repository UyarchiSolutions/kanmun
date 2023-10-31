var https = require('https');
var urlencode = require('urlencode');
const urlencodeed = require('rawurlencode');
const moment = require('moment');
const axios = require('axios');
const Otp = async (mobile, user, msg) => {
  // var sender = 'txtlcl';
  const contact = mobile;
  // numbers = '91' + contact;
  // apiKey = urlencode('NTgzOTZiMzY3MTQ4MzI0ODU1NmI0NDZhNDQ3NTQ5NmY=');
  // sender = urlencode('UYARBZ');
  let OTPCODE = Math.floor(100000 + Math.random() * 900000);

  // message = urlencodeed(
  //   'Dear ' +
  //   user.contactName +
  //   ', thank you for registering with Kapture(An Uyarchi Solutions company). Your OTP for logging into the account is ' +
  //   OTPCODE +
  //   ' .'
  // );
  // data = 'send/?apikey=' + apiKey + '&numbers=' + numbers + '&sender=' + sender + '&message=' + message;
  // var options = 'https://api.textlocal.in/' + data;
  let message;
  let reva;
  if (msg == 'forgot') {
    console.log('for');
    message = `${OTPCODE} is the Onetime password(OTP) to reset the password. This is usable once and valid for 5 mins from the request. PLS DO NOT SHARE WITH ANYONE - AgriExpoLive2023(An Ookam company event)`;
    reva = await axios.get(
      `http://panel.smsmessenger.in/api/mt/SendSMS?user=ookam&password=ookam&senderid=OOKAMM&channel=Trans&DCS=0&flashsms=0&number=${contact}&text=${message}&route=6&peid=1701168700339760716&DLTTemplateId=1707169089051541000`
    );
  } else if (msg == 'reg' || msg == 'cont') {
    console.log('reg');
    message = `Dear ${user.tradeName},thank you for the registration to the event AgriExpoLive2023 .Your OTP for logging into the account is ${OTPCODE}- AgriExpoLive2023(An Ookam company event)`;
    reva = await axios.get(
      `http://panel.smsmessenger.in/api/mt/SendSMS?user=ookam&password=ookam&senderid=OOKAMM&channel=Trans&DCS=0&flashsms=0&number=${contact}&text=${message}&route=6&peid=1701168700339760716&DLTTemplateId=1707168958877302526`
    );
  }

  await saveOtp(contact, OTPCODE, user);
  console.log('test..');
  // https.request(options, callback).end();
  return 'OTP Send Successfully';
};

callback = function (response) {
  var str = '';
  response.on('data', function (chunk) {
    str += chunk;
  });
  response.on('end', function () {
    //console.log(str);
  });
};

const { OTP, sellerOTP } = require('../models/saveOtp.model');

const saveOtp = async (number, otp, user) => {
  return await sellerOTP.create({
    OTP: otp,
    mobileNumber: number,
    userId: user._id,
    create: moment(),
    date: moment().format('YYYY-MM-DD'),
    time: moment().format('HHmms'),
  });
};

// module.exports = { saveOtp };
module.exports = Otp;
