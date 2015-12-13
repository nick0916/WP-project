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
	
	function get_count(url)
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
						station_data = JSON.parse(httpRequest.responseText);
						var j=0;
						station_count = (station_data.length)/2;
						station_count = Math.floor(station_count-1);
						
						for(var k=0;k<station_data.length;k++)
						{
							
							station_name[k]=station_data[k].StopName.Zh_tw;
							
						}
						
						if(station_data[station_count].StopName.Zh_tw==station_data[station_count+1].StopName.Zh_tw)
						{
							dir=1;
						}
						else
						{
							dir=0;
						}
						/*station_count=station_data[station_data.length-1].StopSequence;*/
						//console.log(station_count);
						//console.log(station_name);
					}
				}
            };
	}
	function get_bus_info(url){

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
						var title="<table id=\"t4\"><tr><th></th><th>direction</th><th>Station</th><th>Spend</th><th>Cost</th></tr>";
						var tail="</table>";
						var test;
						bus_data = JSON.parse(httpRequest.responseText);
						
						var j=0;
						//console.log(bus_data);
						if(bus_data=="")
						{
						for(var k=0;k<station_data.length;k++)
						{
							var bus_detail = new Object();
							if(k>station_count&&dir==1)
							{
							bus_detail.direction = "返程";
							}
							else{
							bus_detail.direction = "去程";
							}
							bus_detail.stopname =station_name[k];
							bus_detail.time ="未發車";
							show_bus_data.push(bus_detail);
						}
						}
						else{
						for(var k=0;k<bus_data.length;k++)
						{
							var bus_detail = new Object();
							if(bus_data[k].Route.RouteName.Zh_tw==choose){
							
							if(bus_data[k].Stop.StopName.Zh_tw==station_name[j]){
							//console.log("1");
							if(j>station_count&&dir==1)
							{
							bus_detail.direction = "返程";
							}
							else{
							bus_detail.direction = "去程";
							}
						//console.log(bus_data[0].Stop.StopName.Zh_tw);
							bus_detail.stopname = bus_data[k].Stop.StopName.Zh_tw;
							//bus_detail.route = bus_data[k].Route.BusRouteType;
							bus_detail.routename = bus_data[k].Route.RouteName.Zh_tw;
							if(bus_data[k].EstimateTime>0)
							{
							bus_detail.time = (bus_data[k].EstimateTime)/60 + "分鐘";
							}
							else if(bus_data[k].EstimateTime==0){
							bus_detail.time ="已到站"
							}
							else{
							bus_detail.time ="未發車"
							}
							bus_detail.stopsequence = bus_data[k].Stop.StopSequence;
							bus_detail.cost = bus_data[k].Route.TicketPriceDescriptionZh;
							//console.log("1");
							show_bus_data.push(bus_detail);
							}
							else{
							bus_detail.stopname = station_name[j];
							//bus_detail.route = bus_data[k].Route.BusRouteType;
							bus_detail.routename = bus_data[k].Route.RouteName.Zh_tw;
							bus_detail.time = "末班已駛離";
							bus_detail.stopsequence = bus_data[k].Stop.StopSequence;
							bus_detail.cost = bus_data[k].Route.TicketPriceDescriptionZh;
							show_bus_data.push(bus_detail);
							
							}
							j++;
							//console.log(show_bus_data);
							
							
							if(bus_detail.direction==b)
							{
							test = test + "<tr><td><input type=\"checkbox\" value=\"Travel\" name=\"Interest\"></td><td>" + bus_detail.direction + "</td><td>" + bus_detail.stopname + "</td><td>" + bus_detail.time +"</td><td>" + bus_detail.cost +    "</td></tr>";
							}
							}
							
						}
						}
						/*console.log(bus_data[0]);
						console.log(bus_data[1]);*/
						console.log(show_bus_data);
						test = title + test + tail;
	
					$("#showBus").html(test);
					jQuery("html,body").animate({
						scrollTop:$("#showBus").offset().top
					},800);
					}
				}
            };
			}
	get_count(station_url);
	get_bus_info(b_url);
	}