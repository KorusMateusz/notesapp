const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  strategy: String,
  username: String,
  authId: String,
  localStrategyToken: String, // token used for setting and resetting password via email
  password: String,
  registered: Date
});

const User = mongoose.model("user", userSchema);

const noteSchema = new Schema({
  userId: String,
  title: String,
  note: String,
  created: Date,
  modified: Date
});

const Note = mongoose.model("note", noteSchema);

module.exports = {User, Note};
