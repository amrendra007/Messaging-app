const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { check, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

const router = express.Router();
const saltRounds = 10;
const User = require('../models/userDb');

//  validator middleware
const validator = [
    check('username').trim().isLength({ min: 6 })
        .withMessage('Username must be of min 6 char long')
        .custom(username => User.findOne({ username })
            .then((user) => {
                if (user) {
                    return Promise.reject(new Error('Username already in use'));
                }
            }))
        .withMessage('Username already in use'),

    check('password').trim().isLength({ min: 6 })
        .withMessage('password must be of min 6 char long'),

    check('firstName').trim().isLength({ min: 1 })
        .withMessage('FirstName should not be empty.'),

    check('lastName').trim().isLength({ min: 1 })
        .withMessage('LastName should not be empty.'),

    sanitizeBody('*').trim().escape(),
];

//  post route register
router.post('/register', validator, (req, res, next) => {
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

router.get('/success', (req, res, next) => {
    console.log('req.user: --', req.user);
    console.log('ident. --', req.isAuthenticated());
    res.send('logged in successfully');
});

router.get('/failure', (req, res, next) => {
    res.send('logged in failed, check your username or password');
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
