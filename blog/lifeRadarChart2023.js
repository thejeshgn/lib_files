var margin = {top: 100, right: 100, bottom: 100, left: 100},
width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);
			////////////////////////////////////////////////////////////// 
			////////////////////////// Data ////////////////////////////// 
			////////////////////////////////////////////////////////////// 

			//This is for 42nd Year
			var data = [
				[
				  {axis:"Health",value:.8},
				  {axis:"Wealth",value:.5},
				  {axis:"Location",value:.2},
				  {axis:"Family",value:.9},
				  {axis:"Friends",value:.7},
				  {axis:"Love",value:.8},
				  {axis:"Learning",value:.7},
				  {axis:"Work",value:.7},
				  {axis:"Leisure",value:.3},
				  {axis:"Self",value:.4},
			  ]
			  ];
			////////////////////////////////////////////////////////////// 
			//////////////////// Draw the Chart ////////////////////////// 
			////////////////////////////////////////////////////////////// 

			var color = d3.scale.ordinal()
				.range(["#EDC951","#CC333F","#00A0B0"]);
			var radarChartOptions = {
			  w: width,
			  h: 500,
			  margin: margin,
			  maxValue: 0.9,
			  levels: 5,
			  roundStrokes: true,
			  color: color
			};
			//Call function to draw the Radar chart
			RadarChart(".radarChart", data, radarChartOptions);
