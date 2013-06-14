function myFunction()
{
var mon1=getMonth1.value;
var day1=getDay1.value;
var year1=getYear1.value;
var mon2=getMonth2.value;
var day2=getDay2.value;
var year2=getYear2.value;
var d = new Date();
var t1 = Date.UTC(year1,mon1,day1);
var t2 = Date.UTC(year2,mon2,day2);
var tDiff=t2-t1;
var nDays=tDiff/1000/60/60/24;
var nDiffWeeks=parseInt(nDays/7);
var nDiffDays=nDays%7;
daysDiff.value=nDays;
weeksDiffWeek.value=nDiffWeeks;
weeksDiffDay.value=nDiffDays;
}
		// check whether date is a valid date
        function validDate(year,month,day,startOrEnd) 
        {
            var monthArray = new Array("January","February","March","April","May","June","July","August","September","October","November","December");
            // check for 30 day months
            if ( (month==3 || month==5 || month==8 || month==10) && day == 31 )
            {
                var monthDisplay = monthArray[month];
                alert("There is a problem with your " + startOrEnd + " date.\n"
                + monthDisplay + " does not have 31 days.");
                return true;
            }
            // check for February 29th
            if (month == 1) 
            {
                var isleap = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));
                if (day>29 || (day==29 && !isleap)) 
                {
                    alert("There is a problem with your " + startOrEnd + " date.\n"
                    + "February " + year + " does not have " + day + " days.");
                    return true;
                }
            }
            return false;     // date is valid
        }
		// check whether number of days to be added is a positive integer
        function checkDaysInput(field) {
            for (var i = 0; i < field.length; i++) { 
                 var ch = field.substring(i, i+1);
                    if (ch < "0" || "9" < ch) { 
                        alert("There is a problem with the number of days to add or subtract.\n"
                        + "Please input a positive integar.");
                        return true;
                    }
            }
            return false;     // field is valid
        }
        function daysCalculation() {
            var mon1=document.getElementById("getMonth1").value;
            var day1=document.getElementById("getDay1").value;
            var year1=document.getElementById("getYear1").value;
            var mon2=document.getElementById("getMonth2").value;
            var day2=document.getElementById("getDay2").value;
            var year2=document.getElementById("getYear2").value;

            // var validate = validDate(year1,mon1,day1,"starting");
            if (validDate(year1,mon1,day1,"starting") || validDate(year2,mon2,day2,"ending")) {
                update();
                return;
            }
            
            //var d = new Date();
            var t1 = Date.UTC(year1,mon1,day1);
            var t2 = Date.UTC(year2,mon2,day2);
            

            var tDiff=t2-t1;
            var nDays=tDiff/1000/60/60/24;
            var nDiffWeeks=parseInt(nDays/7);
            var nDiffDays=nDays%7;
            var nYears=parseInt(nDays/365);
            // document.getElemenytById("daysDiff").value=nDays;
            // document.getElementById("weeksDiffWeek").value=nDiffWeeks;
            // document.getElementById("weeksDiffDay").value=nDiffDays;    
            //Display in days 
            if(document.getElementById("inDays").checked==true) {
                var nDaysDisplay = nDays + " Days";
                document.getElementById("numberofDaysID").value=nDaysDisplay;
            }
            //Display in weeks
            if(document.getElementById("inWeeks").checked==true) {
                var nWeeksDisplay = nDiffWeeks +" Weeks" + " and " + nDiffDays + " Days";
                document.getElementById("numberofDaysID").value=nWeeksDisplay;
            }
            //Display in years
            if(document.getElementById("inYears").checked==true) {

                var y = leapYears(year1, year2);
                var daysLeft = nDays - 365*nYears - y;
                var nYearsDisplay = nYears +" Years" + " and " + daysLeft + " Days";
                document.getElementById("numberofDaysID").value=nYearsDisplay;
            }      
        }
        function leapYears(year1, year2) {
                var iyear ;
                var isLeapYear;
                var leapYearNum = 0;
                for (iyear=year1; iyear<=year2; iyear++) {
                    if (isLeapYear = (iyear % 4 == 0 && (iyear % 100 != 0 || iyear % 400 == 0))) {
                        leapYearNum++;
                    }
   
                }
                return leapYearNum;
        }
        function dateCalculation() {
            var mon3=document.getElementById("getMonth3").value;
            var day3=document.getElementById("getDay3").value;
            var year3=document.getElementById("getYear3").value;
            var t3 = Date.UTC(year3,mon3,day3);
            var daysInput=document.getElementById("daysInput").value;
		
            //validate the date input
            if (validDate(year3,mon3,day3,"starting")) {
                update();
                return;
            }
            // check that daysInput field is completed
            if (!daysInput) {
                alert("You must enter a number of days to add or subtract.\n" 
                + "Please complete this and try again.");
                update();
                return;
            }
            //validate the days input
            if (checkDaysInput(daysInput)) {
                update();
                return;
            }
            var t;
            //Add
            if(document.getElementById("add").checked==true) {
                t=addDays();
                convert(t);
            }
            //Subtract
            if(document.getElementById("subtract").checked==true) {
                t=subtractDays();
                convert(t);
            }
        }
        function addDays() {
            var mon3=document.getElementById("getMonth3").value;
            var day3=document.getElementById("getDay3").value;
            var year3=document.getElementById("getYear3").value;
            var t3 = Date.UTC(year3,mon3,day3,12);
            var t5 = new Date();
            var tDiff=t5.getTimezoneOffset()*60*1000;
            var daysAdd=document.getElementById("daysInput").value;
            var t4=(t3+(daysAdd*24*60*60*1000)+tDiff);
                t4 = new Date(t4);
            return t4;
        }
        function subtractDays() {
            var mon3=document.getElementById("getMonth3").value;
            var day3=document.getElementById("getDay3").value;
            var year3=document.getElementById("getYear3").value;
            var t3 = Date.UTC(year3,mon3,day3,12);
            var t5 = new Date();
            var tDiff=t5.getTimezoneOffset()*60*1000;
            var daysSubtract=document.getElementById("daysInput").value;
            var t4=(t3-(daysSubtract*24*60*60*1000)+tDiff);
                t4 = new Date(t4);
            return t4;
        }
        function convert(t) {
            var daysArray = new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
            var monthArray = new Array("Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec");
            var mon33=t.getMonth();
            var date33=t.getDate();
            var year33=t.getFullYear();
            var day33 = t.getDay();
                mon33 = monthArray[mon33];
                day33 = daysArray[day33];
            var endDate = mon33 + " " + date33 + ", " + year33 + "  " +day33;
            document.getElementById("endingDateID").value=endDate;
        }
        //set enter key
        function handleKeyPress(e){
            var key=e.keyCode || e.which;
            if (key==13){
                dateCalculation();
            }
        }
