/*
jQuery( document ).ready(function() {
    console.log( "ready!" );
	updateGraphs();
	jQuery('#tablepress-9').on( 'search.dt', function () {
				
				console.log("inside search");
				updateGraphs();
	} );


//JQuery Ready
});
*/


function updateGraphs(){
	if (jQuery('#graph_display_div_id').css('display') == 'none') {
		jQuery('#graph_display_div_id').show();
	}else{
		jQuery('#graph_display_div_id').hide();	
	}

	//var dt = jQuery('#tablepress-9').DataTable();
	//var rows = dt.$('tr');
	var rows;
	if ( jQuery.fn.dataTable.isDataTable( '#tablepress-9' ) ) {
		var rows = jQuery('#tablepress-9').DataTable().$('tr', {"filter":"applied"});
	}else{
		console.log("DataTable is not initialized yet");
		return;
	}
	
	var json_chart_labels = ['2012', '2013', '2014', '2015'];
	var json_chart_ratings_count = [0,0,0,0,0,0,0,0,0,0,0,0];
	var json_chart_language_count = {'English':0,  'Kannada':0};

	var json_chart_years_count = [0,0,0,0];
	var json_chart_average_rating = 0;

	var total_rating = 0;
	var year_2012 = 0;
	var year_2013 = 0;
	var year_2014 = 0;
	var year_2015 = 0;

	for(j=0; j<rows.length; j++){
	var watched_on = rows[j].cells[0].innerText;
	var rating = rows[j].cells[1].innerText;
	var rating_count = json_chart_ratings_count[rating];
	json_chart_ratings_count[rating] = rating_count + 1;

	var genres = rows[j].cells[4].innerText;
	var language = rows[j].cells[3].innerText;
	console.log('language='+language);

	var lang_count = json_chart_language_count[language];
	console.log('lang_count 0 ='+lang_count);
	console.log('lang_count 0 ='+typeof(lang_count)== 'number');
	if (typeof(lang_count) == 'number'){
		lang_count = lang_count + 1
		console.log('inside 1='+lang_count);
	}else{
		language = "Others";
		lang_count = json_chart_language_count["Others"];
		lang_count = lang_count + 1
		console.log('inside 2='+lang_count);

	}
	json_chart_language_count[language] = lang_count
	//console.log('json_chart_language_count='+json_chart_language_count);


	watched_on_year = watched_on.substring(0,4);
	console.log(watched_on_year);
	total_rating = total_rating + rating;





	switch(watched_on_year){
		case '2012':
			year_2012 = year_2012 + 1;
			break;
		case '2013':
			year_2013 = year_2013 + 1;
			break;
		case '2014':
			year_2014 = year_2014 + 1;
			break;
		case '2015':
			year_2015 = year_2015 + 1;
		break;				
	}

	json_chart_years_count = [year_2012, year_2013, year_2014, year_2015];


	}

	var json_chart_options;


	//no of movies per year
	new Chartist.Bar('#first', {
	  labels: json_chart_labels,
	  series: [
			json_chart_years_count
		]		  
	}, {
	stackBars: true,
	axisY: {
		onlyInteger: true
	},
	  plugins: [
		Chartist.plugins.ctSketchy({
		  overrides: {
			grid: {
			  baseFrequency: 0.2,
			  scale: 5,
			  numOctaves: 1
			},
			bar: {
			  baseFrequency: 0.02,
			  scale: 10
			},
			label: false
		  }
		})
	  ]

	}
	).on('draw', function(data) {
	  if(data.type === 'bar') {
		data.element.attr({
		  style: 'stroke-width: 30px'
		});
	  }
	});


	//2. Pie chart of average ratings,
	new Chartist.Pie('#second', {
		labels: [0,1,2,3,4,5,6,7,8,9,10],
		series: json_chart_ratings_count
	}, {
		chartPadding: 50,
		labelOffset: 40,
		labelDirection: 'explode',
		donut: true
	});

/*
	//3. Pie chanrt of languages
	new Chartist.Pie('#third', {
		labels: ['English',  'Kannada'],
		series: [json_chart_language_count['English'],json_chart_language_count['Kannada']]
	}, {
		chartPadding: 50,
		labelOffset: 40,
		labelDirection: 'explode',
		donut: true
	});
*/
}
