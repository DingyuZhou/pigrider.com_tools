window.onload=function() {
  document.getElementById("workingArea").value="";
  goUndo=UndoRedo.createNew("workingArea",10);
  
  document.getElementById("oldSpace").checked=true;
  document.getElementById("oldTab").checked=true;
  document.getElementById("oldNewline").checked=false;
  document.getElementById("oldColon").checked=false;
  document.getElementById("oldSemicolon").checked=false;
  document.getElementById("oldComma").checked=false;
  document.getElementById("oldPeriod").checked=false;
  document.getElementById("oldCustomized").checked=false;
  document.getElementById("oldCustomizedDelimiter").value="";
  
  document.getElementById("newTab").checked=true;
  document.getElementById("newCustomizedDelimiter").value="";
  
  document.getElementById("collapseDelimiter").checked=true;
  
  document.getElementById("deleteEmptyLine").disabled=false;
  document.getElementById("keepEmptyLine").disabled=false;
  document.getElementById("deleteEmptyLine").checked=true;
  
  document.getElementById("addEndDelimiter").disabled=false;
  document.getElementById("addEndDelimiter").checked=false;
};


addEvent(document.getElementById("oldNewline"), "change", function() { 
  if (document.getElementById("oldNewline").checked) {
    document.getElementById("deleteEmptyLine").checked=false;
    document.getElementById("keepEmptyLine").checked=false;
    document.getElementById("deleteEmptyLine").disabled=true;
    document.getElementById("keepEmptyLine").disabled=true;
  } else {
    document.getElementById("deleteEmptyLine").disabled=false;
    document.getElementById("keepEmptyLine").disabled=false;
    document.getElementById("deleteEmptyLine").checked=true;
  }
});


addEvent(document.getElementById("collapseDelimiter"), "change", function() {
  if (document.getElementById("collapseDelimiter").checked) {
    document.getElementById("addEndDelimiter").checked=false;
    document.getElementById("addEndDelimiter").disabled=false;
  }
});


addEvent(document.getElementById("keepAllDelimiter"), "change", function() {
  if (document.getElementById("keepAllDelimiter").checked) {
    document.getElementById("addEndDelimiter").checked=false;
    document.getElementById("addEndDelimiter").disabled=true;
  }
});


addEvent(document.getElementById("oldCustomizedDelimiter"), "click", function() {
  document.getElementById("oldCustomized").checked=true;
});


addEvent(document.getElementById("newCustomizedDelimiter"), "click", function() {
  document.getElementById("newCustomized").checked=true;
});


document.onkeydown=function(event) {
  if ((event.ctrlKey || event.metaKey) && event.keyCode==13) {
    convertDelimiter();
  }
  
  if (event.keyCode==27) {
    document.getElementById("workingArea").value="";
  }
  
  if ((event.ctrlKey || event.metaKey) && event.keyCode==90) {
    event.preventDefault(); goUndo.undo();
  } else if ((event.ctrlKey || event.metaKey) && event.keyCode==89) {
    event.preventDefault(); goUndo.redo();
  }
}
