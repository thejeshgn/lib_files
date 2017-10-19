function updateGraphs(){
	if (jQuery('#graph_display_div_id').css('display') == 'none') {
		jQuery('#graph_display_div_id').show();
	}else{
		jQuery('#graph_display_div_id').hide();	
	}

	//var dt = jQuery('#tablepress-9').DataTable();
	//var rows = dt.$('tr');
	var rows;
	var year_shown = [];
	if ( jQuery.fn.dataTable.isDataTable( '#tablepress-9' ) ) {
		//var rows = jQuery('#tablepress-9').DataTable().$('tr', {"filter":"applied"});
		rows = jQuery('#tablepress-9').DataTable().$('tr');
	}else{
		console.log("DataTable is not initialized yet");
		return;
	}
	
	var json_chart_labels = [];
	var json_chart_movie_count = {};
	var currentTime = new Date();
	var current_year =  currentTime.getFullYear();
	var current_month = currentTime.getMonth() + 1;
	for(start_year=2012; start_year <= current_year;  start_year++){
			//console.log(start_year);
			final_month=12;
			if(start_year == current_year){
				final_month = current_month;
			}

		for(start_month=1;  start_month <= final_month; start_month++){
			if(start_month < 10){
				year_month = ""+start_year+"-0"+start_month;
			}else{
				year_month = ""+start_year+"-"+start_month;
			}
			
			console.log(year_month);
			json_chart_labels.unshift(year_month);
			json_chart_movie_count[year_month]=0;
		}
	}




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
			    fullWidth: true,
				low:'2008-03',
				chartPadding: {
					right: 10
				},
				axisY: {
					onlyInteger: true
				},
				axisX: {
					labelInterpolationFnc: function (value, index) {
                    return index % 12 === 0 ? value : null;
                	}

				}	
		});

}
