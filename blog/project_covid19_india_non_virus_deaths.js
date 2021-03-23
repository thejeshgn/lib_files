let start_date = new Date("2020-03-14");
let last_updated_on = new Date("2020-07-30");

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

//var virus_total_data_url = THEJESHGN_DATA_DB+"/covid19/_design/aggregation/_view/all_totals?reduce=true&group=true&clear="+formatDateHour();
var cases_data_url = THEJESHGN_DATA_DB+"/covid19/_design/india/_view/non_virus_deaths?descending=false&nounce="+formatDateHour();
var counts_data_url = THEJESHGN_DATA_DB+"/covid19/_design/aggregation/_view/non_virus_deaths?reduce=true&group=true&nounce="+formatDateHour();
var virus_total_data_category_url = THEJESHGN_DATA_DB+"/covid19/_design/aggregation/_view/non_virus_deaths_category?reduce=true&group=true&nounce="+formatDateHour();

var categories = {};
categories["DarkGreen"] = "1";
categories["DarkOliveGreen"] = "2";
categories["DarkSeaGreen"] = "3";
categories["LawnGreen"] = "4";
categories["SandyBrown"] = "5";
categories["Cyan"] = "6";
categories["Magenta"] = "7";
categories["LightGray"] = "8";
categories["Blue"] = "9";
categories["MediumPurple"] = "10";
categories["Yellow"] = "11";

var categories_label = {};
categories_label["DarkGreen"] = "Exhaustion (walking, standing in lines)";
categories_label["DarkOliveGreen"] = "Starvation and financial distress";
categories_label["DarkSeaGreen"] = "Police brutality or state violence";
categories_label["LawnGreen"] = "Lack of medical care or attention";
categories_label["SandyBrown"] = "Death by crimes associated with lockdown (not communal)";
categories_label["Cyan"] = "Accidents due to walking or during migration";
categories_label["Magenta"] = "Alcohol withdrawal-related deaths and suicides";
categories_label["LightGray"] = "Suicides due to fear of infection, loneliness, & lack of freedom of movement, inability to go home";
categories_label["Blue"] = "Deaths in Shramik Trains";
categories_label["MediumPurple"] = "Quarantine centre deaths";
categories_label["Yellow"] = "Unclassified (unclear, unable to categorize, need more details)";
var categories_order = ["DarkGreen", "DarkOliveGreen","DarkSeaGreen","LawnGreen","SandyBrown","Cyan","Magenta","LightGray","Blue","MediumPurple","Yellow"];


// function addGraphs(){
//   jQuery.ajax({
//     url: virus_total_data_url,
//   }).done(function(data) {
//         var death = {};
//         var date_labels = [];
//         var death_data = [];
//         var rows = data["rows"];
        
//         var last_entry_per_day = [];
//         previous_date_part = ""
//         for(var j=(rows.length -1); j >= 0 ; j--){
//           row = rows[j];
//           keys = row["key"];
//           report_datetime = keys[0];
          
//           date_part = (report_datetime.split("T"))[0];
//           //console.log(previous_date_part,date_part )

//           if(previous_date_part != date_part){
//             last_entry_per_day.push(report_datetime);         
//           }      
//           previous_date_part = date_part;
          
//         }
//         for(var i=0; i < rows.length; i++){
//           row = rows[i];

//           keys = row["key"];
//           report_date = keys[0];
//           label_type = keys[1];
//           data_value = row["value"];
//           if(last_entry_per_day.includes(report_date)){
//             if(label_type == "death"){
//               date_part = (report_date.split("T"))[0];
//               death[date_part]=data_value;
//               date_labels.push(date_part);
//               death_data.push(data_value);
//             } 
//           }
//         }
//         updateGraphs(death, date_labels, death_data);        
//   });
// }

