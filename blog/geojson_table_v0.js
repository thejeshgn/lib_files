/* This is compatible with the older version of datatable -  DataTables 1.10.7 
   it uses id (unique per feature), icon(https url), name and description properties from geojson.
   It needs geojson_table_id and geojson_url variables set like for example
      geojson_table_id = "#myTable"
      geojson_url = 'https://data.thejeshgn.com/geojson/3kfor30.geojson';

  For now it just displays the table there is no scrolling as such
*/


let table = jQuery(geojson_table_id).dataTable({ ajax: {
        dataSrc: 'features',
        url: geojson_url
    },
    rowId: 'properties.id',
    columns: [
        { data: 'properties.id' },
        { data: null, render: function (data, type, row, meta){ 
                return render_cell(data, type, row, meta)
            }
        }
    ]
});

function render_cell(data, type, row, meta){
    console.log(data.properties.icon);
    icon =""
    if(data.properties.icon && data.properties.icon != "" ){
        icon = "<img width='40px' src='"+data.properties.icon+"'/>";
    }

    header = "<strong>"+data.properties.name+"</strong><br/>"

    description =  "<div class='geojson_properties_description'>"+ data.properties.description+"</div>";
    content =   "<div >" + icon + header + description +"</div>";
    return content;
}
