/*
Needs the script
https://lib.thejeshgn.com/lib_files/frappe_charts/frappe-charts.min.iife.js
*/

var oTable;

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

function updateGraphs(){
  var total_time_played_podcast_url =THEJESHGN_DATA_DB+"/listeningnow/_design/total_time_played_podcast/_view/total_time_played_podcast?group=true&reduce=true";
  jQuery.ajax({
    url: total_time_played_podcast_url,
  }).done(function(data) {
      labels = [];
      values = [];
      total_time_played = 0;
      for(i=0; i < data['rows'].length; i++){
          labels.push(data['rows'][i]['key']);
          values.push(data['rows'][i]['value']);
          total_time_played = total_time_played + data['rows'][i]['value'];
      }
        var data_mostlistened =  {
        labels: labels,
        datasets: [
          {
            title: "Most Heard podcasts",
            values: values,
          }
        ]
      };
        
        most_listened_podcast = new Chart({
        parent: "#by_listening",
        title: "Most Heard Podcasts",
        data: data_mostlistened,
        type: 'bar', 
        height: 250
      });


  });


}


function updateTable(){

  jQuery('#example').dataTable( {
            "bSort" : false,  //sorting disabled
            "searching": true,
             "pageLength": 25,
            "processing": true,
            "serverSide": true,
            "ajax": {
                      "url": THEJESHGN_DATA_DB+"/listeningnow/_design/latest/_view/latest?include_docs=true&descending=true&clear="+formatDateHour(),
                      "dataSrc": "rows",
                      "data": function ( d ) {
                              d.limit = d.length;
                              d.skip =d.start;
                              if(d.search && d.search["value"] && d.search["value"] != "" ){
                                    d.key='"'+d.search["value"]+'"';     
                                    delete d.search["value"];
                                    delete d.search["regex"];          
                                }
                              //console.log(d);
                        },
                      "beforeSend": function (xhr) {
                          //xhr.setRequestHeader ("Authorization", "Basic " + btoa(cred)); // cred = "username:password" only if the API is not public read
                        },
 
                      "dataFilter": function(data) {
                          //console.log(data);
                          var data = JSON.parse(data);
                          data['recordsTotal']= data["total_rows"];
                          data['recordsFiltered']= data["total_rows"];
                          return JSON.stringify(data);
                        }
              }, //END AJAX
              "columns":[    //columns to display
                  {"data":"doc.podcast"},
                  {"data":"doc.description",
                      "render": function(data, type, row, meta){
                              if(type === 'display'){
                                  data = '<a  target="_blank" href="' + row['doc']['href'] + '">' + data + '</a>';
                              }
                              return data;
                           }

                  },
                  {"data":"doc.period"},
                  {"data":"doc.time"},
                ]
        } );// End: DataTable
 
 
   //FITER SETUP START
     jQuery('#example_filter input').unbind();
     jQuery('#example_filter input').bind('keyup', function(e) {
         if(e.keyCode == 13) {
          oTable.fnFilter(this.value);   
      }
     });
}



function startEverything(){
  updateTable();
  updateGraphs();
}


/* Call it */
startEverything();