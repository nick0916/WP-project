$(document).ready(function(){

    
	

    $('button').click(function(){
        $.ajax({
            method: "POST",
            url: "do.php",
            data: {name: $('#name').val(),message: $('textarea#message').val()},
			error: function(xhr) {
          alert('Ajax request 發生錯誤');
		  alert(xhr);
        },
        success: function(response) {
          $("#board").html(response);
		  alert('ok');
		  alert(response);
        }
        
    });
	});
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