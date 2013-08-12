function myFunction()
{
	
var check =document.getElementsByName("stat");

//x=document.getElementById("rawdata");  // find element
var data =document.getElementById("rawdata").value;
var str=data.replace(/[^0-9\.\-eE]/g," ");
var arrr = str.split(" ");
var interdata = new Array();
var j = 0;
for (var i = 0;i < arrr.length;i++)
{
	if (arrr[i]=="")
	{
	}
	 else{
		interdata[j] = parseFloat(arrr[i]);
		j = j+1;
	}
}



var number = interdata.length;
var mean = meanofArray(interdata);
var sum = sumofArray(interdata);
var mode = modeofArray(interdata);
var max = maxofArray(interdata);
var min = minofArray(interdata);
var variance = varianceofArray(interdata);
var std = stdofArray(interdata);
quickSort(interdata,0,interdata.length-1);
var median = medianofArray(interdata);
var iqr = iqrofArray(interdata);
var matureData = new Array();
matureData[0] = number.toFixed(2);
matureData[1] = mode.toFixed(2);
matureData[2] = mean.toFixed(2);
matureData[3] = variance.toFixed(2);
matureData[4] = max.toFixed(2);
matureData[5] = min.toFixed(2);
matureData[6] = std.toFixed(2);
matureData[7] = median.toFixed(2);
matureData[8] = iqr.toFixed(2);
matureData[9] = sum.toFixed(2);

var result = "";
for (var i = 0;i <10;i++)
{
	if (check[i].checked){
    result = result +check[i].id+":"+ matureData[i]+"\n";
}
}

document.getElementById("result").value = result;
//document.getElementById("result").innerHTML=data;
}





// get the max of sample
function maxofArray(arr){
	var max = arr[0];
    for (var i = 1;i < arr.length;i++)
    {
	   if(max < arr[i]){
	   	 max = arr[i];
    }
    }
	return max;
}

// find median of Array
function medianofArray(arr){
    var median =0;
    var n =arr.length;
    if(n%2==0)	{
    	median = (arr[n/2-1]+arr[n/2])/2;
    }
    if(n%2==1)
    {
    	median = arr[(n-1)/2];
    }
    return median;
}

// find the iqr of an sample
function iqrofArray(arr){
	var iqr;
	var n = arr.length;
	var iq1 = arr[Math.floor(n/4)];
	var iq3 = arr[Math.floor(3*n/4)];
	iqr = iq3 -iq1;
    return iqr;
}



// quicksort function 
function quickSort(arr,start,end){
		   if(end <= start){
		   	  return;
		   }
		   var low = start;
		   var high = end;
		   var tag = low;
		   while(high>low){
		      if (tag == low){
		      	if (arr[high]>=arr[tag]){
		      		high = high -1;
		      	}
		      	else{
		      		low = low +1;
		      		swap(arr,tag,high);
		      		tag = high;
		      	}
		       }
		    else{
		    	if(tag==high){
		      	if (arr[low]<=arr[tag]){
		      		low = low +1;
		      	}
		      	else{
		      		high = high -1;
		      		swap(arr,tag,low);
		      		tag = low;
		      	}
		       }
		    }
		     }
		     quickSort(arr,start,tag);
		     quickSort(arr,tag+1,end); 
}


// swap two elements in an array
function swap(arr,a,b){
	  var temp;
	  temp = arr[a];
	  arr[a] = arr[b];
	  arr[b] = temp;
	  return;
  }







//merge two sorted subarray
function merge(arr,start,middle,end){
   var temp =new Array();
   var low = start;
   var high = middle +1;
   for (var i = start;i <= end;i++)
    {
       
	   if(arr[low]<arr[high]){
	      temp[i] = arr[low];
	      low = low +1;
	     }
	    else{
	      temp[i] = arr[high];
	      high = high +1;
	     }
    }
    
}



// find the min of array
function minofArray(arr){
	var min = arr[0];
    for (var i = 1;i < arr.length;i++)
    {
	   if(min > arr[i]){
	   	 min = arr[i];
    }
    }
	return min;
}

//find mode of array
function modeofArray(arr){
	var numbermap = {};
	var mode = arr[0];
	var numberofmode = 1;
	for (var i = 0;i < arr.length;i++)
    {
	   temp = arr[i];
	   if (numbermap[temp] == null)
	       numbermap[temp] = 1;
	   else 
	       numbermap[temp] = numbermap[temp] + 1;
	   if (numbermap[temp] > numberofmode)
	   {
	   	   mode = temp;
	   	   numberofmode = numbermap[temp];
	   }
    }
	
	return mode;
	
}
// find the sum of array
function sumofArray(arr){
	var sum = 0;
	for (var i = 0;i < arr.length;i++)
    {
	   sum = sum + arr[i];
    }
	return sum;
}

// find mean of array
function meanofArray(arr){
	var mean = 0;
	mean = sumofArray(arr)/arr.length;
	return mean;
}

// find variance of sample array
function varianceofArray(arr){
	var variance = 0;
	if (arr.length==1){
		return variance;
	}
	var mean = meanofArray(arr);
	for (var i = 0;i < arr.length;i++)
    {
	   variance = variance + (arr[i]-mean)*(arr[i]-mean);
    }
    variance = variance/(arr.length-1);
	return variance;
}


// find std of sample
function stdofArray(arr){
	var std = 0;
	var variance = varianceofArray(arr);
	std = Math.sqrt(variance);
	return std;
}



function toExplain(){

    var bgObj=document.createElement("div");
    bgObj.id = "bgDiv"; 
    document.body.appendChild(bgObj);
    var testButton = document.createElement("input");   
    testButton.setAttribute("type","button");
    testButton.setAttribute('class','css_btn_class');
    testButton.id = "helpButton";
    testButton.value= "Close";
     var msgObj=document.createElement("div"); 
     msgObj.id="msgDiv";
     msgObj.align="center"; 


testButton.onclick=removeObj; 
function removeObj(){
   document.body.removeChild(bgObj);
   document.body.removeChild(msgObj);
} 
document.body.appendChild(msgObj);
var txt=document.createElement("p");
txt.style.margin="1em 0" ;
txt.setAttribute("id","msgTxt"); 
txt.align = "justify";
txt.innerHTML=" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Our statistical tool can compute all basical statistics "+
"such as mean,median,count and so on. " 
+"Our tool can currently deal with number including all 0-9 . - e E and look all others as delimeter. " +
"If you need to convert delimeter, please go to our delimeter converter tool : ";
//<a href="/DelimiterConverter" class="ToolName">Delimiter Converter</a>
var link = document.createElement("a");
link.id = "msgLink";
link.value = "Delimiter Converter";
link.innerHTML = "Delimiter Converter.";
link.target = "/blank";
link.href = "/DelimiterConverter";
//txt.innerHTML = +"Thanks!!!."
var para = document.createElement("p");
para.id = "msgPara";
para.innerHTML = "Thanks!!!";
document.getElementById("msgDiv").appendChild(txt);
document.getElementById("msgTxt").appendChild(link);
document.getElementById("msgTxt").appendChild(para);
//tex.innerHTML = "Thanks!!!";


document.getElementById("msgDiv").appendChild(testButton);

}











