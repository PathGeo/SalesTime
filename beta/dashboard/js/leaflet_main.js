var app={
	map:null,
	basemaps:{
			"Cloudmade": L.tileLayer("http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/{styleId}/256/{z}/{x}/{y}.png", {styleId: 22677}),
			"OpenStreetMap": L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"),
			"Google Streetmap":L.tileLayer("https://mts{s}.googleapis.com/vt?lyrs=m@207265067&src=apiv3&hl=zh-TW&x={x}&y={y}&z={z}&s=Ga&style=api%7Csmartmaps",{subdomains:"123", attribution:"Map Source from Google"}),
			"Nokia Satellite":L.tileLayer("http://{s}.maps.nlp.nokia.com/maptile/2.1/maptile/b9e8949142/hybrid.day/{z}/{x}/{y}/256/png8?app_id=SqE1xcSngCd3m4a1zEGb&token=r0sR1DzqDkS6sDnh902FWQ&lg=ENG",{subdomains:"1234", attribution:"Map Source from Nokia"})
	},
	layers:[
			//{name:"Twitter_20121209", type: "GEOJSON", url:"db/ford.json", srs:"EPSG:4326", cluster:true, title:"Twitter 'Ford-case' @20121209 (0.38MB): 745 Twitters", fieldName:{username:"user_name", text:"text_"}},
//			{name:"Twitter_20121210", type: "GEOJSON", url:"db/20121210.json", srs:"EPSG:4326", cluster:true, title:"Twitter 'Ford-case' @20121210 (6.04MB): 12024 Twitters"},
//			{name:"Twitter_20121211", type: "GEOJSON", url:"db/20121211.json", srs:"EPSG:4326", cluster:true, title:"Twitter 'Ford-case' @20121211 (7.85MB): 15608 Twitters"},
			{name:"[WMS]States", type: "WMS", url:"http://sgis.kisr.edu.kw/geoserver/topp/wms", srs:"EPSG:4326", param:{layers:"topp:states", tiled:true, attribution:""}},
			{name:"[WMS]Weather", type: "WMS", url:"http://gis.srh.noaa.gov/ArcGIS/services/NDFDTemps/MapServer/WMSServer", srs:"EPSG:4326", param:{layers:"1", attribution:"NOAA"}}
	],
	searchResult:null,
	controls:{
		toc:{}
	},
	popup:null,
	initCenterLatLng:[35,-100],
	initCenterZoom:4,
	showLayers:[] //layers are shown in the map
}



$(function(){
	init_map();	
	
	init_UI();
	
	//show demo
	getTweets('demo');
})




//init openlayers
function init_map(){
	app.map = L.map("div_map", {
        center: app.initCenterLatLng,
		zoom: app.initCenterZoom,
		layers:[app.basemaps["Cloudmade"]],
		attributionControl:false,
		crs: L.CRS.EPSG4326  //change projection system to latitude and longtitude (epsg:4326), the original is epsg:3857
							 //but it will make some projection problem of WMS!!!
    }); 
	
	//layers control
	app.controls.toc=L.control.layers(app.basemaps); //.addTo(app.map);
	
	//show all layers
	$.each(app.layers,function(i,layer){showLayer(layer,false)});
}


//init UI
function init_UI(){
	$("#div_gallery ul li").click(function(){
		$(this).css("background-color", "#222222").siblings().css("background-color","");
	});
}


