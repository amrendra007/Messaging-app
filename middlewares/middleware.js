const { check } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

const User = require('../models/userDb');

module.exports.registerRouteValidator = [
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

module.exports.sendmessageRouteValidator = [
    check('subject').trim().exists()
        .withMessage('Subject shouldn\'t be blank'),

    check('message').trim().exists()
        .withMessage('Message shouldn\'t be blank'),

    check('toUser').trim().exists()
        .withMessage('toUser shouldn\'t be blank'),

    sanitizeBody('*').trim().escape(),
];

module.exports.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(403).send('Please Log in first');
};
