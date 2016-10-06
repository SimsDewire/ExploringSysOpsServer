var express = require("express");
var bodyParser = require("body-parser");

var app = express();


function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

var databaseHandler = require('./../database/database.js');

// Create a new plugin
var createdPlugin = databaseHandler.AddPlugin({
	name : "Graph maker plugin",
	description : "This convenient plugin will plot your graphs like a baws!",
	creator : "Mr.G",
	version : "2.5",
	pluginPath : "www.graph.com/plugin/download",
	webURL : "www.graph.com/plugin/docs"
});

// Create a new source containing the plugin id of the recently created plugin
var createdSource = databaseHandler.AddSource({
	URL : "www.google.se",
	pluginID : createdPlugin._id
});

var AMOUNT_OF_DATA = 30;

// Now add some source values to the newly created source
for (var i=0; i<AMOUNT_OF_DATA; i++) {
	databaseHandler.AddSourceValue({value : makeid(), createdAt : randomDate(new Date(2016, 0, 1), new Date())}, createdSource.URL);
}

