const Note = require("./mongoose-models").Note;


function createNote (userId, title, note, callback) {
  note = new Note({
    userId: userId,
    title: title,
    note: note,
    created: new Date(),
    modified: new Date()
  });
  note.save().then(callback)
}

function readNotes (userId, callback) {
  Note.find({userId: userId}, callback)
}

function updateNote (noteId, title, note, callback) {
  Note.findByIdAndUpdate(noteId, {title: title, note: note, modified: new Date()}, {new: true},  callback)
}

function deleteNote (noteId, callback) {
  Note.findByIdAndDelete(noteId, callback)
}

module.exports = {createNote, readNotes, updateNote, deleteNote};
