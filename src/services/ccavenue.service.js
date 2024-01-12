
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const uuid = require('uuid');
var crypto = require('crypto');
var ccavenue = require('ccavenue');
const ccav = require('../utils/ccavutil');
const axios = require('axios');

const { ccavenue_paymnet } = require("../models/ccavenue.model")


const get_paymnent_url = async (aa, dd, res) => {
    // // const orderAmount = 1000; // Example order amount in paise
    // const merchantId = '2742878';
    // const accessCode = 'AVRI05KH14CC73IRCC';
    // const workingKey = '6EB13DAEA5810ACB66C7C95BDD4D2684';
    // const orderId = uuid.v4();
    // const baseUrl = 'https://test.ccavenue.com/transaction/transaction.do';
    // const paymentData = {
    //     merchant_id: merchantId,
    //     order_id: orderId,
    //     amount: '100.00',
    //     currency: 'INR',
    //     redirect_url: 'https://agriexpo.click/',
    //     cancel_url: 'https://agriexpo.live/',
    //     language: 'EN',
    //     billing_name: 'John Doe',
    //     billing_address: '123 Main St',
    //     billing_city: 'chennai',
    //     billing_state: 'tamilnadu',
    //     billing_zip: '600017',
    //     billing_country: 'India',
    //     billing_tel: '9965740303',
    //     billing_email: 'bharathiraja996574@gmail.com',
    // };
    // const orderParams = {
    //     order_id: 8765432,
    //     currency: 'INR',
    //     amount: '100',
    //     redirect_url: encodeURIComponent(`http://localhost:3000/api/redirect_url/`),
    //     billing_name: 'Name of the customer',
    //     // etc etc
    // };

    // const encryptedOrderData = ccav.getEncryptedOrder(orderParams);
    // console.log(encryptedOrderData)
    // // const encryptedData = ccav.encrypt(paymentData);
    // // console.log(encryptedData); // Proceed further
    // return encryptedOrderData;
};




const pay_now_encript_value = async (req) => {
    // req.query.amount
    var body = '',
        workingKey = 'B0050D8C882D10898AE305B141D27C8C',	//Put in the 32-Bit key shared by CCAvenues.
        accessCode = 'AVOI05KI17AK41IOKA',				//Put in the Access Code shared by CCAvenues.
        encRequest = '';
    const orderId = uuid.v4();
    const merchantId = '2742878';

    const data = {
        merchant_id: merchantId,
        order_id: orderId,
        currency: "INR",
        amount: 100,
        redirect_url: "https://agriexpo.click/success",
        cancel_url: "https://agriexpo.click/success",
        language: "EN",
        my_redirect_url: "https://agriexpo.click/",
        billing_name: "Peter",
        billing_address: "Santacruz",
        billing_city: "Mumbai",
        billing_state: "MH",
        billing_zip: "400054",
        billing_country: "India",
        billing_tel: "9876543210",
        billing_email: "testing@domain.com",
        delivery_name: "Sam",
        delivery_address: "Vile Parle",
        delivery_city: "Mumbai",
        delivery_state: "Maharashtra",
        delivery_zip: "400038",
        delivery_country: "India",
        delivery_tel: "0123456789",
        merchant_param1: "additional Info.",
        merchant_param2: "additional Info.",
        merchant_param3: "additional Info.",
        merchant_param4: "additional Info.",
        merchant_param5: "additional Info.",
        promo_code: "",
        // customer_identifier: ""
    };
    const queryString = objectToQueryString(data);
    const bufferData = Buffer.from(queryString, 'utf-8');
    encRequest = ccav.encrypt(bufferData, workingKey);
    console.log(encRequest)
    formbody = '<form id="nonseamless" method="post" name="redirect" action="https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/> <input type="hidden" id="encRequest" name="encRequest" value="' + encRequest + '"><input type="hidden" name="access_code" id="access_code" value="' + accessCode + '"><button>pay</button><script language="javascript">document.redirect.submit();</script></form>';
    // formbody = '<html><head><title>Sub-merchant checkout page</title><script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script></head><body><center><!-- width required mininmum 482px --><iframe  width="482" height="500" scrolling="No" frameborder="0"  id="paymentFrame" src="https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction&merchant_id='+merchantId+'&encRequest='+encRequest+'&access_code='+accessCode+'"></iframe></center><script type="text/javascript">$(document).ready(function(){$("iframe#paymentFrame").load(function() {window.addEventListener("message", function(e) {$("#paymentFrame").css("height",e.data["newHeight"]+"px"); }, false);}); });</script></body></html>';
    // let url = "https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction&merchant_id=2742878&encRequest=" + encRequest + "&access_code=AVVK05KI18AW29KVWA"
    return formbody;
}


