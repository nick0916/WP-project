function bus_station(a,b){
	var bus_url="http://210.59.250.227:80/MOTC/v2/Bus/EstimatedTimeOfArrival/Tainan?&%24format=json";
	var choose = a;
	var b_url="http://210.59.250.227:80/MOTC/v2/Bus/EstimatedTimeOfArrival/Tainan/"+ choose +"?%24orderby=Stop%2FStopSequence&%24format=json";
	var station_url = "http://210.59.250.227:80/MOTC/v2/Bus/Stop/Tainan/"+ choose + "?%24format=json";
	var show_bus_data=[];
	var bus = new Object();
	
	var bus_data = [];
	var station_data = [];
	var station_count;
	var station_name = [];
	var dir=[];
	show_bus_data.length = 0;
	
	function get_count(url,index)
	{
		var httpRequest;
            if (window.XMLHttpRequest) { // Mozilla, Safari, ...
                httpRequest = new XMLHttpRequest();
            } else if (window.ActiveXObject) { // IE
                httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
            }

            httpRequest.open('GET', url, true);
            httpRequest.send(null); 

            httpRequest.onreadystatechange = function() { 
                if (httpRequest.readyState == 4) {
                    if (httpRequest.status == 200) {
					switch(index){
						case 0:
						station_data = JSON.parse(httpRequest.responseText);
						var j=0;
						station_count = (station_data.length)/2;
						station_count = Math.floor(station_count-1);
						//先抓全部停靠站名
						for(var k=0;k<station_data.length;k++)
						{
							var station_detail = new Object();
							station_name[k]=station_data[k].StopName.Zh_tw;
							station_detail.stationame=station_data[k].StopName.Zh_tw;;
							station_detail.time ="未發車";
							station_detail.cost = "";
							//判斷是否有去返程
							if(station_data[station_count].StopName.Zh_tw==station_data[station_count+1].StopName.Zh_tw||station_data[station_count+1].StopName.Zh_tw==station_data[station_count+2].StopName.Zh_tw)
							{
								dir=1;
							}
							else
							{
								dir=0;
							}
							//區分去程返程
							if(k<station_count&&dir==1)
							{
							station_detail.direction = "去程";
							}
							else if(k>=station_count&&dir==1)
							{
							station_detail.direction = "返程";
							}
							else
							{
							station_detail.direction = "去程";
							}
							show_bus_data.push(station_detail);
						}
						
						get_count(b_url,1);
						
						break;
						
						case 1:
						//若api有回傳資料，更新即時動態
						station_count = (station_data.length)/2;
						station_count = Math.floor(station_count-1);
						bus_data = JSON.parse(httpRequest.responseText);
						var title="<table id=\"t4\"><tr><th></th><th>direction</th><th>Station</th><th>Spend</th><th>Cost</th></tr>";
						var tail="</table>";
						var test;
						for(var k=0;k<station_name.length;k++){
						for(var j=0;j<bus_data.length;j++){
						var l=k+1;
						if(station_name[k]==bus_data[j].Stop.StopName.Zh_tw&&bus_data[j].Route.RouteName.Zh_tw==choose&&bus_data[j].Stop.StopSequence==l)
						{
							var bus_detail = new Object();
							if(bus_data[j].EstimateTime>0)
							{
							bus_detail.time = (bus_data[j].EstimateTime)/60 + "分鐘";
							}
							else if(bus_data[j].EstimateTime==0){
							bus_detail.time ="已到站";
							}
							else{
							bus_detail.time ="未發車";
							}
							
							bus_detail.stationame = station_name[k];
							bus_detail.stopsequence = bus_data[j].Stop.StopSequence;
							bus_detail.cost = bus_data[j].Route.TicketPriceDescriptionZh;
							if(k<station_count&&dir==1)
							{
							bus_detail.direction = "去程";
							}
							else if(k>=station_count&&dir==1)
							{
							bus_detail.direction = "返程";
							}
							else
							{
							bus_detail.direction = "去程";
							}
							show_bus_data[k]=bus_detail;
							
						}
						}
							if(show_bus_data[k].direction==b)
							{
							test = test + "<tr><td><input type=\"checkbox\" value=\"Travel\"" + " id = t_bus_"+ k + " name=\"Interest\" onclick=t_busCheck(this)></td><td>" + show_bus_data[k].direction + "</td><td>" + show_bus_data[k].stationame + "</td><td>" + show_bus_data[k].time +"</td><td>" + show_bus_data[k].cost +    "</td></tr>";
							}
						}
						
						
						test = title + test + tail;
	
						$("#showBus").html(test);
						jQuery("html,body").animate({
						scrollTop:$("#showBus").offset().top
						},800);
						break;
					}
					}
				}
            };
	}
	
	
	
	
	get_count(station_url,0);
// 選取公車
}
function t_busCheck(buffer){
     var cloneNode = buffer.parentNode.parentNode.cloneNode(true); // 複製一個新的node
     if(buffer.checked == true){
          if(Choose_tbus.children.length == 0){ 
               Choose_tbus.innerHTML = "<table id=\"t8\"><tr><th>公車</th>Direction<th></th><th>Station</th><th>Spend</th><th>Cost</th></tr>";
               t8.children[0].appendChild(cloneNode);               

          } // 建立首欄＆新增喜好時刻
          else{
               t8.children[0].appendChild(cloneNode);               
          }
     }
     else{
          for (var i = 1; i < t8.childNodes[0].children.length; i++){
               var node = t8.childNodes[0].childNodes[i];
               var id = node.childNodes[0].childNodes[0].id;
               if (id == buffer.id){
                    document.getElementById(id).checked = false;
                    t8.childNodes[0].removeChild(t8.childNodes[0].childNodes[i]);
               } // 刪除喜好時刻 & 取消勾選
               if(t8.childNodes[0].children.length == 1){
                    Choose_tbus.removeChild(Choose_tbus.firstChild);
                    break;
               } // 刪除首欄
          } 
     }
}
