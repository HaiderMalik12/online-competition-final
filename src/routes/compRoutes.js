var express = require('express');
var compRouter = express.Router();
var Event = require('../models/events');
var multer = require('multer');
var bodyParser = require('body-parser');
var Particpant = require('../models/participants');
var Judge = require('../models/judges');
var user = require('../models/user');
var nodemailer = require('nodemailer');

var router = function(nav) {

    compRouter.route('/')

    .get(function(req, res) {
            var judgesList = [];
            user.find({
                'local.category': 'Judge'
            }, function(err, judges) {
                console.log('judges');
                console.log(judges);
                if (!err) {
                    judgesList = judges;
                }
                res.render('addCompetition', {
                    title: 'Competition',
                    nav: nav,
                    judges: judgesList,
                    user: req.user
                });
            });

        })
        /*  Save Event to the db*/
        .post(function(req, res) {

            var event = new Event();

            event.name = req.body.event_name;
            event.startDate = new Date(req.body.startDate);
            event.endDate = new Date(req.body.endDate);
            event.category = req.body.category;
            event.imgUrl = req.body.imgUrl;
            event.desc = req.body.desc;

            /*  Save the Event to Db and Send Notification to all participants*/
            event.save(function(err, doc) {
                if (err) {
                    res.status(403).send(err)
                } else {
                    // res.redirect('/');
                    // Send an email this event to all participant;
                    Particpant.find({}, function(err, participants) {
                        if (err) {
                            res.status(500).send(err);
                        }
                        console.log(participants);
                        // ======================Nodemailor ======================
                        var transpoter = nodemailer.createTransport({
                            service: "Gmail",
                            auth: {
                                user: 'haidermalik504@gmail.com',
                                pass: 'htc@1234'
                            }
                        });

                        for (var i = 0; i < participants.length; i++) {
                            var mailOptions = {
                                from: 'Haider Malik <haidermalik504@gamil.com>',
                                to: participants[i].email,
                                subject: event.name,
                                text: event.desc,
                                html: '<p>Event Details</p> <b>Start Date </b> <p> ' + event.startDate + ' </p> <b>End Date </b> <p> ' + event.endDate + ' </p> '
                            };
                            transpoter.sendMail(mailOptions, function(err, info) {
                                if (err) {
                                    console.log(err);
                                    res.redirect('/');
                                } else {
                                    console.log('Message Sent' + info.response);
                                    // res.redirect('/');
                                }
                            });

                            // end for
                        }

                    });
                }

            });



        });

    return compRouter;

};

module.exports = router;