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
     date2= (y + "/" + m + "/" + d);
     
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
			      if(show_data[n].type=="區間車")
			      test3 = test3 + "<tr><td><input type= checkbox value= Travel " + "id = train_" + n + " name=interest onclick=trainCheck(this) ></td><td>" + show_data[n].Arrival_t +" -> "+show_data[n].departure_t + "</td><td>" + show_data[n].Type + show_data[n].ID + "</td><td>" + show_data[n].during_t +"</td><td>" + show_data[n].cost +"</td></tr>";
			      else
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
     date2 =document.getElementById("date").value;
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
buy=buy+"&getin_date="+date2+"&train_no="+x3;
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
else if(station_name=="山佳")
station_num="104";
else if(station_name=="鶯歌")
station_num="105";
else if(station_name=="桃園")
station_num="106";
else if(station_name=="內壢")
station_num="107";
else if(station_name=="中壢")
station_num="108";
else if(station_name=="埔心")
station_num="109";
else if(station_name=="楊梅")
station_num="110";
else if(station_name=="富岡")
station_num="111";
else if(station_name=="湖口")
station_num="112";
else if(station_name=="新豐")
station_num="113";
else if(station_name=="竹北")
station_num="114";
else if(station_name=="新竹")
station_num="115";
else if(station_name=="竹南")
station_num="118";
else if(station_name=="談文")
station_num="119";
else if(station_name=="大山")
station_num="120";
else if(station_name=="後龍")
station_num="121";
else if(station_name=="白沙屯")
station_num="123";
else if(station_name=="新埔")
station_num="124";
else if(station_name=="通霄")
station_num="125";
else if(station_name=="苑裡")
station_num="126";
else if(station_name=="造橋")
station_num="135";
else if(station_name=="苗栗")
station_num="137";
else if(station_name=="銅鑼")
station_num="139";
else if(station_name=="三義")
station_num="140";
else if(station_name=="日南")
station_num="127";
else if(station_name=="大甲")
station_num="128";
else if(station_name=="台中港")
station_num="129";
else if(station_name=="清水")
station_num="130";
else if(station_name=="沙鹿")
station_num="131";
else if(station_name=="龍井")
station_num="132";
else if(station_name=="大肚")
station_num="133";
else if(station_name=="追分")
station_num="134";
else if(station_name=="泰安")
station_num="142";
else if(station_name=="后里")
station_num="143";
else if(station_name=="豐原")
station_num="144";
else if(station_name=="潭子")
station_num="145";
else if(station_name=="台中")
station_num="146";
else if(station_name=="大慶")
station_num="223";
else if(station_name=="烏日")
station_num="147";
else if(station_name=="新烏日")
station_num="280";
else if(station_name=="成功")
station_num="148";
else if(station_name=="彰化")
station_num="149";
else if(station_name=="花壇")
station_num="150";
else if(station_name=="員林")
station_num="151";
else if(station_name=="社頭")
station_num="153";
else if(station_name=="田中")
station_num="154";
else if(station_name=="二水")
station_num="155";
else if(station_name=="林內")
station_num="156";
else if(station_name=="斗六")
station_num="158";
else if(station_name=="斗南")
station_num="159";
else if(station_name=="大林")
station_num="161";
else if(station_name=="民雄")
station_num="162";
else if(station_name=="嘉義")
station_num="163";
else if(station_name=="水上")
station_num="164";
else if(station_name=="後壁")
station_num="166";
else if(station_name=="新營")
station_num="167";
else if(station_name=="林鳳營")
station_num="169";
else if(station_name=="隆田")
station_num="170";
else if(station_name=="拔林")
station_num="171";
else if(station_name=="善化")
station_num="172";
else if(station_name=="南科")
station_num="282";
else if(station_name=="新市")
station_num="173";
else if(station_name=="永康")
station_num="174";
else if(station_name=="台南")
station_num="175";
else if(station_name=="保安")
station_num="176";
else if(station_name=="中洲")
station_num="177";
else if(station_name=="大湖")
station_num="178";
else if(station_name=="路竹")
station_num="179";
else if(station_name=="岡山")
station_num="180";
else if(station_name=="橋頭")
station_num="181";
else if(station_name=="楠梓")
station_num="183";
else if(station_name=="新左營")
station_num="288";
else if(station_name=="左營")
station_num="184";
else if(station_name=="高雄")
station_num="185";
else if(station_name=="鳳山")
station_num="186";
else if(station_name=="後庄")
station_num="187";
else if(station_name=="九曲堂")
station_num="188";
else if(station_name=="屏東")
station_num="190";
else if(station_name=="西勢")
station_num="193";
else if(station_name=="竹田")
station_num="194";
else if(station_name=="潮州")
station_num="195";
else if(station_name=="南州")
station_num="197";
else if(station_name=="林邊")
station_num="199";
else if(station_name=="佳冬")
station_num="200";
else if(station_name=="枋寮")
station_num="203";
else if(station_name=="加祿")
station_num="204";																																																																																																																																																																																																																																																																	
else if(station_name=="大武")
station_num="211";
else if(station_name=="瀧溪")		
station_num="213";
else if(station_name=="金崙")
station_num="215";
else if(station_name=="太麻里")
station_num="217";
else if(station_name=="知本")																																																																																																																																																																																																																																																																																
station_num="219";
else if(station_name=="康樂")			
station_num="220";																																																																																																																																																																																																																																																																																				
else if(station_name=="池上")
station_num="015";
else if(station_name=="關山")
station_num="012";
else if(station_name=="瑞源")
station_num="009";
else if(station_name=="鹿野")
station_num="008";
else if(station_name=="台東")
station_num="004";
else if(station_name=="和平")
station_num="057";
else if(station_name=="和仁")
station_num="056";
else if(station_name=="崇德")
station_num="055";
else if(station_name=="新城")
station_num="054";
else if(station_name=="北埔")
station_num="052";
else if(station_name=="花蓮")
station_num="051";
else if(station_name=="吉安")
station_num="045";
else if(station_name=="志學")
station_num="043";
else if(station_name=="壽豐")
station_num="041";
else if(station_name=="豐田")
station_num="040";
else if(station_name=="南平")
station_num="037";
else if(station_name=="鳳林")
station_num="036";
else if(station_name=="萬榮")
station_num="035";
else if(station_name=="光復")
station_num="034";
else if(station_name=="富源")
station_num="031";
else if(station_name=="瑞穗")
station_num="029";
else if(station_name=="玉里")
station_num="025";
else if(station_name=="東里")
station_num="022";
else if(station_name=="東竹")
station_num="020";
else if(station_name=="富里")
station_num="018";
else if(station_name=="大里")
station_num="081";
else if(station_name=="大溪")
station_num="080";
else if(station_name=="龜山")
station_num="079";
else if(station_name=="頭城")
station_num="077";
else if(station_name=="礁溪")
station_num="075";
else if(station_name=="四城")
station_num="074";
else if(station_name=="宜蘭")
station_num="073";
else if(station_name=="二結")
station_num="072";
else if(station_name=="羅東")
station_num="070";
else if(station_name=="冬山")
station_num="069";
else if(station_name=="蘇澳新")
station_num="067";
else if(station_name=="蘇澳")
station_num="066";
else if(station_name=="東澳")
station_num="063";
else if(station_name=="南澳")
station_num="062";
else if(station_name=="十分")
station_num="232";
else if(station_name=="平溪")
station_num="235";
else if(station_name=="內灣")
station_num="248";
else if(station_name=="車埕")
station_num="256";
}











