const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');

const Timelineschema = new mongoose.Schema({
    _id: {
        type: String,
        default: v4,
    },
    type: {
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
    InTime: {
        type: Number,
    },
    outTime: {
        type: Number,
    },
    Device: {
        type: Object,
    },
    latestActive: {
        type: Number,
    },
    userId: {
        type: String,
    },
    userRole: {
        type: String,
    },
    Token: {
        type: String,
    },
    socketId: {
        type: String,
    },
    streamId: {
        type: String,
    },
    streamingTimelineID: {
        type: String,
    },
    userName: {
        type: String,
    },
    mobileNumber: {
        type: String,
    }

});
const Usertimeline = mongoose.model('usertimeline', Timelineschema);




const propertyschema = new mongoose.Schema({
    _id: {
        type: String,
        default: v4,
    },
    active: {
        type: Boolean,
        default: true,
    },
    archive: {
        type: Boolean,
        default: false,
    },
    Time: {
        type: Number,
    },
    Device: {
        type: Object,
    },
    userId: {
        type: String,
    },
    properyType: {
        type: String,
    },
    properyId: {
        type: String,
    },
    status: {
        type: String,
    }
});
const PropertyTimeline = mongoose.model('propertytimeline', propertyschema);



const streamTimelineshema = new mongoose.Schema({
    _id: {
        type: String,
        default: v4,
    },
    active: {
        type: Boolean,
        default: true,
    },
    archive: {
        type: Boolean,
        default: false,
    },
    Device: {
        type: Object,
    },
    userId: {
        type: String,
    },
    properyType: {
        type: String,
    },
    properyId: {
        type: String,
    },
    status: {
        type: String,
        default: "Stared"
    },
    usertimeline: {
        type: String,
    },
    streamId: {
        type: String,
    },
    IN: {
        type: Number,

    },
    OUT: {
        type: Number,

    }
}, { timestamps: true });
const StreamTimeline = mongoose.model('streamtimeline', streamTimelineshema);
module.exports = {
    Usertimeline,
    PropertyTimeline,
    StreamTimeline
};
