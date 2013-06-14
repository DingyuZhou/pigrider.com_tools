function getTime() {
  var tLocalTime=new Date();
  var nHourUTCOffset=tLocalTime.getTimezoneOffset()/60;
  var iLocalYear=tLocalTime.getFullYear();
  var iLocalHour=tLocalTime.getHours();
  var iLocalMinute=tLocalTime.getMinutes();
  var iUTCHour=iLocalHour+nHourUTCOffset;
  var sEnding=":"+makeUpZero(iLocalMinute);

  
  // Check if it is Daylight Savings Time for US.
  // US Daylight Saving Time begins at 2 a.m. on the second Sunday of March
  // US Daylight Saving Time ends at 2 a.m. on the first Sunday of November
  var bUsaDST=false;
  var tStartUsaDST=new Date("March 14, "+iLocalYear+" 02:00:00"); // 2nd Sunday in March can't occur after the 14th 
  var tEndUsaDST=new Date("November 07, "+iLocalYear+" 02:00:00"); // 1st Sunday in November can't occur after the 7th
  var nWeekDay=tStartUsaDST.getDay(); // day of week of 14th
  tStartUsaDST.setDate(14-nWeekDay); // Calculate 2nd Sunday in March of this year
  nWeekDay=tEndUsaDST.getDay(); // day of the week of 7th
  tEndUsaDST.setDate(7-nWeekDay); // Calculate first Sunday in November of this year
  if (tLocalTime>=tStartUsaDST && tLocalTime<tEndUsaDST) {
    bUsaDST=true;
  }
  
  
  // Check if it is Daylight Savings Time for Europe.
  // Europe Summer Time (Daylight Saving) Begins at 1 a.m. GMT on the last Sunday of March
  // Europe Summer Time (Daylight Saving) Ends at 1 a.m. GMT on the last Sunday of October
  var bEuroDST=false;
  var tStartEuroDST=new Date("March 31, "+iLocalYear+" 01:00:00"); // First set the last day in March 
  var tEndEuroDST=new Date("October 31, "+iLocalYear+" 01:00:00"); // First set the last day in October
  var nWeekDay=tStartEuroDST.getDay(); // day of week of 31st
  tStartEuroDST.setDate(31-nWeekDay); // Calculate the last Sunday in March of this year
  nWeekDay=tEndEuroDST.getDay(); // day of the week of 31st
  tEndEuroDST.setDate(31-nWeekDay); // Calculate the last Sunday in October of this year
  if (tLocalTime>=tStartEuroDST && tLocalTime<tEndEuroDST) {
    bEuroDST=true;
  }

  
  document.getElementById("tLocalTime").innerHTML=printHour(iLocalHour)+sEnding+":"+makeUpZero(tLocalTime.getSeconds());

  document.getElementById("tCairo").innerHTML=printHour(iUTCHour+2)+sEnding;
  document.getElementById("tMsw").innerHTML=printHour(iUTCHour+4)+sEnding;
  
  // The timezone of New Delhi is UTC+5:30
  iLocalMinute+=30;
  document.getElementById("tDel").innerHTML=printHour(iUTCHour+5+Math.floor(iLocalMinute/60))+":"+makeUpZero(iLocalMinute%60);
  
  document.getElementById("tKok").innerHTML=printHour(iUTCHour+7)+sEnding;
  document.getElementById("tHo").innerHTML=printHour(iUTCHour+8)+sEnding;
  document.getElementById("tTky").innerHTML=printHour(iUTCHour+9)+sEnding;
  document.getElementById("tSdn").innerHTML=printHour(iUTCHour+10)+sEnding;
  document.getElementById("tHawaii").innerHTML=printHour(iUTCHour+14)+sEnding;
  document.getElementById("tAtl").innerHTML=printHour(iUTCHour+20)+sEnding;
  document.getElementById("tBra").innerHTML=printHour(iUTCHour+21)+sEnding;
  document.getElementById("tMid").innerHTML=printHour(iUTCHour+22)+sEnding;

  var iDSTHourUTC=iUTCHour;
  var sDSTEnding="";
  if (bUsaDST) {
    iDSTHourUTC=iUTCHour+1;
    sDSTEnding=" <span style='font-size:11px'>(DST)</span>";
  }
  document.getElementById("tAlaska").innerHTML=printHour(iDSTHourUTC+15)+sEnding+sDSTEnding;
  document.getElementById("tPacif").innerHTML=printHour(iDSTHourUTC+16)+sEnding+sDSTEnding;
  document.getElementById("tMount").innerHTML=printHour(iDSTHourUTC+17)+sEnding+sDSTEnding;
  document.getElementById("tCenter").innerHTML=printHour(iDSTHourUTC+18)+sEnding+sDSTEnding;
  document.getElementById("tEast").innerHTML=printHour(iDSTHourUTC+19)+sEnding+sDSTEnding;
  
  iDSTHourUTC=iUTCHour;
  sDSTEnding="";
  if (bEuroDST) {
    iDSTHourUTC=iUTCHour+1;
    sDSTEnding=" <span style='font-size:11px'>(DST)</span>";
  }
  document.getElementById("tUTC").innerHTML=printHour(iDSTHourUTC)+sEnding+sDSTEnding;
  document.getElementById("tBerlin").innerHTML=printHour(iDSTHourUTC+1)+sEnding+sDSTEnding;


  setTimeout("getTime()", 1000);
}


function makeUpZero(iNum) {
  return iNum<=9 ? "0"+iNum : iNum;
}


function printHour(iHour) {
  iHour=iHour%24;
  return iHour<=9 ? "0"+iHour : iHour;
}


(function () {
  getTime();
})();
