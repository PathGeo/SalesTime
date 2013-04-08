	//global variables
	var app={
		map:null,		// leaflet map object
		layer:{
			heatmap:null //heatmap layer
		},
		controls:null, //leafmap controls
		hitMapData:{   //heatmap data
			max:  1,        // Always 1 in tweet data
			data: []
		}
	}


	// start - chart and table
    google.load("visualization", "1", {packages:["corechart"]});
    google.load('visualization', '1', {packages:['table']});
    google.load('visualization', '1', {packages:['gauge']});
    google.setOnLoadCallback(drawChart);
    

	$(document).ready(function() { 	    
		init_map();
		
		// north-center
	    getTweets();
	});
	
	
	
	
	function init_map(){
		// start map functions
			
		//var map = new L.Map('map');
		var OpenStreet = 'http://{s}.tile.cloudmade.com/ad132e106cd246ec961bbdfbe0228fe8/997/256/{z}/{x}/{y}.png',
		//apple = new L.TileLayer(OpenStreet, {maxZoom: 18,unloadInvisibleTiles: true});
		


				cmAttr = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
				cmUrl = 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/{styleId}/256/{z}/{x}/{y}.png';



		var openstreet = L.tileLayer(OpenStreet, {styleId: 256, attribution: cmAttr})
			minimal   = L.tileLayer(cmUrl, {styleId: 22677, attribution: cmAttr}),
			midnight  = L.tileLayer(cmUrl, {styleId: 999,   attribution: cmAttr});
			//motorways = L.tileLayer(cmUrl, {styleId: 46561, attribution: cmAttr});
			
		app.map = L.map('map', {
			center: [40.00, -100.387],
			//center: [0, 0],
			zoom: 4,
			layers: [minimal]
		});			
				
		app.layer.heatmap = L.TileLayer.heatMap({
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

		//app.setView(new L.LatLng(40.00, -100.387), 4).addLayer(apple);
				
		//app.controls = L.layerGroup();

		var baseLayers = {
			"Openstreet":openstreet,
			"Minimal": minimal,
			"Night View": midnight				
		};

		app.controls = L.layerGroup().addTo(app.map);
		
		var overlays = {
			"tweets": app.controls,
			"heatmap": app.layer.heatmap
		};
		
		L.control.layers(baseLayers, overlays).addTo(app.map);		

		var bingGeocoder = new L.Control.BingGeocoder('AvZ8vsxrtgnSqfEJF1hU40bASGwxahJJ3_X3dtkd8BSNljatfzfJUvhjo9IGP_P7');

		app.map.addControl(bingGeocoder);
		
		// end - map functions
	}

	
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
		var data2 = new google.visualization.DataTable();
		data2.addColumn('string', 'Tweet');
		data2.addColumn('number', 'Score');
		data2.addColumn('string', 'Location');
		data2.addRows([
		  ['Test driving a Ford Fusion today',  {v: 99, f: '99'}, 'La Mesa'],
		  ['Cant wait to see the new 2013 Mustang!',   {v:94,   f: '94'},  'La Mesa'],
		  ['Just crashed my car :(... need a new one now', {v: 80, f: '80'}, 'La Mesa'],
		  ['Shelby GT is too much, guess Im getting a Focus',   {v: 67,  f: '67'},  'San Diego']
	  
		]);
		
		var options2 = {
			showRowNumber: false
		  };

		  var table = new google.visualization.Table(document.getElementById('table_div'));
		  table.draw(data2, options2);
		
		// Add our selection handler.
		google.visualization.events.addListener(table, 'select', selectHandler);
		
		
					// Select a table row
		function selectHandler() {
			var selection = table.getSelection();
			var row = selection[0].row;
			 var str = data2.getFormattedValue(row, 0);
			var message = str;

			if (message == '') {
				message = 'nothing';
			}
			
			openPopUp(message);
		}
		
		
		$(window).resize(function() {
			chart.draw(data, options);
			table.draw(data2, {showRowNumber: true});
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
           	
		app.controls.clearLayers();
		app.hitMapData.data = [];        // Clear all items of hit map
	
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
				
			//alert(app.hitMapData.data.toSource());
			//app.hitMapData ='';
			for(var indx in tweets)  {
				var tweet = tweets[indx];
                  
				if (!(tweet.loc[0] == 0 && tweet.loc[1] == 0)) {
					//app.controls.removeLayer(app.layer.heatmap);
					//keep track of min/max lat/lon to set view
					if (tweet.loc[0] > maxLon) maxLon = tweet.loc[0];
					if (tweet.loc[0] < minLon) minLon = tweet.loc[0];
					if (tweet.loc[1] > maxLat) maxLat = tweet.loc[1];
					if (tweet.loc[1] < minLat) minLat = tweet.loc[1];
				   
					app.controls.addLayer(L.marker(tweet.loc).bindPopup(tweet.text));
					var heatItem = {lat:tweet.loc[0], lon:tweet.loc[1], value:1};
					app.hitMapData.data.push(heatItem);
					$("#table tbody").append("<tr><td><div style='height: 50px;'>" + tweet.text + "</div></td></tr>");
				
				}
				
			}
			//alert(app.hitMapData.data.toSource());
			$("#table tr:even").css("background-color", "#ccc");
			//$("#results").html("[" + tweets.length + " results.]");
			
			app.map.fitBounds([[minLon, minLat], [maxLon, maxLat]]);
            L.Util.requestAnimFrame(app.map.invalidateSize, app.map, !1, app.map._container);
            app.map.invalidateSize(); 

			
			var urls = data.urls;
			$("#urls").css("display", (urls.length > 0) ? "block" : "none");	
			$("#urls tbody tr").remove();		
			for (var i = 0; i < urls.length; i++) {
				$("#urls tbody").append("<tr><td><a href='" + urls[i][0] + "' target='_blank'>" + urls[i][0] + "</a></td><td style='padding-left: 40px;'>" + urls[i][1] + "</td></tr>");
			}
			$("#urls table tr:even").css("background-color", "#ccc");

			 
		    app.layer.heatmap.addData(app.hitMapData.data); 
			
		    app.controls.addLayer(app.layer.heatmap);
/*
			var overlays = {
				"tweets": app.controls,
				"heatmap": app.layer.heatmap
			};
			
			L.control.layers(baseLayers, overlays).addTo(map);
			
			
*/


						
		});
      			
	}

	
	
	
	
		