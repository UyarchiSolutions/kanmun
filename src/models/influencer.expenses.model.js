const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');

const influencerSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  name: {
    type: String,
  },
  emailId: {
    type: String,
  },
  mobileNumber: {
    type: Number,
  },
  language: {
    type: String,
  },
  gender: {
    type: String,
  },
  mainContentCategory: {
    type: String,
  },
  secondContentCategory: {
    type: String,
  },
  DOB: {
    type: String,
  },
  Qualification: {
    type: String,
  },
  course: {
    type: String,
  },
  specialization: {
    type: String,
  },
  instagram_Id: {
    type: String,
  },
  instagram_followers: {
    type: String,
  },
  instagram_followings: {
    type: String,
  },
  facebook_Id: {
    type: String,
  },
  facebook_followers: {
    type: String,
  },
  facebook_followings: {
    type: String,
  },
  twitter_Id: {
    type: String,
  },
  twitter_followers: {
    type: String,
  },
  twitter_followings: {
    type: String,
  },
  youtube_Id: {
    type: String,
  },
  youtube_subscribers: {
    type: String,
  },
  blog_or_website: {
    type: String,
  },
  blog_or_website_visitors: {
    type: String,
  },
  primary_publishing_platform: {
    type: String,
  },
  secondary_publishing_platform: {
    type: String,
  },
  main_region_of_influence: {
    type: String,
  },
  secondary_region_of_influence: {
    type: String,
  },
  area_of_interest: {
    type: String,
  },
  my_audience_mainly: {
    type: String,
  },
  monetizing_your_audience: {
    type: String,
  }

}, { timestamps: true });

const Influencer = mongoose.model('influencer', influencerSchema);

module.exports = { Influencer };
