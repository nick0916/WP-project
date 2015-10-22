$(document).ready(function(){

    
	

    $('button').click(function(){
        $.ajax({
            method: "POST",
            url: "do.php",
            data: {name: $('#name').val(),message: $('textarea#message').val()}
        }).done(function(data){
			
            $("#board").html(data);
            //$('input').val("");
        });
    });
<<<<<<< HEAD
	setInterval(function(){
      $.ajax({
            method: "POST",
            url: "show.php"
        }).done(function(data){
            $("#board").html(data);
        })
    }, 100);
    /*$(document).keydown(function(e){
       if(e.keyCode == 13) {
           $.ajax({
                method: "POST",
                url: "do.php",
                data: {name: $('#name').val(),message: $('#message').val()}}
            }).done(function(data){
                $("#board").html(data);
                $('input').val("");
            });
       }
    });*/
});
=======
});
>>>>>>> d613dc0e7d923f59402822393693f204d22d06ed