//load geojson
function showLayer(obj, isShow){
		obj.timeStart=new Date().getTime();
		
		switch(obj.type){
			case "GEOJSON":
				if(!obj.json){
					$.getJSON(obj.url, function(json){
						obj.json=json;
						parseGeojson(obj);
						addLayer(obj);
					});
				}else{
					parseGeojson(obj);
					addLayer(obj);
				}
				
				
				function parseGeojson(obj){
					//create layer
					if(!obj.geoJsonLayer){
						obj.geoJsonLayer=L.geoJson(obj.json, {
								onEachFeature:function(feature,layer){
									var html="<div class='popup'><ul><li><img src='images/1359925009_twitter_02.png' width=20px />&nbsp; &nbsp; <b>"+ feature.properties[obj.fieldName.username]+"</b>: "+ feature.properties[obj.fieldName.text]+"</li></ul></div>";
									html=html.replace(/undefined/g, "Tweet");
									
									//highlight keyword
									html=pathgeo.util.highlightKeyword(obj.keywords,html);
									//info window
									layer.bindPopup(html,{maxWidth:500, maxHeight:300});
								}
						});
						app.controls.toc.addOverlay(obj.geoJsonLayer, "GeoJSON");
						obj.layer=obj.geoJsonLayer;
					}
					
					//marker cluster
					if(!obj.markerClusterLayer){
						obj.markerClusterLayer=pathgeo.layer.markerCluster(obj.json,{
								onEachFeature:function(feature,layer){
									var html="<div class='popup'><ul><li><img src='images/1359925009_twitter_02.png' width=20px />&nbsp; &nbsp; <b>"+ feature.properties[obj.fieldName.username]+"</b>: "+ feature.properties[obj.fieldName.text]+"</li></ul></div>";
									html=html.replace(/undefined/g, "Tweet");
													
									//highlight keyword
									html=pathgeo.util.highlightKeyword(obj.keywords,html);
									//info window
									layer.bindPopup(html,{maxWidth:500, maxHeight:300});
								}
							},{
								//clusterclick event
								clusterclick: function(e){
									if(!e.layer._popup){
										var properties=pathgeo.util.readClusterFeatureProperies(e.layer, []);
										var html="<div class='popup'>There are <b>" + e.layer._childCount + "</b> twitters:<p></p><ul>";
										$.each(properties, function(i, property){
											html+="<li><img src='images/1359925009_twitter_02.png' width=20px />&nbsp; &nbsp; <b>"+ property[obj.fieldName.username]+"</b>: "+ property[obj.fieldName.text]+"</li>";
										});
										html+="</ul></div>";
										html=html.replace(/undefined/g, "Tweet");
											
										//highlight keyword
										html=pathgeo.util.highlightKeyword(obj.keywords,html);
													
										e.layer.bindPopup(html,{maxWidth:500, maxHeight:300}).openPopup();
									}else{
										e.layer.openPopup();
									}
								}
							}
						);
						app.controls.toc.addOverlay(obj.markerClusterLayer, "MarkerCluster");
					}
					
					//heat map				
					if(!obj.heatMapLayer){
						obj.heatMapLayer=pathgeo.layer.heatMap(obj.json);
						app.controls.toc.addOverlay(obj.heatMapLayer, "Heatmap");
					}
				}//end parseGeojson
			break;
			case "WMS":
				//default param
				if(obj.param && obj.param.layers){
					obj.param.format= obj.param.format || 'image/png';
					obj.param.transparent=obj.param.transparent || true
					
					obj.layer = L.tileLayer.wms(obj.url, obj.param);
					
					//events
					obj.layer.on("load", function(e){
						console.log("loaded");
					});
					
					//obj.layer.setOpacity(0.75).addTo(app.map).bringToFront();
					addLayer(obj);
					app.controls.toc.addOverlay(obj.layer, obj.name);
				}
			break;
		}
		
		
		function addLayer(obj){
			if(isShow){
				obj.layer.addTo(app.map);
				app.showLayers.push(obj.layer);
			}

			//close dialog
			$("#div_dialog").dialog("destroy");
			$("#img_loading").hide();
		}
}



//switch layer
function switchVisualization(types){
	//remove all shown layers on the map
	removeLayers();
	
	var layer;
	$.each(types, function(i,type){
		switch(type){
			case "MARKERCLUSTER":
				layer=app.searchResult.markerClusterLayer.addTo(app.map);
			break;
			case "HEATMAP":
				layer=app.searchResult.heatMapLayer.addTo(app.map);
			break;
			case "GEOJSON":
				layer=app.searchResult.geoJsonLayer.addTo(app.map);
			break;
		}
		app.showLayers.push(layer);
	});
}



function getTweets(data){
	//show loading imag
	$("#img_loading").show();
	
	//clear previous result
	if(app.searchResult && app.searchResult.layer){
		removeLayers();
		app.controls.toc.removeLayer(app.searchResult.layer);
		app.controls.toc.removeLayer(app.searchResult.markerClusterLayer);
		app.controls.toc.removeLayer(app.searchResult.heatMapLayer);
	}
		
	var key=$("#keyword").val(),
		radius=$("#radius").val(),
		keyword=$("#car").val();
	
	
	if(data=='demo'){
		$.getJSON("db/ford.json", function(geojson){
			app.searchResult={
				name: "searchResult", 
				type: "GEOJSON", 
				json: geojson,
				srs: "EPSG:4326",
				title: "Demo Data",
				fieldName:{username:"user name", text:"text_"},
				keywords:["FORD", "FUSION", "ESCAPE"]
			};
			showLayer(app.searchResult, true);
		});
	}else{
		pathgeo.service.search(key, radius, keyword, function(geojson){
			app.searchResult={
				name: "searchResult", 
				type: "GEOJSON", 
				json: geojson,
				srs: "EPSG:4326",
				title: keyword + "around " + radius + " miles in " + key,
				fieldName:{username:null, text:"text"},
				keywords:[keyword]
			};
			showLayer(app.searchResult, true);
		});
	}
	
	//change background-color in the default map
	$("#div_gallery ul li:first").css("background-color", "#222222").siblings().css("background-color","");
}


//remove all layers on the map
function removeLayers(){
	if(app.showLayers.length>0){
		$.each(app.showLayers, function(i,layer){
			app.map.removeLayer(layer);
		});
		app.showLayers=[];
	}
}





