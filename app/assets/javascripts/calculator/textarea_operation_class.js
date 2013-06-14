var TextareaOperation = {
  createNew: function() {
    var moNew={};
    
    
    moNew.highlightText = function(sTextareaID,iHighlightStart,iHighlightEnd) {
      var oTextarea=document.getElementById (sTextareaID);
      if ('selectionStart' in oTextarea) {
        oTextarea.selectionStart=iHighlightStart;
        oTextarea.selectionEnd=iHighlightEnd;
        oTextarea.focus();
      }
      else {  // Internet Explorer before version 9
        var oHighlightRange=oTextarea.createTextRange();
        oHighlightRange.moveStart("character", iHighlightStart);
        oHighlightRange.collapse();
        oHighlightRange.moveEnd("character", iHighlightEnd-iHighlightStart);
        oHighlightRange.select();
      }
    }
    
    
    moNew.selectRange = function(sTextareaID) {
      var oElem = document.getElementById(sTextareaID);
      var pos = 0;
      if('selectionStart' in oElem) {
        return {
          iSelectStart: oElem.selectionStart,
          iSelectEnd: oElem.selectionEnd
        }
      } else if('selection' in document) {
        oElem.focus();
        var sSelect = document.selection.createRange();
        var iSelectLength = document.selection.createRange().text.length;
        sSelect.moveStart('character', -oElem.value.length);
        return {
          iSelectStart: sSelect.text.length-iSelectLength,
          iSelectEnd: sSelect.text.length
        }
      }
    }
    
    
    return moNew;
  }
}
