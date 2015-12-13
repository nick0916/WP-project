function ischeck(buffer){
     if(buffer.checked == true)
          console.log("true")
     else
          console.log("false")

     buffer = buffer.parentNode;
     buffer = buffer.parentNode;
     buffer = buffer.childNodes;

     for (var i = 0; i < buffer.length; i++){
          console.log(buffer[i].innerHTML);
     }


} 

