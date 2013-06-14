(function update() {
    //dropdown list update
    var d=new Date()        
    var m1=d.getMonth();
    var d1=d.getDate()-1;
    var y1=d.getFullYear()-2000+20;
    document.getElementById("getYear1").options[y1].selected=true;
    document.getElementById("getMonth1").options[m1].selected=true;
    document.getElementById("getDay1").options[d1].selected=true;
    document.getElementById("getYear2").options[y1].selected=true;
    document.getElementById("getMonth2").options[m1].selected=true;
    document.getElementById("getDay2").options[d1].selected=true;
    document.getElementById("getYear3").options[y1].selected=true;
    document.getElementById("getMonth3").options[m1].selected=true;
    document.getElementById("getDay3").options[d1].selected=true;
    //input text update
    document.getElementById("numberofDaysID").value="";
    document.getElementById("daysInput").value="";
    document.getElementById("endingDateID").value="";
    //radio button update
    document.getElementById("inDays").checked="checked";
    document.getElementById("add").checked="checked";
})();
