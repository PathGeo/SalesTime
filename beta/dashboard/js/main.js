var app={
	map:null,
	gmap:null,
	mapTypes:[new OpenLayers.Layer.OSM("OpenStreetMap"),
      		      new OpenLayers.Layer.Google("Google Streets", {visibility: false, type:"roadmap", numZoomLevels: 20}),
      			  new OpenLayers.Layer.Google("Google Satellite", {visibility: false, type:"satellite",numZoomLevels: 22}),
      			  new OpenLayers.Layer.Google("Google Hybrid", {visibility: false, type:"hybrid", numZoomLevels: 20}),
      			  new OpenLayers.Layer.Google("Google Terrain", {visibility: false, type:"terrain"}),
      			  new OpenLayers.Layer.XYZ("Google Traffic",["http://mt0.googleapis.com/vt?lyrs=m@189000000,traffic&src=apiv3&hl=en-US&x=${x}&y=${y}&z=${z}&s=&style=api%7Csmartmaps","http://mt1.googleapis.com/vt?lyrs=m@189000000,traffic&src=apiv3&hl=en-US&x=${x}&y=${y}&z=${z}&s=&style=api%7Csmartmaps","http://mt2.googleapis.com/vt?lyrs=m@189000000,traffic&src=apiv3&hl=en-US&x=${x}&y=${y}&z=${z}&s=&style=api%7Csmartmaps","http://mt3.googleapis.com/vt?lyrs=m@189000000,traffic&src=apiv3&hl=en-US&x=${x}&y=${y}&z=${z}&s=&style=api%7Csmartmaps"], {attribution: "",sphericalMercator: true,wrapDateLine: true,transitionEffect: "resize",buffer: 1,numZoomLevels: 18}),
      			  new OpenLayers.Layer.Bing({name:"Bing Roadmap", type:"Road", key:"AqpqMtccs90inKd61BNUi-LnEPDhQIlSpfvIm-qY4zM4Bv3_KzF7NMTAzYmco4wZ"}),
      			  new OpenLayers.Layer.Bing({name:"Bing Satellite", type:"Aerial", key:"AqpqMtccs90inKd61BNUi-LnEPDhQIlSpfvIm-qY4zM4Bv3_KzF7NMTAzYmco4wZ"}),
      			  new OpenLayers.Layer.Bing({name:"Bing Hybrid", type:"AerialwithLabels", key:"AqpqMtccs90inKd61BNUi-LnEPDhQIlSpfvIm-qY4zM4Bv3_KzF7NMTAzYmco4wZ"}),
      			  new OpenLayers.Layer.XYZ("Nokia Map",["http://1.maps.nlp.nokia.com/maptile/2.1/maptile/b9e8949142/normal.day/${z}/${x}/${y}/256/png8?app_id=SqE1xcSngCd3m4a1zEGb&token=r0sR1DzqDkS6sDnh902FWQ&lg=ENG","http://2.maps.nlp.nokia.com/maptile/2.1/maptile/b9e8949142/normal.day/${z}/${x}/${y}/256/png8?app_id=SqE1xcSngCd3m4a1zEGb&token=r0sR1DzqDkS6sDnh902FWQ&lg=ENG","http://3.maps.nlp.nokia.com/maptile/2.1/maptile/b9e8949142/normal.day/${z}/${x}/${y}/256/png8?app_id=SqE1xcSngCd3m4a1zEGb&token=r0sR1DzqDkS6sDnh902FWQ&lg=ENG", "http://4.maps.nlp.nokia.com/maptile/2.1/maptile/b9e8949142/normal.day/${z}/${x}/${y}/256/png8?app_id=SqE1xcSngCd3m4a1zEGb&token=r0sR1DzqDkS6sDnh902FWQ&lg=ENG"], {attribution: "",sphericalMercator: true,wrapDateLine: true,transitionEffect: "resize",buffer: 1,numZoomLevels: 19}),
      			  new OpenLayers.Layer.XYZ("Nokia Satellite",["http://1.maps.nlp.nokia.com/maptile/2.1/maptile/b9e8949142/hybrid.day/${z}/${x}/${y}/256/png8?app_id=SqE1xcSngCd3m4a1zEGb&token=r0sR1DzqDkS6sDnh902FWQ&lg=ENG","http://2.maps.nlp.nokia.com/maptile/2.1/maptile/b9e8949142/hybrid.day/${z}/${x}/${y}/256/png8?app_id=SqE1xcSngCd3m4a1zEGb&token=r0sR1DzqDkS6sDnh902FWQ&lg=ENG","http://3.maps.nlp.nokia.com/maptile/2.1/maptile/b9e8949142/hybrid.day/${z}/${x}/${y}/256/png8?app_id=SqE1xcSngCd3m4a1zEGb&token=r0sR1DzqDkS6sDnh902FWQ&lg=ENG", "http://4.maps.nlp.nokia.com/maptile/2.1/maptile/b9e8949142/hybrid.day/${z}/${x}/${y}/256/png8?app_id=SqE1xcSngCd3m4a1zEGb&token=r0sR1DzqDkS6sDnh902FWQ&lg=ENG"], {attribution: "",sphericalMercator: true,wrapDateLine: true,transitionEffect: "resize",buffer: 1,numZoomLevels: 19}),
      			  new OpenLayers.Layer.XYZ("Nokia Terrain",["http://1.maps.nlp.nokia.com/maptile/2.1/maptile/b9e8949142/terrain.day/${z}/${x}/${y}/256/png8?app_id=SqE1xcSngCd3m4a1zEGb&token=r0sR1DzqDkS6sDnh902FWQ&lg=ENG","http://2.maps.nlp.nokia.com/maptile/2.1/maptile/b9e8949142/terrain.day/${z}/${x}/${y}/256/png8?app_id=SqE1xcSngCd3m4a1zEGb&token=r0sR1DzqDkS6sDnh902FWQ&lg=ENG","http://3.maps.nlp.nokia.com/maptile/2.1/maptile/b9e8949142/terrain.day/${z}/${x}/${y}/256/png8?app_id=SqE1xcSngCd3m4a1zEGb&token=r0sR1DzqDkS6sDnh902FWQ&lg=ENG", "http://4.maps.nlp.nokia.com/maptile/2.1/maptile/b9e8949142/terrain.day/${z}/${x}/${y}/256/png8?app_id=SqE1xcSngCd3m4a1zEGb&token=r0sR1DzqDkS6sDnh902FWQ&lg=ENG"], {attribution: "",sphericalMercator: true,wrapDateLine: true,transitionEffect: "resize",buffer: 1,numZoomLevels: 19}),
      			  new OpenLayers.Layer.XYZ("NASA 2012 Night Map",["https://earthbuilder.google.com/10446176163891957399-13737975182519107424-4/2/maptile/maps?v=2&authToken=Cgg5OyyBxpoOuRD80eCGBQ==&x=${x}&y=${y}&z=${z}&s="], {attribution: "",sphericalMercator: true,wrapDateLine: true,transitionEffect: "resize",buffer: 1,numZoomLevels: 8}),
      			  new OpenLayers.Layer.XYZ("Gray Styled Map",["http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/${z}/${y}/${x}",], {attribution: "",sphericalMercator: true,wrapDateLine: true,transitionEffect: "resize",buffer: 1,numZoomLevels: 14}),
      			  new OpenLayers.Layer.XYZ("NationalGeographicMap",["http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/${z}/${y}/${x}",], {attribution: "",sphericalMercator: true,wrapDateLine: true,transitionEffect: "resize",buffer: 1,numZoomLevels: 13}),
      			  new OpenLayers.Layer.XYZ("Ocean Map",["http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/${z}/${y}/${x}",], {attribution: "",sphericalMercator: true,wrapDateLine: true,transitionEffect: "resize",buffer: 1,numZoomLevels: 11})
	],
	layers:[
			{name:"Twitter_Ford", type: "GEOJSON", url:"db/ford.json", srs:"EPSG:4326", cluster:true, title:"Twitter 'Ford-case' 2012.12.04~2012.12.18 (0.753MB): 1958 Twitters"},
			{name:"Twitter_20121209", type: "GEOJSON", url:"db/20121209.json", srs:"EPSG:4326", cluster:true, title:"Twitter 'Ford-case' @20121209 (0.38MB): 745 Twitters"},
			{name:"Twitter_20121210", type: "GEOJSON", url:"db/20121210.json", srs:"EPSG:4326", cluster:true, title:"Twitter 'Ford-case' @20121210 (6.04MB): 12024 Twitters"},
			{name:"Twitter_20121211", type: "GEOJSON", url:"db/20121211.json", srs:"EPSG:4326", cluster:true, title:"Twitter 'Ford-case' @20121211 (7.85MB): 15608 Twitters"}
	],
	controls:{
		selectFeature:new OpenLayers.Control.SelectFeature([])
	},
	keywords:["FORD","ESCAPE","FUSION"],
	popup:null,
	initCenterLonLat:new OpenLayers.LonLat(-100,35),
	initCenterZoom:4
}



