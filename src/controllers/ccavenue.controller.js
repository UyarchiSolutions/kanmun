const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const ccavenue = require("../services/ccavenue.service");



const get_paymnent_url = catchAsync(async (req, res) => {
    const category = await ccavenue.get_paymnent_url(req.shopId, req.body, res);
    res.send(category)
});

const pay_now_encript_value = catchAsync(async (req, res) => {
    const category = await ccavenue.pay_now_encript_value(req);
    res.writeHeader(200, { "Content-Type": "text/html" });
    res.write(category)
    res.end()
    // res.send(category)

});

const exhibitor_purchese_plan = catchAsync(async (req, res) => {
    const category = await ccavenue.exhibitor_purchese_plan(req);
    res.writeHeader(200, { "Content-Type": "text/html" });
    res.write(category)
    res.end()
    // res.send(category)

});


const nearby_value = catchAsync(async (req, res) => {
    const category = await ccavenue.placesNearby(req.shopId, req.body, res);
    res.send(category)
});

const get_paymant_success_response = catchAsync(async (req, res) => {
    const category = await ccavenue.get_paymant_success_response(req);
    res.send(category)
});

const get_paymant_success_response_exp = catchAsync(async (req, res) => {
    const category = await ccavenue.get_paymant_success_response_exp(req);
    res.send(category)
});


const get_ccavenue_details = catchAsync(async (req, res) => {
    const category = await ccavenue.get_ccavenue_details(req);
    res.send(category)
});



module.exports = {
    get_paymnent_url,
    pay_now_encript_value,
    nearby_value,
    exhibitor_purchese_plan,
    get_paymant_success_response,
    get_paymant_success_response_exp,
    get_ccavenue_details
}