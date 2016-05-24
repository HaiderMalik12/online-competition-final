var express = require('express');
var participantRouter = express.Router();
var Particpant = require('../models/participants');
var mongoose = require('mongoose');

var router = function(nav, app) {
    var participantList = [];

    participantRouter.route('/')
        .get(function(req, res) {
            Particpant.find({}, function(err, docs) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    participantList = docs;
                }
            });
            res.render('participantListView', {
                title: 'Particpant',
                nav: nav,
                participants: participantList,
                user:req.user
            });
        });

    participantRouter.route('/:id')
        .get(function(req, res) {
            var id = req.params.id;
            var result = {};
            Particpant.findById({
                _id: id
            }, function(err, doc) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    result = doc;
                    // res.json(participant);
                }
                res.render('participantView', {
                    title: 'Particpant Details',
                    nav: nav,
                    participant: result,
                    user:req.user
                });
            });

        });
    app.post('/addVotes', function(req, res) {
        var result = {};

        Particpant.findById({
            _id: req.body.id
        }, function(err, doc) {
            if (err) {
                res.status(500).send(err);
            } else {
                var index=-1;
                console.log('finding');
                for(var i=0;i<doc.voters.length;i++){
                    if(doc.voters[i]._id.equals(req.user._id)){
                    index=i;
                    break;}
                }
                console.log('found status',index);

                if(index===-1){
                doc.voters.push(req.user);
                doc.vote += 1;
                doc.vote;
                doc.save();
                result = doc;}
            }
            res.redirect('/Participants/'+req.body.id);

        }).populate('voters');
    });
    /* Hanlde Judges Remarks*/
    app.post('/judgesRemarks', function(req, res) {
        var result = {};

        Particpant.findById({
            _id: req.body.id
        }, function(err, doc) {
            if (err) {
                res.status(500).send(err);
            } else {

                doc.judgesRemarks.push(req.body.judgesRemarks);
                console.log(doc.judgesRemarks[0]);
                doc.save();
                result = doc;
            }
            res.render('participantView', {
                title: 'Particpant Details',
                nav: nav,
                participant: result,
                user:req.user
            });

        });
        // res.send('Judges Remarks Route is working here');

    });
    /* Add New Particpant*/
    app.get('/add', function(req, res) {

        res.render('addParticipant', {
            title: 'Add Particpant',
            nav: nav,
            user:req.user
        });
    });
    app.get('/results', function(req, res) {
        Particpant.find({}).sort('-vote').then(function(results){
            console.log('results');
            console.log(results);
            res.render('results', {
                title: 'Results',
                nav: nav,
                user:req.user,
                results:results
            });
        });

    });

    /* Handle Post request when submit form */
    app.post('/add', function(req, res) {
        var participant = new Particpant();
        participant.firstName = req.body.first_name;
        participant.lastName = req.body.last_name;
        participant.email = req.body.email;
        participant.imgUrl = req.body.imgUrl;
        participant.videoUrl = req.body.videoUrl;
        participant.desc = req.body.desc;
        participant.vote = 0;
        participant._judgeId=new mongoose.Types.ObjectId;
        participant.user=req.user.local._Id;

        participant.save(function(err, results) {
            if (err) {
                res.status(500).send(err);
            }
            res.redirect('/Participants');
        });
    });
    return participantRouter;
};

module.exports = router;