exports.sendEmails = (req, res) => {
  let email = req.body.email;
  let personName = req.body.personName;
  let roomName = req.body.roomName;
  let text = `hi there, <br> ${personName} has invited you in a chatroom "${roomName}". <br>Please click on the link below to join the conversation :<br> ${req.body.url}`;
  let subject = "Invitation for the chatroom";

  var nodemailer = require("nodemailer");
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENDER_AUTH_EMAIL,
      pass: process.env.SENDER_AUTH_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.SENDER_EMAIL_ADDRESS,
    to: email,
    subject: subject,
    html: "<h4>" + text + "</h4>",
  };
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      res.json(err);
    } else {
      res.json(info);
    }
  });
};