$(function(){
	init_map();	
	
	showLayer(app.layers[0]);
})




//init openlayers
function init_map(){
	app.map = new OpenLayers.Map({
        div: "div_map",
        projection: new OpenLayers.Projection("EPSG:900913"),
        displayProjection: new OpenLayers.Projection("EPSG:4326")
    }); 
	
	//load base map
	app.map.addLayers(app.mapTypes);
	
	//control
	app.map.addControl(new OpenLayers.Control.LayerSwitcher());
	
	//init centerLonLat
    app.initCenterLonLat=app.initCenterLonLat.transform(app.map.displayProjection, app.map.projection);
    app.map.setCenter(app.initCenterLonLat, app.initCenterZoom);
	
	//set google map
    app.gmap=app.mapTypes[1].mapObject;
	
	//set default basemamp
	app.map.setBaseLayer(app.mapTypes[9]);
	
	//add control
	$.each(app.controls, function(k,control){
		app.map.addControl(control);
		control.activate();
	});
}



//load geojson
function showLayer(obj){
	obj.timeStart=new Date().getTime();
	
	//show title and dialog
	if(obj.title){
		$("#div_title").html("<font size=3>"+ obj.title +"</font>");
		$("#div_dialog").html("<font size=3><b>"+ obj.title +"</b></font><p></p><img src='images/loading.gif' width=30px />");
		$("#div_dialog").dialog({
			 resizable: false,
			 height:140,
			 modal: true,
			 title: "Loading..."
		});
	}
	
	switch(obj.type){
		case "GEOJSON":
			obj.oplayer=new OpenLayers.Layer.Vector(obj.name, {
	                    projection: new OpenLayers.Projection(obj.srs),
	                    strategies: [new OpenLayers.Strategy.Fixed()],
	                    renderers: ['Canvas','SVG'],
						protocol: new OpenLayers.Protocol.HTTP({
	                        url: obj.url,
	                        format: new OpenLayers.Format.GeoJSON({
	                            ignoreExtraDims: true
	                        })
						})
	   		 });

			 //event
			 obj.oplayer.events.on({
			 	"featuresadded":function(){
					if(!obj.timeDuration){
						obj.timeEnd=new Date().getTime();
						obj.timeDuration=(obj.timeEnd - obj.timeStart) /1000;
						
						//show loading time
						$("#div_title").append("<div style='float:right'>Loading time: " + obj.timeDuration + " s</div>");
					}
					
					//hide loading dialog
					$("#div_dialog").dialog("destroy");
				},
				"featureselected":function(e){
					if(app.popup){app.map.removePopup(app.popup)}
					
					//info html
					var html="";
					if(e.feature.cluster){
	         			html="<div class='popup'><ul><li><img src='images/1359925009_twitter_02.png' width=20px />&nbsp; &nbsp; <b>"+ e.feature.cluster[0].attributes["user_name"]+"</b>: "+ e.feature.cluster[0].attributes["text_"]+"</li></ul>";
								
	                	if(e.feature.cluster.length>1){
		               		html="<div class='popup'>There are <b>" + e.feature.cluster.length + "</b> twitters.<p><p><ul>";
							$.each(e.feature.cluster, function(i,feature){
								html+="<li><img src='images/1359925009_twitter_02.png' width=20px />&nbsp; &nbsp; <b>"+ feature.attributes["user_name"]+"</b>: " + feature.attributes["text_"]+"</li>";
							});
							html+="</ul>"
		               	}		
	               	} 
					html+="</div>";
					
					//highlight keyword
					var rgxp,rep1;
					$.each(app.keywords, function(j,keyword){
						rgxp = new RegExp(keyword, 'ig');
						repl = '<span class="highlightKeyword">' + keyword + '</span>';
						html = html.replace(rgxp, repl);
					});
					
	                app.popup=new OpenLayers.Popup.FramedCloud(
					              "popup", 
					              e.feature.geometry.getBounds().getCenterLonLat(),
					              null,
					              html,
					              null,
					              true
					);
					e.feature.popup=app.popup;
					app.map.addPopup(app.popup);
				},
				"refresh":function(){
					obj.timeStart=new Date().getTime();
				}
			 });
		break;
	}
	
	
	
	//cluster
	if(obj.cluster){
		obj.oplayer=pathgeo.layer.createClusterVectorLayer(obj.oplayer, {clusterStrategy: new OpenLayers.Strategy.Cluster()});
	}
	
	
	//add layer to map
	app.map.addLayer(obj.oplayer);	
	
	//active selectFeature Control
	app.controls.selectFeature.setLayer([obj.oplayer])	
}




