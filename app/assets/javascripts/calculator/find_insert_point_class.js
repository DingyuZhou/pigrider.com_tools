var FindInsertPoint = {      // Define a class FindInsertPoint.
  createNew: function() {      // Constructor.
    var moNew={};


    // If 'iPriority'=0, Look for first unpaired left parenthesis or first non-spacing character. 
    // If 'iPriority'=1, look for last available '+' or '-'.
    // If 'iPriority'=2, look for last available '*', '/' or '^'.
    // 'iPriority'=3 is just for '+/-' button.
    // 'oTA' is a textarea object.
    // There can be a third parameter 'iEndPoint', which specifies an search end point.  
    moNew.lastAvailableArithmeticOperator = function(oTA,iPriority,iEndPoint) {
      var iBegin=moNew.firstNonSpacingChar(oTA);
      var iEnd=iEndPoint>oTA.value.length ? moNew.lastNonSpacingChar(oTA,oTA.value.length) : moNew.lastNonSpacingChar(oTA,iEndPoint);
      var oReturnValue = {iInsertBegin:iBegin, iInsertEnd:iEnd};
      var cc1,cc2,cc3,itmp1,itmp2,nPar;
      
      if (iPriority==0) {
        nPar=0;
        for (var kk=iEnd; kk>=iBegin; --kk) {
          cc1=oTA.value.charAt(kk);
          if (cc1==')') {
            ++nPar;
          } else if (cc1=='(') {
            --nPar;
          }
          if (nPar<0) {
            oReturnValue.iInsertBegin=kk+1;
            return oReturnValue;
          }
        }
        return oReturnValue;
      }
      
      var ii=iEnd+1,jj;
      while (ii>=iBegin) {
        jj=moNew.lastNonSpacingChar(oTA,ii);
        cc1=oTA.value.charAt(jj);
        
        if (cc1=='+' || cc1=='-') {
          oReturnValue.iInsertBegin=ii;
          itmp1=moNew.lastNonSpacingChar(oTA,jj);
          if (itmp1<1) {
            return oReturnValue;
          } else {
            cc2=oTA.value.charAt(itmp1);
            if (cc2!='e' && cc2!='E') {
              return oReturnValue;
            } else {      // Consider about the scientific number.
              itmp2=moNew.lastNonSpacingChar(oTA,itmp1);
              if (itmp2<0) {
                return oReturnValue;
              } else {
                cc2=oTA.value.charAt(itmp2);
                if (cc2!='.' && (cc2<'0' || '9'<cc2)) {      // Not like 1.0e-10
                  return oReturnValue;
                } else if (iPriority>2) {
                  return oReturnValue;
                }
              }
            }
          }
        } else if (cc1==')') {      // Consider about the parenthesis.
          if (ii<=iEnd) {
            cc2=oTA.value.charAt(ii);
          } else {
            cc2=' ';
          }
          if (iPriority<=1 || ii>iEnd || cc2=='^') {
            var kk=jj-1;
            nPar=1; jj=iBegin;
            for (kk; kk>=iBegin; --kk) {
              cc3=oTA.value.charAt(kk);
              if (cc3==')') {
                ++nPar;
              } else if (cc3=='(') {
                --nPar;
              }
              if (nPar==0) {
                if (iPriority>1) {
                  itmp3=moNew.lastNonSpacingChar(oTA,kk);
                  if (itmp3>=0) {      // Consider cases like 2(2+3) , ee(2+3) or Pi(3+4)
                    cc3=oTA.value.charAt(itmp3);
                    if (((cc3<='a' || 'z'<=cc3) && (cc3<='A' || 'Z'<=cc3)) || cc3=='e' || cc3=='E' || cc3=='i' || cc3=='I') {
                      if (cc3=='e' || cc3=='E' || cc3=='i' || cc3=='I') {
                        oTA.value=oTA.value.substring(0,kk)+"*"+oTA.value.substring(kk);
                        oReturnValue.iInsertBegin=kk+1;
                        ++oReturnValue.iInsertEnd;
                      } else {
                        oReturnValue.iInsertBegin=kk;
                      }
                      return oReturnValue;
                    }
                  }
                }

                jj=kk; break;
              }
            }
          } else if (iPriority>1) {      // consider the case like: (2+3)(3+4)
            oReturnValue.iInsertBegin=ii;
            return oReturnValue;
          }
        } else if (cc1=='(') {      // Consider the case like: ((2+3)
          oReturnValue.iInsertBegin=ii;
          return oReturnValue;
        } else if (iPriority>1 && (cc1=='*' || cc1=='/')) {
          oReturnValue.iInsertBegin=ii;
          return oReturnValue;
        } else if (iPriority>1 && cc1=='^') {
          oReturnValue.iInsertBegin=ii;
          return oReturnValue;
        } else if (iPriority>1 && (('a'<=cc1 && cc1<='z') || ('A'<=cc1 && cc1<='Z'))) {      // Consider the case like: 2 sin(18)
          if (iPriority>2 && (cc1=='e' || cc1=='E')) {      // Consider the case like the scientif number: 2e3
            itmp1=moNew.lastNonSpacingChar(oTA,jj);
            if (itmp1>=0) {
              cc2=oTA.value.charAt(itmp1);
              if (cc2=='.' || ('0'<=cc2 && cc2<='9')) {
                oReturnValue.iInsertBegin=jj+1;
                return oReturnValue;
              }
            }
          } else if (cc1=='e' || cc1=='E') {
            itmp1=moNew.lastNonSpacingChar(oTA,jj);
            if (itmp1>=0) {
              cc2=oTA.value.charAt(itmp1);
              if (cc2=='.' || ('0'<=cc2 && cc2<='9')) {
                jj=itmp1; break;
              }
            }
            jj=itmp1;
          }
          
          for (var kk=jj-1; kk>=iBegin; --kk) {
            cc2=oTA.value.charAt(kk);
            if ((cc2<'a' || 'z'<cc2) && (cc2<'A' || 'Z'<cc2)) {
              oReturnValue.iInsertBegin=kk+1;
              return oReturnValue;
            }
          }
          oReturnValue.iInsertBegin=iBegin;
          return oReturnValue;
        }
        ii=jj;
      }
      oReturnValue.iInsertBegin=iBegin;
      return oReturnValue;
    }
    
    
    moNew.firstNonSpacingChar = function(oTA) {
      var cc;
      for (var ii=0; ii<oTA.value.length; ++ii) {
        cc=oTA.value.charAt(ii);
        if (cc!='\ ' && cc!='\r' && cc!='\n' && cc!='\t') {
          return ii;
        }
      }
      return oTA.value.length;
    }
    
        
    moNew.lastNonSpacingChar = function(oTA,iStartPoint) {
      var cc;
      if (iStartPoint>oTA.value.length) {iStartPoint=oTA.value.length;}
      for (var ii=iStartPoint-1; ii>=0; --ii) {
        cc=oTA.value.charAt(ii);
        if (cc!='\ ' && cc!='\r' && cc!='\n' && cc!='\t') {
          return ii;
        }
      }
      return -1;
    }
    
    
    moNew.trimmedPart = function(oTA,iRangeStart,iRangeEnd) {
      var cc,iFirst=-1,iLast;
      if (iRangeStart<0) {iRangeStart=0;}
      if (iRangeEnd>oTA.value.length) {iRangeEnd=oTA.value.length-1;}
      
      for (var ii=iRangeStart; ii<=iRangeEnd; ++ii) {
        cc=oTA.value.charAt(ii);
        if (cc!='\ ' && cc!='\r' && cc!='\n' && cc!='\t') {
          iFirst=ii; break;
        }
      }
      
      if (iFirst<0) {
        iFirst=iRangeStart; iLast=iFirst;
      } else {
        for (var ii=iRangeEnd; ii>=iRangeStart; --ii) {
          cc=oTA.value.charAt(ii);
          if (cc!='\ ' && cc!='\r' && cc!='\n' && cc!='\t') {
            iLast=ii; break;
          }
        }
      }
      
      return {
        iStart: iFirst,
        iEnd: iLast
      }
    }
    
  
    return moNew;
  }  
}

