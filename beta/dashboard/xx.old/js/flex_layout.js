
    var outerSouthLayout;
	function createLayouts () {

		var outerLayout = $('#layout_container').layout({ //outermost header and footer
				name:					"outer"
			,	spacing_open:			8 // ALL panes
			,	spacing_closed:			12 // ALL panes
			,	north__paneSelector:	".outer-north"			
			,	center__paneSelector:	".outer-center"
			,	south__paneSelector:	".outer-south"
			,	north__size:			110   //logo and login
			,	south__size:			110	  //footer		
			,   resizable:              false
			,   closable:               false
		});
		
	
		
		var middleLayout = $('div.outer-center').layout({      //outer-center
				name:					"middle"
			,	north__paneSelector:	".middle-north"				
			,	center__paneSelector:	".middle-center"
			,	south__paneSelector:	".middle-south"
			,	north__size:			200 //reputation
			,	south__size:			250 // pie + table + cloud
			//,	minSize:				50
			,	maxSize:				200
			,   resizable:              true
			,   closable:               true		
			,	spacing_open:			8	// ALL panes
			,	spacing_closed:			12 // ALL panes
		});

		var innerLayout_North = $('div.middle-north').layout({
				name:					"innerNorth"
			,	center__paneSelector:	".north-center"
			,	west__paneSelector:		".north-west"
			,	east__paneSelector:		".north-east"
			,	west__size:				200 //reputation west
			,	east__size:				250 //reputation east
			,   resizable:              false
			,   closable:               false
			,	spacing_open:			8	// ALL panes
			,	spacing_closed:			8	// ALL panes
			,	west__spacing_closed:	12
		});

		var innerLayout_Center = $('div.middle-center').layout({ //inner middle
			onresize: function () {
			//alert('whenever anything on layout is redrawn NS.') 
				app.map.invalidateSize();
				chart.draw(data, options);
				table.draw(data2, {showRowNumber: true});				
			},			
				name:					"innerCenter"
			,	center__paneSelector:	".inner-center"
			,	south__paneSelector:	".inner-south"
			//,	east__paneSelector:		".north-east" 
			,	south__size:			250 // Social Media Chart       
			,   resizable:              true	
			,	maxSize:				250			
			,	spacing_open:			8	// ALL panes
			,	spacing_closed:			8	// ALL panes
			,	west__spacing_closed:	12		
		
		});

		var innerLayout_Center_C = $('div.inner-center').layout({ // table + map
			onresize: function () {
			//alert('whenever anything on layout is redrawn. WE')
				app.map.invalidateSize();
				chart.draw(data, options);
				table.draw(data2, {showRowNumber: true});				
			},					
				name:					"innerCenter"
			,	center__paneSelector:	".north-center"
			,	west__paneSelector:		".north-west"
			,	east__paneSelector:		".north-east"		
			,	west__size:				270
			,	east__size:			    350	// not shown			
			,	maxSize:				500
			,	spacing_open:			8	// ALL panes
			,	spacing_closed:			8	// ALL panes
			,	west__spacing_closed:	12	
		
		});	

		var innerLayout_Center_S = $('div.inner-south').layout({ //table + Social Media Chart
				name:					"innerSouth"
			,	center__paneSelector:	".north-center"
			,	west__paneSelector:		".north-west"
			,	west__size:				400
			,   resizable:              false
			,   closable:               false			
			,	spacing_open:			8	// ALL panes
			,	spacing_closed:			8	// ALL panes
			,	west__spacing_closed:	12	
			,	east__spacing_closed:	12	
		});			

		innerLayout_South = $('div.middle-south').layout({ //wordcloud
				name:					"innerSouth"
			,	center__paneSelector:	".north-center"
			,	west__paneSelector:		".north-west"
			,	east__paneSelector:		".north-east"
			,	west__size:				400
			,	east__size:			    400
			,	center__size:			500
			,   resizable:              false
			,   closable:               false
			//,	minSize:				350
			//,	maxSize:				500	

			,	spacing_open:			8	// ALL panes
			,	spacing_closed:			8	// ALL panes
			,	west__spacing_closed:	12
		});

		
	};



	
	$(document).ready(function(){
	
	
		createLayouts();
		//$("#btnCreate").attr('disabled', true);
		$("#btnCreate").removeAttr('disabled'); // avoid caching issue
		

		
		
	});
