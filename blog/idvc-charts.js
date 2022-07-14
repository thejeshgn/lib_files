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
    return [year, month, day].join('-');
}


function updateGraphs(raw_data){
  min_price_array = [];
  mean_price_array = [];
  median_price_array = [];
  mode_price_array = [];
  max_price_array = [];
  keys = ['idly_two','masala_dosa','vada','regular_coffee'];
  keys.forEach(function (item, index) {
    console.log(item)
    console.log(raw_data[item])
    max_price_array.push(raw_data[item]['max']);
    mean_price_array.push(raw_data[item]['mean']);
    median_price_array.push(raw_data[item]['median']);
    mode_price_array.push(raw_data[item]['mode']);
    min_price_array.push(raw_data[item]['min']);

  });

  series_array = []
  series_array.push({ "values":min_price_array, "name": "Minimum", chartType: 'bar'  })  
  series_array.push({ "values":mean_price_array, "name": "Mean", chartType: 'bar'})
  series_array.push({ "values":mode_price_array, "name": "Mode", chartType: 'bar'})  
  series_array.push({ "values":median_price_array, "name": "Median", chartType: 'bar'})
  series_array.push({ "values":max_price_array, "name": "Maximum", chartType: 'bar'})

  console.log(series_array);

  let data = {
      labels: ['Idly','Masala Dosa','Vada','Regular Coffee'],
      datasets: series_array
  }

 chart = new frappe.Chart('#idvc_stat_chart', {
    "title": "Prices of IDVC",
    "data" : data,
    "type":"bar",
     "height": 600,
    "barOptions": { stacked: 0, spaceRatio: 0.1},
    "colors": ['#859900','#2aa198','#2857FF', '#F92672' ,'#dc322f']
  });

}

var total_data_url = THEJESHGN_DATA_DB+"/idvc/current_stats?&clear="+formatDateHour();
jQuery.ajax({
url: total_data_url,
}).done(function(raw_data) {
  updateGraphs(raw_data)
});