function updateGraphs(death, date_labels, death_data){
  //console.log("inside updateGraphs");
  //console.log(death, date_labels, death_data)
  //console.log("-----------------------------------------------------------------------");
  if (Array.isArray(date_labels) && date_labels.length) {
    // array exists and is not empty, so we dont have to do anything    
  }else{
    date_labels = [];
    for(var dt = start_date; dt <= last_updated_on; dt.setDate(dt.getDate() + 1) ){
        iso_date = dt.toISOString();
        date_part = iso_date.split("T")[0];        
        date_labels.push(date_part);
    }
  }

  jQuery.ajax({
    url: counts_data_url,
  }).done(function(data) {
      console.log(data);
      labels = [];
      values = [];
      total_time_played = 0;
      previous_value = 0
      non_virus_deaths = {}
      for(i=0; i < data['rows'].length; i++){          
          let date_part = data['rows'][i]['key'];
          //labels.push(date_part);
          previous_value = previous_value + data['rows'][i]['value'];
          //values.push(previous_value);
          non_virus_deaths[date_part] = previous_value;          
      }
      let previous_value_part = 0;
      for(var k=0; k <date_labels.length; k++){
        let date_part = date_labels[k];

        if(date_part in non_virus_deaths){
          values.push(non_virus_deaths[date_part]);
          previous_value_part = non_virus_deaths[date_part];
        }else{
          values.push(previous_value_part);
        }
      }

      
      // var data_for_compare_chart =  {
      //   labels: date_labels,
      //   datasets: [
      //     {
      //       title: "Non Virus",
      //       name:"Non Virus",
      //       values: values,
      //     }

      //     ,{
      //       title: "COVID-19",
      //       name: "COVID-19",
      //       values: death_data,
      //     }          
      //   ]
      // };

      var data_for_chart =  {
        labels: date_labels,
        datasets: [
          {
            title: "Non Virus Deaths",
            name:"Non Virus Deaths",
            values: values,
          }          
        ]
      };      
        
      //console.log("================================================================");
      //console.log(date_labels, values, death_data)
        deaths_by_timeline = new frappe.Chart("#deaths_by_timeline",
            {
              data: data_for_chart,
              title: "Non Virus Deaths",
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
              colors: ['#ff5858', '#7cd6fd'],    
            }
        );

        // compare_by_timeline = new frappe.Chart("#compare_by_timeline",
        //     {
        //       data: data_for_compare_chart,
        //       title: "Non Virus Deaths v/s COVID-19 Deaths",
        //         type: 'axis-mixed',
        //         height: 600,
        //         barOptions: {
        //            stacked: 0,
        //            spaceRatio: 0.1 // default: 1
        //       },
        //       lineOptions: {
        //           dotSize: 6, // default: 4
        //           heatline: 1
        //       },
        //       axisOptions: {
        //           xIsSeries: true // default: false
        //       },
        //       colors: ['#ff5858', '#7cd6fd'],    
        //     }
        // );




  });
}


function updateCategoryGraph(){
  let data_dict = {}
  jQuery.ajax({
    url: virus_total_data_category_url
  }).done(function(data) {
      
      labels = [];
      values = [];
      for(i=0; i < data['rows'].length; i++){          
          data_dict[data['rows'][i]['key']]= data['rows'][i]['value'];
      }

      for(i=0; i < categories_order.length; i++){          
          labels.push(categories_label[categories_order[i]]);
          values.push(data_dict[categories_order[i]]);                  
      }

      


      var data_for_chart =  {
        labels: labels,
        datasets: [
          {
            title: "Non Virus Deaths by Categories",
            name:"Non Virus Deaths by Categories",
            values: values,
          }          
        ]
      };      
        
      //console.log("================================================================");
      //console.log(date_labels, values, death_data)
        non_virus_deaths_by_category = new frappe.Chart("#non_virus_deaths_by_category",
            {
              data: data_for_chart,
              title: "Non Virus Deaths by Category",
                type: 'bar',
                height: 600,
                barOptions: {
                   spaceRatio: 0.1
              },
              colors: ["red"],    
            }
        );




  });
}




function updateTable(){
  oTable =  jQuery('#non_virus_death_table').dataTable( {
              "pageLength": 25,
              "responsive": true,
              "ajax": {
                        "url":cases_data_url,
                        "dataSrc": "rows",
                }, //END AJAX
                "order": [[ 0, "desc" ]],
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
                  {"data":"value.name_age"},
                  {"data":"value.occupation"},
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
  //addGraphs();
  updateGraphs(null, null, null);
  updateCategoryGraph();
  updateTable();
}


/* Call it */
startEverything();
