const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { validationResult } = require('express-validator/check');

const router = express.Router();
const saltRounds = 10;

const User = require('../models/userDb');
const middleware = require('../middlewares/middleware');

//  post route register
router.post('/register', middleware.registerRouteValidator, (req, res, next) => {
    console.log('body obj:', req.body);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log('errors', errors.array());
        return res.status(422).send(errors.array());
    }
    bcrypt.hash(req.body.password, saltRounds, (error, hash) => {
        if (error) {
            return next(error);
        }
        const user = {
            username: req.body.username,
            password: hash,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        };
        User.create(user, (err, newUser) => {
            if (err) {
                return next(err);
            }
            console.log('newUser', newUser);
            req.login(newUser.id, (er) => {
                if (er) {
                    return next(er);
                }
                res.send('register successfully');
            });
        });
    });
});

router.get('/success', middleware.isLoggedIn, (req, res, next) => {
    console.log('req.user: --', req.user);
    console.log('ident. --', req.isAuthenticated());
    res.send('logged in successfully');
});

router.get('/failure', (req, res, next) => {
    res.send('plz check your username or password');
});

//  login post route
router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/success',
        failureRedirect: '/failure',
    }));


passport.serializeUser((id, done) => {
    done(null, id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

module.exports = router;
