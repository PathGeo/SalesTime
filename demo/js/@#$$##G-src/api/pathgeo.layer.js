if(!window.pathgeo){window.pathgeo={}}



pathgeo.layer={
	/**
	 * create marker cluster layer
	 * @require L.MarkerClusterGroup. please download from https://github.com/Leaflet/Leaflet.markercluster
	 * @param {geojson} geojson
	 * @param {L_geojson_options} L.geojson.options. please refer to https://github.com/Leaflet/Leaflet.markercluster
	 * @param {object} events, including "clusterclick", "clustermouseover"
	 * @return {object} return object includes .markercluster and .layer(L.geojson)
	 */
	markerCluster: function(geojson, L_geojson_options, events){
		var markercluster= new L.MarkerClusterGroup({spiderfyOnMaxZoom: false, showCoverageOnHover: false, zoomToBoundsOnClick: false });
		
		if(L_geojson_options.onEachFeature){
			var clone_onEachFeature=L_geojson_options.onEachFeature;
			L_geojson_options.onEachFeature=function(feature, layer){
				clone_onEachFeature(feature, layer);
				markercluster.addLayer(layer);
			}	
		}
		
		var layer=L.geoJson(geojson, L_geojson_options);
		
		//overwrite markercluster events
		if(events){
			if(events.clusterclick){markercluster.on("clusterclick", events.clusterclick);}
			if(events.clustermouseover){markercluster.on("clustermouseover", events.clustermouseover);}
		}
		
		return markercluster
	},
	
	
	/**
	 * create a heatmap
	 * @require heatmap.js and heatmap-leaflet.js from https://github.com/sunng87/heatcanvas
	 * @param {geojson} geojson
	 * @param {object} heatCanvas options from https://github.com/sunng87/heatcanvas
	 * @return 
	 */
	heatMap: function(geojson, options){
		if(!geojson){console.log("[ERROR] pathgeo.layer.heatMap: no geojson!");return;}
		
		//options
		if(!options){options={}}
		options.unloadInvisibleTiles= options.unloadInvisibleTiles || true;
		options.reuseTiles= options.reuseTiles || true;
		options.radius= options.radius || 30;
		options.opacity= options.opacity || 0.8;
		options.gradient= options.gradient || {
				0.45: "rgb(0,0,255)",
				0.65: "rgb(0,255,255)",
				0.85: "rgb(0,255,0)",
				0.98: "yellow",
				1.0: "rgb(255,0,0)"
		};
		
		var heatmapLayer = L.TileLayer.heatMap(options);
		
		var hitMapData={
	    	max:  1, // Always 1 in tweet data
			data: []
	    };
		
		//parse geojson
		//feature collection
		if(geojson.type=='FeatureCollection'){
			var feature;
			for(var i in geojson.features){
				feature=geojson.features[i];
				if(feature.geometry.type=='Point'){
					hitMapData.data.push({lat: feature.geometry.coordinates[1], lon: feature.geometry.coordinates[0], value: 1});
				}
			}
		}
		//features
		if(geojson instanceof Array){
			var feature;
			for(var i in geojson){
				feature=geojson[i];
				if(feature.geometry.type=='Point'){
					hitMapData.data.push({lat: feature.geometry.coordinates[1], lon: feature.geometry.coordinates[0], value: 1});
				}
			}
		}
		
		heatmapLayer.addData(hitMapData.data);
		return heatmapLayer;
	}
		
	
}
