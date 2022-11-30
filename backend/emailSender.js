const genRand = (len) => {
  return Math.random()
    .toString(36)
    .substring(2, len + 2);
};

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
      user: "dharamthokpranav@gmail.com",
      pass: "wrectzhamtdiqasj",
    },
  });
  const mailOptions = {
    from: "dharamthokpranav@gmail.com", // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    html: "<h4>" + text + "</h4>", // plain text body
  };
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      res.json(err);
    } else {
      res.json(info);
    }
  });
};