const exhibitor_purchese_plan = async (amount, redirct, paymentLink, price, gst) => {
    var body = '',
        workingKey = '1AC82EC283C6AE1561C420D21169F52F',	//Put in the 32-Bit key shared by CCAvenues.
        accessCode = 'AVUK05KI18AW28KUWA',				//Put in the Access Code shared by CCAvenues.
        encRequest = '';
    const orderId = uuid.v4();
    const merchantId = '2742878';

    let data = {
        merchant_id: merchantId,
        order_id: orderId,
        currency: "INR",
        amount: amount,
        redirect_url: redirct,
        cancel_url: redirct,
        language: "EN",
        billing_name: "Peter",
        billing_address: "Santacruz",
        billing_city: "Mumbai",
        billing_state: "MH",
        billing_zip: "400054",
        billing_country: "India",
        billing_tel: "9876543210",
        billing_email: "testing@domain.com",
        delivery_name: "Sam",
        delivery_address: "Vile Parle",
        delivery_city: "Mumbai",
        delivery_state: "Maharashtra",
        delivery_zip: "400038",
        delivery_country: "India",
        delivery_tel: "0123456789",
        merchant_param1: 'https://exhibitor.agriexpo.live/dashboard/payment-success',
        merchant_param2: "additional Info.",
        merchant_param3: "additional Info.",
        merchant_param4: "additional Info.",
        merchant_param5: "additional Info.",
        promo_code: "",
        redirct: redirct,
        my_redirect_url: redirct,
        price: price,
        gst: gst,
        integration_type: 'iframe_normal'
    };
    const queryString = objectToQueryString(data);
    const bufferData = Buffer.from(queryString, 'utf-8');
    encRequest = ccav.encrypt(bufferData, workingKey);
    data.encRequest = encRequest;
    data.paymentLink = paymentLink
    const payment = await create_plan_paymant(data)
    data.merchant_param1 = payment._id;
    // formbody = '<form id="nonseamless" method="post" name="redirect" action="https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/> <input type="hidden" id="encRequest" name="encRequest" value="' + encRequest + '"><input type="hidden" name="access_code" id="access_code" value="' + accessCode + '"><button>pay</button><script language="javascript">document.redirect.submit();</script></form>';
    return { payment };
}




const mexhibitor_purchese_plan = async (amount, redirct, paymentLink, price, gst) => {
    var body = '',
        workingKey = 'C9C73B4F2FB59E0EEFEBDD27B8895894',	//Put in the 32-Bit key shared by CCAvenues.
        accessCode = 'AVJM05KJ27BF28MJFB',				//Put in the Access Code shared by CCAvenues.
        encRequest = '';
    const orderId = uuid.v4();
    const merchantId = '2742878';

    let data = {
        merchant_id: merchantId,
        order_id: orderId,
        currency: "INR",
        amount: amount,
        redirect_url: redirct,
        cancel_url: redirct,
        language: "EN",
        billing_name: "Peter",
        billing_address: "Santacruz",
        billing_city: "Mumbai",
        billing_state: "MH",
        billing_zip: "400054",
        billing_country: "India",
        billing_tel: "9876543210",
        billing_email: "testing@domain.com",
        delivery_name: "Sam",
        delivery_address: "Vile Parle",
        delivery_city: "Mumbai",
        delivery_state: "Maharashtra",
        delivery_zip: "400038",
        delivery_country: "India",
        delivery_tel: "0123456789",
        merchant_param1: 'https://mexhibitor.agriexpo.live/dashboard/payment-success',
        merchant_param2: "additional Info.",
        merchant_param3: "additional Info.",
        merchant_param4: "additional Info.",
        merchant_param5: "additional Info.",
        promo_code: "",
        redirct: redirct,
        my_redirect_url: redirct,
        price: price,
        gst: gst,
        integration_type: 'iframe_normal'
    };
    const queryString = objectToQueryString(data);
    const bufferData = Buffer.from(queryString, 'utf-8');
    encRequest = ccav.encrypt(bufferData, workingKey);
    data.encRequest = encRequest;
    data.paymentLink = paymentLink
    const payment = await create_plan_paymant(data)
    data.merchant_param1 = payment._id;
    // formbody = '<form id="nonseamless" method="post" name="redirect" action="https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/> <input type="hidden" id="encRequest" name="encRequest" value="' + encRequest + '"><input type="hidden" name="access_code" id="access_code" value="' + accessCode + '"><button>pay</button><script language="javascript">document.redirect.submit();</script></form>';
    return { payment };
}




