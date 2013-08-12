var KeyboardListener = {
  createNew: function(sInputTextareaID,sResultContainerID) {
    var moNew={};
    

    var msTextareaID=sInputTextareaID;
    var msResultContainerID=sResultContainerID;
    var moTAO=TextareaOperation.createNew();
    
    moNew.mbTyping=false;
    moNew.mb

    moNew.listening = function(event) {
      event = event || window.event;
      var oEquDisplay=document.getElementById(msTextareaID);

      if (goCalculatorListener.mbClickOtherPlace || goCalculatorListener.mbInputFromButton) {
        goCalculatorListener.mbInputFromButton=false;
        oEquDisplay.style.backgroundColor=goCalculatorListener.msKeyboardInputColor;
        moTAO.highlightText(msTextareaID,goCalculatorListener.miInsertPoint,goCalculatorListener.miInsertPoint);
      }
      
      
      if (event.keyCode==13) {
        event.preventDefault();
        gdLastCalculateResult=goCalculate.run(oEquDisplay.value,msResultContainerID);
        goCalculatorListener.mdANS=gdLastCalculateResult;
        goCalculatorListener.msCalculationResult=document.getElementById(gsResultContainerID).innerHTML;
        goCalculatorListener.msCalculationEquation=document.getElementById(gsEquaitonContainerID).value;
        if (goCalculate.miWarningID!=2) {
          oEquDisplay.value=goCalculatorListener.optimizeOuterParentheses("("+oEquDisplay.value+")",false).optimizedString;
        }
        goCalculatorListener.miInsertPoint=oEquDisplay.value.length;
        moTAO.highlightText(msTextareaID,goCalculatorListener.miInsertPoint,goCalculatorListener.miInsertPoint);
      }
      else if (event.keyCode==27) {
        event.preventDefault(); clearAll(); goCalculatorListener.resetAllFlag();
      }
      
      
      moNew.mbTyping=true;
      goCalculatorListener.mbClickOtherPlace=false;
      
      
      if ((event.ctrlKey || event.metaKey) && event.keyCode==90) {
        event.preventDefault(); goUndo.undo();
      } else if ((event.ctrlKey || event.metaKey) && event.keyCode==89) {
        event.preventDefault(); goUndo.redo();
      } else {
        goUndo.push();
      }
    }
    
    
    return moNew;
  }
}

