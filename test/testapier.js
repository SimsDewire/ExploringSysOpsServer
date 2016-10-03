var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var app = express();



var server = app.listen(3002, function () {
    console.log("Listening on port %s...", server.address().port);
});

var i =0;
var linearcheck=1;
app.get('/test', function (req, res) {
	if(linearcheck==0){
		i--;
		if(i==0){
			linearcheck=1;
		}
	}
	else {
		i++;
		if(i==10){
			linearcheck=0;
		}
	}
	
	res.send(i);


});
var exp =0;
var expcheck=1;
app.get('/test/exp', function(req,res){
	if(expcheck==1){
		exp++;
	}



});
var inlogged={'Windows':'5'};
inlogged.Linux='3';
inlogged.FBI='7';
app.get('/test/barchart', function(req,res){

	for(var myKey in inlogged){
		console.log("Key"+myKey,"value:"+inlogged[myKey]);
	}
	res.send(inlogged);

	inlogged.Windows=Math.floor(Math.random()*(100-0)+0);
	inlogged.Linux=Math.floor(Math.random()*(100-0)+0);
	inlogged.FBI=Math.floor(Math.random()*(100-0)+0);
});