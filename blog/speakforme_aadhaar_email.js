var colors = ['#fee0d2','#fcbba1','#fc9272','#fb6a4a','#ef3b2c','#cb181d','#a50f15','#67000d'];//['#f7fcfd','#e5f5f9','#ccece6','#99d8c9','#66c2a4','#41ae76','#238b45','#006d2c','#00441b'];
var bucket_size = 0;

function getBucketNumberBasedColor(val){
  if(val == 0){
    return '#fff';
  }
  var val_min = 0;
  var val_max = bucket_size*colors.length;
  var index_val =0;
  for(var i=0; i <colors.length; i++){
      present_value = i*bucket_size;
      if(val > present_value){
        index_val = i;
      }
  }
  console.log(colors[index_val]);
  return colors[index_val];
}


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
  
var plotPC = function(pane){
    d3.json('../geojson/pc_14_simplified.json' , function(parcon){
      d3.csv('../data/pc_2014_results.csv' , function(info){
      var marker
      var getColor = function(d) {
                stat_code = d['properties']['stat_code'];
                emails_sent = 0;
                if(mp_emails_sent['doc'][stat_code]){
                  emails_sent = mp_emails_sent['doc'][stat_code];
                }
                d['properties']['emails_sent']=emails_sent;
                return getBucketNumberBasedColor(emails_sent);
      }
      var style = function(feature) {
          return {
              fillColor: getColor(feature), //this will be based on emails sent
              weight: .25,
              opacity: 1,
              fillOpacity: .5
          };
      }
      var infoTip = L.control();
      infoTip.onAdd = function (map) {
          this._div = L.DomUtil.create('div', 'info');
          this.update();
          return this._div;
      };
      infoTip.update = function (props) {
          this._div.innerHTML = '<h6>#SpeakForMe Emails</h6>' +  (props ?
              '<b>'+ props.winner +'</b> ( ' + props.party + ' )'+ ' <br /> <b>' +props.pcname +'</b> ( ' + props.state + ' )'+
              ' <br />Emails : <b>' + props.emails_sent + '</b>'
              : 'Hover over a Constituency');
      };

      infoTip.addTo(map);


      var highlightFeature =function(e) {
          var layer = e.target;

          layer.setStyle({
              weight: 1,
              dashArray: '',
              fillOpacity: 0.9
          });

          if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
              layer.bringToFront();
        }
        infoTip.update(layer.feature.properties);
      }

      var resetHighlight = function(e) {
          geolayer.resetStyle(e.target);
          infoTip.update();
      }

      var zoomToFeature = function(e) {
          map.fitBounds(e.target.getBounds());
      }

      var onEachFeature = function(feature, layer) {
          layer.on({
              mouseover: highlightFeature,
              mouseout: resetHighlight,
              click: zoomToFeature
          });
      }

      var getstate = function(pcnm){
        if(pcnm == null) return 'Not Available'
        entry = info.filter(function(d){
          return d['PC Name'].trim() == pcnm.trim()
        });
        return entry.length >0 ? entry[0]['State'] : 'Not Available'
      }
      var getpcname = function(pcnm){
        if(pcnm == null) return 'Not Available'
        entry = info.filter(function(d){
          return d['PC Name'].trim() == pcnm.trim()
        });
        return entry.length >0 ? entry[0]['PC Name'] : 'Not Available'
      }
      var getwinner = function(pcnm){
        if(pcnm == null) return 'Not Available'
        entry = info.filter(function(d){
          return d['PC Name'].trim() == pcnm.trim()
        });
        return entry.length >0 ? entry[0]['Winner Candidates'] : 'Not Available'
      }
      var getparty = function(pcnm){
        if(pcnm == null) return 'Not Available'
        entry = info.filter(function(d){
          return d['PC Name'].trim() == pcnm.trim()
        });
        return entry.length >0 ? entry[0]['winner Party'] : 'Not Available'
      }
      var getvotes = function(pcnm){
        if(pcnm == null) return '-1'
        entry = info.filter(function(d){
          return d['PC Name'].trim() == pcnm.trim()
        });
        return entry.length >0 ? Math.round((parseInt(entry[0]['Votesw'])*10000) / (parseInt(entry[0]['Votesw']) + parseInt(entry[0]['Votesr'])))/100 : -1
      }
      var getcategory = function(pcnm){
        if(pcnm == null) return 'Not Available'
        entry = info.filter(function(d){
          return d['PC Name'].trim() == pcnm.trim()
        });
        return entry.length >0 ? entry[0]['PC Type'] : 'Not Available'
      }

      for(i=0; i<parcon['features'].length ;i++){
        parcon['features'][i]['properties']['state'] = getstate(parcon['features'][i]['properties']['PC_NAME'])
        parcon['features'][i]['properties']['pcname'] = getpcname(parcon['features'][i]['properties']['PC_NAME'])
        parcon['features'][i]['properties']['winner'] = getwinner(parcon['features'][i]['properties']['PC_NAME'])
        parcon['features'][i]['properties']['party'] = getparty(parcon['features'][i]['properties']['PC_NAME'])
        parcon['features'][i]['properties']['votes'] = getvotes(parcon['features'][i]['properties']['PC_NAME'])
        parcon['features'][i]['properties']['category'] = getcategory(parcon['features'][i]['properties']['PC_NAME'])

        STATE_CODE = parcon['features'][i]['properties']['ST_NAME'];
        console.log(STATE_CODE);
        if(STATE_CODE == "OD"){          
          STATE_CODE = "OR";
        }
        if(STATE_CODE == "KL"){
          STATE_CODE = "KE";
        } 
        if(STATE_CODE == "CG"){
          STATE_CODE = "CT";
        }
        if(STATE_CODE =="BR"){
          STATE_CODE = "BI"; 
        }
        if(STATE_CODE =="UK"){
          STATE_CODE = "UT"; 
        }
        if(STATE_CODE =="HR"){
          STATE_CODE = "HA"; 
        }

        parcon['features'][i]['properties']['stat_code'] = ("mp/"+STATE_CODE+"-"+ parcon['features'][i]['properties']['PC_CODE']).toLowerCase(); 
      }
      var geolayer = L.geoJson(parcon, {style: style, onEachFeature: onEachFeature}).addTo(map);


    })
  })
};


 
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
  //will be used for map plotting
  mp_emails_sent = latest_mailbox_email_sent;

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


  bucket_size = 500/colors.length;

  console.log("Plotting map");
  plotPC('map');
  console.log("End plotting map");



}//end of draGraph

//Make the call
 $.ajax({
  url: "https://data.thejeshgn.com/bulletinbabu/_all_docs?include_docs=true&startkey=%222018%22&endkey=%222017%22&descending=true&limit=300&clear="+formatDateHour(),
  contentType: "application/json",
  dataType:'json'
}).done(function( data ) {
  drawGraphs(data);

});
