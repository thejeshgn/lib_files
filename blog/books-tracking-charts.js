/*
Needs the script
https://lib.thejeshgn.com/lib_files/frappe_charts/frappe-charts.min.iife.js
*/
var books_by_year_chart;
function updateGraphs(){
	if (jQuery('#graph_display_div_id').css('display') == 'none') {
		jQuery('#graph_display_div_id').show();
	}else{
		jQuery('#graph_display_div_id').hide();	
	}
	if(books_by_year_chart){
		//do nothing
		console.log("just display");
	}else{
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
				console.log(start_year);
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
				json_chart_labels.push(year_month);
				json_chart_movie_count[year_month]=0;
			}
		}




		var json_chart_movie_count_array = [];
		var genre_count_array = [];
		var fiction_count = 0;
		var non_fiction_count = 0;
		//debugger;
		for(j=0; j<rows.length; j++){
			//This is for year chart
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

			
			var genre_column = jQuery(rows[j].cells[4]).text();
			var genre_column_array = genre_column.split(",");
			console.log("genre"+genre_column_array.length);
			for (var k = 0; k < genre_column_array.length; k++) {
    			var genre = jQuery.trim(genre_column_array[k]);
    			console.log(genre);
    			if(genre == "Fiction"){
    				fiction_count = fiction_count + 1;
    			}else if (genre == "Non Fiction"){
    				non_fiction_count = non_fiction_count + 1;
    			}else{
    				//other genres
	    			if(genre in genre_count_array){
	    				console.log("found genre");
						genre_count = genre_count_array[genre];
						genre_count = genre_count+1;
						genre_count_array[genre] = genre_count;
	    			}else{
						genre_count_array[genre] = 1;
	    			}
	    		}

			}


		}//end all rows in table

		/************* DISPLAY MONTHLY/YEAR CHART *******************/
		var i = 0;
		//console.log(json_chart_labels);
		for(i=0; i < json_chart_labels.length; i++){
			json_chart_movie_count_array.push(json_chart_movie_count[json_chart_labels[i]]);
		}
		console.log(json_chart_labels);
		console.log(json_chart_movie_count_array);

		var data1 =  {
		    labels: json_chart_labels,
		    datasets: [
		    	{
		    		title: "Books Read by Month",
		    		values: json_chart_movie_count_array,
		    	}
		    ]
	    };
		books_by_year_chart = new Chart({
		    parent: "#first",
		    title: "Books Read by Month",
		    data: data1,
		    is_series: 1,   
		    type: 'line', // or 'line', 'scatter', 'pie', 'percentage'
		    height: 250
	  	});

		/************* DISPLAY Language CHART *******************/

		/************* DISPLAY Genre CHART *******************/
		var data_genre =  {
		    labels: Object.keys(genre_count_array),
		    datasets: [
		    	{
		    		title: "Books Read by Genre",
		    		values: Object.values(genre_count_array),
		    	}
		    ]
	    };

		books_by_genre_chart = new Chart({
		    parent: "#by_genre",
		    title: "Books Read by Genre",
		    data: data_genre,
		    type: 'percentage', // or 'line', 'scatter', 'pie', 'percentage'
		    height: 250
	  	});
		/************* DISPLAY Genre CHART *******************/
		var data_category =  {
		    labels: ['Fiction', 'Non Fiction'],
		    datasets: [
		    	{
		    		title: "Books Read by Category",
		    		values:  [fiction_count, non_fiction_count],
		    	}
		    ]
	    };

		books_by_category_chart = new Chart({
		    parent: "#by_category",
		    title: "Books Read by Category",
		    data: data_category,
		    type: 'percentage', 
		    height: 250
	  	});


	}//end of if charts intialized
}
