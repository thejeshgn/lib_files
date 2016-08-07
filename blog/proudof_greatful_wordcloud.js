function load_grateful(data){
	drawCloud("grateful_canvas", data);
}
function load_proudof(data){
	drawCloud("proudof_canvas", data);
}

function drawCloud(canvas_id, data){

	var settings = {
	  gridSize: Math.round(16 * jQuery("#"+canvas_id).width() / 1024),
	  weightFactor: function (size) {
	    return Math.pow(size, 5) * jQuery("#"+canvas_id).width() / 1024;
	  },
	  fontFamily: 'Times, serif',
	  color: function (word, weight) {
	    return (weight === 12) ? '#f02222' : '#c09292';
	  },
	  rotateRatio: 0.5,
	  backgroundColor: '#ffffff'
	};


	var newData = [];
	var rows = data.rows;
	for (var i = 0; i < rows.length; i++) {
		var d = [];
		newData.push([rows[i]['key'],rows[i]['value'] ]);
	}
	console.log(newData);
	settings['list']=newData;
	s = WordCloud(document.getElementById(canvas_id), settings );

}
 jQuery.getJSON("https://laingentsoneingetterepiv:c36d687425e770805c8f947c372f80d9c8777bb8@thejeshgn.cloudant.com/proudof_grateful/_design/summary/_view/count_grateful?group=true&callback=?", function(result){
         load_grateful(result);
        });
 jQuery.getJSON("https://laingentsoneingetterepiv:c36d687425e770805c8f947c372f80d9c8777bb8@thejeshgn.cloudant.com/proudof_grateful/_design/summary/_view/count_proud?group=true&callback=?", function(result){
         load_proudof(result);
        });
