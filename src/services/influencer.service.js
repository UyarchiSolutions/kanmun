const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Influencer } = require('../models/influencer.expenses.model');
const moment = require('moment');

const create_influencer = async (req) => {
    const { mobileNumber, emailId } = req.body;


    let influence = await Influencer.findOne({ mobileNumber: mobileNumber });

    if (influence) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Mobile Number Already Registered');
    }
    influence = await Influencer.findOne({ emailId: emailId });
    if (influence) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Email Already Registered');
    }
    
    influence = await Influencer.create(req.body);
    return influence;
};





module.exports = {
    create_influencer,
};
