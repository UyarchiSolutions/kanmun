var https = require('https');
var urlencode = require('urlencode');
const urlencodeed = require('rawurlencode');
const saveOtp = require('./saveRegisterOtp');

const Otp = async (mobile) => {
  var sender = 'txtlcl';
  const contact = mobile;
  numbers = '91' + contact;
  apiKey = urlencode('NTgzOTZiMzY3MTQ4MzI0ODU1NmI0NDZhNDQ3NTQ5NmY=');
  sender = urlencode('UYARBZ');
  let OTPCODE = Math.floor(100000 + Math.random() * 900000);
  message = urlencodeed(
    'Dear ' +
      contact +
      ', thank you for registering with Kapture(An Uyarchi Solutions company). Your OTP for logging into the account is ' +
      OTPCODE +
      ' .'
  );
  data = 'send/?apikey=' + apiKey + '&numbers=' + numbers + '&sender=' + sender + '&message=' + message;
  var options = 'https://api.textlocal.in/' + data;
  await saveOtp.saveOtp(contact, OTPCODE);
  https.request(options, callback).end();
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

module.exports = { Otp };
