const mongoose = require('mongoose');
const { v4 } = require('uuid');
const AdvertismentSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    Name_of_plan: {
      type: String,
    },
    File_type: {
      type: String,
    },
    Display_type: {
      type: String,
    },
    Total_display_ads: {
      type: String,
    },
    Display_per_day: {
      type: String,
    },
    Display_per_Stream: {
      type: String,
    },
    Stream_type: {
      type: String,
    },
    Display_mode: {
      type: String,
    },
    userId: {
      type: String,
    },
  },
  { timestamps: true }
);

const Advertisment = mongoose.model('Advertisment', AdvertismentSchema);

module.exports = { Advertisment };
