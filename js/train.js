Parse.initialize("eXa6XCYsez7lkZpf2ytbtRinq0STc1w9NvJkkf4p", "H4gpX9rYLfaYccdgjxP6OH48bPfK2jHeM8e1dr8Z");
function set_date(y, m, d){
     year = y;
     month = m;
     day = d;
     date = (y + "-" + m + "-" + d);
           document.getElementById("date").value = date;
} // 取得理想格式的時間

function get_info(url,index){
     var httpRequest;
     if (window.XMLHttpRequest) { // Mozilla, Safari, ...
          httpRequest = new XMLHttpRequest();
     } else if (window.ActiveXObject) { // IE
          httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
     }
     httpRequest.open('GET', url, true);
     httpRequest.send(null);
     httpRequest.onreadystatechange = function() {
          Contents(httpRequest);
     };
     function Contents (httpRequest) {
          if (httpRequest.readyState == 4) {
               if (httpRequest.status == 200) {
                    switch(index){
                         case 0:
                              station = JSON.parse(httpRequest.responseText);
                              get_info(train_date_api, 1);
                              break;
                         case 1:
                              train_date[day] = JSON.parse(httpRequest.responseText);
                              show_data.length = 0;
                              from_id = changeID(from);
                              to_id = changeID(to);
                              
                              
                              get_info(train_info_api, 2);
                              // console.log("from : " + from);
                              // console.log("To : " + to);
                              // console.log("date : " + date);
                              break;
                         case 2:
                              train_info[day] = JSON.parse(httpRequest.responseText);
                              find_train_time(from_id, to_id, train_date[day], train_info[day], type_choose, time_choose);
                              show_data.sort(function(a,b){
                                   return a.order > b.order ? 1 : -1;;
                              });
                              var test3="";
                              var title="<table id=\"t3\"><tr><th></th><th>" + from +" -> " + to +"</th><th>By</th><th>Spend</th><th>Cost</th></tr>";
                              var tail="</table>";
                              for(var n=0;n<show_data.length;n++){
                              test3 = test3 + "<tr><td><input type= checkbox value= Travel " + "id = train_" + n + " name=interest onclick=trainCheck(this) ></td><td>" + show_data[n].Arrival_t +" -> "+show_data[n].departure_t + "</td><td>" + show_data[n].Type + show_data[n].ID + "</td><td>" + show_data[n].during_t +"</td><td>" + show_data[n].cost +"</td></tr>";
                              }
                              test3 = title + test3 + tail;
                              if(show_data!="")
                              {
                                   $("#showTrain").html(test3);
                              }
                              
                              // console.log(show_data);
                              break;         
                         default:
                              alert ("伺服器處理錯誤");
                              break;
                    }
          }
          }
     }
} // 連API去取得資訊回來

function changeID (id) {
     for (var i = 0; i < station.length; i++)
     {
          if (id == station[i].StationName.Zh_tw)
          {
               return station[i].StationID;
          }
     }
} // 將中文站名換成代碼

function find_train_time(f_id, t_id, traindate, trainInfo, type_choose, time_choose){
     
     for (var i = 0; i < traindate.length; i ++)
     {
          type = tr_type[trainInfo[i].TrainClassification];
          if (type_choose == 2 && (type != "區間車" && type != "區間快")){
                    continue;
          }
          else if (type_choose == 1 && (type == "區間車" || type == "區間快")){
                    continue;
          }    // 篩選車型
          
          var buffer = 0;
          for (var j = 0; j < traindate[i].StoppingTimeElement.length; j++){
               
               if (f_id == traindate[i].StoppingTimeElement[j].StationID){
                    var train = new Object();
                    train.Arrival_t = traindate[i].StoppingTimeElement[j].ArrivalTime;
                    buffer = traindate[i].StoppingTimeElement[j].StopSequence;
               }
               else if (t_id == traindate[i].StoppingTimeElement[j].StationID && buffer > 0){
                    
                    
                    train.departure_t = traindate[i].StoppingTimeElement[j].DepartureTime;
                    train.ID = traindate[i].TrainNo;
                    train.Type = type;
                    train.order = cal_time(train.Arrival_t);
                    train.during_t = cal_during_t(train);
                         // 將資訊放入名為train的object

                    if (time_choose == 0 && train.order < time){
                         continue;
                    }
                    else if (time_choose == 1 && cal_time(train.departure_t) > time){
                         continue;
                    }    // 篩選條件『出發、抵達』時間

                    if(trainInfo[i].TrainClassification==0||trainInfo[i].TrainClassification==1||trainInfo[i].TrainClassification==2)
                              {
                                   train.cost = cost_3;
                              }
                              if(trainInfo[i].TrainClassification==3)
                              {
                                   train.cost = cost_2;
                              }
                              if(trainInfo[i].TrainClassification==4||trainInfo[i].TrainClassification==5||trainInfo[i].TrainClassification==6)
                              {
                                   train.cost = cost_1;
                              }  // 計算票價


                    show_data.push(train);
                    
                    break;
               }
          }
          
     }
} // 從API載下來的資料中去挑選想要車次

