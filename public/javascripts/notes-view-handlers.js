const formatDate = (date) => new Date(date).toLocaleString("en",
  { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' , hour: "2-digit", minute: "2-digit"});

function convertNoteToHTML(text){
  if(text) {
    return text.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }
  return "";
}

function convertNoteToJS(text){
  if (text) {
    return text.replace(/<br>/g, "\n");
  }
  return "";
}

function appendNewNote(note) {
  // append new note to the document
  let newNote = $(`<div>`,
    {
      id: note._id,
      class: "note"
    });
  newNote.append($("<div>",
    {
      text: note.title,
      class: "note-title"
    }));

  newNote.append($("<div>",
    { // checking if text exists and replacing line break characters
      html: convertNoteToHTML(note.note),
      class: "note-text"
    }));
  newNote.append($("<div>",
    {
      text: `Created: ${formatDate(note.created)}`,
      class: "created timestamp"
    }));
  newNote.append($("<div>",
    {
      text: `Last modified: ${formatDate(note.modified)}`,
      class: "modified timestamp"
    }));
  let buttonDiv = ($("<div class='note-control-buttons'>"));
  buttonDiv.append($("<button>",
    {
      text: "Edit",
      class: "update-button",
      onclick: `beginNoteEdit("${note._id}")`
    }));
  buttonDiv.append($("<button>",
    {
      text: "Delete",
      class: "delete-button",
      onclick: `deleteNote("${note._id}")`
    }));
  newNote.append(buttonDiv);
  $("#notes").append(newNote);
}

// load users notes and make textarea elements auto resizable
$(function() {
  $.ajax({
    url: '/user/notes/fetch',
    type: 'get',
    success: function (data) {
      data.forEach((note) => appendNewNote(note))
    }
  });
});

function createNote(){
  const form = $("#new-note-form");
  let noteTitle = form.find(".note-title");
  let noteText = form.find(".note-text");
  $.ajax({
    url: '/user/notes',
    type: 'post',
    data:{
      title: noteTitle.val(),
      note: noteText.val()
    },
    success: function(data) {
      appendNewNote(data);
      // clear input fields
      noteTitle.val("");
      noteText.val("");
    }
  })

}

function deleteNote(noteId){
  $.ajax({
    url: '/user/notes?noteId=' + noteId,
    type: 'delete',
    success: function() {
      $("#"+noteId).remove()
    }
  })
}

function beginNoteEdit(noteId){
  const note = $("#"+noteId);
  const noteTitle = note.find(".note-title").text();
  const noteText = note.find(".note-text").html();
  note.children().hide();
  let updateForm = $(`<div class="update-form"/>`);
  updateForm.append($("<input>",
    { type: 'text',
      class: 'note-title note-input-field edit-note-title',
      value: noteTitle,
      name: 'title',
      autocomplete: "off"}
  ));
  updateForm.append($("<textarea>",
    { type: 'text',
      class: 'note-text note-input-field edit-note-text',
      // checking if text exists and replacing line break characters
      text: convertNoteToJS(noteText),
      name: 'note',
      autocomplete: "off"}
  ));
  let buttonDiv = ($("<div class='note-control-buttons'>"));
  buttonDiv.append($("<button>",
    { text: "Submit Update",
      onclick: `submitEditedNote("${noteId}")`}
  ));
  buttonDiv.append($("<button>",
    { text: "Cancel Edit",
      onclick: `cancelNoteEdit("${noteId}")`}
  ));
  updateForm.append(buttonDiv);
  note.append(updateForm);
}

function submitEditedNote(noteId){
  const note = $("#"+noteId);
  const form = note.find(".update-form");
  const newNoteTitle = form.find(".edit-note-title").val();
  const newNoteText = form.find(".edit-note-text").val();
  $.ajax({
    url: '/user/notes',
    type: 'put',
    data:{
      noteId: noteId,
      title: newNoteTitle,
      note: newNoteText
    },
    success: function(data) {
      //update title and text fields with new values
      note.find(".note-title").text(newNoteTitle);
      note.find(".note-text").html(convertNoteToHTML(newNoteText));
      //update field with new timestamp
      form.remove();
      note.children().show();
      note.find(".modified")
        .text(`Last modified: ${formatDate(data.modified)}`);
    }
  })
}

function cancelNoteEdit(noteId){
  const note = $("#"+noteId);
  note.find(".update-form").remove();
  note.children().show();
}

