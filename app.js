var express = require("express");
var bodyParser = require("body-parser");
var multer = require("multer"); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var externcalls = require("./externcalls/extern.js");
var routes = require("./routes/routes.js")(app, upload);
app.use(externcalls);
 
var server = app.listen(3000, function () {
    console.log("Listening on port %s...", server.address().port);
});