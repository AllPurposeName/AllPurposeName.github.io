$(".tldr").mouseover(function() {
  $(this).parent().children(".popup").show();
}).mouseout(function() {
  $(this).parent().children(".popup").hide();
});
