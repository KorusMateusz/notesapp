const timeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' , hour: "2-digit", minute: "2-digit"};

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
  newNote.append($("<p>",
    {
      text: note.title,
      class: "note-title"
    }));

  newNote.append($("<p>",
    { // checking if text exists and replacing line break characters
      html: convertNoteToHTML(note.note),
      class: "note-text"
    }));
  newNote.append($("<p>",
    {
      text: `Created ${new Date(note.created).toLocaleString("en", timeFormatOptions)}`,
      class: "created-timestamp"
    }));
  if(note.modified){
    newNote.append($("<p>",
      {
        text: `Last modified ${new Date(note.modified).toLocaleString("en", timeFormatOptions)}`,
        class: "modified-timestamp"
      }));
  }
  newNote.append($("<button>",
    {
      text: "Edit",
      class: "update-button",
      onclick: `beginNoteEdit("${note._id}")`
    }));
  newNote.append($("<button>",
    {
      text: "Delete",
      class: "delete-button",
      onclick: `deleteNote("${note._id}")`
    }));
  $("#notes").append(newNote);
}

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
  const form = $(".new-note-form");
  let noteTitle = form.find(".note-title");
  let noteText = form.find(".note-text");
  if(noteTitle === ""){
    return alert("You need to provide a title")
  }
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
      class: 'edit-note-title',
      value: noteTitle,
      name: 'title'}
  ));
  updateForm.append($("<textarea>",
    { type: 'text',
      class: 'edit-note-text',
      // checking if text exists and replacing line break characters
      text: convertNoteToJS(noteText),
      name: 'note'}
  ));
  updateForm.append($("<button>",
    { text: "Submit Update",
      onclick: `submitEditedNote("${noteId}")`}
  ));
  updateForm.append($("<button>",
    { text: "Cancel Edit",
      onclick: `cancelNoteEdit("${noteId}")`}
  ));
  note.append(updateForm);
}

function submitEditedNote(noteId){
  const note = $("#"+noteId);
  const form = note.find(".update-form");
  const newNoteTitle = form.find(".edit-note-title").val();
  const newNoteText = form.find(".edit-note-text").val();
  if(newNoteTitle === ""){
    return alert("You need to provide a title")
  }
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
      note.find(".modified-timestamp")
        .text(`Last modified ${new Date(data.modified).toLocaleString("en", timeFormatOptions)}`);
      form.remove();
      note.children().show();
    }
  })
}

function cancelNoteEdit(noteId){
  const note = $("#"+noteId);
  note.find(".update-form").remove();
  note.children().show();
}

