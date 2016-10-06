var CAMG_XSHOPPER = (function(){

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
	
	function renderGearBoxModule () {
		var gearBoxRequest = null;
        var carcuts
		function reqListener () {			
			var allGearBoxData = JSON.parse(this.responseText);
			//var carouselGearBoxData = {stuff:allGearBoxData.stuff};
			console.log(this.responseText);
			//debugger
            document.getElementById("kbb_rotate").innerHTML = "";
            var i;
 
            function imageDownload(oEvent) {
                if(oEvent.status === 200 || oEvent.status === 304){
                var blob = oEvent.response;
                var mycounter = 'kbb' + i;
                var imgElement = document.getElementById('mycounter');
                imgElement.src = URL.createObjectURL(blob);
               }
            };
            for(i = 0; i < allGearBoxData.results.length;i++){
                var rotMake = allGearBoxData.results[i].make.name;
                var rotModel = allGearBoxData.results[i].model.name;
                var price = allGearBoxData.results[i].primaryPrice;
                //var imgURL = allGearBoxData.results[i].imagesWithSize[0].imageUrl;
                var imgURL = allGearBoxData.results[i].images[0];
                var dealerUrl = "http://www.autotrader.com";
                var imgURLFixed = imgURL.replace("http","https");
                acImgRequest = new XMLHttpRequest();
                acImgRequest.onload = imageDownload(e);
                acImgRequest.open( "GET", imgURLFixed, true);
                acImgRequest.responseType = "blob";
                
                var gearboxCar = document.createElement('div');
                var dummyImage = chrome.extension.getURL("src/images/test.jpg")
                gearboxCar.innerHTML = "<a href=\"" + dealerUrl + "\">" + "<img width=\"90px\" src=\"" + dummyImage + "\" id=\"kbbimg" + i + "\"></a>" + rotMake + " " + rotModel + "<br>$" + price ;
                document.getElementById('kbb_rotate').appendChild(gearboxCar);			
                // acImgRequest.send();  // images are broken links 
            }
            setTimeout(function () {
                console.log("pausing for slick");
            }, 5000);
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.innerHTML= "$('.multiple-items').slick({infinite: false,dots: true,slidesToShow: 3,slidesToScroll: 3});"
            document.getElementsByTagName('body')[0].appendChild(script);
            
			//load data into ids
		}
		gearBoxRequest = new XMLHttpRequest();
		gearBoxRequest.addEventListener("load", reqListener);
		gearBoxRequest.open( "GET", 'https://api-qa-origin.autotrader.com/rest/v0/listings', true);
		gearBoxRequest.withCredentials = true;
		gearBoxRequest.setRequestHeader("Authorization", "Basic " + btoa('kbbwebqa:3VHcgYbH'));  
		gearBoxRequest.setRequestHeader('Accept', 'application/json');
		gearBoxRequest.send( '?makeCode=ACURA&modelCode=ILX&year=2015' );		//TODO use values and confirm syntax, etc
        // Price Advisor JS        
        // chrome-extension://__MSG_@@jnimfljjdnbkcnciojikcehejobpjhfi__/
	}
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = chrome.extension.getURL("src/inject/carousel/jquery-1.11.0.min.js");
                document.getElementsByTagName('body')[0].appendChild(script);

		setTimeout(function() {                
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = chrome.extension.getURL("src/inject/carousel/jquery-migrate-1.2.1.min.js");
                document.getElementsByTagName('body')[0].appendChild(script);

                var script = document.createElement('style');
                script.type = 'text/css';
                script.src = chrome.extension.getURL("src/inject/carousel/slick/slick.css");
                document.getElementsByTagName('head')[0].appendChild(script);

                var script = document.createElement('style');
                script.type = 'text/css';
                script.src = chrome.extension.getURL("src/inject/carousel/slick/slick-theme.css");
                document.getElementsByTagName('head')[0].appendChild(script);
                            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = chrome.extension.getURL("src/inject/carousel/slick/slick.min.js");
            document.getElementsByTagName('body')[0].appendChild(script);
    
    },100);
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
			xmlHttp.open( "GET", chrome.extension.getURL("src/inject/inject.html"), true );
			xmlHttp.send( null );

			xmlHttp.addEventListener("load", function(res) {
				var inject  = document.createElement("div");
				inject.innerHTML = xmlHttp.responseText;
				document.body.insertBefore (inject, document.body.firstChild);

				// Inject Ad
				var imgURL = chrome.extension.getURL("src/images/ad.png");
				document.getElementById("kbb-ext-ad").src = imgURL;

				// Price Advisor
				var imgURL = chrome.extension.getURL("src/images/priceAdvisor.png");
				document.getElementById("kbb-ext-price-advisor").src = imgURL;

				console.log(year+ " " + make+ " " + model);
                make = make.replace(/,/g, '');
                model = model.replace(/,/g, '');
				document.getElementById("year").value = year;
				document.getElementById("make").value = make;
				document.getElementById("model").value = model;
				savePageData();
            renderGearBoxModule();
            });
            
		}
	}, 5000);

})();