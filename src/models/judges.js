var express = require('express');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var judgeModel = new Schema({
    name: {
        type: String
    },

    imgUrl: {
        type: String
    },
    profession: {
        type: String
    }
});

module.exports = mongoose.model('Judges', judgeModel);