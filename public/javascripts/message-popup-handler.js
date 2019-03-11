$(function(){
  let message = $(".message");
  if(message.length){
    $("html").append($("<div id='opacity-div'>"));
  }
  message.append("<br>");
  message.append($("<button>",
    {
      text: "Close",
      onclick: "closePopUp()"
    }));
  message.fadeIn();
});

function closePopUp(){
  $("#opacity-div").fadeOut("slow");
  $(".message").fadeOut("slow");
}