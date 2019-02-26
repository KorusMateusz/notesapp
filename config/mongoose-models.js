const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  strategy: String,
  username: String,
  authId: String
});

const User = mongoose.model("user", userSchema);

module.exports = User;
