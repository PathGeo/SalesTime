	KEYWORDS = 
	
	//Load Google Charts and set callback
	google.load("visualization", "1", {packages:["corechart"]});
	google.load('visualization', '1', {packages:['table']});

	
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
		},
		gridster:null,  //gridster
		widgets:["widget_reputation", "widget_visibility", "widget_competitor", "widget_map", "widget_news", "widget_chart", 'widget_tweetStream', "widget_addWidget"],
		constants: {
			KEYWORDS: ['car', 'buy', 'shopping', 'Ford']
		},
		eventHandler:{
			click: ('ontouchend' in document.documentElement)? "touchend" : "click", //this is because that the click eventHandler will NOT work in the iOS devices (some conflict with the gridster mouse event)
		}
	}


	// start - chart and table
    // google.load("visualization", "1", {packages:["corechart"]});
    // google.load('visualization', '1', {packages:['table']});
    // google.load('visualization', '1', {packages:['gauge']});
    //google.setOnLoadCallback(drawChart);
    

	//dom ready
	$(function() { 	    
		init_UI();

		// north-center
	    //getTweets();
		
		init_news_widget();		
	});
	
	
	/**
	* Creates a google table in news_widget.  Table is populated with data from rss.js.  
	*/
	function init_news_widget() {

		var rssData = new google.visualization.DataTable();
		rssData.addColumn("number", "Score");
		rssData.addColumn("string", "Date");
		rssData.addColumn("string", "Source");
		rssData.addColumn("string", "Title");
		
		for (var indx in rssFeeds) {
			var feed = rssFeeds[indx];
			rssData.addRow( [ 	feed.score, 
								feed.date, feed.name, 
								"<a style='color: #22A' title= 'Click to see article.' target='_blank' href='" 
										+ feed.url + "'>" + pathgeo.util.highlightKeyword(app.constants.KEYWORDS, feed.title, true) + "</a>" 
							] );
		}
		
		var rssTable = new google.visualization.Table(document.getElementById('rss_news'));
		rssTable.draw(rssData, { showRowNumber: false, allowHtml: true, sortColumn: 0, sortAscending: false} );
	}
	
	
	function init_leads(){
		//tabs
		//we have to wait until the tabs have been created. Otherwise, the google chart table cannot get the correct width
		$(".tabs").tabs({"create": function(e,ui){
			init_leads_table(leads.sales, "sales_leads");
			init_leads_table(leads.service, "service_leads");
		}});
	}


	function init_leads_table(leadsGroup, divName) {
		var data = new google.visualization.DataTable();
		data.addColumn('number', 'Score');
		data.addColumn('string', 'User');
		data.addColumn('string', 'Tweet');
		//data.addColumn('string', 'Location');
		
		for (var indx in leadsGroup) {
			var lead = leadsGroup[indx];
			data.addRow( [ 
								lead.score,
								"<a style='color: #22A' title= 'Click to see twitter page.' target='_blank' href='http://www.twitter.com/" + lead.user + "'>" + lead.user + "</a>",
								pathgeo.util.highlightKeyword(app.constants.KEYWORDS, lead.text, true)
								//lead.loc
							] );
		}
		
		
		//adjust divName width and height. It is because using tabs will make the width of 2nd+ tabs to 0. So we need to set up manually.
		$("#"+divName).css({width: $("#"+divName).parent().width()-40, height: $("#"+divName).parent().height()-70});
		
		var table = new google.visualization.Table(document.getElementById(divName));
		table.draw(data, { showRowNumber: false, sortColumn: 0, sortAscending: false,  allowHtml: true});
				
		google.visualization.events.addListener(table, 'select', function() { 
			var row = table.getSelection()[0].row;
			
			//Can I still use the "data" variable due to closure??  Is this safe? (Chris)
			var user = data.getFormattedValue(row, 1);

			//Note: $(user).text() strips HTML tags, but not sure it is the best methods (Chris)
			showUserInfoDialog($(user).text());
		});

	}
	
	function showUserInfoDialog(userName) {
		var userInfo;
		for (var indx in userData) {
			if (userData[indx].user_info.screen_name == userName) 
				userInfo = userData[indx].user_info;
		}
		//alert(userInfo.image_url);
		$("#user_image").attr({"src": userInfo.image_url});
		$("#user_description").text(userInfo.description);
		$("#user_location").text(userInfo.location);
		$("#user_friends_count").text(userInfo.friends_count);
		$("#user_followers_count").text(userInfo.followers_count);
		
		showDialog('dialog_user_info', userName, {modal:true}); 
	}
	
	
	
	/**
	 * init user interface 
	 */
	function init_UI(){		
		//gridster
		$(".gridster").append("<ul></ul>");

		app.gridster=$(".gridster ul").gridster({
	        widget_margins: [15, 15],
	        widget_base_dimensions: [$(".gridster").width()/7.4, $(".gridster").width()/7.4],
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
	
	}
	
	
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
				if($this.attr("widget-onClose") && $this.attr("widget-onClose")!=""){
					eval($this.attr("widget-onClose"))
				}
				app.gridster.remove_widget($widget);
			}
		})
		
		
		
		//close all dialog
		$("*").dialog("destroy");
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
		dialogOptions["close"]=dialogOptions["close"] || function(){};
		dialogOptions.position=dialogOptions.position || "center";
	
		$("#"+id).dialog(dialogOptions);
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
			height: 306,
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
	
		var reputation_data = getScore("dailyRep");
		
		var reputation_data_table = google.visualization.arrayToDataTable(reputation_data);

        var options_graph_rep = {
          legend: {position: 'none'},
		  vAxis: {minValue:0,maxValue:300,gridlines:{count:4}}
        };

        var reputation_graph = new google.visualization.LineChart(document.getElementById('graph_reputation'));
        reputation_graph.draw(reputation_data_table, options_graph_rep);
		
		
		$('.changeRepGraph').click(function() {
			reputation_data = getScore($(this).attr('id'));
			reputation_data_table = google.visualization.arrayToDataTable(reputation_data);
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
			reviewData.addRow( [feed.Rating, 
								feed.Date,
								feed.Review
							] );
		}
		
		var reviewTable = new google.visualization.Table(document.getElementById('reviews_rep'));
		reviewTable.draw(reviewData, { showRowNumber: false, allowHtml: true, sortColumn: 1, sortAscending: false} );
		
	}
	
	/**
	*Initialize visibilty score and graphs
	*/
	function init_visibilty_graph(){
	
		showDialog('dialog_visibility', 'Visibility', {modal:true})
	
		$('.changeVisGraph').css('cursor', 'pointer');
	
		var visibility_data = getScore("dailyVis");
		
		var visibilty_data_table = google.visualization.arrayToDataTable(visibility_data);

        var options_graph_rep = {
          legend: {position: 'none'},
		  vAxis: {minValue:0,maxValue:300,gridlines:{count:4}}
        };

        var visibility_graph = new google.visualization.LineChart(document.getElementById('graph_visibilty'));
        visibility_graph.draw(visibilty_data_table, options_graph_rep);
		
		
		$('.changeVisGraph').click(function() {
			visibility_data = getScore($(this).attr('id'));
			visibilty_data_table = google.visualization.arrayToDataTable(visibility_data);
			visibility_graph.draw(visibilty_data_table, options_graph_rep);
			$('.changeVisGraph').css("font-weight","normal");
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
			reviewData.addRow( [feed.Rating, 
								feed.Date,
								feed.Review
							] );
		}
		
		var reviewTable = new google.visualization.Table(document.getElementById('reviews_vis'));
		reviewTable.draw(reviewData, { showRowNumber: false, allowHtml: true, sortColumn: 1, sortAscending: false} );
	}

	
	
	
	
	/**
	*Switch User Logo
	*/
	function switch_user(company){
		if(company=="penske"){
			$("#link").html("Penske General Manager<span class='ui-icon ui-icon-carat-1-s widget-dropdown' title='Expand'></span>");
			$("#logo").html("<img src = 'images/logo_penske.png' alt='logo' border='0' style = 'width:150px;height:40px;float:right' />");
			$('div#submenu').hide();
		}
		else{
			$("#link").html("Drew Ford General Manager<span class='ui-icon ui-icon-carat-1-s widget-dropdown' title='Expand'></span>");
			$("#logo").html("<img src = 'images/logo_drew.png' alt='logo' border='0' style = 'width:210px;height:40px;float:right' />");
			$('div#submenu').hide();
		}
	}
	
	/**
	*Logout
	*/
	function logout(){
		$("#link").html("Sign In<span class='ui-icon ui-icon-carat-1-s widget-dropdown' title='Expand'></span>");
		$("#logo").html("");
		$('div#submenu').hide();
	}





	
