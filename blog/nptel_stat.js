
function updateGraphs(){
	const data = {
	    labels: ["Jan-June 2014", "Jul-Dec 2014", "Jan-June 2015", "Jul-Dec 2015",
	        "Jan-June 2016", "Jul-Dec 2016", "Jan-June 2017", "Jul-Dec 2017","Jan-Apr 2018","Jul-Oct 2018"
	    ],
	    datasets: [
	        {
	            name: "Certification", chartType: "line",
	            values: [1380, 1653, 2564, 7291, 17292, 35748, 46363, 70316,86954,161242]
	        },
	        {
	            name: "Enrollments", chartType: "line",
	            values: [53807,58947,89045,160819,241691,401176, 535223,1049265,934182,1330816]
	        }
	    ]
	}

	const chart = new frappe.Chart("#enroll_certification", {  // or a DOM element,
	                                            // new Chart() in case of ES6 module with above usage
	    title: "NPTEL Enrollmets and Registrations for Certification",
	    data: data,
	    type: 'axis-mixed', // or 'bar', 'line', 'scatter', 'pie', 'percentage'
	    height: 400,
	    colors: ['#7cd6fd', '#743ee2'],
	    barOptions: {
	       stacked: 1,
 		   spaceRatio: 0.1 // default: 1
		}
	})

}

function startEverything(){
  updateGraphs();
}

startEverything();