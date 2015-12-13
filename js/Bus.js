Parse.initialize("eXa6XCYsez7lkZpf2ytbtRinq0STc1w9NvJkkf4p", "H4gpX9rYLfaYccdgjxP6OH48bPfK2jHeM8e1dr8Z");
function bus_time(a,b,c){
     var rid = a;
     var b_t = b;
     var bus_info;
     var a_t;
     var bus = Parse.Object.extend("bus3");
     var da = document.getElementById("date").value;
     da=da.replace(/-/, "\/");
     da=da.replace(/-/, "\/");
     //alert(da);
     var d =new Date(da);
     var test="";
     week = new Array("sun","mon","tue","wed","thu","fri","sat");
     var weekday = week[d.getDay()];
     var title="<table id=\"t3\"><tr><th></th><th>" + c +"</th><th>By</th><th>Spend</th><th>Cost</th></tr>";
     var tail="</table>";
     var query = new Parse.Query(bus);

     query.limit(1000);
     query.equalTo("routeid", rid);
     query.find({
          success: function(results) {
         
               // Do something with the returned Parse.Object values
               for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    var temp = object.get(weekday);
                 
                    if(object.get(weekday)!="-"){
                         temp = temp.substr(0,2);
                         temp = parseInt(temp);

                         if(temp>=b_t){
                              a_t = arrive_time(rid,object.get(weekday));
                              test = test + "<tr><td><input type=\"checkbox\" value=\"Travel\" name=\"Interest\"></td><td>" + object.get(weekday) +" -> "+a_t + "</td><td>" + "和欣客運" + "</td><td>" + during_time +"</td><td>" + bus_cost +    "</td></tr>";
                              /*console.log(object.get(weekday));
                              console.log(a_t);
                              console.log(during_time);
                              console.log(bus_cost);*/
                         }
                    }
               }
               test = title + test + tail;
               
               $("#showCoach").html(test);
               jQuery("html,body").animate({
                      scrollTop:$("#showCoach").offset().top
               },800);
          },
          error: function(error) {
               alert("Error: " + error.code + " " + error.message);
          }
     });
}
function arrive_time(a,b){
     var c=cal_time(b);

     var a_time;

     if(a==1||a==2||a==3||a==4){
          during_time="4小時30分";
          if(a==1||a==2){
               bus_cost="600/499/399";
          }
          else{
               bus_cost="400/340/220";
          }
          a_time=c+270;
          if(a_time<1440)
          {
               var hour = parseInt(a_time / 60);
               var minute = a_time - hour*60;
               if(hour<10)
               {hour = '0'+hour;}
               if(minute<10)
               {minute = '0'+minute;}
               return (hour + ":" + minute );
          }
          else{
               a_time = a_time-1440;
               var hour = parseInt(a_time / 60);
               var minute = a_time - hour*60;
               if(hour<10)
               {hour = '0'+hour;}
               if(minute<10)
               {minute = '0'+minute;}
               return (hour + ":" + minute );
          }
     }
     else if(a==5||a==6){
          during_time="5小時30分";
          bus_cost="710/600/600";
          a_time=c+330;

          if(a_time<1440)
          {
               var hour = parseInt(a_time / 60);
               var minute = a_time - hour*60;
               if(hour<10)
               {hour = '0'+hour;}
               if(minute<10)
               {minute = '0'+minute;}
               return (hour + ":" + minute );
          }
          else
          {
               a_time = a_time-1440;
               var hour = parseInt(a_time / 60);
               var minute = a_time - hour*60;
               if(hour<10)
               {hour = '0'+hour;}
               if(minute<10)
               {minute = '0'+minute;}
               return (hour + ":" + minute );
          }

          }
          else if(a==7||a==8)
          {
               during_time="1小時25分";
               bus_cost="150";
               a_time=c+85;
               var hour = parseInt(a_time / 60);
               var minute = a_time - hour*60;
               if(hour<10)
               {hour = '0'+hour;}
               if(minute<10)
               {minute = '0'+minute;}
               return (hour + ":" + minute );
          }
          else if(a==9||a==10)
          {
               during_time="2小時0分";
               bus_cost="230/200/140";
               a_time=c+120;

               if(a_time<1440)
               {
                    var hour = parseInt(a_time / 60);
                    var minute = a_time - hour*60;
                    if(hour<10)
                    {hour = '0'+hour;}
                    if(minute<10)
                    {minute = '0'+minute;}
                    return (hour + ":" + minute );
               }
               else
               {
                    a_time = a_time-1440;
                    var hour = parseInt(a_time / 60);
                    var minute = a_time - hour*60;
                    if(hour<10)
                    {hour = '0'+hour;}
                    if(minute<10)
                    {minute = '0'+minute;}
                   return (hour + ":" + minute );
               }
          }
          else if(a==11||a==12)
          {
               during_time="2小時30分";
               bus_cost="170/140/140";
               a_time=c+120;

               if(a_time<1440)
               {
                    var hour = parseInt(a_time / 60);
                    var minute = a_time - hour*60;
                    if(hour<10)
                    {hour = '0'+hour;}
                    if(minute<10)
                    {minute = '0'+minute;}
                   return (hour + ":" + minute );
               }
               else
               {
                    a_time = a_time-1440;
                    var hour = parseInt(a_time / 60);
                    var minute = a_time - hour*60;
                    if(hour<10)
                    {hour = '0'+hour;}
                    if(minute<10)
                    {minute = '0'+minute;}
                    return (hour + ":" + minute );
               }
          }
}