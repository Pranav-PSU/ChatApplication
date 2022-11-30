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


router.get("/auth", (req, res) => {
  if (req.isAuthenticated())
    return res.status(200).json({authenticated: true}).send();
  else
    return res.status(403).json({authenticated: false}).send();
});

router.post("/register", (req, res) => {
  console.log(req.body);
  save_user(req, res);
});

// router.post(
//   "/login",
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/login",
//     failureFlash: false,
//   })
// );


router.post("/login", (req, res, next) => {
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
      if (info)
        return res
          .status(422)
          .json({ logged_in: false, message: info.message })
          .send();
    }

    req.logIn(user, (err) => {
      if (err) {
        console.log(err);
        return next(err);
      }
      console.log("successful redirect");
      return res
        .status(200)
        .json({ logged_in: true, message: "logged-in" })
        .send();
    });
  })(req, res, next);
});

module.exports = router;
