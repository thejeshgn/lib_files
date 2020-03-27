//Needs Frappe chart 1.1.0


function formatDateHour() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
        hour = d.getHours();
        min = d.getMinutes();
        second = d.getSeconds()

        min15 = Math.ceil(min/15);

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    //return [year, month, day, hour,min15].join('-');
    return [year, month, day, hour, min, second].join('-');
}

function updateGraphs(data){
		var confirmed = [];
		var active_cases = [];
		var cured = [];
		var death = [];
		var date_labels = [];
		var rows = data["rows"];
		
		var last_entry_per_day = [];
		previous_date_part = ""
		for(var j=(rows.length -1); j >= 0 ; j--){
			row = rows[j];
			keys = row["key"];
			report_datetime = keys[0];
			
			date_part = (report_datetime.split("T"))[0];
			console.log(previous_date_part,date_part )

			if(previous_date_part != date_part){
				last_entry_per_day.push(report_datetime);					
			}			 
			previous_date_part = date_part;
			
		}

		for(var i=0; i < rows.length; i++){
			row = rows[i];

			keys = row["key"];
			report_date = keys[0];
			label_type = keys[1];
			data_value = row["value"];

			if(last_entry_per_day.includes(report_date)){
				if(label_type == "cured"){
					if(date_labels.includes(report_date)){
						//pass
					}else{
						date_labels.push(report_date);
					}
					cured.push(data_value);		
				} 
				if(label_type == "death"){
					if(date_labels.includes(report_date)){
						//pass
					}else{
						date_labels.push(report_date);
					}
					death.push(data_value);
				} 
				if(label_type == "total_confirmed_cases"){
					if(date_labels.includes(report_date)){
						//pass
					}else{
						date_labels.push(report_date);
					}
					confirmed.push(data_value);
				} 
				if(label_type == "active_cases"){
					if(date_labels.includes(report_date)){
						//pass
					}else{
						date_labels.push(report_date);
					}
					active_cases.push(data_value);
				} 
			}
		}
		console.log(confirmed);
		console.log(cured);
		console.log(death);
		console.log(date_labels);
		console.log(active_cases);
		

		const data2 = {
		    labels: date_labels,
		    datasets: [
		        {
		            name: "Confirmed",chartType: "line",
		            values: confirmed
		        },
		        {
		            name: "Active",chartType: "line",
		            values: active_cases
		        },
		        {
		            name: "Cured", chartType: "line",
		            values: cured
		        },
		        {
		            name: "Death",chartType: "line",
		            values: death
		        }

		    ]
		}

		console.log(data2);

		const chart2 = new frappe.Chart("#totals", {  
		    title: "COVID19 Cases In India",
		    data: data2,
		    type: 'axis-mixed',
		    height: 600,
		    barOptions: {
		       stacked: 0,
				   spaceRatio: 0.1 // default: 1
			},
			lineOptions: {
  			  dotSize: 6, // default: 4
  			  heatline: 1
			},
			axisOptions: {
  			  xIsSeries: true // default: false
			},
			colors: ['#7cd6fd','#5e64ff','#82b965','#ff5858'],		
		});
		//update the divs
		jQuery( "#confirmed" ).text(confirmed[confirmed.length-1])
		jQuery( "#active_cases" ).text(active_cases[active_cases.length-1])
		jQuery( "#cured" ).text(cured[cured.length-1])
		jQuery( "#death" ).text(death[death.length-1])
		jQuery( "#last_updated_on" ).text("Last updated at: " +date_labels[date_labels.length-1])

}



var total_data_url =THEJESHGN_DATA_DB+"/covid19/_design/aggregation/_view/all_totals?reduce=true&group=true&clear="+formatDateHour();
jQuery.ajax({
url: total_data_url,
}).done(function(data) {
	updateGraphs(data)
});
