var express = require('express');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var eventModel = new Schema({
    name: {
        type: String
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String
    },
    imgUrl: {
        type: String
    },
    desc:{
        type:String
    },
    participents: [{
        type:Schema.Types.ObjectId,
        ref:'Participant'
    }],
    judge:{
        type:Schema.Types.ObjectId,
        ref:'User'

    }
});

module.exports = mongoose.model('Events', eventModel);