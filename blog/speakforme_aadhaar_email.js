function formatDateHour() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
        hour = d.getHours();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day, hour].join('-');
}

 
function drawGraphs(returned_data){
  let rows = _.reverse(returned_data.rows);
  let total_rows = returned_data.total_rows;  
  let latest_row = _.last(rows);
  console.log(latest_row);
  $("#display_email_sent").html(latest_row['doc']["total"] +" emails sent until now.");
  $("#last_updated_at").html("Last updated at "+latest_row['doc']["_id"]);


  
  let date_label = _.map(rows, 'id');
  let total = _.map(rows, 'doc.total');
  let banks = _.map(rows, 'doc.banks');
  let mps = _.map(rows, 'doc.mps');
  let others = _.map(rows, 'doc.others');
  let govt = _.map(rows, 'doc.govt');
  let mobile = _.map(rows, 'doc.mobile');


 let data_total = {
    labels: date_label,

    datasets: [
      {
        title: "Total",
        values:total
      }
    ]
  };


 let data = {
    labels: date_label,

    datasets: [
      {
        title: "MPs",
        values:mps
      },
      {
        title: "Banks",
        values:banks
      },
      {
        title: "Mobile service providers",
        values:mobile
      },
      {
        title: "Government services",
        values:govt
      },
      {
        title: "Others",
        values:others
      }
    ]
  };


 let latest_data = {
    labels: ["MPs", "Banks", "Mobile service providers", "Government services", "Others"],

    datasets: [
      {
        title: "",
        values:[latest_row['doc']['mps'],latest_row['doc']['banks'],latest_row['doc']['mobile'],latest_row['doc']['govt'],latest_row['doc']['others']]
      }
    ]
  };



    let chart_email_sent = new Chart({
        parent: "#emails_sent",
        title: "",
        data: data_total,
        is_series: 1,   
        heatline: 1, 
        y_axis_mode: 'span',
        type: 'line', 
        height: 250
      });


   let chart_email_sent_by_provider_date = new Chart({
        parent: "#emails_sent_by_institution_date",
        title: "",
        data: data,
        is_series: 1,   
        type: 'bar', 
        height: 250
      });

   let chart_email_sent_by_provider_percent = new Chart({
        parent: "#emails_sent_by_institution",
        title: "",
        data: latest_data,
        is_series: 1,   
        type: 'percentage', 
        height: 250
      });
}
 





//Make the call
 $.ajax({
  url: "https://data.thejeshgn.com/bulletinbabu/_all_docs?include_docs=true&startkey=%222018%22&endkey=%222017%22&descending=true&clear="+formatDateHour(),
  contentType: "application/json",
  dataType:'json'
}).done(function( data ) {
  drawGraphs(data);

});