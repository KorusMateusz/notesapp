const sendMail = require("./nodemailer-setup");
const crypto = require("crypto");

const token = crypto.randomBytes(16).toString('hex');




module.exports = {};