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
  series_array.push(max_price_array)
  series_array.push(mode_price_array)
  series_array.push(mean_price_array)
  series_array.push(median_price_array)
  series_array.push(min_price_array)  

  console.log(series_array);

  new Chartist.Bar('#idvc_stat_chart', {
    labels: ['Idly','Masala Dosa','Vada','Regular Coffee'],
    series: series_array
  }, {
    // Default mobile configuration
    stackBars: true,
    axisX: {
      labelInterpolationFnc: function(value) {
        return value.split(/\s+/).map(function(word) {
          return word[0];
        }).join('');
      }
    },
    axisY: {
      offset: 20
    }
  }, [
    // Options override for media > 400px
    ['screen and (min-width: 400px)', {
      reverseData: true,
      horizontalBars: true,
      axisX: {
        labelInterpolationFnc: Chartist.noop
      },
      axisY: {
        offset: 60
      }
    }],
    // Options override for media > 800px
    ['screen and (min-width: 800px)', {
      stackBars: false,
      seriesBarDistance: 10
    }],
    // Options override for media > 1000px
    ['screen and (min-width: 1000px)', {
      reverseData: false,
      horizontalBars: false,
      seriesBarDistance: 15
    }]
  ]);

}

var total_data_url = THEJESHGN_DATA_DB+"/idvc/current_stats?&clear="+formatDateHour();
jQuery.ajax({
url: total_data_url,
}).done(function(raw_data) {
  updateGraphs(raw_data)
});