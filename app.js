const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const app = express();
require('dotenv').config();

//  Requiring routes and db
const User = require('./models/userDb');
const userRoute = require('./controllers/userApiController');
const messageRoute = require('./controllers/messageApiController');

// Db connection
mongoose.connect(`${process.env.DB_HOST}${process.env.DB_USER}:${process.env.DB_PASS}@ds121262.mlab.com:21262/local_message`, { useNewUrlParser: true });

const db = mongoose.connection;
db.once('open', () => {
    console.log('connected to db');
});

// app configuration
app.use(session({
    secret: 'fasgasfgasfgastrtsdsf',
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//  Mounting routes
app.use('/', userRoute);
app.use('/', messageRoute);

//  PASSPORT local-strategy to verify login
passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({ username }, (err, user) => {
        if (err) { return done(err); }
        if (!user) {
            //  Incorrect username
            return done(null, false);
        }
        const hash = user.password;
        bcrypt.compare(password, hash, (error, response) => {
            if (response === true) {
                //  SUCCESSFUL LOGGED IN
                return done(null, user);
            }
            // Incorrect password.
            return done(null, false);
        });
    });
}));

// Not found error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handling middleware
app.use((err, req, res, next) => {
    const message = { err };
    res.status(err.status || 500).json(message);
});

const port = process.env.PORT || 3000;
app.listen(port);
