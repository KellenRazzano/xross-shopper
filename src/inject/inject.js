chrome.extension.sendMessage({}, function(response) {
});

chrome.extension.sendMessage({}, function(response) {
});
var year = 0;
var make = "";
var model = "";

function getMetaKeywords() { 
	console.log("here in meta");
	var metas = document.getElementsByTagName('meta'); 
  
   for (var i=0; i<metas.length; i++) {
      if (metas[i].getAttribute("name") === "keywords") { 
		 console.log("here in keywords");
         return metas[i].getAttribute("content"); 
      } 
   } 

    return "";
}  

function checkForKeywords(data) {
   data = data.toLowerCase().split(" ");
   
   if(data.length < 0 || !Number.isInteger(parseInt(data[0]))){
	   return;
   }
   
   console.log(JSON.stringify(data));
   if(data.length > 0){
	   year = parseInt(data[0]);
   }
   if(data.length > 1){
	   make = data[1];
   }
   if(data.length > 2){
	   model = data[2]
   }
}

function savePageData() {
    var visited = window.location.href;
    var time = +new Date();
    chrome.storage.sync.set({'visitedPages':{pageUrl:visited,time:time}}, function () {
        console.log("Just visited",visited)
    });
}


console.log("Hello. This message was sent from src/inject/inject.js");


setTimeout(function() {
	var metakeywords = getMetaKeywords();

	if(metakeywords.length > 0) {
		checkForKeywords(metakeywords);
	}else{
		console.log(document.title);
		checkForKeywords(document.title);
	}
	
	if(year > 1900 && year < 3000) {
        // inject ad
        var xmlHttp = null;

        xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", chrome.extension.getURL ("src/inject/inject.html"), false );
        xmlHttp.send( null );

        var inject  = document.createElement("div");
        inject.innerHTML = xmlHttp.responseText;
        document.body.insertBefore (inject, document.body.firstChild);
        var imgURL = chrome.extension.getURL("src/images/ad.png");
        document.getElementById("kbb-ext-ad").src = imgURL;
        console.log(imgURL)

		console.log(year+ " " + make+ " " + model);
		document.getElementById("year").value = year;
		document.getElementById("make").value = make;
		document.getElementById("model").value = model;
        savePageData();
	}
}, 2000);