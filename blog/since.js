setInterval( "updateTime()", 500);

function getTimeElapsed(dateString) {
  const now = new Date();
  const previousDate = new Date(dateString);

  if (isNaN(previousDate)) {
    return "Invalid date";
  }

  let seconds = Math.floor((now - previousDate) / 1000);
  let minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  let hours = Math.floor(minutes / 60);
  minutes = minutes % 60;
  let days = Math.floor(hours / 24);
  hours = hours % 24;
  let months = Math.floor(days / 30.44); // Using average days in a month
  days = Math.floor(days % 30.44);
  let years = Math.floor(months / 12);
  months = Math.floor(months % 12);

  return {
    years: years,
    months: months,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds
  };
}



function updateTime(){
	let {years, months, days, hours, minutes, seconds} =	getTimeElapsed('2003-06-25');
	document.getElementById("date").innerHTML=years+" Years "+months+"  Months "+days+"  Days ";		
	document.getElementById("time").innerHTML=hours+"  Hours "+minutes+" Minutes "+seconds+"  Seconds ";		
}
