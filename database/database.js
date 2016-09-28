var mongoose = require("mongoose");

// Connection URL
var url = 'mongodb://localhost:27017/myproject';

mongoose.connect(url);

var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", function(callback) {
	console.log("Connection succeeded.");
});
