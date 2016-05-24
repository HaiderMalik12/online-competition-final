var express = require('express');
var userRouter = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var User = require("../models/user");
// ================Passport require modules==========
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require('path');
var redirect;
var router = function (nav, app) {
    // ===========================Passport Authentication ============================================================
    // This strategy is used for Register
    var localRegisterInit = function (req, email, password, callback) {
        User.findOne({
            "local.email": email
        }, function (err, user) {
            if (err) {
                return callback(err);
            }

            if (user) {
                // TODO: supply message
                return callback(null, false);
            }

            var newUser = new User();
            newUser.local.email = email;
            newUser.local.password = newUser.hashPassword(password);
            newUser.local.category = req.body.category;

            newUser.save(function (err) {
                if (err) {
                    throw err;
                }

                return callback(null, newUser);
            });
        });
    };


    // This strategy is used for LocalLogin
    var localLoginInit = function (req, email, password, callback) {
        User.findOne({
            "local.email": email
        }, function (err, user) {
            if (err) {
                return callback(err);
            }
            console.log('user found');
            if (!user || !user.validatePassword(password)) {
                // TODO: supply generic message

                return callback(null, false);
            }
            //if (user.local.category !== req.body.category) {
            //    return callback(null, false);
            //}
            //redirect logic
            redirect = user.local.category;
            return callback(null, user);
        });
    };

    // Options
    var localOptions = {
        usernameField: "emailAddress",
        passReqToCallback: true
    };
    // required for passport
    app.use(session({
        secret: "tank and spank",
        resave: true,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    // create a local-register strategy
    passport.use("local-register", new LocalStrategy(localOptions, localRegisterInit));
    // create a local login strategy
    passport.use("local-login", new LocalStrategy(localOptions, localLoginInit));

    // used for session
    passport.serializeUser(function (user, callback) {
        callback(null, user.id);
    });

    // used for session
    passport.deserializeUser(function (id, callback) {
        User.findById(id, function (err, user) {
            callback(err, user);
        });
    });

    // ======================================End Passport Authentication =============================


    app.get('/login', function (req, res) {
        res.render('login', {
            title: 'Login',
            nav: nav,
            user: req.user
        });
    });
    app.post('/login',
        passport.authenticate('local-login', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        })
    );

    app.get("/register", function (req, res) {
        res.render('register', {
            title: 'Sign Up',
            nav: nav,
            user: req.user
        });
    });
    app.post('/register',
        passport.authenticate('local-register', {
            successRedirect: '/',
            failureRedirect: '/register',

        })
    );
    app.get('/logout', function (req, res) {
        console.log('logging out');
        req.logout();
        res.redirect('/');
    });

    app.get('/about', function (req, res) {
        res.render('about', {
            title: 'About',
            nav: nav,
            user: req.user
        });
    });
    app.get('/contact', function (req, res) {
        res.render('contact', {
            title: 'Contact',
            nav: nav,
            user: req.user
        });
    });

    // router.post("/register", authConfig.localRegister);
    return userRouter;

};

module.exports = router;