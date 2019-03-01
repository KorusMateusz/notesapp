var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', { title: 'weclome', user: req.user, event: req.query.event});
});

const sendMail = require("../config/nodemailer-setup");
router.get('/testmail', function(req, res) {
  sendMail("ogkorus@gmail.com", "test", "this is test", (err, done) =>{
    if (err) return res.send(err);
    return res.send(done);
  })
});


module.exports = router;
