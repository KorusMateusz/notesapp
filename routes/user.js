var express = require('express');
var router = express.Router();
const crudHandlers = require("../config/notes-crud-handlers");

const ensureAuthenticated = (req, res, next) => {
  if(!req.user){ // if not logged in
    return res.redirect("/auth/login")
  }
  next()
};

router.get('/', ensureAuthenticated, function(req, res) {
  res.render('profile', {user: req.user});
});

router.get('/notes', ensureAuthenticated, function(req, res) {
  crudHandlers.readNotes(req.user._id, (err, done) =>{
    if (err) return res.render(err);
    return res.render('notes', {user: req.user, notes: done})
  });
});

router.post('/notes', ensureAuthenticated, function(req, res){
  crudHandlers.createNote(req.user._id, req.body.title, req.body.note, (err, done)=>{
    if (err) return res.send(err);
    return res.send("success")
  })
});

router.put('/notes', ensureAuthenticated, function(req, res){
  crudHandlers.updateNote(req.body.noteId, req.body.title, req.body.note, (err, done)=>{
    if (err) return res.send(err);
    return res.send(done);
  })
});

router.delete('/notes', function(req, res){
  crudHandlers.deleteNote(req.query.noteId, (err, done)=>{
    if (err) return res.send(err);
    return res.send(done)
  });
});

module.exports = router;
