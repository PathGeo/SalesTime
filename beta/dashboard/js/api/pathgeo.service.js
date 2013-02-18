if(!window.pathgeo){window.pathgeo={}}

pathgeo.service={
	proxy: "http://localhost/proxy/proxy.py?url=",
	
	
	/**
	 * search pathgeo database
	 * @param {String} key
	 * @param {String} radius
	 * @param {String} keyword
	 * @param {Function} callback function(json)
	 */
	search: function(key, radius, keyword, callback){
		var url=(this.proxy!="") ? this.proxy + encodeURIComponent("http://vision.sdsu.edu/suhan/chris/PyMapper.py?key=" + key + "&rad=" + radius + "&keyword=" + keyword) : "chris/PyMapper.py?key=" + key + "&rad=" + radius + "&keyword=" + keyword
		//replace %20 (space) to %2520 in the url
		url=url.replace("%20", "%2520");
	
		//get json
		$.getJSON(url, function(json){
			var geojson={
				type:"FeatureCollection",
				features:[]
			}
			
			var feature;
			for(var i in json.results){
				feature=json.results[i];
				
				geojson.features.push({
					type:"Feature",
					geometry:{type:"Point", coordinates:[feature.loc[1], feature.loc[0]]},
					properties:{text: feature.text, urls: feature.urls}
				});
			}
			
			if(callback){
				callback(geojson);
			}
		});
	}
	
	
}
