const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');
const ccavenueSchema = mongoose.Schema({
    _id: {
        type: String,
        default: v4,
    },
    order_id: {
        type: String,
    },
    userID: {
        type: String,
    },
    userType: {
        type: String,
    },
    currency: {
        type: String,
    },
    amount: {
        type: Number,
    },
    redirect_url: {
        type: String,
    },
    cancel_url: {
        type: String,
    },
    language: {
        type: String,
    },
    my_redirect_url: {
        type: String,
    },
    billing_name: {
        type: String,
    },
    billing_address: {
        type: String,
    },
    billing_city: {
        type: String,
    },
    billing_state: {
        type: String,
    },
    billing_zip: {
        type: String,
    },
    billing_country: {
        type: String,
    },
    billing_tel: {
        type: String,
    },
    billing_email: {
        type: String,
    },
    delivery_city: {
        type: String,
    },
    delivery_address: {
        type: String,
    },
    delivery_city: {
        type: String,
    },
    delivery_state: {
        type: String,
    },
    delivery_zip: {
        type: String,
    },
    delivery_country: {
        type: String,
    },
    delivery_tel: {
        type: String,
    },
    merchant_param1: {
        type: String,
    },
    merchant_param2: {
        type: String,
    },
    merchant_param3: {
        type: String,
    },
    merchant_param4: {
        type: String,
    },
    merchant_param5: {
        type: String,
    },
    promo_code: {
        type: String,
    },
    after_redirect: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true,
    },
    archive: {
        type: Boolean,
        default: false,
    },
    encRequest: {
        type: String,
    },
    response: {
        type: Object,
    },
    response_enq: {
        type: String,
    },
    paymentLink: {
        type: String,
    },
    price: Number,
    gst: Number
},
    { timestamps: true }
);
ccavenueSchema.plugin(toJSON);
ccavenueSchema.plugin(paginate);
const ccavenue_paymnet = mongoose.model('ccavanuepayment', ccavenueSchema);
module.exports = { ccavenue_paymnet };
