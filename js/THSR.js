function selectitem(a1,b1,c1,d1,e1,f1){
     /*var check1=$('#boardstation').val();
     check1 = check1.substr(1,1);
     check1 = parseInt(check1);
     var check2=$('#destination').val();
     check2 = check2.substr(1,1);
     check2 = parseInt(check2);*/
     
     // 高鐵票價宣告
     var cost1=[40,160,290,700,1080,1350,1490];
     var cost2=[130,260,670,1050,1320,1460];
     var cost3=[130,540,920,1190,1330];
     var cost4=[410,790,1060,1200];
     var cost5=[380,650,790];
     var cost6=[280,410];
     var cost7=[140];
     var money;

     thsr_f = a1;
     thsr_t = b1;
    
	
     if(d1=="高雄")
	{
	d1="高雄(左營)";
	}
	if(e1=="高雄")
	{
	e1="高雄(左營)";
	}	
     // 
     if(thsr_f>thsr_t){
     
          switch(thsr_t)
          {
               case '1':
               var tem=thsr_f-2;
               money=cost1[tem];
                    break;
               case '2':
               var tem=thsr_f-3;
               money=cost2[tem];
                    break;
               case '3':
               var tem=thsr_f-4;
               money=cost3[tem];
                    break;
               case '4':
               var tem=thsr_f-5;
               money=cost4[tem];
                    break;
               case '5':
               var tem=thsr_f-6;
               money=cost5[tem];
                    break;
               case '6':
               var tem=thsr_f-7;
               money=cost6[tem];
                    break;
               case '7':
               var tem=thsr_f-8;
               money=cost7[tem];
                    break;
          }
     
          var tonorth = Parse.Object.extend("tonorth"); 
               
          var query = new Parse.Query(tonorth);  
          //query.equalTo("$('#direction').val()");
          query.ascending("s1");
          query.find({  
               success: function(results) {  
                    //alert("Successfully retrieved " + results.length + " scores.");  
                    // Do something with the returned Parse.Object values 
                    var test2="";
                    //var test2= '車次' + '    ' + '發車時間'+ '  ' + '抵達時間' +'<br>';*/
                    var b = "s"+thsr_f;
                    var d = "s"+thsr_t;
                    var j =c1;
                    var temp2="";
                    var title="<table id=\"t2\"><tr><th></th><th>" + d1 +" -> " + e1 +"</th><th>By</th><th>Spend</th><th>Cost</th></tr>";
                    var tail="</table>";
                    for (var i = 0; i < results.length; i++) {  
                         var object = results[i];  
                         //alert(object.get('s1')); 
                         temp2=object.get(b);
                         var check_d2 = object.get(d);
                         var take = cal_during(object.get(b),object.get(d));
                         temp2 = temp2.substr(0,2);
                         temp2 = parseInt(temp2);
                         if(temp2>=j&&check_d2!="-"){
                              test2 = test2 + "<tr><td><input type=\"checkbox\" value=\"Travel\" name=\"Interest\"></td><td>" + object.get(b) +" -> "+object.get(d) + "</td><td>" + object.get('train') + "</td><td>" + take +"</td><td>" + money +  "</td></tr>";
                              //test2 =  test2 + '     ' + object.get('train') + '        ' +object.get(b)+ '      ' +object.get(d)+ '      ' +'<br>';
                         }
                    }
                    test2 = title + test2 + tail;
                    
					$("#S2").html(test2);
					if(f1==0)
					{
					loadTab("<a href=\"javascript://\" onclick=\"loadTab(this,2,0);\"><span>客運</span></a>",2,0);
					
					$('#tabsC').modal();
					}
                    /*jQuery("html,body").animate({
                      scrollTop:$("#showThsr").offset().top
                    },800);*/
                    //console.log(test2);
                    //test2 = '<p>' + '-為不停靠或不發車' + '<br>' + test2 + '</p>';
                    //alert(test);
                    //$("#table").html('<p>-為不停靠或不發車</p>');
                    //$("#table").html(test2);
               },  
               error: function(error) {  
                    alert("Error: " + error.code + " " + error.message);  
                    }  
          });
     }
     else if(thsr_f<thsr_t)
     {
          switch(thsr_f)
          {
               case '1':
               var tem=thsr_t-2;
               money=cost1[tem];
                    break;
               case '2':
               var tem=thsr_t-3;
               money=cost2[tem];
                    break;
               case '3':
               var tem=thsr_t-4;
               money=cost3[tem];
                    break;
               case '4':
               var tem=thsr_t-5;
               money=cost4[tem];
                    break;
               case '5':
               var tem=thsr_t-6;
               money=cost5[tem];
                    break;
               case '6':
               var tem=thsr_t-7;
               money=cost6[tem];
                    break;
               case '7':
               var tem=thsr_t-8;
               money=cost7[tem];
                    break;
          }
          var tosouth = Parse.Object.extend("tosouth"); 
               
          var query = new Parse.Query(tosouth);  
          query.ascending("s1");
          //query.equalTo("playerName", "Dan Stemkoski");  
          query.find({  
          success: function(results) {  
               //alert("Successfully retrieved " + results.length + " scores.");  
               // Do something with the returned Parse.Object values 
               //var test= '車次' + '     ' + '發車時間'+ '  ' + '抵達時間' +'<br>';
               var test="";
               var b = "s"+thsr_f;
               var d ="s"+thsr_t;
               var k =parseInt(c1);
               
               var temp="";
               var title="<table id=\"t2\"><tr><th></th><th>" + d1 +" -> " + e1 +"</th><th>By</th><th>Spend</th><th>Cost</th></tr>";
               var tail="</tail>";
               for (var i = 0; i < results.length; i++) {  
                    var object = results[i];  
                    //alert(object.get('s1')); 
                    temp=object.get(b);
                    var check_d = object.get(d);
                    //console.log(b);
                    var take = cal_during(object.get(b),object.get(d));
                    temp = temp.substr(0,2);
                    temp = parseInt(temp);
                    if(temp>=k&&check_d!="-"){
                         test = test + "<tr><td><input type=\"checkbox\" value=\"Travel\" name=\"Interest\"></td><td>" + object.get(b) +" -> "+object.get(d) + "</td><td>" + object.get('train') + "</td><td>" + take +"</td><td>" + money +    "</td></tr>";
                         //test =  test + '  ' + object.get('train') + '        ' +object.get(b)+ '      ' +object.get(d)+ '      ' +'<br>';
                    }
               }
             
               // console.log(test);
               test = title + test + tail;
               $("#S2").html(test);
			   
               if(f1==0)
			   {
			   loadTab("<a href=\"javascript://\" onclick=\"loadTab(this,2,0);\"><span>高鐵</span></a>",2,0);
			   $('#tabsC').modal();
			   
			   }
			   
              /* jQuery("html,body").animate({
                      scrollTop:$("#showThsr").offset().top
               },800);*/
               //alert(test);
               //$("#table").html('<p>-為不停靠或不發車</p>');
               //$("#table").html(test);
               //alert(temp);
          },  
          error: function(error) {  
               alert("Error: " + error.code + " " + error.message);  
          }  
          });
     }
     else{
          alert("出發與抵達地點相同");
     }         
}

function cal_during(a,b){
     var during = cal_time(b) - cal_time(a);
     var hour = parseInt(during / 60);
     var minute = during - hour*60;
     return (hour + "小時" + minute + "分");
} 