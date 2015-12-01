function updateGraphs(){
	if (jQuery('#graph_display_div_id').css('display') == 'none') {
		jQuery('#graph_display_div_id').show();
	}else{
		jQuery('#graph_display_div_id').hide();	
	}

	//var dt = jQuery('#tablepress-7').DataTable();
	//var rows = dt.$('tr');
	var rows;
	var year_shown = [];
	if ( jQuery.fn.dataTable.isDataTable( '#tablepress-7' ) ) {
		//var rows = jQuery('#tablepress-7').DataTable().$('tr', {"filter":"applied"});
		var rows = jQuery('#tablepress-7').DataTable().$('tr');
	}else{
		console.log("DataTable is not initialized yet");
		return;
	}
	
	var json_chart_labels = [];
	var json_chart_weight = [];

	for(j=0; j<rows.length; j++){
		var weight_date = rows[j].cells[0].innerText;
		var weight = rows[j].cells[1].innerText;
		json_chart_labels.push(weight_date);
		json_chart_weight.push(weight);
	}



	new Chartist.Line('#first', {
		  labels: json_chart_labels,
		  series: [
			json_chart_weight,
		  ]
		}, {
			    reverseData: true,
			    fullWidth: false,
				chartPadding: {
					right: 60
				},
				axisY: {
					onlyInteger: true
				},
				axisX: {
					position: 'end',
					showLabel: true,
					labelInterpolationFnc: function(value) {
							year = value.slice(0, 7)
							if(year_shown.indexOf(year) > -1){
								return "";
							}else{
								year_shown.push(year);
								return year;
							}
							
						}
				}	
		});


}
