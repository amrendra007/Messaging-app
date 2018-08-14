const express = require('express');
// const bcrypt = require('bcrypt');
// const passport = require('passport');
// const { check, validationResult } = require('express-validator/check');
// const { sanitizeBody } = require('express-validator/filter');

const router = express.Router();
// const saltRounds = 10;
// const User = require('../models/userDb');

router.get('/', (req, res) => {
    res.send('working');
});

module.exports = router;
