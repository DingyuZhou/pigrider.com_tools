var gsInput;
var nASCII_LENGTH=128;
var gabOldDelimiter=new Array(nASCII_LENGTH);
var gcNewDelimiter;
var goDelimiterRegExp;
var goUndo;


function decodeCustomizedInput(sInput) {
  cSpecialChar=String.fromCharCode(7);
  oSpecialCharRegExp=new RegExp("\\7","g");
  return sInput.replace(/\\\\t/g,cSpecialChar).replace(/\\t/g,"\t").replace(oSpecialCharRegExp,"\\t")
    .replace(/\\\\r/g,cSpecialChar).replace(/\\r/g,"\r").replace(oSpecialCharRegExp,"\\r")
    .replace(/\\\\n/g,cSpecialChar).replace(/\\n/g,"\n").replace(oSpecialCharRegExp,"\\n");
}


function getNewDelimiter() {
  if (document.getElementById("newSpace").checked) {
    gcNewDelimiter=' ';
  } else if (document.getElementById("newTab").checked) {
    gcNewDelimiter='\t';
  } else if (document.getElementById("newNewline").checked) {
    gcNewDelimiter='\n';
  } else if (document.getElementById("newColon").checked) {
    gcNewDelimiter=':';
  } else if (document.getElementById("newSemicolon").checked) {
    gcNewDelimiter=';';
  } else if (document.getElementById("newComma").checked) {
    gcNewDelimiter=',';
  } else if (document.getElementById("newPeriod").checked) {
    gcNewDelimiter='.';
  } else if (document.getElementById("newCustomized").checked) {
    gcNewDelimiter=decodeCustomizedInput(document.getElementById("newCustomizedDelimiter").value);
  } 
}


function getOldDelimiter() {
  for (var ii=0; ii<gabOldDelimiter.length; ++ii) {
    gabOldDelimiter[ii]=false;
  }
  
  gsInput=document.getElementById("workingArea").value;
 
  var sDelimiter="[";
  if (document.getElementById("oldSpace").checked) {
    gabOldDelimiter[" ".charCodeAt(0)]=true;
    sDelimiter+="\\ ";
  } 
  if (document.getElementById("oldTab").checked) {
    gabOldDelimiter["\t".charCodeAt(0)]=true;
    sDelimiter+="\\t";
  } 
  if (document.getElementById("oldNewline").checked) {
    gsInput=gsInput.replace(/\r\n/g, "\n"); 
    gabOldDelimiter["\n".charCodeAt(0)]=true;
    sDelimiter+="\\n";
  } 
  if (document.getElementById("oldColon").checked) {
    gabOldDelimiter[":".charCodeAt(0)]=true;
    sDelimiter+=":";
  } 
  if (document.getElementById("oldSemicolon").checked) {
    gabOldDelimiter[";".charCodeAt(0)]=true;
    sDelimiter+=";";
  } 
  if (document.getElementById("oldComma").checked) {
    gabOldDelimiter[",".charCodeAt(0)]=true;
    sDelimiter+="\\,";
  } 
  if (document.getElementById("oldPeriod").checked) {
    gabOldDelimiter[".".charCodeAt(0)]=true;
    sDelimiter+="\\.";
  } 
  if (document.getElementById("oldCustomized").checked) {
    var sOldCustomizedDelimiter=decodeCustomizedInput(document.getElementById("oldCustomizedDelimiter").value);
    sOldCustomizedDelimiter=sOldCustomizedDelimiter.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    var oReg=new RegExp(sOldCustomizedDelimiter,"g");
    gsInput=gsInput.replace(oReg,String.fromCharCode(7));
    sDelimiter+="\\7";
    gabOldDelimiter[7]=true;
  }
  
  sDelimiter+="]";
  goDelimiterRegExp=new RegExp(sDelimiter,"g");
}


function isOldDelimiter(sChar) {
  var iCharCode=sChar.charCodeAt(0);
  if (iCharCode>=nASCII_LENGTH || iCharCode<0) {
    return false;
  } else {
    return gabOldDelimiter[iCharCode];
  }
}


