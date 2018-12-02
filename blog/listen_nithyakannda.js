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

function format ( d ) {
    // `d` is the original data object for the row

    kannada = "1."+ row['doc']['text']['kn']['1'];
    english = "1."+ row['doc']['text']['en']['1'];
    transliterated = "1."+ row['doc']['text']['Knda-Latn']['1'];

    if( "2" in row['doc']['text']['kn'] ) {
      kannada = kannada + "<br>2."+ row['doc']['text']['kn']['2'];
      english = english + "<br>2."+ row['doc']['text']['en']['2'];
      transliterated = transliterated + "<br>2."+ row['doc']['text']['Knda-Latn']['2'];

    }
    if( "3" in row['doc']['text']['kn'] ) {
      kannada = kannada + "<br>3."+ row['doc']['text']['kn']['3'];
      english = english + "<br>3."+ row['doc']['text']['en']['3'];
      transliterated = transliterated + "<br>3."+ row['doc']['text']['Knda-Latn']['3'];

    }
    if( "4" in row['doc']['text']['kn'] ) {
      kannada = kannada + "<br>4."+ row['doc']['text']['kn']['4'];
      english = english + "<br>4."+ row['doc']['text']['kn']['4'];
      transliterated = transliterated + "<br>4."+ row['doc']['text']['Knda-Latn']['4'];

    }

    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
        '<tr>'+
            '<td>English:</td>'+
            '<td>'+english+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Kannada:</td>'+
            '<td>'+kannada+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Transliterated:</td>'+
            '<td>'+transliterated+'</td>'+
        '</tr>'+
    '</table>';
}


function updateTable(){

  oTable = jQuery('#listen').dataTable( {
            "bSort" : false,  //sorting disabled
            "searching": true,
             "pageLength": 5,
            "processing": true,
            "serverSide": true,
            "ajax": {
                      "url": THEJESHGN_DATA_DB+"/nithyakannada/_design/ordered/_view/ordered-view?include_docs=true&descending=true&clear="+formatDateHour(),
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
                  {"data":"doc._id"},
                  {"data":"doc.audio.en-kn",
                      "render": function(data, type, row, meta){
                              if(type === 'display'){

                                  data = '<audio  src="https://archive.org/download/NithyaKannada/' + row['doc']['audio']['en-kn'] + '"controls></audio>';
                              }
                              return data;
                           }

                  },

                  {"data":"doc.text.en",
                      "render": function(data, type, row, meta){
                              if(type === 'display'){

                                  data = "1."+ row['doc']['text']['en']['1'];
                                  if( "2" in row['doc']['text']['en'] ) {
                                    data = data + "<br>2."+ row['doc']['text']['en']['2'];
                                  }
                                  if( "3" in row['doc']['text']['en'] ) {
                                    data = data + "<br>3."+ row['doc']['text']['en']['3'];
                                  }
                                  if( "4" in row['doc']['text']['en'] ) {
                                    data = data + "<br>4."+ row['doc']['text']['en']['4'];
                                  }

                              }
                              return data;
                           }

                  },

                  {"data":"doc.text.kn",
                      "render": function(data, type, row, meta){
                              if(type === 'display'){

                                  data = "1."+ row['doc']['text']['kn']['1'];
                                  if( "2" in row['doc']['text']['kn'] ) {
                                    data = data + "<br>2."+ row['doc']['text']['kn']['2'];
                                  }
                                  if( "3" in row['doc']['text']['kn'] ) {
                                    data = data + "<br>3."+ row['doc']['text']['kn']['3'];
                                  }
                                  if( "4" in row['doc']['text']['kn'] ) {
                                    data = data + "<br>4."+ row['doc']['text']['kn']['4'];
                                  }

                              }
                              return data;
                           },                           
                  },
                  {
                      "className":      'details-control',
                      "orderable":      false,
                      "data":           null,
                      "defaultContent": ''
                  },                  

                ]
        } );// End: DataTable
 
 
   jQuery('#listen tbody').on('click', 'td.details-control', function () {
    console.log("now");
        var tr = jQuery(this).closest('tr');
        var table  =  jQuery('#listen').DataTable();
        var row =table.row( tr );
        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child( format(row.data()) ).show();
            tr.addClass('shown');
        }

  } );


   //FITER SETUP START
     jQuery('#listen_filter input').unbind();
     jQuery('#listen_filter input').bind('keyup', function(e) {
         if(e.keyCode == 13) {
          oTable.fnFilter(this.value);   
      }
     });
}



function startEverything(){
  updateTable();
}


/* Call it */
startEverything();