const sendMail = require("./nodemailer-setup");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("./mongoose-models").User;


function checkIfAlreadyRegistered(email, callback){
  User.findOne({email: email, strategy: "local"}).then((currentUser)=>{
    if(currentUser){
      return callback(true);
    }
    return callback(false);
  });
}

function createUserAndSendToken(email, username, callback){
  checkIfAlreadyRegistered(email, (alreadyRegistered)=>{
    if (alreadyRegistered){
      return callback("Already registered")
    }
    const token = crypto.randomBytes(16).toString('hex');
    new User({
      strategy: "local",
      username: username,
      email: email,
      localStrategyToken: token,
      registered: new Date()
    }).save().then((newUser)=>{
      console.log("new user created: " + newUser);
      sendMail(email, "The Notes App - registration", `http://localhost:3000/auth/passwordsetup?token=${token}`,
        callback("Registration mail sent successfully"));
    });
  });
}

function createNewPassword(token, newPassword, callback){
  const hash = bcrypt.hashSync(newPassword, 12);
  User.findOneAndUpdate({localStrategyToken: token}, {password: hash, localStrategyToken: null}, callback);
}

module.exports = {createUserAndSendToken, createNewPassword};