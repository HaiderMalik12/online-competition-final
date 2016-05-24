var express = require('express');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var participantModel = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },
    videoUrl: {
        type: String
    },
    imgUrl: {
        type: String
    },
    vote: {
        type: Number,
        default: 0
    },
    voters:[{
        type:Schema.Types.ObjectId,
        ref:'User'

    }],
    desc: {
        type: String
    },user: {
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    event: {
        type:Schema.Types.ObjectId,
        ref:'Event'
    },
    judgesRemarks:[String],
    _judgeId: Schema.Types.ObjectId
});

module.exports = mongoose.model('Participants', participantModel);