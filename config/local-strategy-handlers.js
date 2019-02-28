const sendMail = require("./nodemailer-setup");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("./mongoose-models").User;


const createToken = () => crypto.randomBytes(16).toString('hex');

function checkIfRegistered(email, callback){
  User.findOne({authId: email, strategy: "local"}).then((currentUser)=>{
    if(currentUser){
      return callback(currentUser);
    }
    return callback(false);
  });
}

function createUserAndSendToken(email, username, callback){
  checkIfRegistered(email, (alreadyRegistered)=>{
    if (alreadyRegistered){
      return callback("Already registered")
    }
    const token = createToken();
    new User({
      strategy: "local",
      username: username,
      authId: email,
      localStrategyToken: token,
      registered: new Date()
    }).save().then((newUser)=>{
      sendMail(email, "The Notes App - registration", `Welcome, ${newUser.username}, here's your activation link: 
      http://localhost:3000/auth/passwordsetup?token=${token}`,
        callback("Registration mail sent successfully"));
    });
  });
}

function createAndSendNewToken (email, callback){
  checkIfRegistered(email, (user)=>{
    if (!user){
      return callback("Email not found")
    }
    const token = createToken();
    user.localStrategyToken = token;
    user.save().then((newUser)=> {
      sendMail(email, "The Notes App - password reset", `Welcome, ${newUser.username}, here's your password reset link: 
      http://localhost:3000/auth/passwordsetup?token=${token}`,
        callback("Password reset mail sent successfully"));
    });
  });
}

function createNewPassword(token, newPassword, callback){
  const hash = bcrypt.hashSync(newPassword, 12);
  User.findOneAndUpdate({localStrategyToken: token}, {password: hash, localStrategyToken: null}, callback);
}

module.exports = {createUserAndSendToken, createAndSendNewToken, createNewPassword};