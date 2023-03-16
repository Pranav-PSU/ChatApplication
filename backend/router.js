const express = require("express");
const router = express.Router();
const emailSender = require("./emailSender");

router.post("/invitePeople", emailSender.sendEmails);
module.exports = router;
