function getTextAreaValue(selectId, selectDelimiter)
{ 
  var objSel = document.getElementById(selectId);
  var oDelimiter = document.getElementById(selectDelimiter);

  var iSpaceAmount = 0;
  iSpaceAmount = objSel.value;

  var sDelimiter = oDelimiter.value;
  
  document.getElementById('output1').value='';
  var aLines = new Array();
  var aWordLength = new Array();
  var aPos = new Array();
  var aLines = document.getElementById('input1').value.split('\n');

  
  var iWordLength = 0;
  var iWordLengthIdx = 0;
  var bWordStart = false;
  var iPos = 0;
  var iWordPosIdx = 0;

  var iRow;
  var iCol;

  var aEmptyLine = new Array();

  for(var i = 0; i < aLines.length; ++i){
    aLines[i] = trimStr(aLines[i]);
    aLines[i] = aLines[i].replace(/[\t*]/g," ");
    aLines[i] = aLines[i].replace(/[\s*]/g," ");
  }

  for(var i = 0; i < aLines.length; ++i){
    aEmptyLine[i] = true;
    for(var j = 0; j < aLines[i].length; ++j){
      if(aLines[i].charAt(j) == ' '){
        continue;
      }
      else{
        aEmptyLine[i] = false;
      }
    }
  }

  for(var i = 0; i < aLines.length; ++i)
  {
    if(aEmptyLine[i] == true){
      continue;
    }
      /* parse each line and calculate the length of each word */
      for (var j = 0; j < aLines[i].length; ++j) 
      {       
        if(aLines[i].charAt(j) == sDelimiter){
          if(bWordStart){
            aWordLength[iWordLengthIdx] = j - aPos[iWordPosIdx-1];
            ++iWordLengthIdx;
            bWordStart = false;
          }
        }
        else 
        {
          if (!bWordStart) {
            aPos[iWordPosIdx] = j;
            ++iWordPosIdx;
          }
          bWordStart = true;
        }
      }

      if (bWordStart) 
      {
        bWordStart = false;
        aWordLength[iWordLengthIdx] = j - aPos[iWordPosIdx-1];
        ++iWordLengthIdx;
      }

      if(i == 0)
      { 
        iCol = aWordLength.length;
      }
  }

  iRow = aLines.length;
  var iWordIndex = 0;

  /* Record the length of each word and store them in a two-dimension array*/
  var aInputLength = new Array();
  for (var i = 0; i < iRow; ++i) {
    aInputLength[i] = new Array();
    if(aEmptyLine[i]==true){
      continue;
    }
    for (var j = 0; j < iCol; ++j) {
      aInputLength[i][j] = aWordLength[iWordIndex];
      ++iWordIndex;
    };
  };

  /* Record the beginning position of each word and store them in a two-dimension array*/
  var iPosIndex = 0;
  var aInputPos = new Array();
  for (var i = 0; i< iRow; ++i){
    aInputPos[i] = new Array();
    if(aEmptyLine[i]==true){
      continue;
    }
    for(var j = 0; j < iCol; ++j){
      aInputPos[i][j] = aPos[iPosIndex];
      ++iPosIndex;
    }
  }

  /* Initiate ColMax Array which records the maxium length in each column*/
  var aColMax = new Array(iCol);
  for (var i = 0; i < aColMax.length; i++) {
    aColMax[i] = 0;
  };

  /* Compare all fields with the maximum length in that column, if it is large than maximum, set it as maximum*/
  for (var i = 0; i < iRow; ++i) {
    for (var j = 0; j < iCol; ++j) {
      if(aInputLength[i][j] > aColMax[j]){
        aColMax[j] = aInputLength[i][j];
      }
    };
  };

  
  /* calculate how many spaces that need to add between two fields and put the organized code into a new array*/
  var sSpace = "";

  var iExtraSpace = 4;

  // get extra space amount from drop down menu
  var iExtraSpace = iSpaceAmount;

  var iDeltaSpace = 0;
  var aNewLines = new Array(aLines.length);
  var total=0;
  for(var i = 0; i < iRow; ++i){
    aNewLines[i] = "";
    for (var j = 0; j < iCol; ++j){
      iDeltaSpace = aColMax[j] - aInputLength[i][j];
      total = parseInt(iDeltaSpace) + parseInt(iExtraSpace);

      sSpace = addExtraSpace(total, sDelimiter);
      aNewLines[i] += aLines[i].substr(aInputPos[i][j], aInputLength[i][j]) + sSpace;
    }
  }

  /* Display the aligned code in output textarea */
  for(var i = 0; i < aNewLines.length; ++i){
    aNewLines[i] = trimStr(aNewLines[i])
    document.getElementById('output1').value += aNewLines[i] + '\n';
  }
    
} 

/* Append some extra spaces to each field, the num is the total space count that add to */
function addExtraSpace(num, delimiter){
  var sSpace = delimiter;
  for(var i = 0; i < num; ++i){
    sSpace += " ";
  }
  return sSpace;
}

/* Clear input and output textarea */
function clearTextArea()
{
  document.getElementById('input1').value='';
  document.getElementById('output1').value='';
}

/* When you focus in the input textarea, 'Copy your code here.' will disappear and you can copy the code in that area  */
var c = 'Copy your code here.';
function on_focus(obj){
    obj.value = obj.value == (!!arguments[1]?arguments[1]:c)?'':obj.value;
} 
        
function on_blur(obj)
{
    obj.value = obj.value == ''?(!!arguments[1]?arguments[1]:c):obj.value;
}

/* Remove the space and tab at the front and end of each line */
function trimStr(str)
{
  str = str.replace(/(^\s*)|(\s*$)/g,"");
  return str.replace(/(^\t*)|(\t*$)/g,"");
}