var CalculatorButtonListener = {      // Define a class CalculatorButtonListener.
  createNew: function(sInputTextareaID,sResultContainerID) {      // Constructor.
    var moNew={};
    
    
    var moInsertP=FindInsertPoint.createNew();
    var moTAO=TextareaOperation.createNew();
    var msTextareaID=sInputTextareaID;
    var msResultContainerID=sResultContainerID;
    var mbScientificNum=false,mbPowNum=false,miPowNumStart,miPowNumEnd,mbAngleInDegree=false;
    var mbReplace=false,miReplaceStart,miReplaceEnd;
    var msMode="C", msRed="#fe1900", msWhite="#ffffff";
    var mbJustOperatedInEquationInputArea=false;
    var mhashStoredEquation = {};
    var iUniqueTag=0;
    

    // Public variable.
    moNew.msButtonInputColor="#f7c4c0";
    moNew.msKeyboardInputColor="#d9fbbe";
    moNew.mbJustCalculated=false;
    moNew.mbInputFromButton=true;     
    moNew.mbClickOtherPlace=false;
    moNew.miInsertPoint=0;
    moNew.mdANS="";
    moNew.msCalculationResult="";
    moNew.msCalculationEquation="";
    moNew.msSelectedEquation="";

    
    moNew.resetAllFlag = function() {
      gdLastCalculateResult=0.0;
      mbScientificNum=false;
      mbPowNum=false;
      mbReplace=false
      moNew.mbJustCalculated=false;
      moNew.mbInputFromButton=true;
      moNew.mbClickOtherPlace=false;
      moNew.miInsertPoint=0;
      moNew.msCalculationResult="";
      moNew.msCalculationEquation="";
      moNew.msSelectedEquation="";
    }
    

    moNew.equGenerator = function(event) {
      var oEvt=event || window.event;
      var oTarget=oEvt.target || oEvt.srcElement;
      var sElmId=oTarget.getAttribute('id');
      var sElmClass=oTarget.getAttribute('class');
      var oEquDisplay=document.getElementById(msTextareaID);
      var iTmp,oTmp,iIB,iIE,bHasParenthesis=false;
      var sStringEnd,sEquHead,sEquTail,nEquTailLength,bInsertAtEnd=true;     
      var oTASelect=moTAO.selectRange(msTextareaID);
                 
       
      if (sElmId===msTextareaID) {      // The mouse click the equation input textarea.
        mbScientificNum=false; mbPowNum=false;
        mbJustOperatedInEquationInputArea=true;
        moNew.mbJustCalculated=false;
        moNew.mbInputFromButton=false;
        moNew.mbClickOtherPlace=false;
        goKeyboardListener.mbTyping=false;
        oEquDisplay.style.backgroundColor=moNew.msKeyboardInputColor;
        return;
      } else if (sElmClass!==null && sElmClass.match(/^cb\w{3}B\d*$/)) {      // The mouse click the calculator buttons.
        // Get cursor position in the equation input textarea when last time input is not from the calculator button.
        if (mbJustOperatedInEquationInputArea || goKeyboardListener.mbTyping) {
          if (goKeyboardListener.mbTyping) {
            goUndo.push();
          }
          if (oTASelect.iSelectStart==oTASelect.iSelectEnd) {
            moNew.miInsertPoint=oTASelect.iSelectStart;
            mbPowNum=false;
            mbReplace=false;
          } else {
            mbReplace=true;
            miReplaceStart=oTASelect.iSelectStart;
            miReplaceEnd=oTASelect.iSelectEnd;
          }
          mbJustOperatedInEquationInputArea=false;
          goKeyboardListener.mbTyping=false;
        } 
        
        moNew.mbInputFromButton=true;
        moNew.mbClickOtherPlace=false;
        oEquDisplay.style.backgroundColor=moNew.msButtonInputColor;
        
        if (moNew.mbJustCalculated) {      // If just clicked the "=" button. 
          if (sElmClass.substring(0,6)!="cbCtrB" && sElmId!="cbCalculate") {
            moNew.mbJustCalculated=false;                   
            if (sElmId=="cbMulti" || sElmId=="cbDivi") {
              mbReplace=false;
              oEquDisplay.value="("+oEquDisplay.value+")";
              moNew.miInsertPoint=oEquDisplay.value.length;
            } else if (sElmId=="cbDEL" || sElmId=="cbAdd" || sElmId=="cbSub") {
              mbReplace=false;
              moNew.miInsertPoint=oEquDisplay.value.length;
            } else {              
              mbReplace=true;
              miReplaceStart=0;
              miReplaceEnd=oEquDisplay.value.length;
            }
          }
        }
      } else {      // The mouse click someother area.   
        // Set Flag.
        moNew.mbClickOtherPlace=true;
           
        // If click on "Store" button.
        if (sElmClass=="mcStoreB") {
          if (sElmId=="mcStoreResult") {
            storeResult();
          } else {
            if (mbJustOperatedInEquationInputArea || goKeyboardListener.mbTyping) {
              moNew.msSelectedEquation=oEquDisplay.value.substring(oTASelect.iSelectStart,oTASelect.iSelectEnd);
            }
            storeEquation();
          }
        } else if (sElmId.substring(0,8)=="scRecall") {      // If click on "Recall" button.
          var sRecall="";
          if (sElmId.charAt(sElmId.length-1)!='V') {
            switch (sElmId.substring(8,11)) {
            case "RmC":
              // Clear Hash.
              delete mhashStoredEquation[document.getElementById("scRecallEqu"+sElmId.substring(11)+"V").innerHTML];
              document.getElementById(gsStoreTableID).deleteRow(document.getElementById(sElmId).parentElement.parentElement.rowIndex);
              break;
            case "RmA":
              var oTable=document.getElementById(gsStoreTableID);
              for (var ii=oTable.rows.length-1; ii>0; --ii) {
                oTable.deleteRow(ii);
              }
              mhashStoredEquation={};      // Clear Hash Table.
              break;
            case "Res":      
              sRecall=document.getElementById(sElmId+"V").innerHTML;
              if (sRecall.charAt(0)=='-') {sRecall="("+sRecall+")";}
              break;
            case "Equ":      
              sRecall=moNew.optimizeOuterParentheses("("+document.getElementById(sElmId+"V").innerHTML+")",false).optimizedString;
              break;
            }
          } else {
            moNew.mbClickOtherPlace=false;
          }
          
          if (sRecall!="") {
            if (mbJustOperatedInEquationInputArea || goKeyboardListener.mbTyping) {      // Replace Or Insert.
              oEquDisplay.value=oEquDisplay.value.substring(0,oTASelect.iSelectStart)+sRecall+oEquDisplay.value.substring(oTASelect.iSelectEnd);
            } else {
              oEquDisplay.value=oEquDisplay.value.substring(0,moNew.miInsertPoint)+sRecall+oEquDisplay.value.substring(moNew.miInsertPoint);
            }
          }
        }
        
        // Add parentheses to protect just calculated equation.
        if (moNew.mbJustCalculated) {
          oEquDisplay.value=goCalculatorListener.optimizeOuterParentheses("("+oEquDisplay.value+")",false).optimizedString;
          moNew.mbJustCalculated=false;
          goUndo.push();
        }
        
        // Set Flags.
        moNew.miInsertPoint=oEquDisplay.value.length;        
        mbScientificNum=false; mbPowNum=false;
        moNew.mbInputFromButton=false;
        mbJustOperatedInEquationInputArea=false;
        goKeyboardListener.mbTyping=false;
        return;
      }           
      
      
      if (mbReplace) {      // If something is selected in the equation input textarea.
        bInsertAtEnd=false;
        sEquHead=oEquDisplay.value.substring(0,miReplaceStart);
        sEquTail=oEquDisplay.value.substring(miReplaceEnd);
      } else {
        if (moNew.miInsertPoint<oEquDisplay.value.length) {
          bInsertAtEnd=false;
          sEquHead=oEquDisplay.value.substring(0,moNew.miInsertPoint);
          sEquTail=oEquDisplay.value.substring(moNew.miInsertPoint);
        } else {
          moNew.miInsertPoint=oEquDisplay.value.length;
          sEquTail="";
        }
      }
      nEquTailLength=sEquTail.length;
      
    
      switch (sElmClass.substring(0,6)) {
      case "cbNumB": // Element Class
        if (mbReplace) {mbReplace=false;}
        
        var sNum;          
        switch (sElmId) {
        case "cbNum0":
          sNum="0"; break;
        case "cbNum1":
          sNum="1"; break;
        case "cbNum2":
          sNum="2"; break;
        case "cbNum3":
          sNum="3"; break;
        case "cbNum4":
          sNum="4"; break;
        case "cbNum5":
          sNum="5"; break;
        case "cbNum6":
          sNum="6"; break;
        case "cbNum7":
          sNum="7"; break;
        case "cbNum8":
          sNum="8"; break;
        case "cbNum9":
          sNum="9"; break;
        case "cbDot":
          sNum="."; break;
        }
        if (mbPowNum) {
          if (sElmId!="cbDot") {
            oEquDisplay.value=oEquDisplay.value.substring(0,miPowNumEnd)+sNum+oEquDisplay.value.substring(miPowNumEnd);
            ++miPowNumEnd;
          } else {
            mbPowNum=false;
          }
        } else {
          bInsertAtEnd ? oEquDisplay.value+=sNum : oEquDisplay.value=sEquHead+sNum+sEquTail;
        }
        
        moNew.miInsertPoint=oEquDisplay.value.length-nEquTailLength;
        moTAO.highlightText(msTextareaID,moNew.miInsertPoint,moNew.miInsertPoint);
        goUndo.push();
        break;
        
      case "cbCstB": // Element Class
        if (mbReplace) {mbReplace=false;}
        mbPowNum=false;
        
        switch (sElmId) {
        case "cbPi":
          bInsertAtEnd ? oEquDisplay.value+="Pi" : oEquDisplay.value=sEquHead+"Pi"+sEquTail;
          break;
        case "cbEulerN":
          bInsertAtEnd ? oEquDisplay.value+="ee" : oEquDisplay.value=sEquHead+"ee"+sEquTail;
          break;
        }
        
        moNew.miInsertPoint=oEquDisplay.value.length-nEquTailLength;
        moTAO.highlightText(msTextareaID,moNew.miInsertPoint,moNew.miInsertPoint);
        goUndo.push();
        break;
        
        
      case "cbOprB": // Element Class
        if (mbReplace && sElmId!="cbDEL") {mbReplace=false;}
        mbPowNum=false;
        var iPriorL, sOpr;
        
        switch (sElmId) {
        case "cbCalculate":
          gdLastCalculateResult=goCalculate.run(oEquDisplay.value,msResultContainerID);
          moNew.mdANS=gdLastCalculateResult;
          moTAO.highlightText(msTextareaID,0,oEquDisplay.value.length);
          moNew.mbJustCalculated=true;
          temporaryRecordCalculation(0,oEquDisplay.value.length);
          return;
        case "cbAC":
          clearAll();
          moNew.resetAllFlag();
          goUndo.push();
          return;
        case "cbAdd":
          iPriorL=0; sOpr="+";    
          break;
        case "cbSub":
          iPriorL=0; sOpr="-";
          break;
        case "cbMulti":
          iPriorL=1; sOpr="*";
          break;
        case "cbDivi":
          iPriorL=1; sOpr="/";
          break;
        case "cbParL":
          bInsertAtEnd ? oEquDisplay.value+="(" : oEquDisplay.value=sEquHead+"("+sEquTail;
          moNew.miInsertPoint=oEquDisplay.value.length-nEquTailLength;
          moTAO.highlightText(msTextareaID,moNew.miInsertPoint,moNew.miInsertPoint);
          goUndo.push();
          return;
        case "cbParR":
          if (bInsertAtEnd) {
            oEquDisplay.value+=")";
          } else {
            sEquHead+=")";
            oEquDisplay.value=sEquHead+sEquTail;
          }
          moNew.miInsertPoint=oEquDisplay.value.length-nEquTailLength; 
          iPriorL=2; sOpr="";
          break;
        case "cbDEL":
          if (mbReplace) {
            oEquDisplay.value=sEquHead+sEquTail;
            mbReplace=false;
          } else {
            oEquDisplay.value=oEquDisplay.value.substring(0,moNew.miInsertPoint-1)+sEquTail;
          }
          moNew.miInsertPoint=oEquDisplay.value.length-nEquTailLength;
          moTAO.highlightText(msTextareaID,moNew.miInsertPoint,moNew.miInsertPoint);
          goUndo.push();
          return;
        case "cbANS":
          if (moNew.mdANS<0) {
            bInsertAtEnd ? oEquDisplay.value+="("+moNew.mdANS+")" : oEquDisplay.value=sEquHead+"("+moNew.mdANS+")"+sEquTail;
          } else {
            bInsertAtEnd ? oEquDisplay.value+=moNew.mdANS : oEquDisplay.value=sEquHead+moNew.mdANS+sEquTail;
          }
          moNew.miInsertPoint=oEquDisplay.value.length-nEquTailLength;
          moTAO.highlightText(msTextareaID,moNew.miInsertPoint,moNew.miInsertPoint);
          goUndo.push();
          return;
        }
        
        if (bInsertAtEnd) {
          oTmp=moInsertP.lastAvailableArithmeticOperator(oEquDisplay,iPriorL,moNew.miInsertPoint);
          iIB=oTmp.iInsertBegin; iIE=oTmp.iInsertEnd;
          oEquDisplay.value+=sOpr;
        } else {
          oEquDisplay.value=sEquHead+sOpr+sEquTail;
        }
        moNew.miInsertPoint=oEquDisplay.value.length-nEquTailLength;
        if (moNew.miInsertPoint<oEquDisplay.value.length) {
          moTAO.highlightText(msTextareaID,moNew.miInsertPoint,moNew.miInsertPoint);
        } else {
          if (iIB>iIE) {return;}      // Avoid the program stuck when some wrong format input comes.
          gdLastCalculateResult=goCalculate.run(oEquDisplay.value.substring(iIB,iIE+1),msResultContainerID);
          moTAO.highlightText(msTextareaID,iIB,iIE+1);
          temporaryRecordCalculation(iIB,iIE+1);
        }
        goUndo.push();
        break;
        
        
      case "cbSOpB": // Element Class
        switch (sElmId) {
        case "cbNeg":
          if (msMode=="T") {      // For "Typing Mode".
            bInsertAtEnd ? oEquDisplay.value+="-" : oEquDisplay.value=sEquHead+"-"+sEquTail;
            moNew.miInsertPoint=oEquDisplay.value.length-nEquTailLength;
            moTAO.highlightText(msTextareaID,moNew.miInsertPoint,moNew.miInsertPoint);
            if (mbReplace) {mbReplace=false;}
            goUndo.push();
            return;
          }        
        
          if (mbPowNum && !mbReplace) {
            var cc=oEquDisplay.value.charAt(miPowNumStart);
            if (cc=='-') {
              oEquDisplay.value=oEquDisplay.value.substring(0,miPowNumStart)+oEquDisplay.value.substring(miPowNumStart+1);
            } else if (cc=='+') {
              oEquDisplay.value.charAt(miPowNumStart)='-';
            } else {
              oEquDisplay.value=oEquDisplay.value.substring(0,miPowNumStart)+"-"+oEquDisplay.value.substring(miPowNumStart);
            }
            moNew.miInsertPoint=oEquDisplay.value.length-nEquTailLength;      
          } else {
            if (mbReplace) {
              oTmp=moInsertP.trimmedPart(oEquDisplay,miReplaceStart,miReplaceEnd-1);
              iIB=oTmp.iStart; iIE=oTmp.iEnd;
              mbReplace=false;
            } else {
              var iPriority=mbScientificNum ? 3 : 2;
              oTmp=moInsertP.lastAvailableArithmeticOperator(oEquDisplay,iPriority,moNew.miInsertPoint);
              iIB=oTmp.iInsertBegin; iIE=oTmp.iInsertEnd;
            }
            var sTmp=oEquDisplay.value.substring(iIB,iIE+1);
            var oIsNum=isNumber(sTmp,3,false,true);
            if (oIsNum.bTorF) {
              if (oIsNum.sNumber.charAt(0)=='-') {
                sTmp=oIsNum.sNumber.substring(1);
              } else {
                sTmp="(-"+oIsNum.sNumber+")";
              }
            } else {
              var cj;
              for (var jj=0; jj<sTmp.length; ++jj) {      // Make sure it is not an empty string!
                cj=sTmp.charAt(jj);
                if (cj!='\ ' && cj!='\r' && cj!='\n' && cj!='\t') {
                  sTmp=moNew.optimizeOuterParentheses("(-("+sTmp+"))",false).optimizedString;
                  break;
                }
              }              
            }

            oEquDisplay.value=oEquDisplay.value.substring(0,iIB)+sTmp+sEquTail;
            iTmp=oEquDisplay.value.length-nEquTailLength;
            moNew.miInsertPoint=iTmp;
            gdLastCalculateResult=goCalculate.run(oEquDisplay.value.substring(iIB,iTmp),msResultContainerID);
            moTAO.highlightText(msTextareaID,iIB,iTmp);
            temporaryRecordCalculation(iIB,iTmp);
          }
          goUndo.push();
          return;
          
          
        case "cbEXP":
          if (mbReplace) {
            oEquDisplay.value=sEquHead+"E"+sEquTail;
            moNew.miInsertPoint=oEquDisplay.value.length-nEquTailLength;
            mbReplace=false;
            goUndo.push();
            return;
          }

          oTmp=moInsertP.lastAvailableArithmeticOperator(oEquDisplay,2,moNew.miInsertPoint);
          iIB=oTmp.iInsertBegin; iIE=oTmp.iInsertEnd;
          if (isNumber(oEquDisplay.value.substring(iIB,iIE+1),2,false,false).bTorF) {
            oEquDisplay.value=oEquDisplay.value.substring(0,iIE+1)+"E"+sEquTail;
            mbPowNum=true;
            miPowNumStart=iIE+2;
            miPowNumEnd=miPowNumStart;
          } else {            
            oTmp=moNew.optimizeOuterParentheses(oEquDisplay.value.substring(iIB,iIE+1),false);
            var oIsNum,sNum;
            if (oTmp.hasNegativeSign) {
              sNum=oTmp.optimizedString.substring(3,oTmp.optimizedString.length-2);
            } else {
              sNum=oTmp.optimizedString.substring(1,oTmp.optimizedString.length-1);
            }
            oIsNum=isNumber(sNum,2,true,true);
            if (oIsNum.bTorF) {
              if (oIsNum.sNumber.charAt(0)=='-') {
                oTmp.hasNegativeSign=!oTmp.hasNegativeSign;
                oIsNum.sNumber=oIsNum.sNumber.substring(1);
              }
                
              if (oTmp.hasNegativeSign) {
                oEquDisplay.value=oEquDisplay.value.substring(0,iIB)+"(-"+oIsNum.sNumber+"E)"+sEquTail;
                miPowNumStart=iIB+oIsNum.sNumber.length+3;
              } else {
                oEquDisplay.value=oEquDisplay.value.substring(0,iIB)+"("+oIsNum.sNumber+"E)"+sEquTail;
                miPowNumStart=iIB+oIsNum.sNumber.length+2;
              }
                
              mbPowNum=true;
              miPowNumEnd=miPowNumStart;
            }
          }
          
          moNew.miInsertPoint=oEquDisplay.value.length-nEquTailLength;
          goUndo.push();
          return;
        }
        break;   
       
        
      case "cbFunB": // Element Class
        mbPowNum=false;
        var sFuncStart;
        var bModeC=(msMode=="C");
        var sFuncInModeT="";
        
        if (mbReplace) {
          oTmp=moInsertP.trimmedPart(oEquDisplay,miReplaceStart,miReplaceEnd-1);
          iIB=oTmp.iStart; iIE=oTmp.iEnd;
        } else if (bModeC) {
          oTmp=moInsertP.lastAvailableArithmeticOperator(oEquDisplay,2,moNew.miInsertPoint);
          iIB=oTmp.iInsertBegin; iIE=oTmp.iInsertEnd;
        }
        
        if (bModeC) {
          if (!mbReplace && oEquDisplay.value.charAt(iIB)=='(' && oEquDisplay.value.charAt(iIE)==')') {
            bHasParenthesis=true;
          } else {
            bHasParenthesis=false;
          }
        }
        
        switch (sElmId.substring(0,5)) {
        case "cb_X2":
          sFuncStart="("; sStringEnd="^2)"; sFuncInModeT="^2";
          break;    
        case "cb_X3":
          sFuncStart="("; sStringEnd="^3)"; sFuncInModeT="^3";
          break;   
        case "cb_Ex":
          sFuncStart="(ee^"; sStringEnd=")"; sFuncInModeT="ee^";
          break;
        case "cb10x":
          sFuncStart="(10^"; sStringEnd=")"; sFuncInModeT="10^";
          break;   
        case "cb_Yx":
          if (!mbReplace && !bModeC) {
            oTmp=moInsertP.lastAvailableArithmeticOperator(oEquDisplay,2,moNew.miInsertPoint);
            iIB=oTmp.iInsertBegin; iIE=oTmp.iInsertEnd;
          }
          if (bModeC) {
            if (bHasParenthesis) {
              oEquDisplay.value=oEquDisplay.value.substring(0,iIE+1)+"^"+sEquTail;
            } else {
              oEquDisplay.value=oEquDisplay.value.substring(0,iIB)+"("+oEquDisplay.value.substring(iIB,iIE+1)+")^"+sEquTail;
            }
          } else {
            if (mbReplace) {
              oEquDisplay.value=oEquDisplay.value.substring(0,iIB)+"^"+sEquTail;
            } else {
              oEquDisplay.value=oEquDisplay.value.substring(0,iIE+1)+"^"+sEquTail;
            }
          }
          if (mbReplace) {mbReplace=false;}      // Turn off "mbReplace" if it is on.
          moNew.miInsertPoint=oEquDisplay.value.length-nEquTailLength;
          if (moNew.miInsertPoint<oEquDisplay.value.length) {
            moTAO.highlightText(msTextareaID,moNew.miInsertPoint,moNew.miInsertPoint);
          } else {
            gdLastCalculateResult=goCalculate.run(oEquDisplay.value.substring(iIB,moNew.miInsertPoint-1),msResultContainerID);
            moTAO.highlightText(msTextareaID,iIB,moNew.miInsertPoint-1);
            temporaryRecordCalculation(iIB,moNew.miInsertPoint-1);
          }
          goUndo.push();
          return;
        case "cbPct":
          sFuncStart="("; sStringEnd="%)"; sFuncInModeT="%";
          break;     
        case "cbSqt":
          sFuncStart="sqrt"; sStringEnd=""; sFuncInModeT="sqrt(";
          break;  
        case "cbCub":
          sFuncStart="("; sStringEnd="^(1/3))"; sFuncInModeT="^(1/3)";
          break;   
        case "cb_Ln":
          sFuncStart="ln"; sStringEnd=""; sFuncInModeT="ln(";
          break; 
        case "cbLog":
          sFuncStart="log"; sStringEnd=""; sFuncInModeT="log("
          break;
        case "cbRcp":
          sFuncStart="(1/"; sStringEnd=")"; sFuncInModeT="^(-1)";
          break;
        }
        
        if (bModeC) {
          if (!bHasParenthesis) {sFuncStart+="("; sStringEnd=")"+sStringEnd;}         
          if (mbReplace) {
            oEquDisplay.value=sEquHead+sFuncStart+oEquDisplay.value.substring(iIB,iIE+1)+sStringEnd+sEquTail;
            mbReplace=false;
          } else {
            oEquDisplay.value=oEquDisplay.value.substring(0,iIB)+sFuncStart+oEquDisplay.value.substring(iIB,iIE+1)+sStringEnd+sEquTail;
          }
          iIE=oEquDisplay.value.length-nEquTailLength;
          moNew.miInsertPoint=iIE;
          if (iIE<oEquDisplay.value.length) {
            moTAO.highlightText(msTextareaID,iIE,iIE);
          } else {
            gdLastCalculateResult=goCalculate.run(oEquDisplay.value.substring(iIB,iIE),msResultContainerID);
            moTAO.highlightText(msTextareaID,iIB,iIE);
            temporaryRecordCalculation(iIB,iIE);
          }
        } else {
          if (mbReplace) {
            oEquDisplay.value=sEquHead+sFuncInModeT+sEquTail;
            mbReplace=false;
          } else {
            oEquDisplay.value=oEquDisplay.value.substring(0,moNew.miInsertPoint)+sFuncInModeT+sEquTail;
          }
          moNew.miInsertPoint=oEquDisplay.value.length-nEquTailLength;
          moTAO.highlightText(msTextareaID,moNew.miInsertPoint,moNew.miInsertPoint);
        }
        goUndo.push();
        break;
        
        
      case "cbTriB": // Element Class
        mbPowNum=false;
        var sTriName;
        var bModeC=(msMode=="C");
        
        if (mbReplace) {
          oTmp=moInsertP.trimmedPart(oEquDisplay,miReplaceStart,miReplaceEnd-1);
          iIB=oTmp.iStart; iIE=oTmp.iEnd;
        } else if (bModeC) {
          oTmp=moInsertP.lastAvailableArithmeticOperator(oEquDisplay,2,moNew.miInsertPoint);
          iIB=oTmp.iInsertBegin; iIE=oTmp.iInsertEnd;
        }
        
        if (bModeC) {
          if (!mbReplace && oEquDisplay.value.charAt(iIB)=='(' && oEquDisplay.value.charAt(iIE)==')') {
            bHasParenthesis=true;
          } else {
            bHasParenthesis=false;
          }
        } else {
          bHasParenthesis=false;
        }
        

        if (sElmId.charAt(sElmId.length-1)=='1') {sElmId=sElmId.substring(0,sElmId.length-1);}
        switch (sElmId) {
        case "cbSin":
          if (mbAngleInDegree) {sTriName="sind";} else {sTriName="sin"};
          if (bHasParenthesis) {sStringEnd="";} else {sTriName+="("; sStringEnd=")";}
          break;
          
        case "cbCos":
          if (mbAngleInDegree) {sTriName="cosd";} else {sTriName="cos"};
          if (bHasParenthesis) {sStringEnd="";} else {sTriName+="("; sStringEnd=")";}
          break;
        
        case "cbTan":
          if (mbAngleInDegree) {sTriName="tand";} else {sTriName="tan"};
          if (bHasParenthesis) {sStringEnd="";} else {sTriName+="("; sStringEnd=")";}
          break;
          
        case "cbCsc":
          if (mbAngleInDegree) {sTriName="cscd";} else {sTriName="csc"};
          if (bHasParenthesis) {sStringEnd="";} else {sTriName+="("; sStringEnd=")";}
          break;
        
        case "cbSec":
          if (mbAngleInDegree) {sTriName="secd";} else {sTriName="sec"};
          if (bHasParenthesis) {sStringEnd="";} else {sTriName+="("; sStringEnd=")";}
          break;
        
        case "cbCot":
          if (mbAngleInDegree) {sTriName="cotd";} else {sTriName="cot"};
          if (bHasParenthesis) {sStringEnd="";} else {sTriName+="("; sStringEnd=")";}
          break;
        
        case "cbAsin":
          if (mbAngleInDegree) {sTriName="asind";} else {sTriName="asin"};
          if (bHasParenthesis) {sStringEnd="";} else {sTriName+="("; sStringEnd=")";}
          break;
        
        case "cbAcos":
          if (mbAngleInDegree) {sTriName="acosd";} else {sTriName="acos"};
          if (bHasParenthesis) {sStringEnd="";} else {sTriName+="("; sStringEnd=")";}
          break;
        
        case "cbAtan":
          if (mbAngleInDegree) {sTriName="atand";} else {sTriName="atan"};
          if (bHasParenthesis) {sStringEnd="";} else {sTriName+="("; sStringEnd=")";}
          break;
        
        case "cbAcsc":
          if (mbAngleInDegree) {sTriName="acscd";} else {sTriName="acsc"};
          if (bHasParenthesis) {sStringEnd="";} else {sTriName+="("; sStringEnd=")";}
          break;
        
        case "cbAsec":
          if (mbAngleInDegree) {sTriName="asecd";} else {sTriName="asec"};
          if (bHasParenthesis) {sStringEnd="";} else {sTriName+="("; sStringEnd=")";}
          break;
        
        case "cbAcot":
          if (mbAngleInDegree) {sTriName="acotd";} else {sTriName="acot"};
          if (bHasParenthesis) {sStringEnd="";} else {sTriName+="("; sStringEnd=")";}
          break;
          
        }
        
        if (mbReplace) {
          if (bModeC) {
            oEquDisplay.value=sEquHead+sTriName+oEquDisplay.value.substring(iIB,iIE+1)+sStringEnd+sEquTail;
          } else {
            oEquDisplay.value=sEquHead+sTriName+sEquTail;
          }
          mbReplace=false;        
        } else {
          if (bModeC) {
            oEquDisplay.value=oEquDisplay.value.substring(0,iIB)+sTriName+oEquDisplay.value.substring(iIB,iIE+1)+sStringEnd+sEquTail;
          } else {
            oEquDisplay.value=oEquDisplay.value.substring(0,moNew.miInsertPoint)+sTriName+sEquTail;
          }
        }
        
        iIE=oEquDisplay.value.length-nEquTailLength;
        moNew.miInsertPoint=iIE;
        if (bModeC) {
          if (iIE<oEquDisplay.value.length) {
            moTAO.highlightText(msTextareaID,iIE,iIE);
          } else {
            gdLastCalculateResult=goCalculate.run(oEquDisplay.value.substring(iIB,iIE),msResultContainerID);
            moTAO.highlightText(msTextareaID,iIB,iIE);
            temporaryRecordCalculation(iIB,iIE);
          }
        } else {
          moTAO.highlightText(msTextareaID,moNew.miInsertPoint,moNew.miInsertPoint);
        }
        goUndo.push();
        break;
        
        
      case "cbCtrB": // Element Class
        switch (sElmId) {
        case "cbDoR":
          var aoTriFunc=document.getElementsByClassName("cbTriB");
          var oDorRB=document.getElementById("cbDoR");
                    
          if (mbAngleInDegree) {
            oDorRB.innerHTML="Radian"; oDorRB.style.color=msWhite;
            for (var ii=0; ii<aoTriFunc.length; ++ii) {
              if (aoTriFunc[ii].innerHTML.charAt(4)=='<') {
                aoTriFunc[ii].innerHTML=aoTriFunc[ii].innerHTML.substring(0,4);  
              } else {
                aoTriFunc[ii].innerHTML=aoTriFunc[ii].innerHTML.substring(0,5);
              }
            }
            mbAngleInDegree=false;
          } else {
            oDorRB.innerHTML="Degree"; oDorRB.style.color=msRed;
            for (var ii=0; ii<aoTriFunc.length; ++ii) {
              aoTriFunc[ii].innerHTML+="<span id='"+aoTriFunc[ii].id+"1' class='cbTriB1' style='color:"+msRed+";'>d</span>";
            }
            mbAngleInDegree=true;
          }
          break;
          
        case "cbMode":
          var oDorRB=document.getElementById("cbMode");
                    
          if (msMode=="C") {
            oDorRB.innerHTML="Mode T"; oDorRB.style.color=msRed;
            msMode="T";
          } else {
            oDorRB.innerHTML="Mode C"; oDorRB.style.color=msWhite;
            msMode="C";
          }
          break;
          
        case "cbFoS":
          var oForS=document.getElementById("cbFoS");
          if (goCalculate.miPrintFormat==1) {
            goCalculate.miPrintFormat=2;
            oForS.innerHTML="Scientific"; oForS.style.color=msRed;
          } else {
            goCalculate.miPrintFormat=1;
            oForS.innerHTML="Fixed Point"; oForS.style.color=msWhite;
          }
          goCalculate.resultPrint(document.getElementById(msResultContainerID),gdLastCalculateResult);
          moNew.msCalculationResult=document.getElementById(msResultContainerID).innerHTML;
          break;
          
        case "cbUndo":
          goUndo.undo();
          break;
          
        case "cbRedo":
          goUndo.redo();
          break;
        }
        
        moNew.miInsertPoint=oEquDisplay.value.length;
        moTAO.highlightText(msTextareaID,moNew.miInsertPoint,moNew.miInsertPoint);
        break;
      }  
    }
    
    
    // 'iNumberType'=1, check if it is one integer in 'sStr'.
    // 'iNumberType'=2, check if it is one integer or one fixed point number in 'sStr'.
    // 'iNumberType'=3, check if it is one integer, one fixed point number or one scientific number in 'sStr'. 
    function isNumber(sStr,iNumberType,bTightFormatStr,bHasOuterParentheses) {
      if (!bTightFormatStr) {
        sStr=sStr.replace(/\ /g,"");
        sStr=sStr.replace(/\t/g,"");
        sStr=sStr.replace(/\r/g,"");
        sStr=sStr.replace(/\n/g,"");
      }
      
      var nDot=0,nEXP=0,nNum=0;
      var iStrLength=sStr.length;
      var oReturnValue={bTorF: false, sNumber: ""};
      if (iStrLength<=0) {return oReturnValue;}
      
      var ii=0,iNumStart=ii;
      if (bHasOuterParentheses) {
        if (sStr.charAt(0)=='(' && sStr.charAt(iStrLength-1)==')') {
          ++ii; --iStrLength; iNumStart=ii;
        }
      }
      
      var cc=sStr.charAt(ii);
      if (cc=='-') {
        ++ii;
      } else if (cc=='+') {      // Check if there is a negative or positive sign.
        ++ii; iNumStart=ii;
      }
      
      while (ii<iStrLength) {
        cc=sStr.charAt(ii);
        if ('0'<=cc && cc<='9') {
          ++nNum;
        } else if (cc=='.') {
          if (iNumberType>1) {
            ++nDot;
            if (nEXP==0 && nDot>1) {return oReturnValue;}
            if (nEXP>0 && nDot>0) {return oReturnValue;}
          } else {
            return false;
          }
        } else if (cc=='e' || cc=='E') {
          if (iNumberType>2) {
            ++nEXP;
            if (nEXP>1) {return oReturnValue;}
            if (nNum==0) {return oReturnValue;}
            nDot=0; nNum=0;
            if (ii+1<sStr.length) {
              var cPowSign=sStr.charAt(ii+1);
              if (cPowSign=='+' || cPowSign=='-') {++ii;}
            } else {
              return oReturnValue;
            }
          } else {
            return oReturnValue;
          }
        } else {
          return oReturnValue;
        }
        ++ii;
      }
      if (nNum==0) {return oReturnValue;}
      return {bTorF: true, sNumber: sStr.substring(iNumStart,iStrLength)};
    }

    
    moNew.optimizeOuterParentheses = function(sStr,bTightFormatStr) {
      if (!bTightFormatStr) {
        sStr=sStr.replace(/\ /g,"");
        sStr=sStr.replace(/\t/g,"");
        sStr=sStr.replace(/\r/g,"");
        sStr=sStr.replace(/\n/g,"");
      }
           
      var iStrLastChar=sStr.length-1;
      var cFirst=sStr.charAt(0); cLast=sStr.charAt(iStrLastChar);
      if (cFirst!='(' || cLast!=')') {
        return {
          optimizedString: "("+sStr+")",
          hasNegativeSign: false
        }
      }
      
      var iLeftPP=new Array();      // Left parenthesis position.
      var iRightPP=new Array();      // Right parenthesis position.
      var iL=new Array();
      var iR=new Array();
      var cc,nL=0,nR=0,iLP=-1;
      
      for (var ii=0; ii<=iStrLastChar; ++ii) {
        cc=sStr.charAt(ii);
        if (cc=='(') {
          iLeftPP[nL]=ii;
          ++nL; ++iLP;
          iL[iLP]=nL;
        } else if (cc==')') {
          iRightPP[nR]=ii;
          iR[nR]=iL[iLP];
          ++nR; --iLP;
        }
      }
      
      if (nL!=nR) {
        return {
          optimizedString: sStr,
          hasNegativeSign: false
        }
      }
      
      // Get the number of outer parentheses.
      var nOuterP=1,iTmp=iR[nR-1];
      if (iTmp!=1) {return sStr;}
      for (var ii=nR-2; ii>=0; --ii) {
        ++iTmp;
        if (iR[ii]==iTmp && iRightPP[ii]==iRightPP[ii+1]-1) {
          ++nOuterP;
        } else {
          break;
        }
      }
      
      var bNegSign=false,nOuterUselessP=nOuterP-1;
      for (var ii=0; ii<nOuterP-1; ++ii) {
        iTmp=iLeftPP[ii+1]-iLeftPP[ii];
        if (iTmp==2 && sStr.charAt(iLeftPP[ii]+1)=='-') {
          bNegSign=!bNegSign;
        } else if (iTmp!=1) {
          nOuterUselessP=ii;
          break;
        }
      }
      
      var iStart=iLeftPP[nOuterUselessP],iEnd=iRightPP[nR-1-nOuterUselessP];
      if (bNegSign) {
        return {
          optimizedString: "(-"+sStr.substring(iStart,iEnd+1)+")",
          hasNegativeSign: bNegSign
        }
      } else {
        return {
          optimizedString: sStr.substring(iStart,iEnd+1),
          hasNegativeSign: bNegSign
        }
      }
    }
    
    
    
    function temporaryRecordCalculation(iStart,iEnd) {
      moNew.msCalculationResult=document.getElementById(gsResultContainerID).innerHTML;
      moNew.msCalculationEquation=document.getElementById(gsEquaitonContainerID).value.substring(iStart,iEnd);
    }
    
    
    function storeResult() {
      if (moNew.msCalculationResult=="") {
        moNew.msCalculationResult="0.";
        moNew.msCalculationEquation="";
      }
        
      var oTable=document.getElementById(gsStoreTableID);
      
      if (moNew.msCalculationEquation in mhashStoredEquation) {
        oTable.deleteRow(mhashStoredEquation[moNew.msCalculationEquation].rowIndex);
      }
      
      var oRow=oTable.insertRow(1);
      mhashStoredEquation[moNew.msCalculationEquation]=oRow;
      ++iUniqueTag;
      var oResult=oRow.insertCell(-1);
      var oEqu=oRow.insertCell(-1);
      var oRemove=oRow.insertCell(-1);
  
      oResult.className="scResultCell";
      oResult.innerHTML="<pre id='scRecallRes"+iUniqueTag+"V'>"
        +moNew.msCalculationResult
        +"</pre><div class='scRecallBHeight'></div><button id='scRecallRes"+iUniqueTag+"' class='scRecallB'>Recall Result</button>";
      
      oEqu.className="scEquCell";          
      oEqu.innerHTML="<pre id='scRecallEqu"+iUniqueTag+"V'>"+moNew.msCalculationEquation
        +"</pre><div class='scRecallBHeight'></div><button id='scRecallEqu"+iUniqueTag+"' class='scRecallB'>Recall Equation</button>";
      
      oRemove.className="scRemoveCell";
      oRemove.innerHTML="<span id='scRecallRmC"+iUniqueTag+"' class='scRemoveTag'>Remove</span>";
    }
    
    
    function storeEquation() {
      var oTable=document.getElementById(gsStoreTableID);
      
      if (moNew.msSelectedEquation=="") {
        moNew.msSelectedEquation=document.getElementById(gsEquaitonContainerID).value;
      }
      
      if (moNew.msSelectedEquation in mhashStoredEquation) {
        oTable.deleteRow(mhashStoredEquation[moNew.msSelectedEquation].rowIndex);
      }
      
      var oRow=oTable.insertRow(1);
      mhashStoredEquation[moNew.msSelectedEquation]=oRow;
      ++iUniqueTag;
      var oResult=oRow.insertCell(-1);
      var oEqu=oRow.insertCell(-1);
      var oRemove=oRow.insertCell(-1);
      
      oResult.className="scResultCell";
      oResult.innerHTML="<pre id='scRecallRes"+iUniqueTag+"V'>"
        +"</pre><div class='scRecallBHeight'></div><button id='scRecallRes"+iUniqueTag+"' class='scRecallB'>Recall Result</button>";
      
      oEqu.className="scEquCell";
      oEqu.innerHTML="<pre id='scRecallEqu"+iUniqueTag+"V'>"+moNew.msSelectedEquation
        +"</pre><div class='scRecallBHeight'></div><button id='scRecallEqu"+iUniqueTag+"' class='scRecallB'>Recall Equation</button>";
      goCalculate.run(moNew.msSelectedEquation,"scRecallRes"+iUniqueTag+"V");
      
      oRemove.className="scRemoveCell";
      oRemove.innerHTML="<span id='scRecallRmC"+iUniqueTag+"' class='scRemoveTag'>Remove</span>";
      
      moNew.msSelectedEquation="";    
      var nStrLength=document.getElementById(gsEquaitonContainerID).value.length;
      moTAO.highlightText(msTextareaID,nStrLength,nStrLength);
    }
        
    
    
    return moNew;
  }  
}

