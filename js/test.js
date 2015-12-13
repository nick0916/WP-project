function ischeck(buffer){
     var cloneNode = buffer.parentNode.parentNode.cloneNode(true);
     if(buffer.checked == true){
          console.log("true");
          if(Choose_Train.children.length == 0){
               Choose_Train.innerHTML = "<table id=\"t4\"><tr><th>台鐵</th><th>" + "從" +" -> " + "到" +"</th><th>By</th><th>Spend</th><th>Cost</th></tr>";
               t4.children[0].appendChild(cloneNode);               

          }
          else{
               t4.children[0].appendChild(cloneNode);               
          }
     }
     else{
          console.log("false");
          for (var i = 1; i < t4.childNodes[0].children.length; i++){
               var node = t4.childNodes[0].childNodes[i];
               var id = node.childNodes[0].childNodes[0].id;
               if (id == buffer.id){
                    console.log(typeof(id));
                    console.log(id);
                    document.getElementById(id).checked = false;
                    t4.childNodes[0].removeChild(t4.childNodes[0].childNodes[i]);
               }
               if(t4.childNodes[0].children.length == 1){
                    Choose_Train.removeChild(Choose_Train.firstChild);
               }
          } 
     }


}



