if(!window.pathgeo){window.pathgeo={}}

pathgeo.util={
	/**
	 * convert javascript object to html
	 * @param {Object} obj
	 * @return {String} html string
	 */
	objectToHtml: function(obj){
		if(!obj){console.log("[ERROR]pathgeo.util.objectToHtml: obj is null!");return;}
		
		var html="<ul class='objToHtml'>";
		for(var k in obj){
			html+="<li><b>"+k+"</b>: " + obj[k] + "</li>";
		}
		html+="</ul>";
		
		return html;
	},
	
	
	
	/** 
	 *  highlight keyword
	 */
	highlightKeyword: function(keywords, html){
		//highlight keyword
		var rgxp,rep1;
		$.each(keywords, function(j,keyword){
			rgxp = new RegExp(keyword, 'ig');
			repl = '<span class="highlightKeyword">' + keyword + '</span>';
			html = html.replace(rgxp, repl);
		});
		return html;
	},
	
	
	
	/**
	 * read all features properies in the cluster
	 */
	readClusterFeatureProperies: function(clusterObj,properties){
		if(clusterObj._markers.length>0){
			$.each(clusterObj._markers, function(i,marker){
				properties.push(marker.feature.properties);
			});
		}
		
		if(clusterObj._childClusters.length>0){
			$.each(clusterObj._childClusters, function(i,cluster){
				properties.concat(pathgeo.util.readClusterFeatureProperies(cluster, properties));
			});
		}
		return properties;
	}
		
}
