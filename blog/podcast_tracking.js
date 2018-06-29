
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

oTable =  jQuery('#example').dataTable( {
            "bSort" : false,  //sorting disabled
            "searching": true,
             "pageLength": 25,
            "processing": true,
            "serverSide": true,
            "ajax": {
                      "url": "https://data.thejeshgn.com/listeningnow/_design/latest/_view/latest?include_docs=true&descending=true&clear="+formatDateHour(),
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
