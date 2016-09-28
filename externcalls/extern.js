var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();

        function httpGetasync(theUrl, callback) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function() { 
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    callback(xmlHttp.responseText);
                }
            };
    		xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    		xmlHttp.send(null);
    	}

    	function callback(data) {
            console.log(data);
        }
/*
router.use(function fetchget(apicall,cb){
	httpGetasync(apicall, function(data){
		var tempholder = JSON.parse(data);
		console.log(tempholder);
	})

});
*/
module.exports={


test: function fetchget(apicall,cb){
			console.log("does it work?");

	httpGetasync(apicall, function(data){
		var tempholder = JSON.parse(data);
		console.log(tempholder);
	})
}
};

//module.exports = router;

