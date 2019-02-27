const sendMail = require("./nodemailer-setup");
const crypto = require("crypto");
const User = require("./mongoose-models").User;


function checkIfAlreadyRegistered(email, callback){
  User.findOne({authId: email, strategy: "local"}).then((currentUser)=>{
    if(currentUser){
      return callback(true);
    }
    return callback(false);
  });
}

function createAndSendNewToken(email, username, callback){
  checkIfAlreadyRegistered(email, (alreadyRegistered)=>{
    if (alreadyRegistered){
      return callback("Already registered")
    }
    const token = crypto.randomBytes(16).toString('hex');
    new User({
      strategy: "local",
      username: username,
      authId: email,
      localStrategyToken: token,
      registered: new Date()
    }).save().then((newUser)=>{
      console.log("new user created: " + newUser);
      sendMail(email, "The Notes App - registration", token, callback("Registration mail sent successfully"));
    });
  });
}

module.exports = {createAndSendNewToken};