var StringCalculate = {
  createNew: function() {
    var moNew={};
    
    
    var masEquPart=new Array();
    var maiPartType=new Array();
    var madNum=new Array();
    var mnPart,miPb,miPp,miPf;
    var msWarning="",mdResult;
    moNew.miWarningID=0;   // 0 stands for no warning; 1 stands for "Carriage return in a number!!"; 2 stands for "Missing )".
    var maiPtf=new Array(),maiPtb=new Array(),miPtf0,miPtb0;
    
    
    moNew.miPrintFormat=1;
    moNew.miPrintDigits=-1;
    var mnMaxDigits=10;
    // moNew.miPrintFormat=1 means fixed point format. moNew.miPrintFormat=2 means scientific format.
    // moNew.miPrintDigits<0 means use default number of digits.
    moNew.resultPrint = function(oResultDisplayContainer,dResult) {
      if (moNew.miPrintDigits>mnMaxDigits) {moNew.miPrintDigits=mnMaxDigits;}
      var bDefault=(moNew.miPrintDigits<0);
      var dAbsR=Math.abs(dResult);
      var nAllowedDigitsBeforeDot=bDefault ? mnMaxDigits+1 : mnMaxDigits+1-moNew.miPrintDigits;
      var dUpLimit=Math.pow(10,nAllowedDigitsBeforeDot);
      var sDisplay="";
      if ((dAbsR<Math.pow(10,-mnMaxDigits) && dAbsR!=0.) || dAbsR>=dUpLimit || moNew.miPrintFormat==2) {
        if (bDefault) {
          sDisplay=""+dResult.toExponential(mnMaxDigits).toUpperCase();
          var iE=sDisplay.length-1,iN;
          while (iE>=0) {
            if (sDisplay.charAt(iE)=='E') {
              break;
            }
            --iE;
          }
          iN=iE-1;
          while (iN>=0) {
            if (sDisplay.charAt(iN)!='0') {
              break;
            }
            --iN;
          }
          if (sDisplay.charAt(iN)=='.') {--iN;}
          sDisplay=sDisplay.substring(0,iN+1)+sDisplay.substring(iE);
        } else {
          sDisplay=dResult.toExponential(moNew.miPrintDigits).toUpperCase();
        }
        sDisplay+=msWarning;
      } else if (moNew.miPrintFormat==1) {
        if (bDefault) {
          var nAllowedDigitsAfterDot=mnMaxDigits;
          if (dAbsR>1) {
            nAllowedDigitsAfterDot=mnMaxDigits-Math.floor(Math.log(dAbsR)/Math.log(10));
          }
          sDisplay=""+dResult.toFixed(nAllowedDigitsAfterDot);
          if (nAllowedDigitsAfterDot==0) {sDisplay+=".";}
          var iN=sDisplay.length-1;
          while (iN>=0) {
            if (sDisplay.charAt(iN)!='0') {
              break;
            }
            --iN;
          }
          sDisplay=sDisplay.substring(0,iN+1);
        } else {
          sDisplay=dResult.toFixed(moNew.miPrintDigits);
        }
        sDisplay+=msWarning;
      }

      if (oResultDisplayContainer.type=="text" || oResultDisplayContainer.type=="textarea") {
        oResultDisplayContainer.value=sDisplay;
      } else if ("innerHTML" in oResultDisplayContainer) {
        oResultDisplayContainer.innerHTML=sDisplay;
      } 
    }
    
    
    moNew.run = function(sEqu,sResultDisplayContainerID) {
      oResultDisplayContainer=document.getElementById(sResultDisplayContainerID);
      mnPart=0;
      msWarning=""; moNew.miWarningID=0; mdResult=0.0;  
      
      // It's on purpose to replace '\ ' first, and then replace '\r' and '\n'.
      // This replace order is used to check if a number is seperated by several lines.
      sEqu=sEqu.replace(/\ /g,"");
      sEqu=sEqu.replace(/\t/g,"");
      sEqu=sEqu.replace(/\r/g," ");
      sEqu=sEqu.replace(/\n/g," ");
      sEqu=sEqu.toLowerCase();
      
      var cc,cct,cctt,EL=sEqu.length-1;
      var ic;
      var icStore,Parenthesis;
      var dot,plus,minus,beforeE,ii,jj;
      var HaveParenthesis=0,ParPosi=new Array();;
      
      ic=1;
      while(ic<EL)
      {
        if (sEqu.charAt(ic)==' ')
        {
          cc=sEqu.charAt(ic-1);
          if ((cc>='0' && cc<='9') || cc=='.')
          {
            for (ii=ic+1; ii<=EL; ii++) {icStore=ii; if (sEqu.charAt(ii)!=' ') {break;}}
            ic=icStore;
            cc=sEqu.charAt(ic);
            if ((cc>='0' && cc<='9') || cc=='.')
            {
              msWarning=msWarning+"<br />Warning: Carriage return in a number!!";
              moNew.miWarningID=1;
              break;
            }
          }
        }
        ic++;
      }
      sEqu=sEqu.replace(/\ /g,"");     
        
        
      EL=sEqu.length-1;
      if (EL<0) {      // If the string is only made by spacing characters, return 0.0
        mdResult=0.0; moNew.resultPrint(oResultDisplayContainer,mdResult);
        return mdResult;
      }
      
      
      ic=0; icStore=0; Parenthesis=0;
      cc=sEqu.charAt(ic);
      if (cc=='=') {
        ic++;
      } else if (cc=='+' || cc=='*' || cc=='/' || cc=='^' || cc=='%' || cc==')') {
        inpErr(oResultDisplayContainer,"Cannot Start with the Operator: "+cc); return;
      } else if (cc=='-') {
        masEquPart[mnPart]="-";
        maiPartType[mnPart]=2;
        mnPart++;
        ic++;
      }
      
      while (ic<=EL) {
        cc=sEqu.charAt(ic);
        switch (cc) {
        case 'a':
          var sTmp5=sEqu.substr(ic,5),sTmp4=sEqu.substr(ic,4);
          if (sEqu.substr(ic,3)=="abs") {masEquPart[mnPart]="abs"; ic=ic+3;}
          else if (sTmp5=="acosd") {masEquPart[mnPart]="acosd"; ic=ic+5;}
          else if (sTmp5=="asind") {masEquPart[mnPart]="asind"; ic=ic+5;}
          else if (sTmp5=="atand") {masEquPart[mnPart]="atand"; ic=ic+5;}
          else if (sTmp5=="acotd") {masEquPart[mnPart]="acotd"; ic=ic+5;}
          else if (sTmp5=="asecd") {masEquPart[mnPart]="asecd"; ic=ic+5;}
          else if (sTmp5=="acscd") {masEquPart[mnPart]="acscd"; ic=ic+5;}
          else if (sTmp4=="acos") {masEquPart[mnPart]="acos"; ic=ic+4;}
          else if (sTmp4=="asin") {masEquPart[mnPart]="asin"; ic=ic+4;}
          else if (sTmp4=="atan") {masEquPart[mnPart]="atan"; ic=ic+4;}
          else if (sTmp4=="acot") {masEquPart[mnPart]="acot"; ic=ic+4;}
          else if (sTmp4=="asec") {masEquPart[mnPart]="asec"; ic=ic+4;}
          else if (sTmp4=="acsc") {masEquPart[mnPart]="acsc"; ic=ic+4;}
          else {inpErr(oResultDisplayContainer,"Wrong Input: "+sTmp5); return;}
          maiPartType[mnPart]=6;
          mnPart++;
          break;
          
        case 'c':
          if (sEqu.substr(ic,4)=="cosd") {masEquPart[mnPart]="cosd"; ic=ic+4;}
          else if (sEqu.substr(ic,4)=="cotd") {masEquPart[mnPart]="cotd"; ic=ic+4;}
          else if (sEqu.substr(ic,4)=="cscd") {masEquPart[mnPart]="cscd"; ic=ic+4;}
          else if (sEqu.substr(ic,3)=="cos") {masEquPart[mnPart]="cos"; ic=ic+3;}
          else if (sEqu.substr(ic,3)=="cot") {masEquPart[mnPart]="cot"; ic=ic+3;}
          else if (sEqu.substr(ic,3)=="csc") {masEquPart[mnPart]="csc"; ic=ic+3;}
          else {inpErr(oResultDisplayContainer,"Wrong Input: "+sEqu.substr(ic,4)); return;}
          maiPartType[mnPart]=6;
          mnPart++;
          break;
          
        case 'e':
          if (sEqu.substr(ic,2)=="ee")
          {
            masEquPart[mnPart]="ee"; madNum[mnPart]=Math.E;
            maiPartType[mnPart]=0; mnPart++;
            cct=sEqu.charAt(ic+2);
            if (cct=='(')
            {
              masEquPart[mnPart]="*"; maiPartType[mnPart]=3; mnPart++;
            }
            else if (cct=='.' || (cct>='0' && cct<='9') || (cct>='a' && cct<='z')) {inpErr(oResultDisplayContainer,"Wrong Input: "+sEqu.substr(ic,3)); return;}
            ic=ic+2;
          }
          else if (sEqu.substr(ic,3)=="exp") {masEquPart[mnPart]="exp"; ic=ic+3; maiPartType[mnPart]=6; mnPart++;}
          else {inpErr(oResultDisplayContainer,"Wrong Input: "+sEqu.substr(ic,3)); return;}
          break;
          
        case 'l':
          if (sEqu.substr(ic,3)=="log") {masEquPart[mnPart]="log"; ic=ic+3;}
          else if (sEqu.substr(ic,2)=="ln") {masEquPart[mnPart]="ln"; ic=ic+2;}
          else {inpErr(oResultDisplayContainer,"Wrong Input: "+sEqu.substr(ic,3)); return;}
          maiPartType[mnPart]=6;
          mnPart++;
          break;
          
        case 's':
          if (sEqu.substr(ic,4)=="sqrt") {masEquPart[mnPart]="sqrt"; ic=ic+4;}
          else if (sEqu.substr(ic,4)=="sind") {masEquPart[mnPart]="sind"; ic=ic+4;}
          else if (sEqu.substr(ic,4)=="secd") {masEquPart[mnPart]="secd"; ic=ic+4;}
          else if (sEqu.substr(ic,3)=="sin") {masEquPart[mnPart]="sin"; ic=ic+3;}
          else if (sEqu.substr(ic,3)=="sec") {masEquPart[mnPart]="sec"; ic=ic+3;}
          else {inpErr(oResultDisplayContainer,"Wrong Input: "+sEqu.substr(ic,4)); return;}
          maiPartType[mnPart]=6;
          mnPart++;
          break;
          
        case 't':
          if (sEqu.substr(ic,4)=="tand") {masEquPart[mnPart]="tand"; ic=ic+4;}
          else if (sEqu.substr(ic,3)=="tan") {masEquPart[mnPart]="tan"; ic=ic+3;}    
          else {inpErr(oResultDisplayContainer,"Wrong Input: "+sEqu.substr(ic,4)); return;}
          maiPartType[mnPart]=6;
          mnPart++;
          break;
          
        case 'p':
          if (sEqu.substr(ic,2)=="pi") 
          {
            masEquPart[mnPart]="pi"; madNum[mnPart]=Math.PI;
            maiPartType[mnPart]=0; mnPart++;
            cct=sEqu.charAt(ic+2);
            if (cct=='(')
            {
              masEquPart[mnPart]="*"; maiPartType[mnPart]=3; mnPart++;
            }
            else if (cct=='.' || (cct>='0' && cct<='9') || (cct>='a' && cct<='z')) {inpErr(oResultDisplayContainer,"Wrong Input: "+sEqu.substr(ic,3)); return;}
            ic=ic+2;
          }
          else {inpErr(oResultDisplayContainer,"Wrong Input: "+sEqu.substr(ic,2)); return;}
          break;
          
        case '+':
          if (checkOp(sEqu.charAt(ic+1))) {inpErr(oResultDisplayContainer,"Wrong Input: "+sEqu.substr(ic,2)); return;}
          masEquPart[mnPart]="+"; maiPartType[mnPart]=1; mnPart++; ic++;
          break;
          
        case '-':
          if (checkOp(sEqu.charAt(ic+1))) {inpErr(oResultDisplayContainer,"Wrong Input: "+sEqu.substr(ic,2)); return;}
          masEquPart[mnPart]="-"; 
          if (sEqu.charAt(ic-1)=='(') {maiPartType[mnPart]=2;}
          else {maiPartType[mnPart]=1;} 
          mnPart++; ic++;
          break;
          
        case '*':
          if (checkOp(sEqu.charAt(ic+1))) {inpErr(oResultDisplayContainer,"Wrong Input: "+sEqu.substr(ic,2)); return;}
          masEquPart[mnPart]="*"; maiPartType[mnPart]=3; mnPart++; ic++;
          break;
          
        case '/':
          if (checkOp(sEqu.charAt(ic+1))) {inpErr(oResultDisplayContainer,"Wrong Input: "+sEqu.substr(ic,2)); return;}
          masEquPart[mnPart]="/"; maiPartType[mnPart]=3; mnPart++; ic++;
          break;
          
        case '^':
          if (checkOp(sEqu.charAt(ic+1))) {inpErr(oResultDisplayContainer,"Wrong Input: "+sEqu.substr(ic,2)); return;}
          masEquPart[mnPart]="^"; maiPartType[mnPart]=4; mnPart++; ic++;
          break;
          
        case '%':
          masEquPart[mnPart]="%"; maiPartType[mnPart]=5; mnPart++;
          cct=sEqu.charAt(ic+1);
          if (cct=='(' || (cct>='a' && cct<='z')) {masEquPart[mnPart]="*"; maiPartType[mnPart]=3; mnPart++;}
          ic++;
          break;
          
        case '(':
          cct=sEqu.charAt(ic+1);
          if (cct=='+' || cct=='*' || cct=='/' || cct=='^' || cct=='%' || cct==')')
          {inpErr(oResultDisplayContainer,"Wrong Input: "+sEqu.substr(ic,2)); return;}
          masEquPart[mnPart]="("; maiPartType[mnPart]=7; HaveParenthesis++; ParPosi[HaveParenthesis]=mnPart; 
          mnPart++; Parenthesis++; ic++;
          break;
          
        case ')':
          cct=sEqu.charAt(ic+1); 
          if (cct=='.' || (cct>='0' && cct<='9')) {inpErr(oResultDisplayContainer,"Wrong Input: "+sEqu.substr(ic,2)); return;}
          masEquPart[mnPart]=")"; maiPartType[mnPart]=7; mnPart++; Parenthesis--; ic++;
          if (cct=='(' || (cct>='a' && cct<='z')) {masEquPart[mnPart]="*"; maiPartType[mnPart]=3; mnPart++;}
          break;
          
        case '$':
          cct=sEqu.charAt(ic+1); 
          if (cct=='.' || (cct>='0' && cct<='9')) {ic++;}
          else {inpErr(oResultDisplayContainer,"Wrong Input: "+sEqu.substr(ic,2)); return;}
          break;
          
        default:
          if ((cc>="0" && cc<='9') || cc=='.') {
            dot=0; plus=0; minus=0; beforeE=1; ii=ic+1;
            if (cc=='.') {dot++; cct=sEqu.charAt(ii); if (cct<'0' || cct>'9') {inpErr(oResultDisplayContainer,"Wrong Input: "+sEqu.substring(ic,ii+1)); return;}}
            while (ii<=EL) {
              cct=sEqu.charAt(ii);
              if (cct=='.') {   // Only 1 dot allowed below 'e'.
                dot++;
                if (beforeE==1) {if (dot>1) {inpErr(oResultDisplayContainer,"Wrong Input: "+sEqu.substring(ic,ii+1)); return;} else {ii++;}}
                else  {if (dot>0) {inpErr(oResultDisplayContainer,"Wrong Input: "+sEqu.substring(ic,ii+1)); return;} else {ii++;}}
              } else if (cct==',' && dot==0) {   // Thousand separator. 
                cctt=sEqu.charAt(ii+4);
                if (cctt==',' || cctt=='.' || (cctt<'0' || cctt>'9')) {
                  for (jj=1; jj<4; jj++) {if (sEqu.charAt(ii+jj)<'0' || sEqu.charAt(ii+jj)>'9') {inpErr(oResultDisplayContainer,"Wrong Input: "+sEqu.substring(ic,ii+jj+1)); return;}}
                  sEqu=sEqu.substring(0,ii)+sEqu.substring(ii+1);
                  EL=sEqu.length-1;
                } else {
                  inpErr(oResultDisplayContainer,"Wrong Input: "+sEqu.substring(ic,ii+5)); return;
                }
              } else if (cct=='e') {
                if (beforeE==1) {
                  if (sEqu.substr(ii,3)=="exp") {
                    masEquPart[mnPart]=sEqu.substring(ic,ii);
                    maiPartType[mnPart]=0;
                    madNum[mnPart]=parseFloat(masEquPart[mnPart]);
                    mnPart++;
                    masEquPart[mnPart]="*";
                    maiPartType[mnPart]=3;
                    mnPart++;
                    ic=ii; 
                    break;
                  } else if (sEqu.substr(ii,2)=="ee") {
                    masEquPart[mnPart]=sEqu.substring(ic,ii);
                    maiPartType[mnPart]=0;
                    madNum[mnPart]=parseFloat(masEquPart[mnPart]);
                    mnPart++;
                    masEquPart[mnPart]="*";
                    maiPartType[mnPart]=3;
                    mnPart++;
                    ic=ii; 
                    break;
                  } else if (sEqu.substr(ii,2)=="e+") {
                    if (sEqu.charAt(ii+2)<'0' || sEqu.charAt(ii+2)>'9') {inpErr(oResultDisplayContainer,"Wrong Input: "+sEqu.substring(ic,ii+3)); return;}
                    beforeE=0;
                    ii=ii+2;
                  } else if (sEqu.substr(ii,2)=="e-") {
                    if (sEqu.charAt(ii+2)<'0' || sEqu.charAt(ii+2)>'9') {inpErr(oResultDisplayContainer,"Wrong Input: "+sEqu.substring(ic,ii+3)); return;}
                    beforeE=0;
                    ii=ii+2;
                  } else if (sEqu.charAt(ii+1)>='0' && sEqu.charAt(ii+1)<='9') {
                    beforeE=0;
                    ii++;
                  } else {
                    inpErr(oResultDisplayContainer,"Wrong Input: "+sEqu.substring(ic,ii+2)); return;
                  }
                } else {
                  masEquPart[mnPart]=sEqu.substring(ic,ii);
                  maiPartType[mnPart]=0;
                  madNum[mnPart]=parseFloat(masEquPart[mnPart]);
                  mnPart++;
                  if ((cct>='a' && cct<='z') || cct=='(') {
                    masEquPart[mnPart]="*";
                    maiPartType[mnPart]=3;
                    mnPart++;
                  }
                  ic=ii; 
                  break;
                }
              } else if (cct>='0' && cct<='9') {
                ii++;
              } else {
                masEquPart[mnPart]=sEqu.substring(ic,ii);
                maiPartType[mnPart]=0;
                madNum[mnPart]=parseFloat(masEquPart[mnPart]);
                mnPart++;
                if ((cct>='a' && cct<='z') || cct=='(') {
                  masEquPart[mnPart]="*";
                  maiPartType[mnPart]=3;
                  mnPart++;
                }
                ic=ii; 
                break;
              }
            }
            
            if (ii>EL) {
              masEquPart[mnPart]=sEqu.substring(ic,ii);
              maiPartType[mnPart]=0;
              madNum[mnPart]=parseFloat(masEquPart[mnPart]);
              mnPart++;
              ic=ii;
            }
            
          } else {
            inpErr(oResultDisplayContainer,"Wrong Input: "+sEqu.substr(ic,1)); return;
          }
          
        }
      }
        
    
      if (Parenthesis>0) 
      {
        for (ii=Parenthesis; ii>0; ii--) {masEquPart[mnPart]=")"; maiPartType[mnPart]=7; mnPart++;}
        msWarning=msWarning+"<br />Warning: Missing ')'. The result is calculated with the assumption that all missing ')' are at the end of the equation.";
        moNew.miWarningID=2;
      }
      else if (Parenthesis<0) {inpErr(oResultDisplayContainer,"Missing: ("); return;}
    
      
      for (ii=0; ii<mnPart-1; ii++) {if (maiPartType[ii]==6) {if (masEquPart[ii+1]!="(") {inpErr(oResultDisplayContainer,"Missing: ("); return;}}}
      ii=mnPart-1;
      if (maiPartType[ii]==1 || maiPartType[ii]==2 || maiPartType[ii]==3 || maiPartType[ii]==4 || maiPartType[ii]==6 || masEquPart[ii]=="(")
      {inpErr(oResultDisplayContainer,"Input Incomplete!"); return;}
      
      
      for (ii=0; ii<mnPart; ii++) {maiPtf[ii]=ii+1; maiPtb[ii]=ii-1;} maiPtf[mnPart-1]=-1;
      miPtf0=0; miPtb0=mnPart-1;
    
    
      var ip,ipar1,ipar2,pt,maxType;
      while (HaveParenthesis>0)
      {
        ipar1=ParPosi[HaveParenthesis]; 
        pt=maiPtf[ipar1]; while (pt!=-1) {if (masEquPart[pt]==")") {ipar2=pt; break;} pt=goFirst(pt); pt=maiPtf[pt];}
        while (maiPtf[ipar1]!=maiPtb[ipar2]) {pt=maiPtf[ipar1]; while (pt!=ipar2) {pt=goFirst(pt); pt=maiPtf[pt];}}
        if (ipar1==miPtf0) {miPtf0=maiPtf[ipar1];} else {maiPtf[maiPtb[ipar1]]=maiPtf[ipar1];}  maiPtb[maiPtf[ipar1]]=maiPtb[ipar1];
        if (ipar2==miPtb0) {miPtb0=maiPtb[ipar2];} else {maiPtb[maiPtf[ipar2]]=maiPtb[ipar2];}  maiPtf[maiPtb[ipar2]]=maiPtf[ipar2];
        masEquPart[ipar2]=""; HaveParenthesis--;
      }
      while (miPtf0!=miPtb0) {pt=miPtf0; while (pt!=-1) {pt=goFirst(pt); pt=maiPtf[pt];}}
      mdResult=madNum[miPtf0]; moNew.resultPrint(oResultDisplayContainer,mdResult);
      
      return mdResult;
    }
    
    
    function calculate(ip) 
    {
      switch (maiPartType[ip]) {
      case 2:
        miPf=maiPtf[ip];
        madNum[miPf]=-madNum[miPf];
        if (ip==miPtf0) {miPtf0=miPf;} else {maiPtf[maiPtb[ip]]=miPf;} 
        maiPtb[miPf]=maiPtb[ip]; miPp=miPf;
        break;
        
      case 5:
        miPb=maiPtb[ip];
        madNum[miPb]=madNum[miPb]/100.0;
        if (ip==miPtb0) {miPtb0=miPb;} else {maiPtb[maiPtf[ip]]=miPb;}
        maiPtf[miPb]=maiPtf[ip]; miPp=miPb;
        break;
        
      case 6:
        miPf=maiPtf[ip];
        
        switch (masEquPart[ip]) {
        case "exp": madNum[miPf]=Math.exp(madNum[miPf]); break;
        case "log": madNum[miPf]=Math.log(madNum[miPf])/Math.log(10.0); break;
        case "ln": madNum[miPf]=Math.log(madNum[miPf]); break;
        case "abs": madNum[miPf]=Math.abs(madNum[miPf]); break;
        case "sqrt": madNum[miPf]=Math.sqrt(madNum[miPf]); break;
        case "sind": madNum[miPf]=Math.sin(madNum[miPf]*Math.PI/180.0); break;
        case "sin": madNum[miPf]=Math.sin(madNum[miPf]); break;
        case "cosd": madNum[miPf]=Math.cos(madNum[miPf]*Math.PI/180.0); break;
        case "cos": madNum[miPf]=Math.cos(madNum[miPf]); break;
        case "tand": madNum[miPf]=Math.tan(madNum[miPf]*Math.PI/180.0); break;
        case "tan": madNum[miPf]=Math.tan(madNum[miPf]); break;
        case "cotd": madNum[miPf]=1.0/Math.tan(madNum[miPf]*Math.PI/180.0); break;
        case "cot": madNum[miPf]=1.0/Math.tan(madNum[miPf]); break;
        case "cscd": madNum[miPf]=1.0/Math.sin(madNum[miPf]*Math.PI/180.0); break;
        case "csc": madNum[miPf]=1.0/Math.sin(madNum[miPf]); break;
        case "secd": madNum[miPf]=1.0/Math.cos(madNum[miPf]*Math.PI/180.0); break;
        case "sec": madNum[miPf]=1.0/Math.cos(madNum[miPf]); break;
        case "acos": madNum[miPf]=Math.acos(madNum[miPf]); break;
        case "asin": madNum[miPf]=Math.asin(madNum[miPf]); break;
        case "atan": madNum[miPf]=Math.atan(madNum[miPf]); break;
        case "acot": madNum[miPf]=Math.PI/2.0-Math.atan(madNum[miPf]); break;     
        case "asec": madNum[miPf]=Math.acos(1.0/madNum[miPf]); break;
        case "acsc": madNum[miPf]=Math.asin(1.0/madNum[miPf]); break;
        case "acosd": madNum[miPf]=180.0*Math.acos(madNum[miPf])/Math.PI; break;
        case "asind": madNum[miPf]=180.0*Math.asin(madNum[miPf])/Math.PI; break;
        case "atand": madNum[miPf]=180.0*Math.atan(madNum[miPf])/Math.PI; break;
        case "acotd": madNum[miPf]=180.0*(Math.PI/2.0-Math.atan(madNum[miPf]))/Math.PI; break;     
        case "asecd": madNum[miPf]=180.0*Math.acos(1.0/madNum[miPf])/Math.PI; break;
        case "acscd": madNum[miPf]=180.0*Math.asin(1.0/madNum[miPf])/Math.PI; break;
        }
        
        if (ip==miPtf0) {miPtf0=miPf;} else {maiPtf[maiPtb[ip]]=miPf;} 
        maiPtb[miPf]=maiPtb[ip]; miPp=miPf;
        break;
        
      default:
        miPf=maiPtf[ip]; miPb=maiPtb[ip];
        if (masEquPart[ip]=="+") madNum[miPb]=madNum[miPb]+madNum[miPf];
        else if (masEquPart[ip]=="-") madNum[miPb]=madNum[miPb]-madNum[miPf];
        else if (masEquPart[ip]=="*") madNum[miPb]=madNum[miPb]*madNum[miPf];
        else if (masEquPart[ip]=="/") madNum[miPb]=madNum[miPb]/madNum[miPf];
        else if (masEquPart[ip]=="^") madNum[miPb]=Math.pow(madNum[miPb],madNum[miPf]);
        if (miPf==miPtb0) {miPtb0=miPb;} else {maiPtb[maiPtf[miPf]]=miPb;}
        maiPtf[miPb]=maiPtf[miPf]; miPp=miPb;
      }
      return miPp;
    }
    
    
    function goFirst(ip)
    {
      if (maiPartType[ip]>0)
      {
        switch (maiPartType[ip]) {
        case 6:
          if (maiPartType[maiPtf[ip]]==0) return calculate(ip);
          break;
          
        case 5:
          if (maiPtb[maiPtb[ip]]==-1 || masEquPart[maiPtb[maiPtb[ip]]]=="(") return calculate(ip); 
          else if (maiPartType[maiPtb[ip]]==0 && maiPartType[maiPtb[maiPtb[ip]]]!=6) return calculate(ip);
          break;
          
        case 2:
          if (maiPtf[maiPtf[ip]]==-1 || masEquPart[maiPtf[maiPtf[ip]]]==")") return calculate(ip); 
          else if (maiPartType[maiPtf[ip]]==0 && maiPartType[maiPtf[maiPtf[ip]]]<=2) return calculate(ip);
          break;
    
        default:
          if (maiPartType[ip]<5) {
            if (maiPtf[maiPtf[ip]]==-1 || masEquPart[maiPtf[maiPtf[ip]]]==")") {
              if (maiPtb[maiPtb[ip]]==-1 || masEquPart[maiPtb[maiPtb[ip]]]=="(") return calculate(ip);
              else if (maiPartType[maiPtb[ip]]==0 && maiPartType[maiPtb[maiPtb[ip]]]<maiPartType[ip]) return calculate(ip);
            } else if (maiPartType[maiPtf[ip]]==0 && maiPartType[maiPtf[maiPtf[ip]]]<=maiPartType[ip]) {
              if (maiPtb[maiPtb[ip]]==-1 || masEquPart[maiPtb[maiPtb[ip]]]=="(") return calculate(ip);
              else if (maiPartType[maiPtb[ip]]==0 && maiPartType[maiPtb[maiPtb[ip]]]<maiPartType[ip]) return calculate(ip);
            }
          }
        }
      }
      return ip;
    }
    
    
    function inpErr(oResultDisplayContainer,sErrorDescription) {
      if (sErrorDescription=="") {
        sErrorDescription="Input Error!";
      }
      if (oResultDisplayContainer.type=="text" || oResultDisplayContainer.type=="textarea") {
        oResultDisplayContainer.value=sErrorDescription;
      } else if ("innerHTML" in oResultDisplayContainer) {
        oResultDisplayContainer.innerHTML=sErrorDescription;
      } 
    }
    
    
    function checkOp(cc) {return (cc=='+' || cc=='-' || cc=='*' || cc=='/' || cc=='^' || cc=='%' || cc==')');}
    

    return moNew;
  }
}
   
    
