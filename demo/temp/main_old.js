	// start map functions
	var hitMapData={
    	max:  1,        // Always 1 in tweet data
		data: []
    };	
		
		
	//var map = new L.Map('map');
	var OpenStreet = 'http://{s}.tile.cloudmade.com/ad132e106cd246ec961bbdfbe0228fe8/997/256/{z}/{x}/{y}.png',
	//apple = new L.TileLayer(OpenStreet, {maxZoom: 18,unloadInvisibleTiles: true});
	


	        cmAttr = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
			cmUrl = 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/{styleId}/256/{z}/{x}/{y}.png';



    var openstreet = L.tileLayer(OpenStreet, {styleId: 256, attribution: cmAttr})
	    minimal   = L.tileLayer(cmUrl, {styleId: 22677, attribution: cmAttr}),
	    midnight  = L.tileLayer(cmUrl, {styleId: 999,   attribution: cmAttr});
	    //motorways = L.tileLayer(cmUrl, {styleId: 46561, attribution: cmAttr});
		
	var map = L.map('map', {
		center: [32.774917, -117.005639],
		//center: [0, 0],
		zoom: 10,
		layers: [minimal]
	});			
			
	var heatmapLayer = L.TileLayer.heatMap({
	    unloadInvisibleTiles: true,
		reuseTiles: true,
		radius:30,
		opacity: 0.8,
		gradient: {
			0.45: "rgb(0,0,255)",
			0.65: "rgb(0,255,255)",
			0.85: "rgb(0,255,0)",
			0.98: "yellow",
			1.0: "rgb(255,0,0)"
		}
	});	

	//map.setView(new L.LatLng(40.00, -100.387), 4).addLayer(apple);
			
	//var controls = L.layerGroup();

	var baseLayers = {
	    "Openstreet":openstreet,
		"Minimal": minimal,
		"Night View": midnight				
	};

       var controls = L.layerGroup().addTo(map);
	
	var overlays = {
		"tweets": controls,
		"heatmap": heatmapLayer
	};
	
	L.control.layers(baseLayers, overlays).addTo(map);		

	//var bingGeocoder = new L.Control.BingGeocoder('AvZ8vsxrtgnSqfEJF1hU40bASGwxahJJ3_X3dtkd8BSNljatfzfJUvhjo9IGP_P7');

	//map.addControl(bingGeocoder);

		// add a marker in the given location, attach some popup content to it and open the popup
		
		var pointIcon = L.icon({
		iconUrl: 'ford.png',
		iconSize:     [60, 35], // size of the icon
		});
		

		var markerService1 = new L.CircleMarker(new L.LatLng(32.749098,  -117.10053), {color: 'red'}).addTo(map);
		//markerService1.bindPopup("Cant drive my new car till i get shocks. Fack").openPopup();
		
		//var SelectMarker = new L.Marker(new L.LatLng(32.749098, -117.10053));
		//map.addLayer(SelectMarker);		

		var markerService2 = new L.CircleMarker(new L.LatLng(32.778265, -117.158222), {color: 'red'}).addTo(map);
		//markerService2.bindPopup("Car is over hearing weh  need to fix tomorrow").openPopup();

		var markerService3 = new L.CircleMarker(new L.LatLng(32.7153, -117.1564), {color: 'red'}).addTo(map);
		//markerService3.bindPopup("Who knows about intakes? I want to buy one for my car but I don't know which one?").openPopup();
		//var SelectMarker = new L.Marker(new L.LatLng(32.749098, -117.10053));
		//map.addLayer(SelectMarker);	
		

		var markerService4 = new L.CircleMarker(new L.LatLng(32.7153, -117.1564), {color: 'red'}).addTo(map);
		//arkerService4.bindPopup("Then ima get my new tires+rims. Finalllllyyyy ! Babygirl gonna be more rideable lol").openPopup();			

		var markerService5 = new L.CircleMarker(new L.LatLng(32.6333324, -117.00178), {color: 'red'}).addTo(map);
		//markerService5.bindPopup("My car needs a damn tune up &amp; oil change").openPopup();			

		var markerService6 = new L.CircleMarker(new L.LatLng(32.7153,  -117.1564), {color: 'red'}).addTo(map);
		//markerService6.bindPopup("Lmao my car just died on me again. I need new a new battery for my car").openPopup();			

		var markerService7 = new L.CircleMarker(new L.LatLng(32.7153, -117.1564), {color: 'red'}).addTo(map);
		//markerService7.bindPopup("All looking up getting my car painted next week").openPopup();			

		var markerService8 = new L.CircleMarker(new L.LatLng(32.7153, -117.1564), {color: 'red'}).addTo(map);
		//markerService8.bindPopup("OF COURSE my car needs a new battery....so much for good luck #frustrated").openPopup();			

		var markerService9 = new L.CircleMarker(new L.LatLng(32.64, -117.08333), {color: 'red'}).addTo(map);
		//markerService9.bindPopup("grrr...I hate my car ! Expensive repairs and still something new to break.").openPopup();			

		var markerService10 = new L.CircleMarker(new L.LatLng(32.749098, -117.10053), {color: 'red'}).addTo(map);
		//markerService10.bindPopup("- ok . We're just waiting on tia to bring the money to fix gmas car -_______- @_Jacintaaa").openPopup();					



		
		var markerSales1 = new L.CircleMarker(new L.LatLng(32.7153,  -117.1564), {color: 'red'}).addTo(map);
		//markerSales1.bindPopup("Car shopping today").openPopup();

		var markerSales2 = new L.CircleMarker(new L.LatLng(32.7153,  -117.1564), {color: 'red'}).addTo(map);
		//markerSales2.bindPopup(" think I found someone to buy my car. Now looking for a new car.").openPopup();
		var markerSales3 = new L.CircleMarker(new L.LatLng(33.3,  -117.2417), {color: 'red'}).addTo(map);
		
		var markerSales4 = new L.CircleMarker(new L.LatLng(32.778265, -117.158222), {color: 'red'}).addTo(map);
		
		var markerSales5 = new L.CircleMarker(new L.LatLng(32.7153,   -117.1564), {color: 'red'}).addTo(map);
		
		var markerSales6 = new L.CircleMarker(new L.LatLng( 32.64,   -117.08333), {color: 'red'}).addTo(map);
		
		var markerSales7 = new L.CircleMarker(new L.LatLng(32.905016,  -117.152191), {color: 'red'}).addTo(map);
		
		var markerSales8 = new L.CircleMarker(new L.LatLng(32.7153,  -117.1564), {color: 'red'}).addTo(map);
		
		var markerSales9 = new L.CircleMarker(new L.LatLng(32.7153,   -117.1564), {color: 'red'}).addTo(map);
		
		var markerSales10 = new L.CircleMarker(new L.LatLng(32.7153, -117.1564), {color: 'red'}).addTo(map);
		
		
		
	
		var markerDealer = L.marker([32.774917,-117.005639], {icon: pointIcon}).addTo(map);
		//markerDealer.bindPopup("Drew Ford Dealership").openPopup();
				

