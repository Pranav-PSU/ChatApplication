const express = require("express");
const router = express.Router();
const emailSender = require("./emailSender");
const passport = require("passport");
const {
  redirect_auth,
  redirect_not_auth,
  save_user,
} = require("./libs/login_functions");
// router.post("/invitePeople", (req, res) => {
//   const body = req.body;
// });
router.post("/invitePeople", emailSender.sendEmails);


// Not used yet
router.get("/auth", (req, res) => {
  if (req.isAuthenticated())
    return res.status(200).json({authenticated: true}).send();
  else
    return res.status(403).json({authenticated: false}).send();
});


// Post from backend to save the user's data on register.
router.post("/register", (req, res) => {
  console.log(req.body);
  save_user(req, res);
});


// Alternative that has not been made to work
// router.post(
//   "/login",
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/login",
//     failureFlash: false,
//   })
// );


// Post from backend to log the user in and authenticate with passport.
router.post("/login", (req, res, next) => {
  // Passport will authenticate using the local strategy in login_functions.js
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      console.log(err);
      return res
        .status(422)
        .json({
          logged_in: false,
          message: err.message,
        })
        .send();
    }

    if (!user) {
      // If the user is not authenticated, passport will send back a message that we specify.
      // The message is not an error, but is returned as info.
      if (info)
        return res
          .status(422)
          .json({ logged_in: false, message: info.message })
          .send();
    }

    // We use passport's logIn function to log the user in manually 
    req.logIn(user, (err) => {
      if (err) {
        console.log(err);
        return next(err);
      }
      return res
        .status(200)
        .json({ logged_in: true, message: "logged-in" })
        .send();
    });
  })(req, res, next);
});

module.exports = router;
