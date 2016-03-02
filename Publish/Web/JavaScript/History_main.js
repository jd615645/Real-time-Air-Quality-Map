var Channel_id;
var SiteGroup;
var Element;

var fieldsetting;

function fixSiteGroup(){
	if(SiteGroup !== "ProbeCube" && SiteGroup !== "EPA")
		SiteGroup = "Indie";
}
function parse_frame_url(field, setting, fieldname){
	console.log(fieldname);
	field = parseInt(field);
	var return_str = ("http://api.thingspeak.com/channels/" + Channel_id + "/charts/" + field);
	return_str += "?width=auto&height=auto";
	if(fieldname === 'Temperature'){
		return_str += "&title=空氣溫度&dynamic=true&type=spline&color=green&yaxis=°C";
	}else if(fieldname === 'Humidity'){
		return_str += "&title=相對濕度&dynamic=true&type=spline&color=blue&yaxis=RH%20%25";
	}else if(fieldname === 'Dust2_5'){
		return_str += "&title=懸浮微粒PM2.5&dynamic=true&type=spline&color=grey&yaxis=μg/m3&yaxismin=0";
	}
	/*return_str += "&title=有機汙染VoC&dynamic=true&type=spline&color=darkred&yaxis=ppm&yaxismin=0";*/
	if(setting){
		return_str += "&days=" + (setting.day ? setting.day : 7) + "&median=" + setting.averge;
	}else{
		return_str += "&days=7&average=30";
	}
	return return_str;
}
function append_frame(){
	$("#tablediv").remove();
	$("#cont").append("<div id=\'char\' class=\'col-xs-12\' style=\'padding: 0px;\'></div>");
	$("#char").append("<div id=\'field5\' style=\'height:460px;\' class=\'row col-xs-12 his-field\'><div class=\'row col-xs-12\'><h3 class=\'inline\'>懸浮微粒PM2.5</h3><button class=\'inline btn btn-default pull-right\'  data-toggle=\"modal\" data-target=\"#fieldModal\" onclick=\'field_set(5)\'>更改天數設定</button></div></div>");
	//$("#char").append("<div id=\'field4\' style=\'height:460px;\' class=\'row col-xs-12 his-field\'><div class=\'row col-xs-12\'><h3 class=\'inline\'>有機汙染VoC</h3><button class=\'inline btn btn-default pull-right\'  data-toggle=\"modal\" data-target=\"#fieldModal\" onclick=\'field_set(4)\'>更改天數設定</button></div></div>");
	$("#char").append("<div id=\'field1\' style=\'height:460px;\' class=\'row col-xs-12 his-field\'><div class=\'row col-xs-12\'><h3 class=\'inline\'>空氣溫度</h3><button class=\'inline btn btn-default pull-right\'  data-toggle=\"modal\" data-target=\"#fieldModal\" onclick=\'field_set(1)\'>更改天數設定</button></div></div>");
	$("#char").append("<div id=\'field2\' style=\'height:460px;\' class=\'row col-xs-12 his-field\'><div class=\'row col-xs-12\'><h3 class=\'inline\'>相對濕度</h3><button class=\'inline btn btn-default pull-right\'  data-toggle=\"modal\" data-target=\"#fieldModal\" onclick=\'field_set(2)\'>更改天數設定</button></div></div>");
	//$("#char").append("<div id=\'field3\' style=\'height:460px;\' class=\'row col-xs-12 per-field\'><div class=\'row col-xs-12\'><h3 class=\'inline\'>土壤濕度</h3><button class=\'inline btn btn-default pull-right\'  data-toggle=\"modal\" data-target=\"#fieldModal\" onclick=\'field_set(3)\'>更新設定</button></div></div>");

	document.getElementById("field1").innerHTML += "<div class=\'row col-xs-12\'><iframe class=\'col-xs-12\' height=\'400\' style=\'border:0px;margins:0px;\' id=\'f1\' src=\'" + parse_frame_url((Element.Option ? (Element.Option.Temperature.charAt(5)) : '1'), undefined, 'Temperature') + "\'></div>";
    document.getElementById("field2").innerHTML += "<div class=\'row col-xs-12\'><iframe class=\'col-xs-12\' height=\'400\' style=\'border:0px;margins:0px;\' id=\'f2\' src=\'" + parse_frame_url((Element.Option ? (Element.Option.Humidity.charAt(5)) : '2'), undefined, 'Humidity') + "\'></div>";
    //document.getElementById("field3").innerHTML += "<div class=\'row col-xs-12\'><iframe class=\'col-xs-12\' height=\'400\' style=\'border:0px;margins:0px;\' id=\'f3\' src=\'" + parse_frame_url(3, undefined) + "\'></div>";
    //document.getElementById("field4").innerHTML += "<div class=\'row col-xs-12\'><iframe class=\'col-xs-12\' height=\'400\' style=\'border:0px;margins:0px;\' id=\'f4\' src=\'" + parse_frame_url(4, undefined) + "\'></div>";
    document.getElementById("field5").innerHTML += "<div class=\'row col-xs-12\'><iframe class=\'col-xs-12\' height=\'400\' style=\'border:0px;margins:0px;\' id=\'f5\' src=\'" + parse_frame_url((Element.Option ? (Element.Option.Dust2_5.charAt(5)) : '5'), undefined, 'Dust2_5') + "\'></div>";
    return;
}
function append_table(setting){
	$("#char").remove();
	$("#tablediv").remove();
	$("#cont").append("<div id=\'tablediv\' class=\'col-xs-12 his-field\'></div>");
	document.getElementById("tablediv").innerHTML = "處理中"
	$.getJSON("https://thingspeak.com/channels/" + Channel_id + "/feeds.json", setting).success(function(data, xml){
		var table_str = "<div class=\'row col-xs-12\'><table class=\"table table-striped table_bordered table_hover table-condensed\">"

		table_str += "<tr>";
		table_str += "<th>Feed ID</th>";
		table_str += "<th>時間 (UTC)</th>";
		table_str += "<th>空氣溫度 (°C)</th>";
		table_str += "<th>相對濕度 (%)</th>";
		//table_str += "<th>有機汙染VoC (ppm)</th>";
		table_str += "<th>懸浮微粒PM2.5 (μg/m<sup>3</sup>)</th>";
		table_str += "</tr>";

		for(var i = data.feeds.length-1; i >= 0; i --){
			var feed = data.feeds[i];
			table_str += "<tr>";
			table_str += "<td>" + feed.entry_id + "</td>";
			table_str += "<td>" + feed.created_at.replace(/T/g, " ").replace(/Z/g, " ") + "</td>";
			table_str += "<td>" + feed['field' + (Element.Option ? (Element.Option.Temperature.charAt(5)) : '1')] + "</td>";
			table_str += "<td>" + feed['field' + (Element.Option ? (Element.Option.Humidity.charAt(5)) : '2')] + "</td>";
			//table_str += "<td>" + feed.field4 + "</td>";
			table_str += "<td>" + feed['field' + (Element.Option ? (Element.Option.Dust2_5.charAt(5)) : '5')] + "</td>";
			table_str += "</tr>";
		}

		table_str += "</table></div>";

		document.getElementById("tablediv").innerHTML = "<div class=\'row col-xs-12\' style=\'margin-bottom: 20px\'><h3 class=\'inline\'>資料表</h3><button class=\'inline btn btn-default pull-right\'  data-toggle=\"modal\" data-target=\"#tableModal\" onclick=\'field_set(5)\'>更新設定</button></div>";
		document.getElementById("tablediv").innerHTML += table_str; 
	});
}
function field_set(field){
	fieldsetting = field;
}

