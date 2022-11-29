const express = require("express");
const router = express.Router();
const emailSender = require("./emailSender");
const passport = require("passport");
const {redirect_auth, redirect_not_auth} = require("./libs/login_functions")
// router.post("/invitePeople", (req, res) => {
//   const body = req.body;
// });
router.post("/invitePeople", emailSender.sendEmails);


router.get("/", redirect_not_auth, (req, res) => {
});


router.get("/register", redirect_auth, (req, res) => {
});

router.post("/register", redirect_auth, (req, res) => {
  console.log(req.body);
  save_user(req, res);
});

router.get("/login", redirect_auth, (req, res) => {
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: false,
  })
);

// router.post("/login", (req, res, next) => {
//   passport.authenticate("local", function (err, user, info) {
//     if (err) 
//     {
//       console.log(err);
//       return next(err);
//     }

//     if (!user) {
//       console.log("NO USER");
//       return res.redirect("http://localhost:5000/login");
//     }

//     req.logIn(user, (err) => {
//       if (err)
//       {
//         console.log(err);
//         return next(err);
//       }
//       console.log("successful redirect?")
//       return res.redirect("http://localhost:5000");
//     });
//   })(req, res, next);
// });


module.exports = router;