const create_plan_paymant = async (data) => {
    let payment = await ccavenue_paymnet.create(data);
    return payment;
}

function objectToQueryString(obj) {
    return Object.keys(obj)
        .map(key => `${key}=${encodeURIComponent(obj[key])}`)
        .join("&");
}




const { google } = require("googleapis");

const places = google.places({
    version: "v1",
    apiKey: "AIzaSyARM6-Qr_hsR53GExv9Gmu9EtFTV5ZuDX4",
});

const nearby_value = async (req) => {
    const location = {
        lat: 12.9716,
        lng: 77.5946,
    };

    const request = {
        location: location,
        radius: 10000,
        type: "locality",
    };

    const response = await places.nearbySearch(request);

    console.log(response.results);
}
// workingKey = '1AC82EC283C6AE1561C420D21169F52F',	//Put in the 32-Bit key shared by CCAvenues.
// accessCode = 'AVUK05KI18AW28KUWA',


const pay_nowredirect_url = async (amount, redirct) => {
    // req.query.amount
    var body = '',
        workingKey = '1AC82EC283C6AE1561C420D21169F52F',	//Put in the 32-Bit key shared by CCAvenues.
        accessCode = 'AVUK05KI18AW28KUWA',				//Put in the Access Code shared by CCAvenues.
        encRequest = '';
    const orderId = uuid.v4();
    // console.log(req.body)
    // formbody = '<h1>hello<h1>';
    const merchantId = '2742878';

    const data = {
        merchant_id: merchantId,
        order_id: orderId,
        currency: "INR",
        amount: amount,
        redirect_url: "https://agriexpo.click/success",
        cancel_url: "https://agriexpo.click/success",
        language: "EN",
        billing_name: "Peter",
        billing_address: "Santacruz",
        billing_city: "Mumbai",
        billing_state: "MH",
        billing_zip: "400054",
        billing_country: "India",
        billing_tel: "9876543210",
        billing_email: "testing@domain.com",
        delivery_name: "Sam",
        delivery_address: "Vile Parle",
        delivery_city: "Mumbai",
        delivery_state: "Maharashtra",
        delivery_zip: "400038",
        delivery_country: "India",
        delivery_tel: "0123456789",
        merchant_param1: 'https://agriexpo.live/dashboard/payment-success',
        merchant_param2: "additional Info.",
        merchant_param3: "additional Info.",
        merchant_param4: "additional Info.",
        merchant_param5: "additional Info.",
        promo_code: "",
        redirct: redirct,
        my_redirect_url: redirct
    };
    const queryString = objectToQueryString(data);
    const bufferData = Buffer.from(queryString, 'utf-8');
    encRequest = ccav.encrypt(bufferData, workingKey);
    console.log(encRequest)
    data.encRequest = encRequest;
    let payment = await ccavenue_paymnet.create(data);
    data.merchant_param1 = payment._id;
    formbody = '<form id="nonseamless" method="post" name="redirect" action="https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/> <input type="hidden" id="encRequest" name="encRequest" value="' + encRequest + '"><input type="hidden" name="access_code" id="access_code" value="' + accessCode + '"><button>pay</button><script language="javascript">document.redirect.submit();</script></form>';
    return { payment, formbody };
}
const redirect_payment_gateway = async (html, res) => {
    res.writeHeader(200, { "Content-Type": "text/html" });
    res.write(html)
    res.end()
}
const get_paymant_success_response = async (req) => {
    let id = req.params.id;
    let payment = await ccavenue_paymnet.aggregate([
        { $match: { $and: [{ _id: { $eq: id } }] } },
        {
            $lookup: {
                from: 'paymentlinks',
                localField: 'paymentLink',
                foreignField: '_id',
                pipeline: [
                    {
                        $lookup: {
                            from: 'purchasedplans',
                            localField: 'purchasePlan',
                            foreignField: '_id',
                            pipeline: [
                                {
                                    $lookup: {
                                        from: 'sellers',
                                        localField: 'suppierId',
                                        foreignField: '_id',
                                        as: 'sellers',
                                    },
                                },
                                {
                                    $unwind: '$sellers',
                                },

                                {
                                    $project: {
                                        "numberOfStreamused": 1,
                                        "planType": 1,
                                        "streamvalidity": 1,
                                        "slotInfo": 1,
                                        "status": 1,
                                        "PayementStatus": 1,
                                        "PaidAmount": 1,
                                        "planName": 1,
                                        "numberOfParticipants": 1,
                                        "Teaser": 1,
                                        "completedStream": 1,
                                        "Pdf": 1,
                                        "image": 1,
                                        "description": 1,
                                        "RaiseHands": 1,
                                        "Special_Notification": 1,
                                        "chat_Option": 1,
                                        "Price": 1,
                                        "PostCount": 1,
                                        "no_of_host": 1,
                                        "DateIso": 1,
                                        "planId": 1,
                                        "transaction": 1,
                                        "offer_price": 1,
                                        "stream_validity": 1,
                                        "Interest_View_Count": 1,
                                        "Service_Charges": 1,
                                        "TimeType": 1,
                                        "raisehandcontrol": 1,
                                        "Discount": 1,
                                        "Referral": 1,
                                        "RevisedAmount": 1,
                                        "Type": 1,
                                        "paymentLink": 1,
                                        "approvalDate": 1,
                                        mobileNumber: "$sellers.mobileNumber",
                                        email: "$sellers.email",
                                        tradeName: "$sellers.tradeName",
                                    }
                                }
                            ],
                            as: 'purchasedplans',
                        },
                    },
                    {
                        $unwind: '$purchasedplans',
                    },
                ],
                as: 'paymentlinks',
            },
        },
        {
            $unwind: '$paymentlinks',
        },
        {
            $project: {
                "_id": 1,
                "order_id": 1,
                "currency": 1,
                "amount": 1,
                "language": 1,
                "billing_name": 1,
                "billing_address": 1,
                "billing_city": 1,
                "billing_state": 1,
                "billing_zip": 1,
                "billing_country": 1,
                "billing_tel": 1,
                "billing_email": 1,
                "delivery_address": 1,
                "delivery_city": 1,
                "delivery_state": 1,
                "delivery_zip": 1,
                "delivery_country": 1,
                "delivery_tel": 1,
                "promo_code": 1,
                "paymentLink": 1,
                "createdAt": 1,
                "updatedAt": 1,
                response: 1,
                purchasedplans: "$paymentlinks.purchasedplans",
                mobileNumber: "$paymentlinks.purchasedplans.mobileNumber",
                email: "$paymentlinks.purchasedplans.email",
                tradeName: "$paymentlinks.purchasedplans.tradeName",
            }
        }
    ])
    if (payment.length == 0) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
    }
    return payment[0];
}


