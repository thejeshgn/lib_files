var now = new Date();
var start = new Date(now.getFullYear(), 0, 0);
var diff = now - start;
var oneDay = 1000 * 60 * 60 * 24;
var day = Math.floor(diff / oneDay);

var startDate = new Date("2016-01-01");
var endDate = Date.now();

var startTimestamp = 1451586600;

function GAconverter(data) {
	var results = {};
	total = data.length;
	console.log(total);
	currentTimeStamp = startTimestamp;
	for(i = 0; i < total; i++) {
		console.log(data[i].Start);
		console.log(data[i].End);
		
		start = new Date(data[i].Start).getTime()/1000;
		end = new Date(data[i].End).getTime()/1000;
		console.log(start);
		console.log(end);
		console.log(currentTimeStamp);
		while(currentTimeStamp <= end){
			console.log("inside while");
			if(currentTimeStamp >= start){
				results[currentTimeStamp] = parseInt(data[i].Rate);
			}
			currentTimeStamp = currentTimeStamp + 3600;				
		}
	}
	console.log(results);
	return results;
}

var cal = new CalHeatMap();
cal.init({
	itemSelector: "#visual",
	domain: "day",
	subDomain: "hour",
	rowLimit: 1,
	cellSize: 15,
	domainGutter: 0,
	verticalOrientation: true,
	label: {
		position: "left",
		offset: {
			x: 10,
			y: 10
		},
		width: 110
	},
	data: "https://thejeshgn.com/dna_git/sleep/year_2016.csv",
	dataType: "csv",
	range: day,
	start: startDate,
	afterLoadData: GAconverter,
	itemName: "Rate",
	legend: [1, 2, 3, 4, 5],
	legendHorizontalPosition: "right",
	legendVerticalPosition:"bottom",
	highlight: ["now"],
	legendColors: {
		empty: "#ededed",
		max: "chartreuse",
		min: "red"
	}
});