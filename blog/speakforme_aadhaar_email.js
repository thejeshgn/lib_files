function formatDateHour() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
        hour = d.getHours();
        min = Math.ceil(d.getMinutes()/15);

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day, hour,min].join('-');
}

 
function drawGraphs(returned_data){
  let all_rows = _.reverse(returned_data.rows);
  //Filter emails sent
  let rows =  _.filter(all_rows, function(o) { return o.doc.stat == "email_sent" && o.doc.campaign == "#SpeakForMe"});

  let total_rows = returned_data.total_rows;  
  let latest_row = _.last(rows);
  console.log(latest_row);
  $("#display_email_sent").html(latest_row['doc']["total"] +" Emails Sent Until Now.");
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
        title: "Mobile",
        values:mobile
      },
      {
        title: "Govt",
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






  let rows_mailbox_email_sent = _.filter(all_rows, function(o) { return o.doc.stat == "mailbox_email_sent" && o.doc.campaign == "#SpeakForMe"});
  let latest_mailbox_email_sent = _.last(rows_mailbox_email_sent);

   let latest_mobile_data = {
      labels: ["Airtel", "MTS", "MTNL", "BSNL", "Aircel", "Telenor", "Idea", "Vodafone"],

      datasets: [
        {
          title: "",
          values:[latest_mailbox_email_sent['doc']['mobile/airtel'],latest_mailbox_email_sent['doc']['mobile/mts'],latest_mailbox_email_sent['doc']['mobile/mtnl'],latest_mailbox_email_sent['doc']['mobile/bsnl'],latest_mailbox_email_sent['doc']['mobile/aircel'], latest_mailbox_email_sent['doc']['mobile/telenor'], latest_mailbox_email_sent['doc']['mobile/idea'], latest_mailbox_email_sent['doc']['mobile/vodafone']]
        }
      ]
    };


  
   


   let chart_email_sent_by_mobile_operator = new Chart({
        parent: "#emails_sent_to_mobile_operator",
        title: "",
        data: latest_mobile_data,
        is_series: 1,   
        type: 'percentage', 
        height: 250,
        width:"90%"
      });




   let latest_bank_data = {
      labels: ["Yes Bank", "Vijaya Bank", "Utkarsh Small Finance Bank", "United Bank of India","Union Bank of India",
                "Ujjivan Small Finance Bank","UCO Bank","Tamilnad Mercantile Bank","Syndicate Bank","Suryoday Small Finance Bank","State Bank of India",
                "Standard Chartered Bank","South Indian Bank","RBL Bank","Punjab National Bank","Punjab and Sindh Bank","PayTM Payments Bank","Oriental Bank of Commerce",
                "Lakshmi Vilas Bank","Kotak Mahindra Bank","Karur Vysya Bank","Karnataka Bank","Jammu and Kashmir Bank","IndusInd Bank","Indian Overseas Bank","Indian Bank",
                "IDFC Bank","IDBI Bank","ICICI Bank","HSBC India","HDFC Bank","Fincare Small Finance Bank","Federal Bank","ESAF Small Finance Bank","Equitas Small Finance Bank",
                "Dhanlaxmi Bank","Deutsche Bank","Dena Bank","DCB Bank","DBS Bank","Corporation Bank","City Union Bank","Citi Bank","Central Bank of India","Catholic Syrian Bank",
                "Capital Small Finance Bank","Canara Bank","Bank of Maharashtra","Bank of India","Bank of Baroda","Bandhan Bank","Axis Bank","AU Small Finance Bank",
                "Andhra Bank","American Express","Allahabad Bank"
              ],

      datasets: [
        {
          title: "",
          values:[
            latest_mailbox_email_sent['doc']['bank/yesb'],
            latest_mailbox_email_sent['doc']['bank/vijb'],
            latest_mailbox_email_sent['doc']['bank/utks'],
            latest_mailbox_email_sent['doc']['bank/utbi'],
            latest_mailbox_email_sent['doc']['bank/ubin'],
            latest_mailbox_email_sent['doc']['bank/usfb'],
            latest_mailbox_email_sent['doc']['bank/ucba'],
            latest_mailbox_email_sent['doc']['bank/tmbl'],
            latest_mailbox_email_sent['doc']['bank/synb'],
            latest_mailbox_email_sent['doc']['bank/sury'],
            latest_mailbox_email_sent['doc']['bank/sbin'],
            latest_mailbox_email_sent['doc']['bank/scbl'],
            latest_mailbox_email_sent['doc']['bank/sibl'],
            latest_mailbox_email_sent['doc']['bank/ratn'],
            latest_mailbox_email_sent['doc']['bank/punb'],
            latest_mailbox_email_sent['doc']['bank/psib'],
            latest_mailbox_email_sent['doc']['bank/pytm'],
            latest_mailbox_email_sent['doc']['bank/orbc'],
            latest_mailbox_email_sent['doc']['bank/lavb'],
            latest_mailbox_email_sent['doc']['bank/kkbk'],
            latest_mailbox_email_sent['doc']['bank/kvbl'],
            latest_mailbox_email_sent['doc']['bank/karb'],
            latest_mailbox_email_sent['doc']['bank/jaka'],
            latest_mailbox_email_sent['doc']['bank/indb'],
            latest_mailbox_email_sent['doc']['bank/ioba'],
            latest_mailbox_email_sent['doc']['bank/idib'],
            latest_mailbox_email_sent['doc']['bank/idfb'],
            latest_mailbox_email_sent['doc']['bank/icic'],
            latest_mailbox_email_sent['doc']['bank/hsbc'],
            latest_mailbox_email_sent['doc']['bank/fsfb'],
            latest_mailbox_email_sent['doc']['bank/fdrl'],
            latest_mailbox_email_sent['doc']['bank/esaf'],
            latest_mailbox_email_sent['doc']['bank/esfb'],
            latest_mailbox_email_sent['doc']['bank/dlxb'],
            latest_mailbox_email_sent['doc']['bank/deut'],
            latest_mailbox_email_sent['doc']['bank/bkdn'],
            latest_mailbox_email_sent['doc']['bank/dbss'],
            latest_mailbox_email_sent['doc']['bank/corp'],
            latest_mailbox_email_sent['doc']['bank/ciub'],
            latest_mailbox_email_sent['doc']['bank/citi'],
            latest_mailbox_email_sent['doc']['bank/cbin'],
            latest_mailbox_email_sent['doc']['bank/csbk'],
            latest_mailbox_email_sent['doc']['bank/clbl'],
            latest_mailbox_email_sent['doc']['bank/cnrb'],
            latest_mailbox_email_sent['doc']['bank/mahb'],
            latest_mailbox_email_sent['doc']['bank/bkid'],
            latest_mailbox_email_sent['doc']['bank/barb'],
            latest_mailbox_email_sent['doc']['bank/bdbl'],
            latest_mailbox_email_sent['doc']['bank/utib'],
            latest_mailbox_email_sent['doc']['bank/aubl'],
            latest_mailbox_email_sent['doc']['bank/andb'],
            latest_mailbox_email_sent['doc']['bank/amex'],
            latest_mailbox_email_sent['doc']['bank/alla']
          ]
        }
      ]
    };


  
   


   let chart_email_sent_by_banks = new Chart({
        parent: "#emails_sent_to_banks",
        title: "",
        data: latest_bank_data,
        type: 'percentage',
        is_series: 1,                
        height: 250,
        width:"90%"
      });





}//end of draGraph

//Make the call
 $.ajax({
  url: "https://data.thejeshgn.com/bulletinbabu/_all_docs?include_docs=true&startkey=%222018%22&endkey=%222017%22&descending=true&limit=300&clear="+formatDateHour(),
  contentType: "application/json",
  dataType:'json'
}).done(function( data ) {
  drawGraphs(data);

});
