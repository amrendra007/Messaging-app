const express = require('express');
const { check, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

const router = express.Router();
const User = require('../models/userDb');
const Message = require('../models/messageDb');

const validator = [
    check('subject').trim().exists()
        .withMessage('Subject shouldn\'t be blank'),

    check('message').trim().exists()
        .withMessage('Message shouldn\'t be blank'),

    check('toUser').trim().exists()
        .withMessage('toUser shouldn\'t be blank'),

    sanitizeBody('*').trim().escape(),
];

//!  middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(403).send('Please Log in first');
}

router.post('/sendmessage', isLoggedIn, validator, (req, res, next) => {
    console.log('currentUser: ', req.user);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log('errors', errors.array());
        return res.status(422).send(errors.array());
    }
    User.findOne({ username: req.body.toUser }, (error, foundUser) => {
        if (error) {
            return next(error);
        }
        if (!foundUser) {
            return res.status(404).send('toUser not found');
        }
        console.log(foundUser);
        if (foundUser.blockList.includes(req.user.username)) {
            return res.status(403).send(`You are not allowed to send message to ${foundUser.username}`);
        }
        const oneMessage = {
            subject: req.body.subject,
            message: req.body.message,
            toUser: req.body.toUser,
        };
        Message.create(oneMessage, (err, newMesage) => {
            if (err) {
                return next(err);
            }
            foundUser.messages.unshift(newMesage);
            foundUser.save((er) => {
                if (er) {
                    return next(er);
                }
                console.log('newMEssage', newMesage);
                res.status(200).send(`your message successfully sent to ${foundUser.username}`);
            });
        });
    });
});

router.get('/inbox', isLoggedIn, (req, res, next) => {
    console.log(req.user);
    User.findOne({ username: req.user.username })
        .populate('messages')
        .exec((error, foundData) => {
            if (error) {
                return next(error);
            }
            const userMessages = foundData.messages.map(item => ({
                subject: item.subject,
                message: item.message,
            }));
            res.status(200).send(userMessages);
        });
});

router.put('/block/:username', isLoggedIn, (req, res, next) => {
    User.findOne({ username: req.user.username }, (error, foundUser) => {
        if (error) {
            return next(error);
        }
        if (foundUser.blockList.includes(req.params.username)) {
            return res.send(`you have already blocked ${req.params.username}`);
        }
        foundUser.blockList.push(req.params.username);
        foundUser.save((err, savedUser) => {
            if (err) {
                return next(err);
            }
            console.log(savedUser);
            res.status(200).send(`you have successfully blocked ${req.params.username}`);
        });
    });
});

module.exports = router;