function convertDelimiter() {
  goUndo.push();
  getNewDelimiter();
  getOldDelimiter();

  var bKeepEmptyLine=false;
  if (document.getElementById("oldNewline").checked) {
    bKeepEmptyLine=true;
  } else {
    if (document.getElementById("keepEmptyLine").checked) {
      bKeepEmptyLine=true;
    }
  }
  
  var bAddEndDelimiter=false;
  if (document.getElementById("keepAllDelimiter").checked) {
    if (bKeepEmptyLine) {
      document.getElementById("workingArea").value=gsInput.replace(goDelimiterRegExp,gcNewDelimiter);
    } else {
      var nInputLength=gsInput.length;
      var sResult="";
      var ic=0;
      var bKeepLine=false;
      var iLineStart=0;
      
      while (ic<nInputLength) {
        if (isOldDelimiter(gsInput.charAt(ic)) || gsInput.charAt(ic)=='\r') {
          ++ic;
        } else if (gsInput.charAt(ic)=='\n') {
          ++ic;
          if (bKeepLine) {
            sResult+=gsInput.substring(iLineStart,ic);
          }
          bKeepLine=false;
          iLineStart=ic;
        } else {
          bKeepLine=true;
          ++ic;
        }
      }
      if (bKeepLine) {
        sResult+=gsInput.substring(iLineStart,ic);
      }
      document.getElementById("workingArea").value=sResult.replace(goDelimiterRegExp,gcNewDelimiter);
    }
    return;
  } else {
    if (document.getElementById("addEndDelimiter").checked) {
      bAddEndDelimiter=true;
    }
  }
  
  var nInputLength=gsInput.length;
  var sResult="";
 
  var bWindowsNewLine=false;
  var bWord=false;
  var iWordStart=-1;
 
  var ic=0;
  while (ic<nInputLength) {
    if (isOldDelimiter(gsInput.charAt(ic))) {
      if (bWord) {
        if (bAddEndDelimiter) {
          sResult+=gsInput.substring(iWordStart,ic)+gcNewDelimiter;
          bWord=false;
          ++ic;
        } else {
          sResult+=gsInput.substring(iWordStart,ic);
          bWord=false;
          ++ic;
          while (ic<nInputLength) {
            if (isOldDelimiter(gsInput.charAt(ic))) {
              ++ic;
            } else if (gsInput.charAt(ic)=='\r' || gsInput.charAt(ic)=='\n') {
              break;
            } else {
              sResult+=gcNewDelimiter;
              iWordStart=ic;
              bWord=true;
              ++ic;
              break;
            }
          }
        }  
      } else {
        ++ic;
      }
    } else {
      if (gsInput.charAt(ic)=='\r') {
        bWindowsNewLine=true;
        ++ic;
      } else if (gsInput.charAt(ic)=='\n') {
        if (bWord) {
          if (bAddEndDelimiter) {
            sResult+=gsInput.substring(iWordStart,ic)+gcNewDelimiter;
          } else {
            sResult+=gsInput.substring(iWordStart,ic);
          }
          bWord=false;
        }
        if (bKeepEmptyLine || iWordStart>=0) {
          if (bWindowsNewLine) {
            sResult+="\r\n";
          } else {
            sResult+="\n";
          }
        }
        ++ic;
        while (ic<nInputLength) {
          if (isOldDelimiter(gsInput.charAt(ic)) || gsInput.charAt(ic)=='\r') {
            ++ic;
          } else if (gsInput.charAt(ic)=='\n') {
            if (bKeepEmptyLine) {
              break;
            } else {
              ++ic;
            }
          } else {
            iWordStart=ic;
            bWord=true;
            ++ic;
            break;
          }
        }
      } else {
        if (!bWord) {
          iWordStart=ic;
          bWord=true;
        }
        ++ic;
      }
    }
  }

  if (bWord) {
    if (bAddEndDelimiter) {
      sResult+=gsInput.substring(iWordStart)+gcNewDelimiter;
    } else {
      sResult+=gsInput.substring(iWordStart);
    }
  }
  
  document.getElementById("workingArea").value=sResult;
  goUndo.push();
}

