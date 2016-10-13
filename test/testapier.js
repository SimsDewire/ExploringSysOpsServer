var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var app = express();



var server = app.listen(3002, function () {
    console.log("Listening on port %s...", server.address().port);
});

var lin ={'Test':'0'};
var i =0;
var linearcheck=1;
app.get('/test/linear', function (req, res) {
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
	lin.Test=i;
	res.send(lin);


});
var exp ={'Test':'3'};
var numb=1;
var expcheck=1;
app.get('/test/exp', function(req,res){

	if(numb<=800 && expcheck==1){
		numb=numb*3;
		console.log(req.connection.remoteAddress+" requested");
		exp.Test=numb;
		res.send(exp);
	}
	else if(numb>=800 && expcheck <=7){
		expcheck++;
		console.log(req.connection.remoteAddress+" requested");
		res.send(exp);
	}
	else if(expcheck>1){
		numb=numb*(1/3);
		exp.Test=numb;
		expcheck--;
		console.log(req.connection.remoteAddress+" requested");
		res.send(exp);
		}
//he ån hopp


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
