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

var communal_incidents_data_url = THEJESHGN_DATA_DB+"/covid19/_design/india/_view/communal_incidents?descending=false&nounce="+formatDateHour();

var categories = {};
categories["Yellow"] = "1";
categories["Magenta"] = "2";
categories["Blue"] = "3";
categories["LawnGreen"] = "4";
categories["SandyBrown"] = "5";
categories["Red"] = "6";
categories["Cyan"] = "7";

var categories_label = {};
categories_label["Yellow"] = "Communal Violence (physical assault, vandalism, break in)";
categories_label["Magenta"] = "Communal Tension (Threats issued, preventing public access, hate speech)";
categories_label["Blue"] = "Racist Tension (Hate speech based on racialization) ";
categories_label["LawnGreen"] = "Caste Violence (physical assault, vandalism, break in) ";
categories_label["SandyBrown"] = "Casteist Tension (Threats issued, preventing public access, hate speech) ";
categories_label["Red"] = "Communal Death/Suicide (Death as an outcome of communalism)";
categories_label["Cyan"] = "Police/State Violence and Hate Speech (Unlawful arrest; communalized Corona allegation by gov) ";




function updateTable(){
  oTable =  jQuery('#communal_incidents_table').dataTable( {
              "pageLength": 25,
              "ajax": {
                        "url":communal_incidents_data_url,
                        "dataSrc": "rows",
                }, //END AJAX
                "order": [[ 0, "desc" ]],
                "columns":[    //columns to display
                  {
                      "data":"value.incident_date",
                      "visible": true
                  },
                  {"data":"null",
                          "render": function(data, type, row, meta){
                                var return_data = ""
                                if(type === "display" || type === "filter"){
                                  if(row['value']['location'] != ""){                                    
                                    return_data = row['value']['location'] +", "+ row['value']['district'];                                  
                                  }else{
                                    return_data = row['value']['district'];                                  
                                  }
                                }
                                return return_data;
                             }

                  },                
                  {"data":"value.state"},
                  {"data":"value.victims"},
                  {"data":"value.incident"},
                  {"data":"value.incident_details"},
                  {"data":"value.source", 
                           "render": function(data, type, row, meta){
                                if(type === 'display'){
                                    data = '<a  target="_blank" href="' + row['value']['source_link'] + '">' + data+"<br/>"+row['value']['source_date'] + '</a>';
                                }
                                return data;
                             }

                  },                                    
                  {
                    "data":"&nbsp;",
                          "render":  
                              function(data, type, row, meta){
                                var return_data = ""
                                if(type === "display" || type === "filter"){
                                  if(row['value']['category'] != ""){                                    
                                    return_data = '<span style="background-color:'+row['value']['category']+';">&nbsp;&nbsp;'+categories[row['value']['category']]+'&nbsp;&nbsp;</span>';                                  
                                  }else{
                                    return_data = "";                                  
                                  }
                                }else if(type == 'sort'){
                                  return_data = categories[row['value']['category']];
                                }
                                return return_data;
                             }
                  }
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
