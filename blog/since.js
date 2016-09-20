setInterval( "updateTime()", 500);
var sinceYear=2003;
var sinceMonth=6;
var sinceDay=25;
var sinceHour=0;
var sinceMinutes=0;
var sinceSec=0;
var now = new Date();

var nowYear=now.getFullYear();
var nowMonth=now.getMonth();
var nowDay=now.getDate();
var elapsedYear=nowYear-sinceYear;
var elapsedMonth=nowMonth-sinceMonth;
if(elapsedMonth <0){
	nowMonth = nowMonth+12;
	elapsedMonth=nowMonth-sinceMonth;
	elapsedYear = elapsedYear-1;
}
var elapsedDay=nowDay-sinceDay;
if(elapsedDay < 0){
	nowDay = nowDay+30;
	elapsedDay=nowDay-sinceDay;
	elapsedMonth = elapsedMonth-1;
}

var elapsedHour;
var elapsedSec;
var elapsedMinutes;

document.getElementById("date").innerHTML=elapsedYear+" Years "+elapsedMonth+"  Months "+elapsedDay+"  Days ";

function updateTime(){
		now = new Date();
		var nowHour = now.getHours();
		elapsedHour=nowHour-sinceHour;
		if(elapsedHour <0){
			elapsedHour = elapsedHour+24;
			elapsedHour=nowHour-sinceHour;
			elapsedDay = elapsedDay-1;
		}
		
		var nowMinutes = now.getMinutes();
		elapsedMinutes=nowMinutes-sinceMinutes;
		if(elapsedMinutes <0){
			elapsedMinutes = elapsedMinutes+60;
			elapsedMinutes=nowMinutes-sinceMinutes;
			elapsedHour = elapsedHour-1;
		}

		var nowSec = now.getSeconds();
		elapsedSec=nowSec-sinceSec;
		if(elapsedSec <0){
			elapsedSec = elapsedSec+60;
			elapsedSec=nowSec-sinceSec;
			elapsedMinutes = elapsedMinutes-1;
		}
document.getElementById("time").innerHTML=elapsedHour+"  Hours "+elapsedMinutes+" Minutes "+elapsedSec+"  Seconds ";		
}
