const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  strategy: String,
  username: String,
  authId: String,
  registered: Date
});

const User = mongoose.model("user", userSchema);

const localRegistrationTokenSchema = new Schema({
  username: String,
  email: String,
  token: String,
  date: Date
});

module.exports = User;
