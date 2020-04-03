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
    return [year, month, day, hour].join('-');
}
cases_data_url = "https://data.thejeshgn.com/covid19/_design/india/_view/non_virus_deaths?descending=false&nounce="+formatDateHour();
counts_data_url = "https://data.thejeshgn.com/covid19/_design/aggregation/_view/non_virus_deaths?reduce=true&group=true&nounce="+formatDateHour();


function updateGraphs(){
  jQuery.ajax({
    url: counts_data_url,
  }).done(function(data) {
      labels = [];
      values = [];
      total_time_played = 0;
      previous_value = 0
      for(i=0; i < data['rows'].length; i++){
          labels.push(data['rows'][i]['key']);
          previous_value = previous_value + data['rows'][i]['value'];
          values.push(previous_value);
      }
        var non_virus_death_count =  {
        labels: labels,
        datasets: [
          {
            title: "Deaths",
            values: values,
          }
        ]
      };
        
        console.log(non_virus_death_count);

        most_listened_podcast = new frappe.Chart("#deaths_by_timeline",
        {
          data: non_virus_death_count,
          title: "Non Virus Death Count",
          type: 'line', 
          height: 250
        });
  });
}

function updateTable(){
  oTable =  jQuery('#non_virus_death_table').dataTable( {
              "pageLength": 25,
              "ajax": {
                        "url":cases_data_url,
                        "dataSrc": "rows",
                }, //END AJAX
                "columns":[    //columns to display
                    {
                      "data":"value.incident_date",
                      "visible": true
                    },
                    {"data":"value.deaths"},
                    {"data":"value.reason",
                          "render": function(data, type, row, meta){
                                var return_data = ""
                                if(type === "display" || type === "filter"){
                                    for(var i =0; i < data.length; i++){
                                      return_data = return_data + data[i] +"<br/>";
                                    }
                                    
                                }
                                return return_data;
                             }

                  },
                  {"data":"null",
                          "render": function(data, type, row, meta){
                                var return_data = ""
                                if(type === "display" || type === "filter"){
                                   return_data = row['value']['location'] +", "+ row['value']['district'];                                  
                                }
                                return return_data;
                             }

                  },                
                  {"data":"value.state"},
                  {"data":"value.source", 
                           "render": function(data, type, row, meta){
                                if(type === 'display'){
                                    data = data.replace("www.","");
                                    data = data.replace(".com","");
                                    data = data.replace(".in","");
                                    data = data.replace(".net","");
                                    data = '<a  target="_blank" href="' + row['value']['source_link'] + '">' + data + '</a>';
                                }
                                return data;
                             }

                  },
                  ],
                  "columnDefs": [ {
                  targets: [ 0 ]
                  } ]                
          } );// End: DataTable

}
 
 
function startEverything(){
  updateGraphs();
  updateTable();
}


/* Call it */
startEverything();