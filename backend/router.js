const express = require("express");
const router = express.Router();
const emailSender = require("./emailSender");
// router.post("/invitePeople", (req, res) => {
//   const body = req.body;
// });
router.post("/invitePeople", emailSender.sendEmails);
module.exports = router;