const get_paymant_success_response_exp = async (req) => {
    let id = req.params.id;
    let payment = await ccavenue_paymnet.aggregate([
        { $match: { $and: [{ _id: { $eq: id } }] } },
        {
            $lookup: {
                from: 'purchasedplans',
                localField: '_id',
                foreignField: 'ccavenue',
                pipeline: [
                    {
                        $lookup: {
                            from: 'sellers',
                            localField: 'suppierId',
                            foreignField: '_id',
                            as: 'sellers',
                        },
                    },
                    {
                        $unwind: '$sellers',
                    },

                    {
                        $project: {
                            "numberOfStreamused": 1,
                            "planType": 1,
                            "streamvalidity": 1,
                            "slotInfo": 1,
                            "status": 1,
                            "PayementStatus": 1,
                            "PaidAmount": 1,
                            "planName": 1,
                            "numberOfParticipants": 1,
                            "Teaser": 1,
                            "completedStream": 1,
                            "Pdf": 1,
                            "image": 1,
                            "description": 1,
                            "RaiseHands": 1,
                            "Special_Notification": 1,
                            "chat_Option": 1,
                            "Price": 1,
                            "PostCount": 1,
                            "no_of_host": 1,
                            "DateIso": 1,
                            "planId": 1,
                            "transaction": 1,
                            "offer_price": 1,
                            "stream_validity": 1,
                            "Interest_View_Count": 1,
                            "Service_Charges": 1,
                            "TimeType": 1,
                            "raisehandcontrol": 1,
                            "Discount": 1,
                            "Referral": 1,
                            "RevisedAmount": 1,
                            "Type": 1,
                            "paymentLink": 1,
                            "approvalDate": 1,
                            mobileNumber: "$sellers.mobileNumber",
                            email: "$sellers.email",
                            tradeName: "$sellers.tradeName",
                        }
                    }
                ],
                as: 'purchasedplans',
            },
        },
        {
            $unwind: '$purchasedplans',
        },
        {
            $project: {
                "_id": 1,
                "order_id": 1,
                "currency": 1,
                "amount": 1,
                "language": 1,
                "billing_name": 1,
                "billing_address": 1,
                "billing_city": 1,
                "billing_state": 1,
                "billing_zip": 1,
                "billing_country": 1,
                "billing_tel": 1,
                "billing_email": 1,
                "delivery_address": 1,
                "delivery_city": 1,
                "delivery_state": 1,
                "delivery_zip": 1,
                "delivery_country": 1,
                "delivery_tel": 1,
                "promo_code": 1,
                "paymentLink": 1,
                "createdAt": 1,
                "updatedAt": 1,
                response: 1,
                purchasedplans: "$purchasedplans",
                mobileNumber: "$purchasedplans.mobileNumber",
                email: "$purchasedplans.email",
                tradeName: "$purchasedplans.tradeName",
            }
        }
    ])
    if (payment.length == 0) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
    }
    return payment[0];
}


