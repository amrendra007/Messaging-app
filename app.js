const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// const bcrypt = require('bcrypt');
const passport = require('passport');
// const LocalStrategy = require('passport-local');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const app = express();
require('dotenv').config();

//!  requiring routes
// const User = require('./models/userDb');
const mainRoutes = require('./controllers/apiController');

//!  database conn
mongoose.connect(`${process.env.DB_HOST}${process.env.DB_USER}:${process.env.DB_PASS}@ds121262.mlab.com:21262/local_message`, { useNewUrlParser: true });
// mongoose.connect('mongodb://localhost:27017/right-click', { useNewUrlParser: true });

const db = mongoose.connection;
db.once('open', () => {
    console.log('connected to db');
});

//! add maxage
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


//!  mounting route
app.use('/', mainRoutes);

//  PASSPORT local CONFIGRATION
// passport.use(new LocalStrategy((username, password, done) => {
//     User.findOne({ 'local.username': username }, (err, user) => {
//         if (err) { return done(err); }
//         if (!user) {
//             return done(null, false, { message: 'Incorrect username.' });
//         }
//         const hash = user.local.password;
//         bcrypt.compare(password, hash, (error, response) => {
//             if (response === true) {
//                 return done(null, user);
//             }
//             return done(null, false, { message: 'Incorrect password.' });
//         });
//     });
// }));


// error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    const message = { err };
    res.status(err.status || 500).json(message);
});

process.on('uncaughtException', (err) => {
    console.log('Its a uncaught one: ', err);
    process.exit(1);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('server is running');
});
