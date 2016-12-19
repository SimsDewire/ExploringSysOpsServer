var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var app = express();



var server = app.listen(3002, function () {
    console.log("Listening on port %s...", server.address().port);
});
app.get('/test/linear', function (req, res) {
	var alt = 10000;
	var time = (new Date().getTime()) % (2 * alt);

	if(time > alt)
		res.send({Test: alt - (time % alt)});
	else
		res.send({Test: time % alt});
});

app.get('/test/exp', function(req,res){
	var alt = 1000;
	var time = (new Date().getTime()) % (2 * alt);
	if(time > alt)
		time = alt - time % alt;
	res.send({ Test: (time * time) / 3000 });
});
var test={"val":[0,0,0]};
var inlogged={'Windows':'5'};
inlogged.Linux='3';
inlogged.FBI='7';
app.get('/test/barchart', function(req,res){
/*
	for(var myKey in inlogged){
		console.log("Key"+myKey,"value:"+inlogged[myKey]);
	}*/
	//res.send(inlogged);
	res.send(test);
	test.val[0]=(Math.floor(Math.random()*(10-0)+0));
	test.val[1]=(Math.floor(Math.random()*(10-0)+0));
	test.val[2]=(Math.floor(Math.random()*(10-0)+0));
	console.log(test);
	//inlogged.Windows=Math.floor(Math.random()*(10-0)+0);
	//inlogged.Linux=Math.floor(Math.random()*(10-0)+0);
	//inlogged.FBI=Math.floor(Math.random()*(10-0)+0);
});
