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

// router.get("/", redirect_not_auth, (req, res) => {
//   console.log("hi");
// });

router.get("/auth", (req, res) => {
  console.log("REACHED AUTH ROUTER");
  res.status(200).send();
});

router.get("/register", redirect_auth, (req, res) => {
  console.log("register");
});

router.post("/register", (req, res) => {
  console.log(req.body);
  save_user(req, res);
});

router.get("/login", redirect_auth, (req, res) => {
  console.log("GET LOGIN ROUTER");
});

// router.post(
//   "/login",
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/login",
//     failureFlash: false,
//   })
// );

// router.post("/login", (req, res) => {
//   console.log("Hello");
// })

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
      // return next(err);
    }

    if (!user) {
      if (info)
        return res
          .status(422)
          .json({ logged_in: false, message: info.message })
          .send();
      // return res
      //   .status(422)
      //   .json({
      //     logged_in: false,
      //     message: `${"No user found with those credentials!"}`,
      //   })
      //   .send();
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
