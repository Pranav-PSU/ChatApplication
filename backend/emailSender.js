const genRand = (len) => {
  return Math.random()
    .toString(36)
    .substring(2, len + 2);
};

exports.sendEmails = (req, res) => {
  let email = req.body.email;
  let text =
    "hello click here to join the chatroom: " +
    req.body.url +
    " <br> Use this password to Join the room: " +
    genRand();
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
    html: "<h2>" + text + "</h2>", // plain text body
  };
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      res.json(err);
    } else {
      res.json(info);
    }
  });
};
