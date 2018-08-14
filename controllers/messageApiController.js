const express = require('express');
const { check, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

const router = express.Router();

const validator = [
    check('subject').trim().exists()
        .withMessage('Message subject shouldn\'t be blank'),

    check('message').trim().exists()
        .withMessage('Message shouldn\'t be blank'),

    check('toUser').trim().exists()
        .withMessage('toUser shouldn\'t be blank'),

    sanitizeBody('*').trim().escape(),
];

router.post('/sendmessage', validator, (req, res, next) => {
    console.log('body obj:', req.body);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log('errors', errors.array());
        return res.status(422).send(errors.array());
    }
});

module.exports = router;
