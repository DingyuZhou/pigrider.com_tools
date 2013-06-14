var UndoRedo = {
  createNew: function(sInputTextareaID) {
    var moNew={};
    
    var oInput=document.getElementById(sInputTextareaID);
    var mnHistoryLength=50;      // 'mnHistoryLength' must be larger than 1. 
    var msHistory=new Array(mnHistoryLength);
    var miLastUndo=0,miCurrent=0,miLastRedo=0;
    msHistory[miCurrent]="";
    
    moNew.push = function() {
      var bStore=false;
      
      if (msHistory[miCurrent].length!=oInput.value.length) {
        bStore=true;
      } else {
        if (msHistory[miCurrent]!=oInput.value) {
          bStore=true;
        }
      }
      
      if (bStore) {
        ++miCurrent;
        if (miCurrent==mnHistoryLength) {
          miCurrent=0;
        }
        if (miCurrent==miLastUndo) {
          ++miLastUndo;
          if (miLastUndo==mnHistoryLength) {
            miLastUndo=0;
          }
        }
        miLastRedo=miCurrent;
        msHistory[miCurrent]=oInput.value;  
      }    
    }
    
    moNew.undo = function() {
      if (miCurrent!=miLastUndo) {
        --miCurrent;
        if (miCurrent<0) {
          miCurrent=mnHistoryLength-1;
        }
        oInput.value=msHistory[miCurrent];
      }
    } 
    
    moNew.redo = function() {
      if (miCurrent!=miLastRedo) {
        ++miCurrent;
        if (miCurrent==mnHistoryLength) {
          miCurrent=0;
        }
        oInput.value=msHistory[miCurrent];
      }
    }   
    
    return moNew;
  }
}
