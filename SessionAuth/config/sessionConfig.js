// sessionConfig.js
const session = require('express-session');
const MongoStore = require('connect-mongo');

const sessionConfig = session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.DB_STRING,
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        httpOnly: true,
        secure: false, // Set to true if using HTTPS
    },
});

module.exports = sessionConfig;
