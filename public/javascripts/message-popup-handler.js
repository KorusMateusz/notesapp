$(function(){
  let message = $(".message");
  if(message.length){
    $("html").append($("<div id='opacity-div'>"));
  }
  message.append("<br><br>");
  message.append($("<button>",
    {
      text: "Close",
      onclick: "closePopUp()",
      class: "btn btn-secondary"
    }));
  message.fadeIn();
});

function closePopUp(){
  $("#opacity-div").fadeOut("slow");
  $(".message").fadeOut("slow");
}