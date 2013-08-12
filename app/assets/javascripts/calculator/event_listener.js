window.onload=function() {
  document.getElementById("cbDigits").options[0].selected=true;
  document.getElementById("cbResult").innerHTML="0.";
  document.getElementById("cbEquation").value="";
}


var gsEquaitonContainerID="cbEquation", gsResultContainerID="cbResult";
var gsStoreTableID="scStoreTable";
var gdLastCalculateResult=0.0;


var goUndo=UndoRedo.createNew(gsEquaitonContainerID,50);
var goCalculate=StringCalculate.createNew();
var goCalculatorListener=CalculatorButtonListener.createNew(gsEquaitonContainerID,gsResultContainerID);
var goKeyboardListener=KeyboardListener.createNew(gsEquaitonContainerID,gsResultContainerID);


function clearAll()
{
  document.getElementById(gsEquaitonContainerID).value="";
  document.getElementById(gsResultContainerID).innerHTML="0.";
}


addEvent(document.getElementById("cbDigits"), "change", function() {
  var nDigits=document.getElementById("cbDigits").selectedIndex-1;
  goCalculate.miPrintDigits=nDigits;
  goCalculate.resultPrint(document.getElementById(gsResultContainerID),gdLastCalculateResult);
  goCalculatorListener.msCalculationResult=document.getElementById(gsResultContainerID).innerHTML;  
});
          

document.onclick=goCalculatorListener.equGenerator;
document.onkeydown=goKeyboardListener.listening;