function show_switch(type){
	if(type == 0){
		$("#typeswitch").text("表格模式");
		$("#typeswitch").attr({"onclick": "show_switch(1)"});
		append_frame();
	}else{
		$("#typeswitch").text("趨勢圖模式");
		$("#typeswitch").attr({"onclick": "show_switch(0)"});
		append_table();
	}
}

$(document).ready(function(){
	Channel_id = $("#theid").text();
	SiteGroup = $("#thety").text();
	console.log(SiteGroup);
	fixSiteGroup();
	console.log(SiteGroup);
	$.getJSON(SiteGroup + '_last.json').done(function(data){
		Element = data.find(function(element, index, arrary){
			return element.Channel_id == Channel_id;
		});
		console.log(Element);
		$("title").text(Element.SiteName + "歷史觀測資料");
		$("#chname").text(Element.SiteName).css({"color":"#AA7700", "font-size":"32px", "margin":"10px"});
		$("#map-btn").attr("onclick", "location.href=\'/map.html?type=" + $("#thety").text() + "&chid=" + Element.Channel_id + "\'");
		append_frame();
	}).fail(function(){
		$("#ErrorModal").modal();
	});

	$("#fieldset").submit(function(event){
		event.preventDefault();
		var k;
		if(fieldsetting == 5)
			k = 'Dust2_5';
		else if(fieldsetting == 1)
			k = 'Temperature';
		else if(fieldsetting == 2)
			k = 'Humidity';
		$("#f" + fieldsetting).attr("src", parse_frame_url((Element.Option ? (Element.Option[k].charAt(5)) : fieldsetting), {day: $("#day").val(), averge: $("#averge").val()}, k));
		$('#fieldModal').modal('hide');	
	});
	$("#tableset").submit(function(event){
		event.preventDefault();
		var setting;
		if( $("#method").val() === "天數"){
			setting = {days: $("#tday").val()};
		}else if( $("#method").val() === "資料數量"){
			setting = {results: $("#result").val()};
		}else{
			setting = {start: $("#startdate").val() + "T" + $("#starttime").val() + ":00", end:  $("#enddate").val() + "T" + $("#endtime").val() + ":00"};
		}
		append_table(setting);
		$('#tableModal').modal('hide');	
	});
	$("#method").change(function(event){
		for(var i = 0; i <= 2; i ++){
			$(".tm").hide();
		}
		var selectm = "#" + ($("#method").val() === "天數" ? "tday" : $("#method").val() === "資料數量" ? "result" : "range" ) + "div";
		$(selectm).show();
	});
});