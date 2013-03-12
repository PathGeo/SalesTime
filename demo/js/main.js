	KEYWORDS = 
	
	//Load Google Charts and set callback
	google.load("visualization", "1", {packages:["corechart"]});
	google.load('visualization', '1', {packages:['table']});

	
	//global variables
	var app={
		map:null,		// leaflet map object
		layer:{
			heatmap:null, //heatmap layer
			markerLead:L.marker([0,0]), //marker for top leads
			markerDealer:{
				drew: L.marker([32.774917,-117.005639], {icon: L.icon({iconUrl: 'images/logo_ford.png', iconSize:[60, 35]})}),
				penske: L.marker([32.774917,-117.005639], {icon: L.icon({iconUrl: 'images/logo_penske.png', iconSize:[60, 35]})})
			}
		},
		dealer:"drew", //currrentDealer
		controls:null, //leafmap controls
		hitMapData:{   //heatmap data
			max:  1,        // Always 1 in tweet data
			data: []
		},
		gridster:null,  //gridster
		widgets:["widget_reputation", "widget_visibility", "widget_competitor", "widget_map", "widget_news", "widget_chart", 'widget_tweetStream'],// "widget_addWidget"],
		constants: {
			KEYWORDS: ['car', 'buy', 'shopping', 'Ford']
		},
		eventHandler:{
			click: ('ontouchend' in document.documentElement)? "touchend" : "click", //this is because that the click eventHandler will NOT work in the iOS devices (some conflict with the gridster mouse event)
			mouseover: "mouseover"
		}
	}



    

	//dom ready
	$(function() { 	    
		init_UI();
		init_news_widget();		
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
		
		//use google chart table to show the rssFeeds
//		var rssData = new google.visualization.DataTable();
//		rssData.addColumn("number", "Score");
//		rssData.addColumn("string", "Date");
//		rssData.addColumn("string", "Source");
//		rssData.addColumn("string", "Title");
//		
//		for (var indx in rssFeeds) {
//			var feed = rssFeeds[indx];
//			rssData.addRow( [ 	feed.score, 
//								feed.date, feed.name, 
//								"<a style='color: #22A' title= 'Click to see article.' target='_blank' href='" 
//										+ feed.url + "'>" + pathgeo.util.highlightKeyword(app.constants.KEYWORDS, feed.title, true) + "</a>" 
//							] );
//		}
//		
//		var rssTable = new google.visualization.Table(document.getElementById('rss_news'));
//		rssTable.draw(rssData, { showRowNumber: false, allowHtml: true, sortColumn: 0, sortAscending: false} );
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
		
		
		
		//use google chart table
//		var data = new google.visualization.DataTable();
//		data.addColumn('number', 'Score');
//		data.addColumn('string', 'User');
//		data.addColumn('string', 'Tweet');
//		//data.addColumn('string', 'Location');
//		
//		for (var indx in leadsGroup) {
//			var lead = leadsGroup[indx];
//			data.addRow( [ 
//								lead.score,
//								"<a style='color: #22A' title= 'Click to see twitter page.' target='_blank' href='http://www.twitter.com/" + lead.user + "'>" + lead.user + "</a>",
//								pathgeo.util.highlightKeyword(app.constants.KEYWORDS, lead.text, true)
//								//lead.loc
//							] );
//		}
//		
//		var table = new google.visualization.Table(document.getElementById(divName));
//		table.draw(data, { showRowNumber: false, sortColumn: 0, sortAscending: false,  allowHtml: true});
//				
//		google.visualization.events.addListener(table, 'select', function() { 
//			var row = table.getSelection()[0].row;
//			
//			//Can I still use the "data" variable due to closure??  Is this safe? (Chris)
//			//YES, you can. the "data" varaible has become a global variable for this function. Therefore, even this function is a select-event listener, the "data" variable can be called correctly. (Calvin)
//			var user = data.getFormattedValue(row, 1);
//
//			//Note: $(user).text() strips HTML tags, but not sure it is the best methods (Chris)
//			showUserInfoDialog($(user).text());
//		});

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
		
		showDialog('dialog_user_info', lead.user, {modal:true}); 
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
					//app.layer.markerLead.closePopup();
					//$("#" + divName + " ul li:nth-child(" + (idx + 1) + ")").css({"background-color": ""});
				}
			);
		}
	}

    function linkClick(div,txt,id,height,id2){
        //collapse all boxes to normal size
        $("."+ div).each(function(){
            $(this).css({"height": "20%"});
        });

        //collapse all descriptions
        $("."+ txt).each(function(){
            $(this).css({"display": "none"});
        });

        //set size for a specific box
        $("#"+id).parent().css({"height": height});

        //turn on a specific description
        $("#"+id2).css({"display": ""});
    }

    function changeHeight(id , height){
        $("#"+id).parent().css({"height": height});
    }

    function closeDiv(div){
        $("."+ div).each(function(){
            $(this).css({"height": "20%"});
        })
    }

    function closeTxt(txt){
        $("."+ txt).each(function(){
            $(this).css({"display": "none"});
        })
    }

    function changeColor(id, color){
        $("#"+id).css({"background-color": color});
    }

    function showText(id){
        $("#"+id).css({"display": "inline"});
    }

    function userContent(id, username){
       var html="";
//       userinfo[] = twitterInfoRetrieve(username);
//       userinfo.img
//       userinfo.name
//       userinfo.location
//       userinfo.friends
//       userinfo.follows

       html+="<div class='content'>\n\
              <img src='" + "http://a0.twimg.com/profile_images/3268835550/1abe40bdc857158d00e165a7a0c21c8b_bigger.jpeg" + "' style='float:left; padding-right:15px'/>\n\
              <div style='font-size:15px; padding-left:15%' ><b>nathanW</b><br> San Diego, CA <br> 128 Friends <br> 972 Follows </div>\n\
              </div>";
       $("#"+id).html(html);
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
	    }).data("gridster");
	    
		
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
		
		
		//Adjust score text size based on window size
		var sectionWidth = $('#widget_reputation').height();
		
		var newFontSizeScore = ($('#widget_reputation').height() - 66);
		$('#rep_score').css({"font-size" : newFontSizeScore});
		$('#vis_score').css({"font-size" : newFontSizeScore});
		
		var newFontSizePercent = newFontSizeScore/2;
		$('#rep_percent').css({"font-size" : newFontSizePercent});
		$('#vis_percent').css({"font-size" : newFontSizePercent});
		
		var arrowSize = (newFontSizePercent*20)/32;
		$('#rep_arrow').width(arrowSize);
		$('#rep_arrow').height(arrowSize);
		$('#vis_arrow').width(arrowSize);
		$('#vis_arrow').height(arrowSize);
		
	
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
			center: [32.834917, -117.005639],
			zoom: 9,
			layers: [basemaps["Gray Map"]],
			attributionControl:false
		});			
				
		//clusterlayer
		app.layer.cluster=pathgeo.layer.markerCluster(leadsToGeojson(leads.service.concat(leads.sales), "latlon"),
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


		app.controls = L.layerGroup().addTo(app.map);
				
		var overlays = {
			"tweets": app.controls,
			"cluster": app.layer.cluster,
			"lead": app.layer.markerLead
		};
		
		L.control.layers(basemaps, overlays);//.addTo(app.map);		
		
		//bing geocoder
		var bingGeocoder = new L.Control.BingGeocoder('AvZ8vsxrtgnSqfEJF1hU40bASGwxahJJ3_X3dtkd8BSNljatfzfJUvhjo9IGP_P7');
		app.map.addControl(bingGeocoder);
		
		
		//show default dealer logo marker
		app.layer.markerDealer[app.dealer].addTo(app.map);
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
			html+="<span class='ui-icon ui-icon-close widget-close' title='close the widget'></span>"+
			  	  "<span class='ui-icon ui-icon-search widget-detail' title='See more detail'></span>"+
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
		
		dialogOptions.title=dialogOptions.title || title;
		dialogOptions.width=dialogOptions.width || 700;
		dialogOptions.height=dialogOptions.height || 500;
		dialogOptions.resizable=false || dialogOptions.resizable;
		//dialogOptions.draggable=false || dialogOptions.draggable;
		dialogOptions.dialogClass="dialog";
		dialogOptions.closeFn=dialogOptions.close || null;
		dialogOptions.close=function(){
			//if close function
			if(dialogOptions.closeFn){dialogOptions.closeFn()} 
			//enable <body> scroll
			$("body").css("overflow", "auto");
		};
		dialogOptions.position=dialogOptions.position || "center";

		//disable <body> scroll
		$("body").css("overflow", "hidden");
		
		$("#"+id).dialog(dialogOptions);
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
	function init_tweetStream(){

		new TWTR.Widget({
			version: 2,
			id: 'tweet',
			subject: 'Now Streaming: "Nascar"',
			type: 'search',
			search: 'nascar',
			interval: 30,
			width: 'auto',
			height: $("li[id=widget_tweetStream]").height() - $(".widget_title").height() - 105,
			// height: 306,
			// height: 325,    if without the subject
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
		}).render().start();
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
			review = "<div style='float:left'><img src='images/small/" + feed.Source + ".png' alt='logo' ></div>" + feed.Review;
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
			var review = "<div style='float:left'><img src='images/small/" + feed.Source + ".png' alt='logo' ></div>" + feed.Review;
			reviewData.addRow( [feed.Rating, 
								feed.Date,
								review
							] );
		}
		
		var reviewTable = new google.visualization.Table(document.getElementById('review_vis'));
		reviewTable.draw(reviewData, { showRowNumber: false, allowHtml: true, sortColumn: 1, sortAscending: false} );
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
				legend: {position:'none'},
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
				titleTextStyle: {color: '#555555', fontName: 'Arial', fontSize: 12}
			};
			var data = google.visualization.arrayToDataTable(chart_data);
			var chart = new google.visualization.PieChart(document.getElementById('chart'));
			chart.draw(data, options);


		}
	}





	
