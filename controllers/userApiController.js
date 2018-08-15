const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { validationResult } = require('express-validator/check');

const router = express.Router();
const saltRounds = 10;

const User = require('../models/userDb');
const middleware = require('../middlewares/middleware');

//  POST /register route
router.post('/register', middleware.registerRouteValidator, (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
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
            req.login(newUser.id, (er) => {
                if (er) {
                    return next(er);
                }
                res.send('register successfully');
            });
        });
    });
});

// success redirect after req to log in
router.get('/success', middleware.isLoggedIn, (req, res, next) => {
    res.send('logged in successfully');
});

// failure redirect after req to log in
router.get('/failure', (req, res, next) => {
    res.send('plz check your username or password');
});

//  POST /login route
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
