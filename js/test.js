function trainCheck(buffer){
     var cloneNode = buffer.parentNode.parentNode.cloneNode(true);
     if(buffer.checked == true){
          console.log("true");
          if(Choose_Train.children.length == 0){
               Choose_Train.innerHTML = "<table id=\"t4\"><tr><th>台鐵</th><th>" + $('#train_from :selected').text() +" -> " + $('#train_to :selected').text() +"</th><th>By</th><th>Spend</th><th>Cost</th></tr>";
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

function thsrCheck(buffer){
     var cloneNode = buffer.parentNode.parentNode.cloneNode(true);
     if(buffer.checked == true){
          console.log("true");
          if(Choose_Thsr.children.length == 0){
               Choose_Thsr.innerHTML = "<table id=\"t5\"><tr><th>高鐵</th><th>" + $('#thsr_from :selected').text() +" -> " + $('#thsr_to :selected').text() +"</th><th>By</th><th>Spend</th><th>Cost</th></tr>";
               t5.children[0].appendChild(cloneNode);               

          }
          else{
               t5.children[0].appendChild(cloneNode);               
          }
     }
     else{
          console.log("false");
          for (var i = 1; i < t5.childNodes[0].children.length; i++){
               var node = t5.childNodes[0].childNodes[i];
               var id = node.childNodes[0].childNodes[0].id;
               if (id == buffer.id){
                    console.log(typeof(id));
                    console.log(id);
                    document.getElementById(id).checked = false;
                    t5.childNodes[0].removeChild(t5.childNodes[0].childNodes[i]);
               }
               if(t5.childNodes[0].children.length == 1){
                    Choose_Thsr.removeChild(Choose_Thsr.firstChild);
               }
          } 
     }
}

function busCheck(buffer){
     var cloneNode = buffer.parentNode.parentNode.cloneNode(true);
     if(buffer.checked == true){
          console.log("true");
          if(Choose_Bus.children.length == 0){
               Choose_Bus.innerHTML = "<table id=\"t6\"><tr><th>客運</th><th>" + $('#bus_route :selected').text() +"</th><th>By</th><th>Spend</th><th>Cost</th></tr>";
               t6.children[0].appendChild(cloneNode);               

          }
          else{
               t6.children[0].appendChild(cloneNode);               
          }
     }
     else{
          console.log("false");
          for (var i = 1; i < t6.childNodes[0].children.length; i++){
               var node = t6.childNodes[0].childNodes[i];
               var id = node.childNodes[0].childNodes[0].id;
               if (id == buffer.id){
                    console.log(typeof(id));
                    console.log(id);
                    document.getElementById(id).checked = false;
                    t6.childNodes[0].removeChild(t6.childNodes[0].childNodes[i]);
               }
               if(t6.childNodes[0].children.length == 1){
                    Choose_Bus.removeChild(Choose_Bus.firstChild);
               }
          } 
     }
}

