const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "mail35.mydevil.net",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD
  }
});

function sendMail(recipient, subject, message, callback){
  const mailOptions = {
    from: `The Notes App \<${process.env.EMAIL_ADDRESS}\>`,
    to: recipient,
    subject: subject,
    text: message
  };
  transporter.sendMail(mailOptions, callback);
}

module.exports = sendMail;