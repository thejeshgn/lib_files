function load_grateful(data){
	drawCloud("grateful_canvas", data);
}
function load_proudof(data){
	drawCloud("proudof_canvas", data);
}

function drawCloud(canvas_id, data){
        var can = document.getElementById(canvas_id);
        var wid = window.innerWidth*0.60;
        can.style.width = wid + "px";

	var settings = {
	  gridSize: Math.round(10 * jQuery("#"+canvas_id).width() / wid),
	  weightFactor: function (size) {
	    return Math.pow(size, 4) * jQuery("#"+canvas_id).width() / wid;
	  },
	  fontFamily: 'Times, serif',
	  color: function (word, weight) {
	    return (weight === 12) ? '#f02222' : '#d70206';
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
