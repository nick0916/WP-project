Parse.initialize("eXa6XCYsez7lkZpf2ytbtRinq0STc1w9NvJkkf4p", "H4gpX9rYLfaYccdgjxP6OH48bPfK2jHeM8e1dr8Z");

var from = "";
var to = "";
// 出發地點預設值

var now = new Date();
var y = now.getFullYear();
var m = now.getMonth() + 1;
var d = now.getDate();
set_date(y, m, d);
// 時間預設值（當天）

var time_choose = 0;
var type_choose = 0;
var time = "00:00";
time = cal_time(time);
// 客人選擇預設為『出發時間』、『全部類型』

var buy;
var train_date = [];
var train_info = [];
var station = [];
var tr_type = ["太魯閣號", "新自強", "自強", "莒光", "復興", "區間快", "區間車", "電車", "兩鐵", "單機迴送", "客迴", "普快車", "普通貨車", "普通車", "柴客", "柴快車", "柴油車" ,"柴迴", "特種", "臨時客迴", "行包專車", "試轉運", "調車列車"];
var tr_diration = ["去程", "返程", "順行", "逆行" ,"南下", "北上"];
var tr_line = ["不經山海線", "山線", "海線"];
var show_data = [];
var from_id;
var to_id;
get_cost(from,to);
document.getElementById("date").value = date;
var station_num;



var station_api = "http://210.59.250.227:80/MOTC/v1/Rail/TRA/Station?%24format=json";
get_info(station_api, 0);
var train_info_api = "http://210.59.250.227:80/MOTC/v1/Rail/TRA/TrainInfo/" + date + "?%24format=json";
var train_date_api = "http://210.59.250.227:80/MOTC/v1/Rail/TRA/DailyTimetable/" + date + "?%24format=json";
                  
var cost_1;
var cost_2;
var cost_3;

function set_date(y, m, d){
     year = y;
     month = m;
     day = d;
     date = (y + "-" + m + "-" + d);
     data2= (y + "/" + m + "/" + d);
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
			      buy_ticket(n);
                              test3 = test3 + "<tr><td><input type= checkbox value= Travel " + "id = train_" + n + " name=interest onclick=trainCheck(this) ></td><td>" + show_data[n].Arrival_t +" -> "+show_data[n].departure_t + "</td><td>" + show_data[n].Type + show_data[n].ID + "</td><td>" + show_data[n].during_t +"</td><td>" + show_data[n].cost +"<a target="+"_blank"+" href="+buy+" > buy</a>"+"</td></tr>";
                              }
                              test3 = title + test3 + tail;
                              
							  if(show_data!="")
							  {	
                              setTimeout(function(){$("#S1").html(test3);},1000);
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

					//console.log(train.cost);
					
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


function search(a,b,c,d,e,f){
          
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
          
     
           //console.log(c.date);
     date =document.getElementById("date").value;
     get_cost(from,to);      
           //console.log(d);
     //set_date(c.date.getFullYear(), c.date.getMonth() + 1, c.date.getDate());
          // 取得固定格式的時間 -> 以利放入api的網址中
     from_id = changeID(from);     
     to_id = changeID(to);         // 轉換中文成ID
     
     get_info(train_date_api, 1);  // 取得api中的資料（這裡會連鎖開始跑程式去篩選）
	 
	 if(f==0)
	 {
	 loadTab("<a href=\"javascript://\" onclick=\"loadTab(this,1,0);\"><span>台鐵</span></a>",1,0);
	 $('#tabsC').modal();
	 }
	 
          /* jQuery("html,body").animate({
                                             scrollTop:$("#tabsC").offset().top
                                             },800);*/
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
               Choose_Train.innerHTML = "<table id=\"t5\"><tr><th>台鐵</th><th>" + from +" -> " + to +"</th><th>By</th><th>Spend</th><th>Cost</th></tr>";
               t5.children[0].appendChild(cloneNode);               

          } // 建立首欄＆新增喜好時刻
          else{
               t5.children[0].appendChild(cloneNode);               
          }
     }
     else{
          for (var i = 1; i < t5.childNodes[0].children.length; i++){
               var node = t5.childNodes[0].childNodes[i];
               var id = node.childNodes[0].childNodes[0].id;
               if (id == buffer.id){
                    document.getElementById(id).checked = false;
                    t5.childNodes[0].removeChild(t5.childNodes[0].childNodes[i]);
               } // 刪除喜好時刻 & 取消勾選
               if(t5.childNodes[0].children.length == 1){
                    Choose_Train.removeChild(Choose_Train.firstChild);
                    break;
               } // 刪除首欄
          } 
     }
}// 選取喜好的火車時段

function buy_ticket(n){
buy="http://railway.hinet.net/ctno1.htm?from_station=";
var  x1=from;
var x2=to;
var x3=show_data[n].ID;
change_num(x1);
buy=buy+station_num;
buy=buy+"&to_station=";
change_num(x2);
buy=buy+station_num;
buy=buy+"&getin_date="+data2+"&train_no="+x3;
}


function change_num(station_name)
{
if(station_name=="貢寮")
station_num="084";
else if(station_name=="雙溪")
station_num="085";
else if(station_name=="牡丹")
station_num="086";
else if(station_name=="三貂嶺")
station_num="087";
else if(station_name=="猴硐")
station_num="088";
else if(station_name=="瑞芳")
station_num="089";
else if(station_name=="四腳亭")
station_num="090";
else if(station_name=="基隆")
station_num="092";
else if(station_name=="八堵")
station_num="093";
else if(station_name=="七堵")
station_num="094";
else if(station_name=="汐止")
station_num="096";
else if(station_name=="南港")
station_num="097";
else if(station_name=="松山")
station_num="098";
else if(station_name=="台北")
station_num="100";
else if(station_name=="萬華")
station_num="101";
else if(station_name=="板橋")
station_num="102";
else if(station_name=="樹林")
station_num="103";
}


