var UndoRedo = {
  createNew: function(sInputTextareaID,nHistoryLength) {
    if (nHistoryLength<1) {      // 'nHistoryLength' must be larger than 1.
      alert("Parameter 'nHistoryLength' for creating an instance of the UndoRedo class must be larger than 1.");
      return;
    }
    
    var moNew={};
    
    var oInput=document.getElementById(sInputTextareaID);
    var msHistory=new Array(nHistoryLength);
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
        if (miCurrent==nHistoryLength) {
          miCurrent=0;
        }
        if (miCurrent==miLastUndo) {
          ++miLastUndo;
          if (miLastUndo==nHistoryLength) {
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
          miCurrent=nHistoryLength-1;
        }
        oInput.value=msHistory[miCurrent];
      }
    } 
    
    moNew.redo = function() {
      if (miCurrent!=miLastRedo) {
        ++miCurrent;
        if (miCurrent==nHistoryLength) {
          miCurrent=0;
        }
        oInput.value=msHistory[miCurrent];
      }
    }   
    
    return moNew;
  }
}
