function loadCss(url) {
	var link = document.createElement("link");
	link.type = "text/css";
	link.rel = "stylesheet";
	link.href = url;
	document.getElementsByTagName("head")[0].appendChild(link);
}

jQuery.cachedScript = function( url, options ) {
  // Allow user to set any option except for dataType, cache, and url
  options = $.extend( options || {}, {
    dataType: "script",
    cache: true,
    url: url
  });
 
  // Use $.ajax() since it is more flexible than $.getScript
  // Return the jqXHR object so we can chain callbacks
  return jQuery.ajax( options );
};

loadCss("https://thejeshgn.com/lib_files/chartist/chartist.min.css");

$.getScript("https://thejeshgn.com/lib_files/chartist/chartist.min.js", function() {
	
	updateGraphs = function(){
		if (jQuery('#graph_display_div_id').css('display') == 'none') {
			jQuery('#graph_display_div_id').show();
		}else{
			jQuery('#graph_display_div_id').hide();	
		}

		//var dt = jQuery('#tablepress-7').DataTable();
		//var rows = dt.$('tr');
		var rows;
		var year_shown = [];
		if ( jQuery.fn.dataTable.isDataTable( '#tablepress-8' ) ) {
			//var rows = jQuery('#tablepress-7').DataTable().$('tr', {"filter":"applied"});
			var rows = jQuery('#tablepress-8').DataTable().$('tr');
		}else{
			console.log("DataTable is not initialized yet");
			return;
		}
		
		var json_chart_labels = [];
		var json_chart_movie_count = {};
		var json_chart_movie_count_array = [];
		//debugger;
		for(j=0; j<rows.length; j++){
			//var weight_date = rows[j].cells[0].innerText;
			var watched_date = jQuery(rows[j].cells[0]).text();
			year_month = watched_date.slice(0, 7)
			if(json_chart_labels.indexOf(year_month) > -1){
				movie_count = json_chart_movie_count[year_month];
				movie_count = movie_count+1;
				json_chart_movie_count[year_month] = movie_count;
			}else{
				json_chart_labels.push(year_month);
				json_chart_movie_count[year_month] = 1;
			}
		}
		var i = 0;
		//console.log(json_chart_labels);
		for(i=0; i < json_chart_labels.length; i++){
			json_chart_movie_count_array.push(json_chart_movie_count[json_chart_labels[i]]);
		}
		//console.log(json_chart_labels);
		//console.log(json_chart_movie_count_array);

		new Chartist.Line('#first', {
			  labels: json_chart_labels,
			  series: [
				json_chart_movie_count_array,
			  ]
			}, {
					reverseData: true,
					fullWidth: false,
					low:'2008-03',
					chartPadding: {
						right: 10
					},
					axisY: {
						onlyInteger: true
					},
					axisX: {
						
						showLabel: true
					}	
			});

	}
});