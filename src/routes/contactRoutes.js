var express = require('express');
var auth=require('../middlewares');
var contactRouter = express.Router();


var router = function (nav) {
    /* Get All Events from DB*/
    contactRouter.route('/Contact')
        .get(auth.requiresLogin,function (req, res) {

            res.render('contact', {
                title: 'Contact Us',
                nav: nav,
                user:req.user
            });
        });

    contactRouter.route('/About')
        .get(function (req, res) {

            res.render('about', {
                title: 'About',
                nav: nav,
                user:req.user
            });
        });



    return contactRouter;
};



module.exports = router;