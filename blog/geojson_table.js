
//example
//geojson_table_id = "#myTable"
//geojson_url = 'https://data.thejeshgn.com/geojson/3kfor30.geojson';

let table = new DataTable(geojson_table_id,    { ajax: {
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

// Function to scroll to a specific row by ID
function scrollToRowByID(rowID) {
  var row = table.row('[id="' + rowID + '"]');
  if (row.length > 0) {
    var rowIndex = row.index();
    var settings = table.settings();
    var page = Math.floor(rowIndex / settings[0]._iDisplayLength);
    settings[0]._iDisplayStart = page * settings[0]._iDisplayLength;
    table.page(page).draw(false);

    $('html, body').animate({
      scrollTop: row.node().offsetTop
    }, 500);
  }
}

