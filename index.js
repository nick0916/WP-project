$(document).ready(function(){

    setInterval(function(){
      $.ajax({
            method: "POST",
            url: "do.php"
        }).done(function(data){
            $("#board").html(data);
        })
    }, 100);

    $('#send').click(function(){
        $.ajax({
            method: "POST",
            url: "do.php",
            data: {name: $('#name').val(),message: $('textarea#message').val()}
        }).done(function(data){
            $("#board").html(data);
            $('input').val("");
        });
    });
});
