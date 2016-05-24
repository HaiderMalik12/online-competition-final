var express = require('express');
var judgeRouter = express.Router();
var auth = require('../middlewares');
var Judge = require('../models/judges');
var user = require('../models/user');
var router = function (nav, app) {

    //  remove the competitions from nav
    // nav = nav.splice(2, 1);

    var judgeList = [];
    /* Display All Judges*/
    judgeRouter.route('/')
        .get(function (req, res) {
            user.find({'local.category':'Judge'}, function (err, docs) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    judgeList = docs;
                }
            });
            res.render('JudgeListView', {
                title: 'Judges',
                nav: nav,
                judges: judgeList,
                user: req.user
            });
        });
    //  Judges by Id
    judgeRouter.route('/:judgeId')
        .get(function (req, res) {
            var id = req.params.eventId;
            res.render('judgeView', {
                title: 'Judges Details',
                nav: nav,
                judge: judgeList[id],
                user: req.user
            });
        });
    // create a new Judge form
    app.get('/Judges/add', function (req, res) {
        res.render('addJudge', {
            title: 'Add Judge',
            nav: nav,
            user: req.user
        });
    });
    /*Create a new Judge */
    app.post('/Judges/add', function (req, res) {

        var judge = new user();
        //var judge = new Judge();
        judge.local.name = req.body.judgeName;
        judge.local.email = req.body.email;
        judge.local.password = judge.hashPassword('admin');
        judge.local.category = 'Judge';
        judge.local.img =req.body.img;
        judge.local.occupation =req.body.ocu;
        //judge.profession = req.body.profession;
        //console.log('creating judge success');
        //console.log(judge);
        //return res.send({status: 'success'});

        judge.save(function (err, doc) {
            if (err) {
                res.status(500).send();
            } else {
                console.log('Judge Created Successfully!!');
                res.redirect('/Judges');
            }
        });
    });
    return judgeRouter;
}


module.exports = router;