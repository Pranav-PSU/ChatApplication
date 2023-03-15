// Outline our session middleware to not take up extra space in routing.

const session = require('express-session');
require("dotenv").config();

const session_middleware = session({
    secret: process.env.SESSION_SECRET,
    credentials: true,
    name: "sid",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      expires: 1000 * 60 * 60 * 24 * 2,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", //we only want secure and sameSite to be false/lax when we're making the app and testing.
    },
  });


module.exports = session_middleware;
