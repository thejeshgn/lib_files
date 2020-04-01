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
data_url = "https://data.thejeshgn.com/covid19/_design/india/_view/non_virus_deaths?descending=false&nounce=3"+formatDateHour();


function updateTable(){
  oTable =  jQuery('#non_virus_death_table').dataTable( {
              "ajax": {
                        "url":data_url,
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
  updateTable();
}


/* Call it */
startEverything();