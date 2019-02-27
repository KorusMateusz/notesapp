const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  strategy: String,
  username: String,
  authId: String,
  localStrategyToken: String, // token used for setting and resetting password via email
  registered: Date
});

const User = mongoose.model("user", userSchema);

module.exports = {User};
