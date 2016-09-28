var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')

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

router.use(function fetchget(apicall,cb){
	httpGetasync(apicall, function(data){
		var tempholder = JSON.parse(data);
	})

});



module.exports = router;

