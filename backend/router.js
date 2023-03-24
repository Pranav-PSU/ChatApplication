const express = require("express");
const router = express.Router();
const emailSender = require("./emailSender");

/**
 * Router for inviting people to the chatroom via email
 */
router.post("/chatroomInvitation", emailSender.emailSender);
module.exports = router;
