const timeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' , hour: "2-digit", minute: "2-digit"};

function createNote(){
  const form = $(".new-note-form");
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
      // append new note to the document
      let newNote = $(`<div>`,
        { id: data._id,
          class: "note"
      });
      newNote.append($("<p>",
        { text: data.title,
          class: "note-title"
        }));
      newNote.append($("<p>",
        { text: data.note,
          class: "note-text"
        }));
      newNote.append($("<p>",
        { text: `Created ${new Date(data.created).toLocaleString("en", timeFormatOptions)}`,
          class: "created-timestamp"
        }));
      newNote.append($("<button>",
        { text: "Edit",
          class: "update-button",
          onclick: `beginNoteEdit("${data._id}")`
        }));
      newNote.append($("<button>",
        { text: "Delete",
          class: "delete-button",
          onclick: `deleteNote("${data._id}")`
        }));
      $("#notes").append(newNote);
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
    success: function(data) {
      $("#"+noteId).remove()
    }
  })
}

function beginNoteEdit(noteId){
  const note = $("#"+noteId);
  const noteTitle = note.find(".note-title").text();
  const noteText = note.find(".note-text").text();
  note.children().hide();
  let updateForm = $(`<div class="update-form"/>`);
  updateForm.append($("<input>",
    { type: 'text',
      class: 'edit-note-title',
      value: noteTitle,
      name: 'title'}
  ));
  updateForm.append($("<input>",
    { type: 'text',
      class: 'edit-note-text',
      value: noteText,
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
      note.find(".note-text").text(newNoteText);
      if(!note.find(".modified-timestamp").text()){
        //if note wasn't modified before, add "modified" field
        note.find(".created-timestamp").after($("<p> Last modified <div class='modified-timestamp'></div></p>"));
      }
      //update field with new timestamp
      note.find(".modified-timestamp").text(new Date().toLocaleString("en", timeFormatOptions));
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