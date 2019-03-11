$(function(){
  let message = $(".message");
  message.append("<br>");
  message.append($("<button>",
    {
      text: "Close",
      onclick: "closePopUp()"
    }));
  message.fadeIn();
});

function closePopUp(){
  $(".message").fadeOut("slow");
}