function cal_time(t){
     var time;
     time = parseInt(t[0]+t[1]) * 60 + parseInt(t[3]+t[4]);
     return time;
} // 計算總秒數->幫助排列從早到晚的車次

function cal_during_t(train){
     var during = cal_time(train.departure_t) - cal_time(train.Arrival_t);
     if(during>=0){
          ;
     }
     else{
     during =  1440 - cal_time(train.Arrival_t) + cal_time(train.departure_t);
     }
     var hour = parseInt(during / 60);
     var minute = during - hour*60;
     return (hour + "小時" + minute + "分");
} // 計算車程所耗費的時間


function search(a,b,c,d,e){
          
     from = a;
     to = b;
     
     if (from == to){
          return alert("上下車地點相同喔～請重新選擇");
     }    // 避免相同地點

     time_choose = c;
          // console.log(time_choose);
          // 『出發時間』的值會等於 0;
          // 『抵達時間』的值會等於 1;

     time = d;      // 『出發or抵達』時間值
     time = cal_time(time);
           
     type_choose = e;
          //『全部類型』的值等於 0;
          //『對號』的值等於 1;
          //『非對號』的值等於 2;
          
     get_cost(from,to);
           //console.log(c.date);
           date =document.getElementById("date").value;
           
           //console.log(d);
     //set_date(c.date.getFullYear(), c.date.getMonth() + 1, c.date.getDate());
          // 取得固定格式的時間 -> 以利放入api的網址中
     from_id = changeID(from);     
     to_id = changeID(to);         // 轉換中文成ID
     
     get_info(train_date_api, 1);  // 取得api中的資料（這裡會連鎖開始跑程式去篩選）
           jQuery("html,body").animate({
                                             scrollTop:$("#showTrain").offset().top
                                             },800);
} // 按鈕按下後所跑的程式

function get_cost(from,to){
     var cost;
     
     var query = new Parse.Query("cost_west");
     query.limit(200);
     query.find({
          success: function(results) {
          //console.log("1");
          //alert("Successfully retrieved " + results.length + " scores.");
          // Do something with the returned Parse.Object values
          for (var i = 0; i < results.length; i++) {
               var object = results[i];
               
               if(object.get('station')==from)
               {
                    var from_distance = object.get('distance');
               }
               else if(object.get('station')==to)
               {
                    
                    var to_distance = object.get('distance');
               }
               
               //alert(object.id + ' - ' + object.get('distance'));
          }
          sub = Math.abs(to_distance - from_distance);
          if(sub<10)
          {
               cost_1=15;
               cost_2=18;
               cost_3=23;
          }
          else
          {
               cost_1=Math.ceil(1.46*sub);
               cost_2=Math.ceil(1.75*sub);
               cost_3=Math.ceil(2.27*sub);
          }
          /*console.log(cost_1);
          console.log(cost_2);
          console.log(cost_3);*/
          /*console.log(sub);
          console.log(type);
          console.log(dir);
          console.log(cost);*/
          //return cost;
          
          //alert(to_distance);
          },
          error: function(error) {
               alert("Error: " + error.code + " " + error.message);
          }
     });
}// 取的票價

function trainCheck(buffer){
     var cloneNode = buffer.parentNode.parentNode.cloneNode(true); // 複製一個新的node
     if(buffer.checked == true){
          if(Choose_Train.children.length == 0){ 
               Choose_Train.innerHTML = "<table id=\"t5\"><tr><th>台鐵</th><th>" + $('#train_from :selected').text() +" -> " + $('#train_to :selected').text() +"</th><th>By</th><th>Spend</th><th>Cost</th></tr>";
               t4.children[0].appendChild(cloneNode);               

          } // 建立首欄＆新增喜好時刻
          else{
               t4.children[0].appendChild(cloneNode);               
          }
     }
     else{
          for (var i = 1; i < t4.childNodes[0].children.length; i++){
               var node = t4.childNodes[0].childNodes[i];
               var id = node.childNodes[0].childNodes[0].id;
               if (id == buffer.id){
                    console.log(typeof(id));
                    console.log(id);
                    document.getElementById(id).checked = false;
                    t4.childNodes[0].removeChild(t4.childNodes[0].childNodes[i]);
               } // 刪除喜好時刻 & 取消勾選
               if(t4.childNodes[0].children.length == 1){
                    Choose_Train.removeChild(Choose_Train.firstChild);
               } // 刪除首欄
          } 
     }
}// 選取喜好的火車時段
