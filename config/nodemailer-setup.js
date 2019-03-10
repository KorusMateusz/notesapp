const nodemailer = require("nodemailer");
const pug = require("pug");


const transporter = nodemailer.createTransport({
  host: "mail35.mydevil.net",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD
  }
});

function sendTokenMail(recipient, messageOptions, callback){
  const capitalizedSubject = messageOptions.subject.charAt(0).toUpperCase() + messageOptions.subject.slice(1);
  const mailOptions = {
    from: `The Notes App \<${process.env.EMAIL_ADDRESS}\>`,
    to: recipient,
    subject: capitalizedSubject,
    html: compiledTemplate(messageOptions)
  };
  transporter.sendMail(mailOptions, callback);
}

const compiledTemplate = pug.compileFile("views/email-template.pug");

module.exports = sendTokenMail;