const get_ccavenue_details = async (req) => {

    let id = req.query.id;
    const find = await ccavenue_paymnet.findById(id)
    if (!find) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
    }

    return find;

}
module.exports = {
    get_paymnent_url,
    pay_now_encript_value,
    nearby_value,
    pay_nowredirect_url,
    redirect_payment_gateway,
    exhibitor_purchese_plan,
    create_plan_paymant,
    get_paymant_success_response,
    get_paymant_success_response_exp,
    get_ccavenue_details,
    mexhibitor_purchese_plan
}



// https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction&encRequest=77c628f3cf576649aacb22801527ddcccf41813a5fde07aee739cb7f6010538797f3c1a5125c5644013c50cb0c9e69a8654fa418e23be21a71484c3bdbf6c577bb81e7c6161dcae453c46aacd967dea7c904257454a9fd31e37ce350ab73daafb49a2ef92b9d9da470532f3680842d4aeef870e65162e9ed58fad09526ea19f2aa7335725e62eb2653c333621e9cd39211671d4e02ddcf330292dc311aa9bbefd7357268bb99c84a5df80ca7087649150f1e74e41f1904729ebaabfe806793926a2003121b55e0b0cd9600c37b60538b94d7f139797074df335d88ce7f9c3651fe38e26a325556d900ddf7ba56513061e25ce055c7e0b6bb476cd67ed1891c1e821cfb81edf0093a0e3f4452427db1aec22196c95007102b007e368e3f24991e55f8d791fcef9943312ea95035db01cab4b9c31a27dbe0727d9588a23ff0910405b6e5013e653abe94402dc8bf261d5fb3bc3a2969ee3882d676765ad124ee141465fa09d1916820db19c4196dae19555caafce8618951379bab2596edcdd9b1598380064f00afe620c00757d2b3a90d45eb40c99ccdc8d767600beed16fe0936658365a4fed0a7677dcc09b6fd831f4ff37ae68b85a71d099ad2dcb5524c3ade99437295fdff6e2ab0b06f605d06a860d5323eb4ff604756080a891be32f63299156e9c326eab02d2df4484cd9a70249ee54f45bf61e5ae6f8145ecd49d6860add59715a64be3d4ef418c0083090fb81f13ce2d80ef5269296ead36de0272f2f3100067d15c499fd1411f4f73b752b2eb4c11e23ff6351e83b75b50d1da214db3bc37e81f793dfb358296131864d49e396633f78287d79e2766efcc0a7ec35d1ecd4ef83131d90864900efcc3103b6d4bbe2ed873a0dfeb024385fe31a18ef0a0839ffb0967f377f719efe76614a6a3a6d859283dc52758718fa2726697d7202a40a9b6fc64d19033165d6949f7b225a3e878fb8b8b8179f358c01e0f205960&access_code=AVTO97KH72AS17OTSA