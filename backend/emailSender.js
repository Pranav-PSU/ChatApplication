const nodemailer = require("nodemailer");

/**
 * SMTP transport configuration for nodemailer
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_AUTH_EMAIL,
    pass: process.env.SENDER_AUTH_PASSWORD,
  },
});

/**
 * Function for sending emails to the people you want to invite to the chatroom
 * @param {*} req
 * @param {*} res
 */

exports.emailSender = async (req, res) => {
  const { email, personName, roomName, url } = req.body;
  let text = `hi there, <br> ${personName} has invited you in a chatroom "${roomName}". <br>Please click on the link below to join the conversation :<br> ${req.body.url}`;
  let subject = "Invitation for the chatroom";

  const mailOptions = {
    from: process.env.SENDER_EMAIL_ADDRESS,
    to: email,
    subject: subject,
    html: `<h4>${text}</h4>`,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    res.json(info);
  } catch (error) {
    res.json(error);
  }
};
