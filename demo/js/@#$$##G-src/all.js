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
	highlightKeyword: function(keywords, html, matchEntireWord){
		//highlight keyword
		var rgxp,rep1;
		$.each(keywords, function(j,keyword){
			
			if (matchEntireWord) {
				//Only match keywords that are distinct. 
				//For example, match "car", but not "cards"
				rgxp = new RegExp('\\b' + keyword + '\\b', 'ig');
			} else {
				rgxp = new RegExp(keyword, 'ig');
			} 
			
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
function getScore(a){if("dailyRep"==a)return[["Date","Reputation"],["Feb 16",-8],["Feb 17",0],["Feb 18",16],["Feb 19",20],["Feb 20",26],["Feb 21",22],["Feb 22",20],["Feb 23",30],["Feb 24",45],["Feb 25",63],["Feb 26",70],["Feb 27",65],["Feb 28",77],["Mar 1",82]];if("weeklyRep"==a)return[["Date","Reputation"],["Feb 1",-62],["Feb 2",-48],["Feb 3",-48],["Feb 4",-33],["Feb 5",-22],["Feb 6",-33],["Feb 7",-8],["Feb 8",-10],["Feb 9",-18],["Feb 10",3],["Feb 11",6],["Feb 12",12],["Feb 13",20],["Feb 14",36],
["Feb 15",10],["Feb 16",-8],["Feb 17",0],["Feb 18",16],["Feb 19",20],["Feb 20",26],["Feb 21",22],["Feb 22",20],["Feb 23",30],["Feb 24",45],["Feb 25",63],["Feb 26",70],["Feb 27",65],["Feb 28",77],["Mar 1",82]];if("monthlyRep"==a)return[["Date","Reputation"],["Jan 1",-55],["Jan 2",-45],["Jan 3",-48],["Jan 4",-36],["Jan 5",-24],["Jan 6",-22],["Jan 7",-16],["Jan 8",-16],["Jan 9",-18],["Jan 10",2],["Jan 11",6],["Jan 12",-10],["Jan 13",-10],["Jan 14",-12],["Jan 15",-2],["Jan 16",-4],["Jan 17",-6],["Jan 18",
1],["Jan 19",5],["Jan 20",18],["Jan 21",32],["Jan 22",28],["Jan 23",25],["Jan 24",11],["Jan 25",2],["Jan 26",5],["Jan 27",12],["Jan 28",8],["Jan 29",-17],["Jan 30",-32],["Jan 31",-40],["Feb 1",-62],["Feb 2",-48],["Feb 3",-48],["Feb 4",-33],["Feb 5",-22],["Feb 6",-33],["Feb 7",-8],["Feb 8",-10],["Feb 9",-18],["Feb 10",3],["Feb 11",6],["Feb 12",12],["Feb 13",20],["Feb 14",36],["Feb 15",10],["Feb 16",-8],["Feb 17",0],["Feb 18",16],["Feb 19",20],["Feb 20",26],["Feb 21",22],["Feb 22",20],["Feb 23",30],
["Feb 24",45],["Feb 25",63],["Feb 26",70],["Feb 27",65],["Feb 28",77],["Mar 1",82]];if("dailyVis"==a)return[["Date","Visibilty"],["Feb 16",45],["Feb 17",12],["Feb 18",34],["Feb 19",50],["Feb 20",38],["Feb 21",49],["Feb 22",42],["Feb 23",34],["Feb 24",45],["Feb 25",63],["Feb 26",77],["Feb 27",70],["Feb 28",79],["Mar 1",88]];if("weeklyVis"==a)return[["Date","Visibilty"],["Feb 1",-55],["Feb 2",-45],["Feb 3",-48],["Feb 4",-33],["Feb 5",-22],["Feb 6",-28],["Feb 7",-10],["Feb 8",-16],["Feb 9",-18],["Feb 10",
2],["Feb 11",6],["Feb 12",-12],["Feb 13",-20],["Feb 14",10],["Feb 15",30],["Feb 16",45],["Feb 17",12],["Feb 18",34],["Feb 19",50],["Feb 20",38],["Feb 21",49],["Feb 22",42],["Feb 23",34],["Feb 24",45],["Feb 25",63],["Feb 26",77],["Feb 27",70],["Feb 28",79],["Mar 1",88]];if("monthlyVis"==a)return[["Date","Visibilty"],["Jan 1",-55],["Jan 2",-45],["Jan 3",-48],["Jan 4",-36],["Jan 5",-24],["Jan 6",-22],["Jan 7",-16],["Jan 8",-16],["Jan 9",-18],["Jan 10",2],["Jan 11",6],["Jan 12",-12],["Jan 13",-20],["Jan 14",
-22],["Jan 15",-18],["Jan 16",-12],["Jan 17",-6],["Jan 18",1],["Jan 19",5],["Jan 20",15],["Jan 21",22],["Jan 22",18],["Jan 23",15],["Jan 24",11],["Jan 25",2],["Jan 26",-5],["Jan 27",-12],["Jan 28",-15],["Jan 29",-17],["Jan 30",-32],["Jan 31",-40],["Feb 1",-55],["Feb 2",-45],["Feb 3",-48],["Feb 4",-33],["Feb 5",-22],["Feb 6",-28],["Feb 7",-10],["Feb 8",-16],["Feb 9",-18],["Feb 10",2],["Feb 11",6],["Feb 12",-12],["Feb 13",-20],["Feb 14",10],["Feb 15",30],["Feb 16",45],["Feb 17",12],["Feb 18",34],["Feb 19",
50],["Feb 20",38],["Feb 21",49],["Feb 22",42],["Feb 23",34],["Feb 24",45],["Feb 25",63],["Feb 26",77],["Feb 27",70],["Feb 28",79],["Mar 1",88]]}
var userData={Da_Juan_andOnly:{description:"I do what I want.Cali livin. Soccer best sport in the world. Good beer. Laid back chillin posted, living like a villain mostly.",friends_count:301,followers_count:108,image_url:"http://a0.twimg.com/profile_images/2012788536/jd_bigger.jpg",location:"San Diego",screen_name:"Da_Juan_andOnly"},"2Girlsx1STONER_":{description:"Tatt Artist/CALIFORINA NATIVE/19 #Team_LEO #Team_BeachBoiz #TeamCALI #WildLyfeGANG #INKJUNKIES #2GIRLS1STONER ",friends_count:597,followers_count:359,
image_url:"http://a0.twimg.com/profile_images/3244797412/5ac9d1afd781c7e8fa661cfe3a729209_bigger.jpeg",location:"San Diego \u2708 California",screen_name:"2Girlsx1STONER_"},nsolis23:{description:"21 years of age.\tSan Diego. always hungry. responsible tattoo addict ",friends_count:334,followers_count:259,image_url:"http://a0.twimg.com/profile_images/3264635052/54b7f04570f088cb33fdcf3f119e5073_bigger.jpeg",location:"Chula Vista",screen_name:"nsolis23"},Ryro1313:{description:"Speak Your Mind Out, It's all we can do\u2665 http://speakyourmindoutyo.tumblr.com/",
friends_count:43,followers_count:3,image_url:"http://a0.twimg.com/profile_images/2946330656/ac630f8ca9e7a8cccb4f42d46227eab1_bigger.jpeg",location:"Vista, CA",screen_name:"Ryro1313"},ChelseyChavez:{description:"Blessed that God gave me the talent and opportunity to chase my dream. SDSU. Corrinthians 13:4",friends_count:145,followers_count:182,image_url:"http://a0.twimg.com/profile_images/3111104992/65ab2e7c01395d49522a57528bed6513_bigger.jpeg",location:"San Diego, California",screen_name:"ChelseyChavez"},
cabrera_gabe:{description:"",friends_count:111,followers_count:83,image_url:"http://a0.twimg.com/profile_images/3097701251/625f83d604d6eae2aa0f2158c9837397_bigger.jpeg",location:"San Diego, CA",screen_name:"cabrera_gabe"},gigglesbabyxoxo:{description:"",friends_count:111,followers_count:122,image_url:"http://a0.twimg.com/profile_images/3280979121/1f922257bf7fe1952a4793a22c67cf51_bigger.png",location:"San Diego",screen_name:"gigglesbabyxoxo"},STEEZEandCHEEZE:{description:"The only thing I need to be chasing is my dream. And believe me, I'm already running.",
friends_count:230,followers_count:267,image_url:"http://a0.twimg.com/profile_images/3146585275/5654e03e27e48c9baa5d927785707d0f_bigger.jpeg",location:"San Diego, California",screen_name:"STEEZEandCHEEZE"},mariesammy:{description:"its all happening.",friends_count:102,followers_count:155,image_url:"http://a0.twimg.com/profile_images/3274368196/cac7db9e12a0fd9bf7294a836a91cf32_bigger.jpeg",location:"San Diego/Murrieta, Ca.",screen_name:"mariesammy"},Kitana_Monaee:{description:"- Livin' Life To The Fullest | Sweet 16 ^_^ | NO Mention = NO Follow Back \u270c| #ObeyReality . \u2665",
friends_count:547,followers_count:737,image_url:"http://a0.twimg.com/profile_images/3325782043/47f2fa4c95e090c81fc8824e4ff4b518_bigger.jpeg",location:"- San Diego \u2661 CaLOVEfornia .",screen_name:"Kitana_Monaee"},negsmani:{description:"",friends_count:139,followers_count:82,image_url:"http://a0.twimg.com/profile_images/2893193613/f1b10707c1766ccdd6723b1aad774948_bigger.jpeg",location:"San Diego ",screen_name:"negsmani"},shhhua:{description:"I do the Twitters and Facebooks for @Razer (Razer|Quick). ",
friends_count:111,followers_count:728,image_url:"http://a0.twimg.com/profile_images/2963083245/27eb939c61ff2a83730f468b0e5de916_bigger.jpeg",location:"San Diego, CA",screen_name:"shhhua"},LuisxNights:{description:".Edge // N i G H T S // Living Free // Ocean Life.",friends_count:299,followers_count:336,image_url:"http://a0.twimg.com/profile_images/3115114294/99e179ac24b93ddd8b47b53d352d8d25_bigger.jpeg",location:"Chula Vista",screen_name:"LuisxNights"},MagdaBanome:{description:"helping you discover, deceive me when, disgrace for you. Deceive me -- you cannot get fooled once again!",
friends_count:121,followers_count:25,image_url:"http://a0.twimg.com/profile_images/2627523394/fdhfdhah_bigger.jpg",location:"Chula Vista, California",screen_name:"MagdaBanome"},"2manyjuans":{description:"Life is a rought mix! then filter it!!",friends_count:134,followers_count:64,image_url:"http://a0.twimg.com/profile_images/2708172190/bf0fe85e7e28d1c78819c82b1d0ce31f_bigger.jpeg",location:"San Diego",screen_name:"2manyjuans"},marileeaze:{description:"Ignorant ass fuq (Apparently I tweet in bulk!)",
friends_count:130,followers_count:126,image_url:"http://a0.twimg.com/profile_images/2493275101/marileeaze_bigger.jpg",location:"SanDiego",screen_name:"marileeaze"},Kenzie_Kmackin:{description:"Life's a garden, Dig it!! -Joe Dirt",friends_count:318,followers_count:321,image_url:"http://a0.twimg.com/profile_images/2794984312/478353a35575e90d68cffd5bc1a0a5e9_bigger.jpeg",location:"San Diego",screen_name:"Kenzie_Kmackin"},Mantis619:{description:"EDM \u266c| Writer| Poet| Gloomy| #Producer| #TeamFollowBack| LoadedLights Sponsor| [OBEY]",
friends_count:655,followers_count:348,image_url:"http://a0.twimg.com/profile_images/3074327838/f54455330f2f385497c187a819820e70_bigger.jpeg",location:"Sunny San Diego, California",screen_name:"Mantis619"},Cfendiz:{description:"Feels good to be alive ",friends_count:138,followers_count:112,image_url:"http://a0.twimg.com/profile_images/3268835550/1abe40bdc857158d00e165a7a0c21c8b_bigger.jpeg",location:"San Diego, CA ",screen_name:"Cfendiz"},sarahmikhael_:{description:"follow me on Instagram @sarahmikhael",
friends_count:107,followers_count:225,image_url:"https://twimg0-a.akamaihd.net/profile_images/3344089932/f48e4c299cfcecb5f693aaeb4e9e2f9e_bigger.jpeg",location:"sunny san diego",screen_name:"sarahmikhael_"}},leads={service:[{date:"2/26/2013",text:"Cant drive my new car till i get shocks. Fack",latlon:[32.749098,-117.10053],score:83,user:"Mantis619",loc:"San Diego"},{date:"2/22/2013",text:"Car is over hearing weh  need to fix tomorrow",latlon:[32.778265,-117.158222],score:87,user:"marileeaze",loc:"SanDiego"},
{date:"2/23/2013",text:"Who knows about intakes? I want to buy one for my car but I don't know which one?",latlon:[32.7153,-117.1564],score:79,user:"2manyjuans",loc:"San Diego"},{date:"2/25/2013",text:"Then ima get my new tires+rims. Finalllllyyyy ! Babygirl gonna be more rideable lol",latlon:[32.7153,-117.1564],score:84,user:"gigglesbabyxoxo",loc:"San Diego"},{date:"2/26/2013",text:"My car needs a damn tune up &amp; oil change",latlon:[32.6333324,-117.00178],score:75,user:"nsolis23",loc:"Chula Vista"},
{date:"2/24/2013",text:"Lmao my car just died on me again. I need new a new battery for my car",latlon:[32.7153,-117.1564],score:79,user:"ChelseyChavez",loc:"San Diego, California"},{date:"2/25/2013",text:"All looking up getting my car painted next week",latlon:[32.7153,-117.1564],score:80,user:"2Girlsx1STONER_",loc:"San Diego"},{date:"2/25/2013",text:"OF COURSE my car needs a new battery....so much for good luck #frustrated",latlon:[32.7153,-117.1564],score:72,user:"negsmani",loc:"San Diego"},{date:"2/26/2013",
text:"grrr...I hate my car ! Expensive repairs and still something new to break.",latlon:[32.64,-117.08333],score:76,user:"MagdaBanome",loc:"Chula Vista"},{date:"2/23/2013",text:"- ok . We're just waiting on tia to bring the money to fix gmas car -_______- @_Jacintaaa",latlon:[32.749098,-117.10053],score:81,user:"Kitana_Monaee",loc:"San Diego"}],sales:[{date:"2/18/2013",text:"Car shopping today",latlon:[32.7153,-117.1564],score:90,user:"sarahmikhael_",loc:"San Diego"},{date:"2/19/2013",text:"I think I found someone to buy my car. Now looking for a new car.",
latlon:[32.7153,-117.1564],score:93,user:"shhhua",loc:"San Diego, CA"},{date:"2/21/2013",text:"Looking for a new car to buy",latlon:[33.2,-117.2417],score:71,user:"Ryro1313",loc:"Vista, CA"},{latlon:[32.778265,-117.158222],score:88,text:"Looks like im getting a new car. Welp.",date:"2/25/2013",user:"mariesammy",loc:"San Diego"},{date:"2/16/2013",text:"Car shopping. Too many cars to choose from",latlon:[32.7153,-117.1564],score:89,user:"cabrera_gabe",loc:"San Diego, CA"},{date:"2/26/2013",text:"Can't wait to get my new car in the summer.  Trying to race @Freddyx24x",
latlon:[32.64,-117.08333],score:65,user:"LuisxNights",loc:"Chula Vista"},{date:"2/22/2013",text:"Gettin a new car=)",latlon:[32.905016,-117.152191],score:86,user:"Kenzie_Kmackin",loc:"Mira Mesa"},{date:"2/20/2013",text:"I guess it's time for a new car. Shopped around a little today... I'm getting excited",latlon:[32.7153,-117.1564],score:96,user:"Cfendiz",loc:"San Diego, CA"},{date:"2/22/2013",text:"Time for a new car!!!!!",latlon:[32.7153,-117.1564],score:85,user:"STEEZEandCHEEZE",loc:"San Diego"},
{date:"2/21/2013",text:"This new car situation looking good :)",latlon:[32.7153,-117.1564],score:83,user:"Da_Juan_andOnly",loc:"San Diego"}]},rssFeeds=[{score:94,url:"http://www.edmunds.com/car-news/2013-nascar-ford-fusions-mission-strengthen-consumer-relevance.html",date:"2013-02-21",name:"Edmunds",title:"2013 NASCAR Ford Fusion's Mission: Strengthen Consumer Relevance"},{score:65,url:"http://autos.yahoo.com/blogs/motoramic/tale-tape-chevrolet-ss-vs-chrysler-300-srt-153703078.html",date:"2013-02-16",
name:"Yahoo!",title:"Tale of the tape: Chevrolet SS vs. Chrysler 300 SRT8 vs Ford Taurus SHO"},{score:89,url:"http://forums.motortrend.com/70/9369113/the_general_forum/ford_to_add_450_jobs_to_produce_20_ecoboost_to_cleveland/",date:"2013-02-22",name:"MotorTrend",title:"Ford to add 450 jobs to produce 2.0 Ecoboost to Cleveland."},{score:78,url:"http://www.edmunds.com/ford/focus-st/2013/long-term-road-test/2013-ford-focus-st-hidden-fuel-door.html",date:"2013-02-20",name:"Edmunds",title:"2013 Ford Focus ST Long Term Road Test"},
{score:87,url:"http://feeds.autoblog.com/~r/weblogsinc/autoblog/~3/2sBEdGmIafQ/",date:"2013-02-20",name:"AutoBlog",title:"Motorsports: Ford debuts Fusion NASCAR racer that edges closer to stock [w/video]"},{score:84,url:"http://www.autoblog.com/2013/02/16/north-americas-automakers-ran-at-97-of-their-production-capaci/",date:"2013-02-16",name:"AutoBlog",title:"North America's automakers ran at 97% of their production capacity last year"},{score:81,url:"http://wot.motortrend.com/2014-ford-mustang-pricing-configurator-launches-with-new-appearance-packages-colors-331469.html",
date:"2013-02-20",name:"MotorTrend",title:"2014 Ford Mustang Pricing Configurator Launches With New Appearance Packages, Colors"},{score:84,url:"http://wot.motortrend.com/our-cars-2013-ford-focus-st-has-the-right-interior-touches-330223.html",date:"2013-02-18",name:"MotorTrend",title:"Our Cars: 2013 Ford Focus ST Has the Right Interior Touches"},{score:80,url:"http://wot.motortrend.com/2013-ford-f-150-svt-raptor-halo-4-edition-quick-drive-329547.html",date:"2013-02-17",name:"MotorTrend",title:"2013 Ford F-150 SVT Raptor Halo 4 Edition Quick Drive"},
{score:87,url:"http://www.autonews.com/article/20130220/OEM01/302209813/ford-plans-2-liter-engine-output-in-ohio-report-says",date:"2013-02-20",name:"Automotive News",title:"Ford plans 2-liter engine output in Ohio, report says"},{score:86,url:"http://www.autonews.com/article/20130219/RETAIL03/130219849/ford-dusts-off-fiesta-movement-to-pitch-refreshed-subcompact",date:"2013-02-19",name:"Automotive News",title:"Ford dusts off Fiesta Movement to pitch refreshed subcompact"},{score:90,url:"http://simplefeed.consumerreports.org/l?s=_misc&r=misc&he=687474702533412532462532466e6577732e636f6e73756d65727265706f7274732e6f7267253246636172732532463230313325324630322532466e65772d323031342d63686576726f6c65742d73732d736564616e2d736574732d7468652d706163652d626f617374732d3431352d68702e68746d6c2533464558544b455925334449373252534330&i=727373696e3a687474703a2f2f6e6577732e636f6e73756d65727265706f7274732e6f72672f636172732f323031332f30322f6e65772d323031342d63686576726f6c65742d73732d736564616e2d736574732d7468652d706163652d626f617374732d3431352d68702e68746d6c",
date:"2013-02-17",name:"Consumer Reports",title:"New 2014 Chevrolet SS sedan sets the pace, boasts 415 hp"}],reviews=[{Date:"2013-2-22",Review:"Worst car buying experience I have ever had. My family was long-time buyers from the company and felt it would be the best. What a mistake.",Rating:"-5",Source:"yelp-logo-small"},{Date:"2013-2-18",Review:"Drew Ford is super popular for a reason. You see their license plates tags everywhere! I even saw one out in LA last week. Imagine that!",Rating:"+3",Source:"yelp-logo-small"},
{Date:"2013-2-4",Review:"Great, friendly people. Always treats our family. Service and sales are top notch.",Rating:"+2",Source:"foursquare-logo-small"},{Date:"2013-1-28",Review:"I just bought a new vehicle through Drew Ford in La Mesa. The staff on the sales floor, the collision center and the service department were all professional and polite.",Rating:"+5",Source:"twitter-logo-small"},{Date:"2013-1-2",Review:"Always treats our family. Service and sales are top notch.",Rating:"+3",Source:"twitter-logo-small"},
{Date:"2012-12-12",Review:"It's possible I just had a bad car salesman, but this experience at Drew Ford kind of made me lose all faith in their service.",Rating:"-3",Source:"yelp-logo-small"},{Date:"2012-11-18",Review:"Just purchased my 2012 Ford Focus with Drew Ford. The sales staff was very helpful and were not the pushy sales people I had expected when I first arrived.",Rating:"+5",Source:"foursquare-logo-small"},{Date:"2012-11-2",Review:"I was upset with one employee. The owner was nice and professional.",
Rating:"-1",Source:"yelp-logo-small"}];
function getData(a){if("pie"==a)return[["Keyword","Total Mentions"],["Ford Fusion",55],["Ford Escape",42],["Ford Fiesta",15]];if("bar"==a)return[["Date","Ford Fusion","Ford Escape","Ford Fiesta"],["Feb 1-Feb 7",55,33,22],["Feb 8-Feb 14",40,39,8],["Feb 15-Feb 21",72,42,19],["Feb 22-Feb 28",56,40,12]];if("line"==a)return[["Date","Ford Fusion","Ford Escape","Ford Fiesta"],["Feb 22",6,12,7],["Feb 23",8,10,3],["Feb 24",6,3,1],["Feb 25",12,5,2],["Feb 26",7,3,1],["Feb 27",10,4,0],["Feb 28",7,3,1]]}
function getCompetitorScores(a){if("dealerA"==a)return a=[["Date","Reputation","Visibility"],["Feb 1",32,-12],["Feb 2",31,-14],["Feb 3",29,-22],["Feb 4",36,-32],["Feb 5",23,-29],["Feb 6",22,-44],["Feb 7",12,-56],["Feb 8",6,-51],["Feb 9",0,-32],["Feb 10",-8,-29],["Feb 11",-6,-16],["Feb 12",-6,-25],["Feb 13",12,-25],["Feb 14",-7,-13],["Feb 15",10,-14],["Feb 16",-6,-2],["Feb 17",18,10],["Feb 18",26,13],["Feb 19",22,25],["Feb 20",37,33],["Feb 21",45,44],["Feb 22",61,62],["Feb 23",38,70],["Feb 24",36,
73],["Feb 25",42,85],["Feb 26",57,93],["Feb 27",60,89],["Feb 28",67,99]];if("dealerB"==a)return a=[["Date","Reputation","Visibility"],["Feb 1",-75,-62],["Feb 2",-69,-52],["Feb 3",-66,-45],["Feb 4",-54,-39],["Feb 5",-46,-24],["Feb 6",-36,-32],["Feb 7",-22,-22],["Feb 8",-26,-12],["Feb 9",-16,-12],["Feb 10",-8,10],["Feb 11",-6,23],["Feb 12",-6,53],["Feb 13",-12,35],["Feb 14",7,43],["Feb 15",20,44],["Feb 16",36,52],["Feb 17",38,60],["Feb 18",36,43],["Feb 19",32,55],["Feb 20",47,43],["Feb 21",55,54],["Feb 22",
69,62],["Feb 23",81,60],["Feb 24",66,55],["Feb 25",62,75],["Feb 26",55,86],["Feb 27",40,82],["Feb 28",42,92]];if("yourself"==a)return a=[["Date","Reputation","Visibility"],["Feb 1",-62,-55],["Feb 2",-48,-48],["Feb 3",-48,-33],["Feb 4",-33,-22],["Feb 5",-22,-28],["Feb 6",-33,-10],["Feb 7",-8,-16],["Feb 8",-10,-18],["Feb 9",-18,2],["Feb 10",3,6],["Feb 11",6,-12],["Feb 12",12,-20],["Feb 13",20,10],["Feb 14",36,30],["Feb 15",10,45],["Feb 16",-8,12],["Feb 17",0,34],["Feb 18",16,50],["Feb 19",20,38],["Feb 20",
26,49],["Feb 21",22,42],["Feb 22",20,34],["Feb 23",30,45],["Feb 24",45,63],["Feb 25",63,77],["Feb 26",70,70],["Feb 27",65,79],["Feb 28",77,88]]}
var reputSolution=[{screen_name:"Da_Juan_andOnly",time:"50 mins",description:"Reputation DROPS 10 points because @2manyjuans complains about dealer service.",solution:"*Solution: contact @2manyjuans for details about service in Drew Ford. Provide a coupon of 15% off next time, cost $30.",friends_count:301,followers_count:108,image_url:"http://a0.twimg.com/profile_images/2012788536/jd_bigger.jpg",location:"San Diego"},{screen_name:"marileeaze",time:"1 hour",description:"Reputation DROPS 10 points because @marileeaze has an issue on Fusion engine light.",
solution:"*Solution: Provide free recall service to @marileeaze, cost $150.",friends_count:130,followers_count:126,image_url:"http://a0.twimg.com/profile_images/2493275101/marileeaze_bigger.jpg",location:"SanDiego"},{screen_name:"Kenzie_Kmackin",time:"4 hours",description:"Reputation GOES UP 15 points because a comment by @Kenzie_Kmackin on Youtube.",solution:"*Solution: Increase chat volume on social media,  in particular online video commercials, cost $200 daily.",friends_count:318,followers_count:321,
image_url:"http://a0.twimg.com/profile_images/2794984312/478353a35575e90d68cffd5bc1a0a5e9_bigger.jpeg",location:"San Diego"},{screen_name:"Mantis619",time:"7 hours",description:"Reputation DROPS 10 points because @Mantis619 has an issue on Fusion engine light.",solution:"*Solution: host a local car photography competition, cost $1000 for model hire.",friends_count:655,followers_count:348,image_url:"http://a0.twimg.com/profile_images/3074327838/f54455330f2f385497c187a819820e70_bigger.jpeg",location:"Sunny San Diego, California"},
{screen_name:"Cfendiz",time:"10 hours",description:"Reputation DROPS 9 points because @Cfendiz got a bad battery.",solution:"*Solution: host a local car photography competition, cost $1000 for model hire.",friends_count:138,followers_count:112,image_url:"http://a0.twimg.com/profile_images/3268835550/1abe40bdc857158d00e165a7a0c21c8b_bigger.jpeg",location:"San Diego, CA "},{screen_name:"sarahmikhael_",time:"15 hours",description:"Reputation GOES UP 15 points because a comment by @sarahmikhael_ on Yelp.",
solution:"*Solution: host a local car photography competition, cost $1000 for model hire.",friends_count:107,followers_count:225,image_url:"https://twimg0-a.akamaihd.net/profile_images/3344089932/f48e4c299cfcecb5f693aaeb4e9e2f9e_bigger.jpeg",location:"sunny san diego"}],visibSolution=[{screen_name:"Kenzie_Kmackin",time:"17 mins",description:"Visibility GOES UP 15 points because Youtube new test drive video.",solution:"*Solution: Increase chat volume on social media,  in particular online video commercials, cost $200 daily.",
friends_count:318,followers_count:321,image_url:"http://a0.twimg.com/profile_images/2794984312/478353a35575e90d68cffd5bc1a0a5e9_bigger.jpeg",location:"San Diego"},{screen_name:"Da_Juan_andOnly",time:"1 hour",description:"Visibility DROPS 15 points because our webpage has been down for 10 minutes.",solution:"*Solution: contact @Da_Juan_andOnly for details about service in Drew Ford. Provide a coupon of 15% off next time, cost $30.",friends_count:301,followers_count:108,image_url:"http://a0.twimg.com/profile_images/2012788536/jd_bigger.jpg",
location:"San Diego"},{screen_name:"marileeaze",time:"3 hours",description:"Visibility DROPS 10 points because Fox News broadcasts Toyota Yaris commercial.",solution:"*Solution: Provide free recall service to @marileeaze, cost $150.",friends_count:130,followers_count:126,image_url:"http://a0.twimg.com/profile_images/2493275101/marileeaze_bigger.jpg",location:"SanDiego"},{screen_name:"Cfendiz",time:"7 hours",description:"Visibility DROPS 10 points because no Ads on San Diego Tribune.",solution:"*Solution: host a local car photography competition, cost $1000 for model hire.",
friends_count:138,followers_count:112,image_url:"http://a0.twimg.com/profile_images/3268835550/1abe40bdc857158d00e165a7a0c21c8b_bigger.jpeg",location:"San Diego, CA "},{screen_name:"Mantis619",time:"10 hours",description:"Visibility DROPS 7 points because Google Maps site has no maintanence.",solution:"*Solution: host a local car photography competition, cost $1000 for model hire.",friends_count:655,followers_count:348,image_url:"http://a0.twimg.com/profile_images/3074327838/f54455330f2f385497c187a819820e70_bigger.jpeg",
location:"Sunny San Diego, California"}],map,layers=[],curTweets=[];function initMapGallery(){var a=L.tileLayer("http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/{styleId}/256/{z}/{x}/{y}.png",{styleId:22677});map||(map=new L.map("div_map",{center:[35,-100],zoom:4,layers:[a],attributionControl:!1}));switchVisualization([$("#div_select_map_style").val()],!0);$("#div_button_controls").click(function(){var a=$("#div_select_map_style").val();switchVisualization([a],!0)})}
function addPointsToGroup(a,b){for(var e=a instanceof L.MarkerClusterGroup?b.length:Math.min(b.length,1E3),c=0;c<e;c++){var d=b[c],g=new L.Marker(d.loc);g.properties={text:d.text};g.bindPopup("<div class='popup'><ul><li>"+d.text+"</li></ul></div>",{maxWidth:500,maxHeight:300});a.addLayer(g)}}function getPointLayer(a){var b=new L.layerGroup;addPointsToGroup(b,a);return b}
function getClusterLayer(a){var b=new L.MarkerClusterGroup({spiderfyOnMaxZoom:!1,showCoverageOnHover:!1,zoomToBoundsOnClick:!1});b.on("clusterclick",function(a){getClusterProperties(a.layer,[]);if(a.layer._popup)a.layer.openPopup();else{var b=getClusterProperties(a.layer,[]),d="<div class='popup'>There are <b>"+a.layer._childCount+"</b> tweets:<p></p><ul>";$.each(b,function(a,b){d+="<li>"+b.text+" </li>"});d+="</ul></div>";a.layer.bindPopup(d,{maxWidth:500,maxHeight:300}).openPopup()}});addPointsToGroup(b,
a);return b}function getClusterProperties(a,b){0<a._markers.length&&$.each(a._markers,function(a,c){b.push(c.properties)});0<a._childClusters.length&&$.each(a._childClusters,function(a,c){b.concat(getClusterProperties(c,b))});return b}
function getHeatMapLayer(a){var b=new L.TileLayer.heatMap({radius:40,opacity:0.75,gradient:{"0.45":"rgb(0,0,255)","0.65":"rgb(0,255,255)","0.85":"rgb(0,255,0)","0.98":"yellow",1:"rgb(255,0,0)"}}),e=[],c;for(c in a){var d=a[c];e.push({lat:d.loc[0],lon:d.loc[1],value:1})}b.addData(e);return b}
function switchVisualization(a,b){function e(b){curTweets=b;$.each(a,function(a,e){switch(e){case "MARKERCLUSTER":var f=getClusterLayer(b);layers.push(f);map.addLayer(f);break;case "HEATMAP":f=getHeatMapLayer(b);layers.push(f);map.addLayer(f);break;case "GEOJSON":f=getPointLayer(b),layers.push(f),map.addLayer(f)}})}removeLayers();b?getTweets(e):e(curTweets)}function removeLayers(){0<layers.length&&($.each(layers,function(a,b){map.removeLayer(b)}),layers=[])}
function getTweets(a){if(a){var b=$("#div_select_location").val()||"Los+Angeles",e=$("#div_select_radius").val()||50,c=$("#div_select_keyword").val()||"Honda";$.getJSON("http://vision.sdsu.edu/chris42/PyMapper.py?key="+b+"&rad="+e+"&keyword="+c,function(b){a(b.results)})}};
	
	//Load Google Charts and set callback
	google.load("visualization", "1", {packages:["corechart"]});
	google.load('visualization', '1', {packages:['table']});

	
	//global variables
	var app={
		map:null,		// leaflet map object
		layer:{
			markerLead:L.marker([0,0]), //marker for top leads
			markerDealer:{
				drew: L.marker([32.774917,-117.005639], {icon: L.icon({iconUrl: 'images/logo_ford.png', iconSize:[60, 35]})}),			
				penske: L.marker([32.774917,-117.005639], {icon: L.icon({iconUrl: 'images/logo_penske.png', iconSize:[60, 35]})})
			}
		},
		dealer:"drew", //currrentDealer
		controls:{     //leafmap controls
			toc:null,
			geocoding: new L.Control.BingGeocoder('AvZ8vsxrtgnSqfEJF1hU40bASGwxahJJ3_X3dtkd8BSNljatfzfJUvhjo9IGP_P7')
		}, 
		hitMapData:{   //heatmap data
			max:  1,        // Always 1 in tweet data
			data: []
		},
		gridster:null,  //gridster
		widgets:["widget_reputation", "widget_visibility", "widget_competitor", "widget_map", "widget_news", "widget_chart", 'widget_tweetStream'],// "widget_addWidget"],
		constants: {
			KEYWORDS: ['car', 'buy', 'shopping', 'Ford', 'friendly', 'upset', 'nice', 'bad', 'good', 'helpful', 'mistake']
		},
		eventHandler:{
			click: ('ontouchend' in document.documentElement)? "touchend" : "click", //this is because that the click eventHandler will NOT work in the iOS devices (some conflict with the gridster mouse event)
			mouseover: "mouseover"
		}
	}

    

	//dom ready
	$(function() { 	    
		init_UI();
		//init_news_widget();
		
		
		//TEMPORARY way to open map gallery (when map is double clicked)
//		$("#map").dblclick(function(event) {
//			showDialog('dialog_map_gallery', 'Map Gallery', {modal:true});
//			initMapGallery();
//			//event.preventDefault();
//			return false;
//		});		
	});
	
	
	
	
	/**
	* Creates a google table in news_widget.  Table is populated with data from rss.js.  
	*/
	function init_news_widget() {
		//sort score
		sortArray(rssFeeds, "score");
		showNews();
	}
	
	
	
	
	/**
	 * show news Feed
	 */
	function showNews(){
		//use <ul><li>to show the rssFeeds
		var html="<ul>";
		$.each(rssFeeds, function(i,rss){
			html+="<li rssIndex=" + i +" title='Please click to see the news'><div class='score' title='Relevant Score. Powered by PathGeo'>" + rss.score+"</div><div class='content'><label class='title'>"+ rss.name + " @ " + rss.date + "</label><br>"+ rss.title + "</div></li>";
		});
		html+="</ul>";
		$("#rss_news").html(html);
		
		//onclick event on each li
		$("#rss_news ul li").click(function(){
			var id=$(this).attr("rssIndex");
			if(id && id !=""){
				$("#dialog_news_score").html(rssFeeds[id].score);
				$("#dialog_news_content").html("<label class='title'>"+ rssFeeds[id].title + "</label><br>" + rssFeeds[id].name + " @ " + rssFeeds[id].date);
				$("#dialog_news_goto").click(function(){window.open(rssFeeds[id].url)});
				$("#dialog_news iframe").attr("src", rssFeeds[id].url);
				showDialog("dialog_news", "news", {modal:true, resizable:false, draggable:false, width:900, height:650, close:function(e,ui){$("#dialog_news iframe").html("").attr("src", "");}});
			}
		})
		
	}
	
	
	
	
	function init_leads(){
		//tabs
		//we have to wait until the tabs have been created. Otherwise, the google chart table cannot get the correct width
		$("#leads").tabs({"create": function(e,ui){
			//init_leads_table(leads.sales, "sales_leads");
			//init_leads_table(leads.service, "service_leads");
			init_leads_table(leads);
		}});
	}




	function init_leads_table(leads) {
		var divName='';
		
		//read leads
		$.each(leads, function(k,v){
			if(k=='service'){divName='service_leads'}
			if(k=='sales'){divName='sales_leads'}
			
			//adjust divName width and height. It is because using tabs will make the width of 2nd+ tabs to 0. So we need to set up manually.
			$("#"+divName).css({width: $("#"+divName).parent().width()-40, height: $("#"+divName).parent().height()-65});
			
			//sort array 
			sortArray(v, "score");
			
			var html="<ul>";
			$.each(v, function(i, lead){
				lead.leadID=i;
				lead.leadType=k;
				lead.divName=divName;
				
				html+="<li id=" + i + " leadType='" + k + "'>" + 
				  "<div class='score'>" + lead.score +"</div>"+
				  "<div class='content'><img title='see more about the lead' src='" + userData[lead.user].image_url + "' /><div><label class='title'>" + lead.user +"</label> says:<br>" + pathgeo.util.highlightKeyword(app.constants.KEYWORDS, lead.text, true) + "</div></div>"+
				  "</li>";
			});
			$("#"+divName).html(html);	
		});
		
		//click event and mouseover event
		$(".leads ul li .content img").bind(app.eventHandler.click, function(){
			var idx=$(this).parent().parent().attr("id"), //id in <li>
				leadType=$(this).parent().parent().attr("leadType"); //leadType in <li>
				
			showUserInfoDialog(leads[leadType][idx]);
		});
		$(".leads ul li").bind(app.eventHandler.mouseover, function(){
			//reset background color to avoid the color setted while mouseovering the marker
			$(".leads ul li").css({"background-color": ""});
			
			var idx=$(this).attr("id"),
				leadType=$(this).attr("leadType");
			showLocation(leads[leadType][idx]);
		});
	}
	
	
	
	function showUserInfoDialog(lead) {
		var userInfo=userData[lead.user]
		
		//join userinfo and lead, but we should be very carefull if there is any existing key name in two dateset
		$.extend(userInfo, lead);
		
		//user image
		$("#user_image").attr("src", userInfo.image_url);
		//user info
		$(".userInfo").each(function(){
			if($(this).attr("id") && $(this).attr("id") && userInfo[$(this).attr("id")] && userInfo[$(this).attr("id")]!=''){
				//if there is appointed format
				if($(this).attr("textFormat") && $(this).attr("textFormat")!='' && $(this).attr("textFormat").split("{value}").length>1){
					$(this).html($(this).attr("textFormat").replace(new RegExp("{value}", 'ig'), userInfo[$(this).attr("id")]));
				}else{
					$(this).html(userInfo[$(this).attr("id")])
					//highlight the text
					if($(this).attr("id")=='text'){$(this).html(pathgeo.util.highlightKeyword(app.constants.KEYWORDS, userInfo[$(this).attr("id")], true))}
				}
			}
		});
		
		
//		var userInfo;
//		for (var indx in userData) {
//			if (userData[indx].user_info.screen_name == userName) 
//				userInfo = userData[indx].user_info;
//		}
		//alert(userInfo.image_url);
//		$("#user_image").attr({"src": userInfo.image_url});
//		$("#user_description").text(userInfo.description);
//		$("#user_location").text(userInfo.location);
//		$("#user_friends_count").text(userInfo.friends_count);
//		$("#user_followers_count").text(userInfo.followers_count);
		
		showDialog('dialog_user_info', "About "+ lead.user, {
			modal:true,
			create:function(e,ui){
				$("#dialog_user_info textarea").blur(); //disable focusing to avoid the vitual keyboard popup i
			},
			open:function(e, ui){
				$("#dialog_user_info textarea").blur(); //disable focusing to avoid the vitual keyboard popup in mobile devices.
			}
		}); 
		
	}
	
	
	
	
	/**
	 * while mouseovering on the lead, it will trigger showLocation to show location on the map
	 * @param {Object} Lead
	 */
	function showLocation(lead){
		var userInfo=userData[lead.user]
		//join userinfo and lead, but we should be very carefull if there is any existing key name in two dateset
		
		//hide the markerLead layer
		app.map.removeLayer(app.layer.markerLead);
		
		var idx=Number(lead.leadID);
		
		//show
		if(lead.latlon && lead.latlon.length==2 && lead.latlon[0]!='' && lead.latlon[1]!=''){
			app.layer.markerLead=L.marker(lead.latlon)//.addTo(app.map); //add marker
			app.map.panTo(app.layer.markerLead.getLatLng()); //center to the marker
			
			//popup info window
			//var html="<img style='' src='" + userInfo.image_url + "' width=30px height=30px />"+
			var html="<div class='popup' style=''><b>" + lead.user + "</b> says: <br>"+lead.text+"&nbsp; &nbsp; &nbsp; <a style='cursor:pointer'>more...</a></div>";
			//app.layer.markerLead.bindPopup(html).openPopup();
			L.popup().setLatLng(app.layer.markerLead.getLatLng()).setContent(html).openOn(app.map);
			
			$(".popup a").bind(app.eventHandler.click, function(){
				showUserInfoDialog(lead);
			});
				
			
			//mouseover event on the app.layer.markerLead 
			//still have some problem!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			app.layer.markerLead.on("mouseover", function(e){
					app.layer.markerLead.openPopup();
					$("#" + lead.divName + " ul li:nth-child(" + (idx + 1) + ")").css({"background-color": "#eeeeee"});
			}).on("mouseout", function(e){
					app.layer.markerLead.closePopup();
					//$("#" + divName + " ul li:nth-child(" + (idx + 1) + ")").css({"background-color": ""});
				}
			);
		}
	}


    function init_Reputation(){

        var keywords = ['GOES UP', 'DROPS'];
       
        var html="";
        $.each(reputSolution, function(i,reputSol){
			html+="<div class='dia_rep' repIndex=" + i +">\n\
                    <span class='time'>" + reputSol.time+"</span>\n\
                    <div class='solution'><img class='image' src= " + reputSol.image_url+ " /><p class='message'>"+ pathgeo.util.highlightKeyword(keywords, reputSol.description, true)  + "</p>\n\
                    <span class='span'>Solution</span> <span class='span'>Detail</span> <span class='span'>Reply</span> <span class='span'>Save</span>\n\
                    <br>"+ reputSol.solution + "</div>\n\
                   </div>";
		});
		html+="";
		$("#reputation").html(html);

        $(".dia_rep").hover(function(){
			$(this).css('background-color','#BDBDBD');
            $(this).children().children('.span').css('display','inline')
		}, function(){
			$(this).css('background-color','#FFFFFF');
            $(this).children().children('.span').css('display','none')
		})

        $(".dia_rep_2").hover(function(){
			$(this).css('background-color','#BDBDBD')
		}, function(){
			$(this).css('background-color','#FFFFFF')
		})
    }

    function init_Visibility(){

        var keywords = ['GOES UP', 'DROPS'];

        var html="";
        $.each(visibSolution, function(i,visibSol){
			html+="<div class='dia_vis' repIndex=" + i +">\n\
                    <span class='time'>" + visibSol.time+"</span>\n\
                    <div class='solution'><img class='image' src= " + visibSol.image_url+ " /><p class='message'>"+ pathgeo.util.highlightKeyword(keywords, visibSol.description, true)  + "</p>\n\
                    <span class='span' id='btnSolution'>Solution</span> <span class='span' id='btnDetail'>Detail</span> <span class='span' id='btnReply'>Reply</span> <span class='span' id='btnSave'>Save</span>\n\
                    <br><div class='info' id='txtSolution'>"+ visibSol.solution + "</div></div>\n\
                   </div>";
		});
		html+="";
		$("#visibility").html(html);

        $(".dia_vis").hover(function(){
			$(this).css('background-color','#BDBDBD');
            $(this).children().children('.span').css('display','inline')
		}, function(){
			$(this).css('background-color','#FFFFFF');
            $(this).children().children('.span').css('display','none')
		})

        $(".dia_vis_2").hover(function(){
			$(this).css('background-color','#BDBDBD')
		}, function(){
			$(this).css('background-color','#FFFFFF')
		})

        $("#btnSolution").click(function(){
            $(this).siblings('#txtSolution').css('display','inline')
        })
    }
	
	/**
	 * init user interface 
	 */
	function init_UI(){		
		//gridster
		$(".gridster").append("<ul></ul>");

		app.gridster=$(".gridster > ul").gridster({
	        widget_margins: [15, 15],
	        widget_base_dimensions: [$(".gridster").width()/7.45, $(".gridster").width()/7.45],
			draggable: {
	            handle: '.widget-title' //change draggable area to the '.widget-title'
	        }
	    }).data("gridster");//.disable(); //disable dragging while init();
	    
		
	    //load widget
	    $.each(app.widgets, function(i,widget){
			addWidget(widget);
		});


		//cursor change while mouseovering on the widget title 
		$(".widget-title").hover(function(){
			$(this).css('cursor','move');
		}, function(){
			$(this).css('cursor','auto');
		})
		
		
		
		/**
		*logout dropdown event handler
		*/
		$('a#link').click(function() {
			//alert("sdfd");
			var submenu = $('div#submenu');
			if (submenu.is(":visible")) {
				submenu.fadeOut();
			} else {
				submenu.fadeIn();
			}
		});
		
		var submenu_active = false;
		 
		$('div#submenu').mouseenter(function() {
			submenu_active = true;
		});
		 
		$('div#submenu').mouseleave(function() {
			submenu_active = false;
			setTimeout(function() { if (submenu_active === false) $('div#submenu').fadeOut(); }, 400);
		});
		
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!

		var yyyy = today.getFullYear();
		if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = mm+'/'+dd+'/'+yyyy;
		
		var currentTime = new Date()
		var hours = currentTime.getHours()
		var minutes = currentTime.getMinutes()

		if (minutes < 10){
			minutes = "0" + minutes
		}
		var suffix = "AM";
		if (hours >= 12) {
			suffix = "PM";
			hours = hours - 12;
		}
		if (hours == 0) {
			hours = 12;
		}
	
		today+= "<span style='padding-left:30px'>" + hours + ":" + minutes + " " + suffix + "</span>";

		$("#date").html(today);
		
		
		//Adjust score text size based on window size
		//var sectionWidth = $('#widget_reputation').height();
		
		//var newFontSizeScore = ($('#widget_reputation').height() - 66);
		//$('.digital_score').css({"font-size" : newFontSizeScore});
		
		//var newFontSizePercent = newFontSizeScore/2;
		//$('.digital_percent').css({"font-size" : newFontSizePercent});
		
		//var arrowSize = (newFontSizePercent*20)/32;
		//$('.digital_arrow').width(arrowSize);
		//$('.digital_arrow').height(arrowSize);
		
		//$('.digital_table').css({"font-size" : newFontSizePercent});
		//$('.digital_table').css({"font-size" : newFontSizePercent});

	
	}
	
	
	
	/**
	 * initilize map
	 */
	function init_map(){
		// start map functions
		//basemap
		var basemaps = {
			"OpenStreetMap": L.tileLayer('http://{s}.tile.cloudmade.com/ad132e106cd246ec961bbdfbe0228fe8/997/256/{z}/{x}/{y}.png', {styleId: 256, attribution: ""}),
			"Gray Map": L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/{styleId}/256/{z}/{x}/{y}.png', {styleId: 22677, attribution: ""}),
			"Night View": L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/{styleId}/256/{z}/{x}/{y}.png', {styleId: 999, attribution: ""})
		}
		
		//init map
		app.map = L.map('map', {
			center: [32.774917, -117.005639],
			zoom: 11,
			layers: [basemaps["Gray Map"]],
			attributionControl:false
		});			
		
		//add layers
		var geojson=leadsToGeojson(leads.service.concat(leads.sales), "latlon");
		//clusterlayer
		var clusterMap=pathgeo.layer.markerCluster(geojson,
				{
					onEachFeature: function(feature,layer){
						var html="<div class='popup'><ul><li><label class='score'>" + feature.properties["score"] + "</label><b>" + feature.properties["user"] + ":</b>&nbsp; " + feature.properties["text"] + "</li></ul></div>";
						html=html.replace(/undefined/g, "Tweet");
													
						//highlight keyword
						html=pathgeo.util.highlightKeyword(app.constants.KEYWORDS, html, true);
						//info window
						layer.bindPopup(html,{maxWidth:400, maxHeight:225});
					}
				},{
					clusterclick: function(e){
						if(!e.layer._popup){
							var properties=pathgeo.util.readClusterFeatureProperies(e.layer, []);
							var html="<div class='popup'><b>" + e.layer._childCount + "</b> leads in this area:<p></p><ul>";
							$.each(properties, function(i, property){
								html+="<li id=" + property["leadID"] + " leadType='" + property["leadType"] + "' ><label class='score'>" + property["score"] + "</label><b>" + property["user"] + ":</b>&nbsp; " + property["text"] + "</li>";
							});
							html+="</ul></div>";
							html=html.replace(/undefined/g, "Tweet");
											
							//highlight keyword
							html=pathgeo.util.highlightKeyword(app.constants.KEYWORDS, html, true);
													
							e.layer.bindPopup(html,{maxWidth:400, maxHeight:225}).openPopup();
						}else{
							e.layer.openPopup();
						}
						
						
						//onclick and onmouseover event
						//!!!!!!!!! still have some problems!!!!!!!!!!!!!!!!!!!
						$(".popup ul li").bind(app.eventHandler.click, function(){
							var lead=leads[$(this).attr("leadType")][$(this).attr("id")];
							showUserInfoDialog(lead)
						}).bind(app.eventHandler.mouseover, function(){
							var lead=leads[$(this).attr("leadType")][$(this).attr("id")];
							$("#" + lead.divName + " ul li:nth-child(" + (Number(lead.leadID)+1) + ")").css("background-color:#eeeeee;")
						});
					}
				}
		).addTo(app.map);


		//map controls
		var overlays = {
			"Marker Map": L.geoJson(geojson, {
				onEachFeature: function(feature,layer){
						var html="<div class='popup'><ul><li><label class='score'>" + feature.properties["score"] + "</label><b>" + feature.properties["user"] + ":</b>&nbsp; " + feature.properties["text"] + "</li></ul></div>";
						html=html.replace(/undefined/g, "Tweet");
													
						//highlight keyword
						html=pathgeo.util.highlightKeyword(app.constants.KEYWORDS, html, true);
						//info window
						layer.bindPopup(html,{maxWidth:400, maxHeight:225});
				}
			}),
			"Cluster Map": clusterMap,
			"Heat Map": pathgeo.layer.heatMap(geojson),
			"Census Data": L.tileLayer.wms("http://sgis.kisr.edu.kw/geoserver/topp/wms", {layers:"topp:states", attribution:"", format:"image/png", transparent:true})
		};
		app.controls.toc=L.control.layers(basemaps, overlays).addTo(app.map);		
		
		
		//bing geocoder
		app.map.addControl(app.controls.geocoding)
		
		//scale bar
		app.map.addControl(new L.Control.Scale());
		
		
		//show default dealer logo marker
		app.layer.markerDealer[app.dealer].addTo(app.map);
		
		//add buffer around car dealer 32.774917,-117.005639 (1mile = 1609.34 meters)
		var biffer5m = L.circle([32.774917, -117.005639], 1609.34 * 5, {
			color: 'red',
			fillColor: '#f03',
			weight:2,
			fillOpacity: 0
		}).addTo(app.map);
		
		var biffer10m = L.circle([32.774917, -117.005639], 1609.34 * 10, {
			color: 'green',
			fillColor: '#f03',
			weight:2,
			fillOpacity: 0
		}).addTo(app.map);	

		var biffer15m = L.circle([32.774917, -117.005639], 1609.34 * 15, {
			color: 'blue',
			fillColor: '#f03',
			weight:2,
			fillOpacity: 0
		}).addTo(app.map);			
			
	}

	
	/**
	 * convert leads to geojson format
	 * @param {Array} leadArray
	 * @param {String} locationFieldName
	 */
	function leadsToGeojson(leadArray, locationFieldName){
		if(!leadArray && !locationFieldName){console.log("[ERROR] leadsToGeojson: no leadArray, location field name");return;}
		
		var featureCollection={
				type: "FeatureCollection",
				features:[]
			};
		
		$.each(leadArray, function(i,lead){
			var feature={
				type:"Feature",
				properties:lead,
				geometry:{
					type:"Point",
					coordinates:[]
				}
			};
			$.each(lead, function(k,v){
				if(k==locationFieldName){feature.geometry.coordinates=[v[1], v[0]]}
			});
			featureCollection.features.push(feature);
		})
		return featureCollection;
	}
		
	

	/**
	 * add a new Widget into the Dashboard 
	 */
	function addWidget(dom_id){
		var $this=$("div[id="+dom_id+"]");
		
		var sizeX=$this.attr("widget-sizeX") || 1,
			sizeY=$this.attr("widget-sizeY") || 1,
			row=$this.attr("widget-row") || 1,
			col=$this.attr("widget-col") || 1;

		
		//add the widget
		var $widget=app.gridster.add_widget("<li>"+ createWidgetTitle($this) + $this.html() + "</li>", sizeX, sizeY, col, row);
		
		//give widget id
		$widget.attr("id", $this.attr("id"));

		//init the widget
		//Because while loading all widget into the dashboard, the width of the widgets will be dyanmically increased until to the assigned width
		//Therefore, we have to wait until the widgets reach the assigned width to call the init function
		//calculate the widget final width
		var final_width=(app.gridster.min_widget_width * sizeX) - (app.gridster.options.widget_margins[0] * 2 )-1;
		var interval=setInterval(function(){
			if($widget.width() > final_width){
				clearInterval(interval);
				
				//if div contains widget-onInit event
				if($this.attr("widget-onInit") && $this.attr("widget-onInit")!=""){
					//window[$this.attr("widget-onInit")]()
					eval($this.attr("widget-onInit"));
				}
			}
		},100);
		
		
		//onclick event
		if($this.attr("widget-onClick") && $this.attr("widget-onClick")!=""){
			//if not addWidget
			if($widget.attr("id")!="widget_addWidget"){
				$widget.find(".widget-detail").show().bind(app.eventHandler.click, function(){
					eval($this.attr("widget-onClick"));
				});
			}else{
				$widget.find("div:nth-child(2)").bind(app.eventHandler.click, function(){
					eval($this.attr("widget-onClick"));
				});
			}
		}
		
		//onclose event
		$widget.find(".widget-close").bind(app.eventHandler.click, function(){
			if($widget.attr("id")!='widget_addWidget'){
				showDialog('div_closeWidget', 'Close Widget', {
					width:300,
					height:150,
					resizable:false,
					draggable:false,
					modal:true, 
					buttons: {
						Confirm: function() {
							if($this.attr("widget-onClose") && $this.attr("widget-onClose")!=""){
								eval($this.attr("widget-onClose"));
							}
							app.gridster.remove_widget($widget);
							$(this).dialog("close");
						},
						Cancel: function() {
							$(this ).dialog("close");
						}
					}
				});
			}
		})
		
		
		
		//close all dialog
		$("*").dialog("close");
		
	}
	
	
	/**
	 * create title section in a widget 
	 */
	function createWidgetTitle($this){
		//title
		var html="<div class='widget-title'>"
		if($this.attr("widget-title") && $this.attr("widget-title")!=""){
			html+="<label>"+$this.attr("widget-title")+"</label>";
		}
		
		if($this.attr("id")!="widget_addWidget"){
			html+="<span class='widget-close' title='close the widget'></span>"+
			  	  "<span class='widget-detail' title='See more detail'></span>"+
			      "</div>";
		}
		return html;
	}
	
	

	
	
	/**
	 * showDialog
	 * @param {Object} id
	 * @param {Object} title
	 * @param {Object} dialogOptions
	 */
	function showDialog(id, title, dialogOptions){
		if(!dialogOptions){dialogOptions={}}
		
		//options
		dialogOptions.title=dialogOptions.title || title;
		dialogOptions.width=dialogOptions.width || 700;
		dialogOptions.height=dialogOptions.height || 500;
		dialogOptions.resizable=dialogOptions.resizable || false;
		dialogOptions.draggable=dialogOptions.draggable || false;
		//dialogOptions.draggable=false || dialogOptions.draggable;
		dialogOptions.dialogClass="";
		dialogOptions.position=dialogOptions.position || "center";
		dialogOptions.closeFn=dialogOptions.close || null;
		dialogOptions.close=function(){
			//if close function
			if(dialogOptions.closeFn){dialogOptions.closeFn()} 
			//enable <body> scroll
			$("body").css("overflow", "auto");
		};
		
		//disable <body> scroll
		$("body").css("overflow", "hidden");
		
		$("#"+id).dialog(dialogOptions);
		
		//jquery mobile
		//$("#"+id).show();
		//$.mobile.changePage('#'+id, {transition: 'pop', role: 'dialog'});
	}
	

	
	/**
	 * sort array based on objname
	 */
	function sortArray(array, objName){
		if (!array || array.length==0 || !objName || objName == "") {console.log("[ERROR]sortArray: no array or objName");return;}
		
		array.sort(function(a,b){
			switch ($.type(a[objName])) {
				case "number":
					if (a[objName] == b[objName]) return 0;
					return a[objName] < b[objName] ? 1 : -1; //descend
				break;
				case "date":
					
				break;
				case "string":
					if(objName=='date'){
						return (new Date(a[objName]) < new Date(b[objName]))? 1: -1; //descend
					}else{
						return a[objName] > b[objName] ? 1: -1; //ascend
					}
					
				break;
			}
		});
		
	}		



	/**
	*   Initialize tweet stream box
	*/	
	function init_tweetStream(TweetStream_kw){
        
	    if (!window.BAM) {
	        window.BAM = new TWTR.Widget({
	            version: 2,
	            id: 'tweet',
	            subject: 'Now Streaming: "' + TweetStream_kw + '"',
	            type: 'search',
	            search: TweetStream_kw,
	            interval: 30,
	            width: 'auto',
	            height: $("li[id=widget_tweetStream]").height() - $(".widget_title").height() - 133,
	            theme: {
	                shell: {
	                    background: '#8ec1da',
	                    color: '#ffffff'
	                },
	                tweets: {
	                    background: '#ffffff',
	                    color: '#444444',
	                    links: '#1985b5'
	                }
	            },
	            features: {
	                scrollbar: true,
	                loop: true,
	                live: true,
	                behavior: 'all'
	            }
	        });

	        window.BAM
                .render()
                .start();
	    }
	    else {
	        if (TweetStream_kw != window.old_search) {
	            window.BAM
                    .stop()
                    .setSearch(TweetStream_kw)
                    .setCaption('Now Streaming: "' + TweetStream_kw + '"')
                    .render()
                    .start()
	        }
	    }

	    window.old_search = TweetStream_kw;
	    return window.BAM;
	}

	function change_Keyword(user_kw) {
	    init_tweetStream(user_kw)
	}


	
		
	/**
	*Initialize reputation score and graphs
	*/
	function init_reputation_graph(){
	
		showDialog('dialog_reputation', 'Reputation', {modal:true});
	
		$('.changeRepGraph').css('cursor', 'pointer');
	
		var reputation_data = getScore("weeklyRep");
		var reputation_data_table = google.visualization.arrayToDataTable(reputation_data);

        var options_graph_rep = {
          legend: {position: 'none'},
		  vAxis: {minValue:-100,maxValue:100,gridlines:{count:5}},
		  hAxis: {showTextEvery:4},
		  pointSize:4
        };

        var reputation_graph = new google.visualization.LineChart(document.getElementById('graph_rep'));
        reputation_graph.draw(reputation_data_table, options_graph_rep);
		
		
		$('.changeRepGraph').click(function() {
			reputation_data = getScore($(this).attr('id'));
			reputation_data_table = google.visualization.arrayToDataTable(reputation_data);
			if($(this).attr('id') == "dailyRep"){
				var hLabel = 2;
			}
			if($(this).attr('id') == "weeklyRep"){
				var hLabel = 4;
			}
			if($(this).attr('id') == "monthlyRep"){
				var hLabel = 8;
			}
			options_graph_rep = {
				legend: {position: 'none'},
				vAxis: {minValue:-100,maxValue:100,gridlines:{count:5}},
				hAxis: {showTextEvery:hLabel},
				pointSize:4
				
			};
			reputation_graph.draw(reputation_data_table, options_graph_rep);
			$('.changeRepGraph').css("font-weight","normal");
			var bolder = '#' + ($(this).attr('id'));
			$(bolder).css("font-weight","bold");
		});
		
		//Show reviews table
		var reviewData = new google.visualization.DataTable();
		reviewData.addColumn("string", "Rating");
		reviewData.addColumn("string", "Date");
		reviewData.addColumn("string", "Review");
		
		for (var indx in reviews) {
			var feed = reviews[indx];
			if(feed.Rating.charAt(0) == "+"){
				feed.Rating = "<span style='color:green; font-weight:bold'>" + feed.Rating + "</span>"
			}
			else{
				feed.Rating = "<span style='color:red; font-weight:bold'>" + feed.Rating + "</span>"
			}
			//review = "<div style='float:left'><img src='images/small/" + feed.Source + ".png' alt='logo' ></div>" + feed.Review;
			var review = "<div style='float:left'><img src='images/small/" + feed.Source + ".png' alt='logo' ></div>" + (pathgeo.util.highlightKeyword(app.constants.KEYWORDS, feed.Review, true));
			reviewData.addRow( [feed.Rating, 
								feed.Date,
								review
							] );
		}
		
		var reviewTable = new google.visualization.Table(document.getElementById('review_rep'));
		reviewTable.draw(reviewData, { showRowNumber: false, allowHtml: true, sortColumn: 1, sortAscending: false} );
		
	}
	
	/**
	*Initialize visibilty score and graphs
	*/
	function init_visibilty_graph(){
	
		showDialog('dialog_visibility', 'Visibility', {modal:true})
	
		$('.changeVisGraph').css('cursor', 'pointer');
	
		var visibility_data = getScore("weeklyVis");
		var visibilty_data_table = google.visualization.arrayToDataTable(visibility_data);

        var options_graph_vis = {
			series: [{color: 'F00000'}],
			legend: {position: 'none'},
			vAxis: {minValue:-100,maxValue:100,gridlines:{count:5}},
			hAxis: {showTextEvery:4},
			pointSize:4
        };

        var visibility_graph = new google.visualization.LineChart(document.getElementById('graph_vis'));
        visibility_graph.draw(visibilty_data_table, options_graph_vis);
		
		
		$('.changeVisGraph').click(function() {
			visibility_data = getScore($(this).attr('id'));
			visibilty_data_table = google.visualization.arrayToDataTable(visibility_data);
			if($(this).attr('id') == "dailyVis"){
				var hLabel = 2;
			}
			if($(this).attr('id') == "weeklyVis"){
				var hLabel = 4;
			}
			if($(this).attr('id') == "monthlyVis"){
				var hLabel = 8;
			}
			options_graph_vis = {
				series: [{color: 'F00000'}],
				legend: {position: 'none'},
				vAxis: {minValue:-100,maxValue:100,gridlines:{count:5}},
				hAxis: {showTextEvery:hLabel},
				pointSize:4
				
			};
			visibility_graph.draw(visibilty_data_table, options_graph_vis);
			$('.changeVisGraph').css("font-weight","normal");
			var bolder = '#' + ($(this).attr('id'));
			$(bolder).css("font-weight","bold");
		});
		
		//Show reviews table
		var reviewData = new google.visualization.DataTable();
		reviewData.addColumn("string", "Rating");
		reviewData.addColumn("string", "Date");
		reviewData.addColumn("string", "Chatter");
		
		for (var indx in reviews) {
			var feed = reviews[indx];
			if(feed.Rating.charAt(0) == "+"){
				feed.Rating = "<span style='color:green; font-weight:bold'>" + feed.Rating + "</span>"
			}
			else{
				feed.Rating = "<span style='color:red; font-weight:bold'>" + feed.Rating + "</span>"
			}
			//var review = "<div style='float:left'><img src='images/small/" + feed.Source + ".png' alt='logo' ></div>" + feed.Review;
			var review = "<div style='float:left'><img src='images/small/" + feed.Source + ".png' alt='logo' ></div>" + (pathgeo.util.highlightKeyword(app.constants.KEYWORDS, feed.Review, true));
			reviewData.addRow( [feed.Rating, 
								feed.Date,
								review
							] );
		}
		
		var reviewTable = new google.visualization.Table(document.getElementById('review_vis'));
		reviewTable.draw(reviewData, { showRowNumber: false, allowHtml: true, sortColumn: 1, sortAscending: false} );

	}
	
	
	
	/**
	*Initialize competitor score and graphs
	*/
	function init_competitor_graph(){
	
		showDialog('dialog_competitor', 'Competitor', {modal:true})
		$('.changeCompGraph').css('cursor', 'pointer');
		
		var competitor_data = getCompetitorScores("dealerA");
		var competitor_data_table = google.visualization.arrayToDataTable(competitor_data);

        var options_graph_comp = {
			legend: {position: 'bottom'},
			vAxis: {minValue:-100,maxValue:100,gridlines:{count:5}},
			hAxis: {showTextEvery:4},
			pointSize:4
        };

        var competitor_graph = new google.visualization.LineChart(document.getElementById('competitor_graph'));
        competitor_graph.draw(competitor_data_table, options_graph_comp);
		
		$('.changeCompGraph').click(function() {
		
			competitor_data = getCompetitorScores($(this).attr('id'));
			competitor_data_table = google.visualization.arrayToDataTable(competitor_data);

			competitor_graph = new google.visualization.LineChart(document.getElementById('competitor_graph'));
			competitor_graph.draw(competitor_data_table, options_graph_comp);

			$('.changeCompGraph').css("font-weight","normal");
			var bolder = '#' + ($(this).attr('id'));
			$(bolder).css("font-weight","bold");
		});
	

	}

	
	
	
	/**
	*Switch User Logo
	*/
	function switch_user(company){
		if(company=="penske"){
			$("#link").html("General Manager<span class='ui-icon ui-icon-carat-1-s widget-dropdown' title='Expand'></span>");
			$("#logo").html("<img src = 'images/logo_penske.png' alt='logo' border='0' style = 'float:left;padding-right:15px' />");
			$('div#submenu').hide();
		}
		else{
			$("#link").html("General Manager<span class='ui-icon ui-icon-carat-1-s widget-dropdown' title='Expand'></span>");
			$("#logo").html("<img src = 'images/logo_ford.png' alt='logo' border='0' style = 'float:left;padding-right:15px' />");
			$('div#submenu').hide();
		}
		
		//add dealer logo on the map
		//first, remove all dealer logo existing on the map
		$.each(app.layer.markerDealer, function(k,v){app.map.removeLayer(v);});
		app.layer.markerDealer[company].addTo(app.map);
		
		app.dealer=company;
	}
	
	
	/**
	*Logout
	*/
	function logout(){
		$("#link").html("Sign In<span class='ui-icon ui-icon-carat-1-s widget-dropdown' title='Expand'></span>");
		$("#logo").html("");
		$('div#submenu').hide();
	}
	
	
	/**
	*Change Chart Type
	*/
	function changeChart(chartType){
	
		var chart_data = getData(chartType);
		
		if(chartType == "line"){
			var options = {
				title: 'Total Mentions per Day',
				legend: {position:'bottom'},
				hAxis: {showTextEvery:2},
				pointSize:4,
				titleTextStyle: {color: '#555555', fontName: 'Arial', fontSize: 12}
			};
			var data = google.visualization.arrayToDataTable(chart_data);
			var chart = new google.visualization.LineChart(document.getElementById('chart'));
			chart.draw(data, options);
		}

		if(chartType == "pie"){
			var options = {
				title: 'Total Mentions, Feb 22-28',
				legend: {position:'bottom'},
				titleTextStyle: {color: '#555555', fontName: 'Arial', fontSize: 12}
			};
			var data = google.visualization.arrayToDataTable(chart_data);
			var chart = new google.visualization.PieChart(document.getElementById('chart'));
			chart.draw(data, options);


		}
	}





	
