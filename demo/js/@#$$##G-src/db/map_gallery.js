var map;
var layers = [];		
var curTweets = [];

function initMapGallery() {
	var baseLayer = L.tileLayer("http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/{styleId}/256/{z}/{x}/{y}.png", {styleId: 22677});
	
	if (!map) {
		map = new L.map("div_map", {
				center: [35,-100],
				zoom: 4,
				layers:[baseLayer],
				attributionControl:false
			}); 
	}
		
	//initialize map...
	switchVisualization([$("#div_select_map_style").val()], true);
	
	$("#div_button_controls").click(function(e) {
		var style = $("#div_select_map_style").val();	
		switchVisualization([style], true);
	});
}

function addPointsToGroup(group, tweets) {
	//More than 1,000 points seems to make the map very slow!
	var length = (group instanceof L.MarkerClusterGroup) ? tweets.length : Math.min(tweets.length, 1000);

	for (var indx = 0; indx < length; indx++) {
		var tweet = tweets[indx];
		var marker = new L.Marker(tweet.loc);
		marker.properties = { text: tweet.text };
		marker.bindPopup("<div class='popup'><ul><li>" + tweet.text + "</li></ul></div>", {maxWidth:500, maxHeight:300});
		group.addLayer(marker);
	}
}
	
function getPointLayer(tweets) {
	var group = new L.layerGroup();
	addPointsToGroup(group, tweets);
	return group;
}
		
function getClusterLayer(tweets) {
	var group = new L.MarkerClusterGroup( {
		spiderfyOnMaxZoom: false, 
		showCoverageOnHover: false, 
		zoomToBoundsOnClick: false
	});
	
	//Event handler for click
	group.on('clusterclick', function(e) {
		var props = getClusterProperties(e.layer, []);
		
		if(!e.layer._popup) {
			var properties = getClusterProperties(e.layer, []);
			var html="<div class='popup'>There are <b>" + e.layer._childCount + "</b> tweets:<p></p><ul>";
			$.each(properties, function(i, property) {
				html+="<li>" + property.text + " </li>";
			});
			html+="</ul></div>";
														
			e.layer.bindPopup(html, {maxWidth:500, maxHeight:300} ).openPopup();
		} else {
			e.layer.openPopup();
		}
	});
	
	addPointsToGroup(group, tweets);
	return group;
}

function getClusterProperties(clusterObj, properties) {
  
  if(clusterObj._markers.length > 0) {
      $.each(clusterObj._markers, function(i, marker) {
	      properties.push(marker.properties);
	  });
  }
		
  if(clusterObj._childClusters.length > 0) {
      $.each(clusterObj._childClusters, function(i, cluster) {
	      properties.concat(getClusterProperties(cluster, properties));
	  });
  }
  
  return properties;
}	
	
function getHeatMapLayer(tweets) {
	
	var heatmapLayer = new L.TileLayer.heatMap({ 
		radius: 40,
		opacity: 0.75,
		gradient: {
			0.45: "rgb(0,0,255)",
			0.65: "rgb(0,255,255)",
			0.85: "rgb(0,255,0)",
			0.98: "yellow",
			1.0: "rgb(255,0,0)"
		}
	});
	
	var data = [];
	
	for (var indx in tweets) {
		var tweet = tweets[indx];
		data.push( { lat: tweet.loc[0], lon: tweet.loc[1], value: 1 } );
	}
	
	heatmapLayer.addData(data);
	
	return heatmapLayer;
}

//switch layer
function switchVisualization(types, isNewRequest){
	//remove all shown layers on the map
	removeLayers();
	
	function addNewLayers(tweets) {
		curTweets = tweets;
		//$("#div_button_controls").attr('disabled', true);
		$.each(types, function(i, type) {
			switch(type) {
				case "MARKERCLUSTER":
					var newLayer = getClusterLayer(tweets);
					layers.push(newLayer);
					map.addLayer(newLayer);
					break;
				case "HEATMAP":
					var newLayer = getHeatMapLayer(tweets);
					layers.push(newLayer);
					map.addLayer(newLayer);
					break;
				case "GEOJSON":
					var newLayer = getPointLayer(tweets);
					layers.push(newLayer);
					map.addLayer(newLayer);
					break;
			}
		});
		//$("#div_button_controls").attr('disabled', false);
	}
	
	if (isNewRequest) {
		getTweets(addNewLayers);
	} else {
		addNewLayers(curTweets);
	}
}

//remove all layers on the map
function removeLayers(){
	if(layers.length > 0) {
		$.each(layers, function(i, layer) {
			map.removeLayer(layer);
		});
		layers = [];
	}
}
		
function getTweets(callback) {
	//Stop execution if there's no callback...
	if (!callback) return;
	
	var location = $("#div_select_location").val() || 'Los+Angeles';
	var rad = $("#div_select_radius").val() || 50;
	var keywd = $("#div_select_keyword").val() || 'Honda';

	var url = "http://vision.sdsu.edu/chris42/PyMapper.py?key=" + location + "&rad=" + rad + "&keyword=" + keywd;	
	
	$.getJSON(url, function(data) { 
		var result = data.results;
		callback(result);
	});	
}