/*		
		var marker2 = L.CircleMarker(new L.LatLng(32.769324,-117.003322).addTo(map);
		marker2.bindPopup("Test driving a Ford Fusion today");
		
		var marker3 = L.marker([32.7712,-117.010639]).addTo(map);
		marker3.bindPopup("Just crashed my car :(... need a new one now");
		
		var marker4 = L.marker([32.775115,-117.000275]).addTo(map);
		marker4.bindPopup("Can't wait to see the new 2013 Mustang!");
		
		var marker5 = L.marker([32.759779,-117.136316]).addTo(map);
		marker5.bindPopup("Shelby GT is too much, guess I'm getting a Focus");
*/
	
	// end - map functions
	
	// start - chart and table
		
    google.load("visualization", "1", {packages:["corechart"]});
    google.load('visualization', '1', {packages:['table']});
    google.load('visualization', '1', {packages:['gauge']});
    google.setOnLoadCallback(drawChart);
    function drawChart() {
  
    //Data/draw Google Line Chart - start
    var data = google.visualization.arrayToDataTable([
      ['Date', 'Ford Fusion Tweets', 'Ford Escape Tweets'],
      ['Jan 27 - Feb 2',  100,      200],
      ['Feb 3 - Feb 9',  170,      160],
      ['Feb 10 - Feb 16',  66,       120],
      ['Feb 17 - Feb 23',  130,      340],
      ['Jan 27 - Feb 2',  100,      200],
      ['Feb 3 - Feb 9',  170,      160],
      ['Feb 10 - Feb 16',  66,       120],
      ['Feb 17 - Feb 23',  130,      340],
      ['Jan 27 - Feb 2',  100,      200],
      ['Feb 3 - Feb 9',  170,      160],
      ['Feb 10 - Feb 16',  66,       120],
      ['Feb 17 - Feb 23',  130,      340],		  
      ['Feb 24 - Mar 2',  130,      340]
    ]);

    var options = {
      title: 'Ford Fusion and Ford Escape Tweets'
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    chart.draw(data, options);
    //Data/draw Google Line Chart - end

    //Data/draw Google Table - start
    var dataSale = new google.visualization.DataTable();
    dataSale.addColumn('string', 'Tweet');
    dataSale.addColumn('number', 'Score');
    dataSale.addColumn('string', 'Location');

    dataSale.addRows([
      ['Test driving a Ford Fusion today',  {v: 99, f: '99'}, 'La Mesa'],
      ['Cant wait to see the new 2013 Mustang!',   {v:94,   f: '94'},  'La Mesa'],
      ['Just crashed my car :(... need a new one now', {v: 80, f: '80'}, 'La Mesa'],
      ['Test driving a Ford Fusion today',  {v: 99, f: '99'}, 'La Mesa'],
      ['Cant wait to see the new 2013 Mustang!',   {v:94,   f: '94'},  'La Mesa'],
      ['Just crashed my car :(... need a new one now', {v: 80, f: '80'}, 'La Mesa'],	  
      ['Test driving a Ford Fusion today',  {v: 99, f: '99'}, 'La Mesa'],
      ['Cant wait to see the new 2013 Mustang!',   {v:94,   f: '94'},  'La Mesa'],
      ['Just crashed my car :(... need a new one now', {v: 80, f: '80'}, 'La Mesa'],	
      ['Test driving a Ford Fusion today',  {v: 99, f: '99'}, 'La Mesa'],
      ['Cant wait to see the new 2013 Mustang!',   {v:94,   f: '94'},  'La Mesa'],
      ['Just crashed my car :(... need a new one now', {v: 80, f: '80'}, 'La Mesa'],	  
      ['Test driving a Ford Fusion today',  {v: 99, f: '99'}, 'La Mesa'],
      ['Cant wait to see the new 2013 Mustang!',   {v:94,   f: '94'},  'La Mesa'],
      ['Just crashed my car :(... need a new one now', {v: 80, f: '80'}, 'La Mesa'],
      ['Shelby GT is too much, guess Im getting a Focus',   {v: 67,  f: '67'},  'San Diego']
  
    ]);
	
	var options2 = {
        showRowNumber: false
      };

      var table = new google.visualization.Table(document.getElementById('table_div'));
      table.draw(dataSale, options2);
	
	// Add our selection handler.
	google.visualization.events.addListener(table, 'select', selectHandler);
	
	
		  		// Select a table row
	function selectHandler() {
		var selection = table.getSelection();
		var row = selection[0].row;
		 var str = dataSale.getFormattedValue(row, 0);
		var message = str;

		if (message == '') {
			message = 'nothing';
		}
		
		openPopUp(message);
	}
	
	
	$(window).resize(function() {
		chart.draw(data, options);
		table.draw(dataSale, {showRowNumber: true});
	});
	
	
	//OPen PopUp
	function openPopUp(message){
		alert("Select this '" + message + "'");
	}
	
    }
    //Data/draw Google Table - end		
	

		
	function getTweets() {
	
	
	
		var params = {};  //build an object, then pass it!
		var param = $("#keyword").val() || 'NULL';
		var rad = $("#radius").val() || 0;
		var keywd = $("#car").val()
           	
		controls.clearLayers();
		hitMapData.data = [];        // Clear all items of hit map
	
		var url = "PyMapper.py?key=" + param + "&rad=" + rad + "&keyword=" + keywd;

		$.getJSON(url, function(data) {
			var tweets = data.results;
			
			if (!tweets.length) {
				$("#table tbody tr").remove();	
				$("#table").css("display", (tweets.length > 0) ? "block" : "none");
				$("#urls").css("display", (data.urls.length > 0) ? "block" : "none");	
				$("#urls tbody tr").remove();		
				//$("#results").html("[" + tweets.length + " results.]");
				return;
			}
			
			$("#table tbody tr").remove();	
			$("#table").css("display", (tweets.length > 0) ? "block" : "none");
			
			var minLat = 180.0,
				maxLat = -180.0,
				minLon = 180.0,
				maxLon = -180.0;
				
			//alert(hitMapData.data.toSource());
			//hitMapData ='';
			for(var indx in tweets)  {
				var tweet = tweets[indx];
                  
				if (!(tweet.loc[0] == 0 && tweet.loc[1] == 0)) {
					//controls.removeLayer(heatmapLayer);
					//keep track of min/max lat/lon to set view
					if (tweet.loc[0] > maxLon) maxLon = tweet.loc[0];
					if (tweet.loc[0] < minLon) minLon = tweet.loc[0];
					if (tweet.loc[1] > maxLat) maxLat = tweet.loc[1];
					if (tweet.loc[1] < minLat) minLat = tweet.loc[1];
				   
					controls.addLayer(L.marker(tweet.loc).bindPopup(tweet.text));
					var heatItem = {lat:tweet.loc[0], lon:tweet.loc[1], value:1};
					hitMapData.data.push(heatItem);
					$("#table tbody").append("<tr><td><div style='height: 50px;'>" + tweet.text + "</div></td></tr>");
				
				}
				
			}
			//alert(hitMapData.data.toSource());
			$("#table tr:even").css("background-color", "#ccc");
			//$("#results").html("[" + tweets.length + " results.]");
			
			map.fitBounds([[minLon, minLat], [maxLon, maxLat]]);
            L.Util.requestAnimFrame(map.invalidateSize,map,!1,map._container);
               map.invalidateSize(); 

			
			var urls = data.urls;
			$("#urls").css("display", (urls.length > 0) ? "block" : "none");	
			$("#urls tbody tr").remove();		
			for (var i = 0; i < urls.length; i++) {
				$("#urls tbody").append("<tr><td><a href='" + urls[i][0] + "' target='_blank'>" + urls[i][0] + "</a></td><td style='padding-left: 40px;'>" + urls[i][1] + "</td></tr>");
			}
			$("#urls table tr:even").css("background-color", "#ccc");

			 
		    heatmapLayer.addData(hitMapData.data); 
			
		    controls.addLayer(heatmapLayer);
/*
			var overlays = {
				"tweets": controls,
				"heatmap": heatmapLayer
			};
			
			L.control.layers(baseLayers, overlays).addTo(map);
			
			
*/


						
		});
      			
	}

	
	$(document).ready(function() { 	    
		// north-center
	    getTweets();
        L.Util.requestAnimFrame(map.invalidateSize,map,!1,map._container);
        map.invalidateSize();		
		

   	
	});
	
	
		