//Needs Frappe chart

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
		var cured = [];
		var death = [];
		var date_labels = [];
		var rows = data["rows"];
		for(var i=0; i < rows.length; i++){
			row = rows[i];

			keys = row["key"];
			report_date = keys[0];
			label_type = keys[1];
			data_value = row["value"];

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

		}
		console.log(confirmed);
		console.log(cured);
		console.log(death);
		console.log(date_labels);

		const data2 = {
		    labels: date_labels,
		    datasets: [
		        {
		            name: "Confirmed",chartType: "line",
		            values: confirmed
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
		    height: 400,
		    barOptions: {
		       stacked: 0,
				   spaceRatio: 0.1 // default: 1
			}
		})

}



var total_data_url =THEJESHGN_DATA_DB+"/covid19/_design/aggregation/_view/all_totals?reduce=true&group=true&clear="+formatDateHour();
jQuery.ajax({
url: total_data_url,
}).done(function(data) {
	updateGraphs(data)
});
